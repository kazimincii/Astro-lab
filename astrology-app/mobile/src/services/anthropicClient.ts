/**
 * Anthropic AI Client for React Native
 * Integrates Claude Haiku 4.5 with the astrology mobile app
 */

import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '@/store/authStore';

interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AnthropicResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface AnthropicConfig {
  apiKey: string;
  baseURL?: string;
  model?: string;
  maxTokens?: number;
  timeout?: number;
}

/**
 * AnthropicClient for mobile app
 * Communicates with backend AI endpoint which proxies to Anthropic API
 */
export class AnthropicClient {
  private client: AxiosInstance;
  private config: Required<AnthropicConfig>;

  constructor(config: AnthropicConfig) {
    this.config = {
      apiKey: config.apiKey,
      baseURL: config.baseURL || 'http://localhost:3000/api/v1',
      model: config.model || 'claude-haiku-4.5',
      maxTokens: config.maxTokens || 1024,
      timeout: config.timeout || 30000,
    };

    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to inject auth token from authStore
    this.client.interceptors.request.use(
      (requestConfig) => {
        const token = useAuthStore.getState().token;
        if (token) {
          requestConfig.headers.Authorization = `Bearer ${token}`;
        }
        return requestConfig;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          useAuthStore.getState().logout();
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Send a message to Claude and get a response
   * @param messages - Conversation history
   * @returns Claude's response
   */
  async sendMessage(messages: AnthropicMessage[]): Promise<string> {
    try {
      const response = await this.client.post<AnthropicResponse>(
        '/ai-assistant/message',
        {
          messages,
          model: this.config.model,
          max_tokens: this.config.maxTokens,
        }
      );

      if (response.data.content && response.data.content.length > 0) {
        return response.data.content[0].text;
      }

      throw new Error('No content in Anthropic response');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Anthropic API error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get AI interpretation of astrology data
   * @param data - Astrological data (birth chart, readings, etc.)
   * @returns AI interpretation
   */
  async getAstrologyInterpretation(data: Record<string, any>): Promise<string> {
    const prompt = `As an astrology expert AI, interpret the following astrological data:\n\n${JSON.stringify(data, null, 2)}\n\nProvide a personalized, insightful interpretation.`;

    return this.sendMessage([
      {
        role: 'user',
        content: prompt,
      },
    ]);
  }

  /**
   * Get personalized horoscope
   * @param birthData - User's birth information
   * @param timeframe - e.g., "daily", "weekly", "monthly"
   * @returns Personalized horoscope
   */
  async getPersonalizedHoroscope(
    birthData: { sign?: string; birthDate?: string },
    timeframe: string = 'daily'
  ): Promise<string> {
    const prompt = `Generate a ${timeframe} horoscope for a ${birthData.sign} born on ${birthData.birthDate}. Be specific, insightful, and mystical.`;

    return this.sendMessage([
      {
        role: 'user',
        content: prompt,
      },
    ]);
  }

  /**
   * Get relationship compatibility analysis
   * @param person1 - First person's info
   * @param person2 - Second person's info
   * @returns Compatibility analysis
   */
  async getCompatibilityAnalysis(
    person1: { name: string; sign: string; birthDate?: string },
    person2: { name: string; sign: string; birthDate?: string }
  ): Promise<string> {
    const prompt = `Analyze astrological compatibility between ${person1.name} (${person1.sign}) and ${person2.name} (${person2.sign}). Provide insights on emotional, intellectual, and romantic compatibility.`;

    return this.sendMessage([
      {
        role: 'user',
        content: prompt,
      },
    ]);
  }

  /**
   * Chat with AI for general astrology questions
   * @param conversationHistory - Previous messages
   * @param userMessage - Current user message
   * @returns AI response
   */
  async chat(
    conversationHistory: AnthropicMessage[],
    userMessage: string
  ): Promise<string> {
    const messages: AnthropicMessage[] = [
      ...conversationHistory,
      {
        role: 'user',
        content: userMessage,
      },
    ];

    return this.sendMessage(messages);
  }

  /**
   * Health check - verify API connection
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.status === 200;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<AnthropicConfig>): void {
    if (config.apiKey) {
      this.config.apiKey = config.apiKey;
      this.client.defaults.headers.Authorization = `Bearer ${config.apiKey}`;
    }
    if (config.model) {
      this.config.model = config.model;
    }
    if (config.maxTokens) {
      this.config.maxTokens = config.maxTokens;
    }
    if (config.baseURL) {
      this.config.baseURL = config.baseURL;
      this.client.defaults.baseURL = config.baseURL;
    }
  }
}

/**
 * Create and export a singleton instance
 */
let anthropicInstance: AnthropicClient | null = null;

export function initializeAnthropicClient(config: AnthropicConfig): AnthropicClient {
  anthropicInstance = new AnthropicClient(config);
  return anthropicInstance;
}

export function getAnthropicClient(): AnthropicClient {
  if (!anthropicInstance) {
    // Auto-initialize with default config if not already initialized
    const defaultConfig: AnthropicConfig = {
      apiKey: '', // Will be set by auth interceptor
      baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
      model: 'claude-haiku-4.5',
      maxTokens: 1024,
      timeout: 30000,
    };
    anthropicInstance = new AnthropicClient(defaultConfig);
  }
  return anthropicInstance;
}

export default AnthropicClient;
