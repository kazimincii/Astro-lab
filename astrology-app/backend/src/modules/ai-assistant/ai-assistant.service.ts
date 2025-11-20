import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { AiConversation, AiMessage } from '@/entities/ai-conversation.entity';
import { PersonProfile } from '@/entities/person-profile.entity';

@Injectable()
export class AiAssistantService {
  private readonly logger = new Logger(AiAssistantService.name);
  private anthropic: Anthropic | null = null;
  private openai: OpenAI | null = null;
  private aiProvider: 'openai' | 'anthropic';

  constructor(
    @InjectRepository(AiConversation)
    private conversationsRepository: Repository<AiConversation>,
    @InjectRepository(AiMessage)
    private messagesRepository: Repository<AiMessage>,
    @InjectRepository(PersonProfile)
    private profilesRepository: Repository<PersonProfile>,
    private configService: ConfigService,
  ) {
    this.aiProvider = this.configService.get<'openai' | 'anthropic'>('AI_PROVIDER', 'anthropic');

    // Initialize AI clients based on provider
    if (this.aiProvider === 'anthropic') {
      const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');
      if (apiKey && apiKey.startsWith('sk-ant-')) {
        this.anthropic = new Anthropic({ apiKey });
      }
    } else if (this.aiProvider === 'openai') {
      const apiKey = this.configService.get<string>('OPENAI_API_KEY');
      if (apiKey && apiKey.startsWith('sk-')) {
        this.openai = new OpenAI({ apiKey });
      }
    }
  }

  async createConversation(userId: string, title: string) {
    const conversation = this.conversationsRepository.create({
      user: { id: userId } as any,
      title,
    });

    return this.conversationsRepository.save(conversation);
  }

  async sendMessage(conversationId: string, message: string) {
    // Get conversation with user
    const conversation = await this.conversationsRepository.findOne({
      where: { id: conversationId },
      relations: ['user'],
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Save user message
    const userMessage = this.messagesRepository.create({
      conversation: { id: conversationId } as any,
      role: 'user',
      content: message,
    });
    await this.messagesRepository.save(userMessage);

    // Get conversation history
    const history = await this.messagesRepository.find({
      where: { conversation: { id: conversationId } },
      order: { createdAt: 'ASC' },
      take: 20, // Last 20 messages for context
    });

    // Get user's astrological profile
    const profile = await this.profilesRepository.findOne({
      where: { owner: { id: conversation.user.id }, isMainProfile: true },
    });

    // Generate AI response
    const aiResponse = await this.generateAIResponse(message, history, profile);

    // Save assistant message
    const assistantMessage = this.messagesRepository.create({
      conversation: { id: conversationId } as any,
      role: 'assistant',
      content: aiResponse,
    });

    return this.messagesRepository.save(assistantMessage);
  }

  private async generateAIResponse(
    message: string,
    history: AiMessage[],
    profile?: PersonProfile,
  ): Promise<string> {
    try {
      // Build system prompt with astrological context
      const systemPrompt = this.buildSystemPrompt(profile);

      // Build conversation context
      const conversationHistory = history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      if (this.aiProvider === 'anthropic' && this.anthropic) {
        return await this.generateAnthropicResponse(systemPrompt, conversationHistory, message);
      } else if (this.aiProvider === 'openai' && this.openai) {
        return await this.generateOpenAIResponse(systemPrompt, conversationHistory, message);
      } else {
        // Fallback to rule-based response if no AI configured
        this.logger.warn('No AI provider configured, using fallback response');
        return this.generateFallbackResponse(message, profile);
      }
    } catch (error) {
      this.logger.error('AI response generation failed', error);
      return 'I apologize, but I encountered an error processing your request. Please try again.';
    }
  }

  private buildSystemPrompt(profile?: PersonProfile): string {
    let prompt = `You are an expert astrology AI assistant with deep knowledge of astrology, birth charts, planetary transits, and spiritual guidance. You provide personalized, compassionate, and insightful astrological advice.`;

    if (profile) {
      prompt += `\n\nYou are currently assisting a person with the following astrological profile:`;
      if (profile.name) prompt += `\n- Name: ${profile.name}`;
      if (profile.birthDate) prompt += `\n- Birth Date: ${profile.birthDate}`;
      if (profile.birthTime) prompt += `\n- Birth Time: ${profile.birthTime}`;
      if (profile.birthPlace) prompt += `\n- Birth Place: ${profile.birthPlace}`;
      if (profile.sunSign) prompt += `\n- Sun Sign: ${profile.sunSign}`;
      if (profile.moonSign) prompt += `\n- Moon Sign: ${profile.moonSign}`;
      if (profile.risingSign) prompt += `\n- Rising Sign (Ascendant): ${profile.risingSign}`;

      prompt += `\n\nUse this information to provide personalized astrological insights and advice. Reference their specific placements when relevant.`;
    } else {
      prompt += `\n\nThe user has not provided their birth chart information yet. You can still provide general astrological guidance and encourage them to add their birth details for more personalized insights.`;
    }

    prompt += `\n\nAlways be:
- Warm, supportive, and non-judgmental
- Specific and practical in your advice
- Balanced between spiritual wisdom and real-world application
- Encouraging of personal growth and self-awareness
- Clear that astrology is a tool for self-reflection, not deterministic fate`;

    return prompt;
  }

  private async generateAnthropicResponse(
    systemPrompt: string,
    history: Array<{ role: string; content: string }>,
    message: string,
  ): Promise<string> {
    const response = await this.anthropic.messages.create({
      model: this.configService.get<string>('ANTHROPIC_MODEL', 'claude-3-5-haiku-20241022'),
      max_tokens: this.configService.get<number>('ANTHROPIC_MAX_TOKENS', 2000),
      system: systemPrompt,
      messages: [
        ...history.slice(-10), // Last 10 messages for context
        { role: 'user', content: message },
      ],
    });

    return response.content[0].type === 'text' ? response.content[0].text : 'Unable to generate response';
  }

  private async generateOpenAIResponse(
    systemPrompt: string,
    history: Array<{ role: string; content: string }>,
    message: string,
  ): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: this.configService.get<string>('OPENAI_MODEL', 'gpt-4'),
      max_tokens: this.configService.get<number>('OPENAI_MAX_TOKENS', 2000),
      messages: [
        { role: 'system', content: systemPrompt },
        ...history.slice(-10).map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
        { role: 'user', content: message },
      ],
    });

    return response.choices[0]?.message?.content || 'Unable to generate response';
  }

  private generateFallbackResponse(message: string, profile?: PersonProfile): string {
    const lowerMessage = message.toLowerCase();

    // Simple keyword-based responses
    if (lowerMessage.includes('sun') || lowerMessage.includes('sun sign')) {
      if (profile?.sunSign) {
        return `Your Sun is in ${profile.sunSign}, which represents your core identity and life purpose. ${profile.sunSign} individuals are known for their unique qualities. Would you like to know more about how this influences your personality?`;
      }
      return `Your Sun sign represents your core identity and ego. It's the essence of who you are. To provide personalized insights, please add your birth information to your profile.`;
    }

    if (lowerMessage.includes('moon') || lowerMessage.includes('moon sign')) {
      if (profile?.moonSign) {
        return `Your Moon is in ${profile.moonSign}, which governs your emotions and inner world. This placement influences how you process feelings and what makes you feel secure.`;
      }
      return `The Moon sign represents your emotional nature and subconscious patterns. Add your birth time to discover your Moon sign and understand your emotional landscape better.`;
    }

    if (lowerMessage.includes('rising') || lowerMessage.includes('ascendant')) {
      if (profile?.risingSign) {
        return `Your Rising sign is ${profile.risingSign}, which shapes how others perceive you and your approach to life. It's the mask you wear in the world.`;
      }
      return `Your Rising sign (Ascendant) is your social personality and how you present yourself. You'll need your exact birth time to calculate this important placement.`;
    }

    // Default response
    return `Thank you for your question about astrology. While I can provide general guidance, for truly personalized insights, I recommend adding your complete birth information (date, time, and place) to your profile. This allows for accurate chart calculations and deep, meaningful astrological analysis tailored specifically to you.`;
  }
}
