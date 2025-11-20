import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TarotReading } from '@/entities/tarot-reading.entity';

interface TarotCard {
  id: number;
  name: string;
  suit?: string;
  arcana: 'major' | 'minor';
  uprightMeaning: string;
  reversedMeaning: string;
  keywords: string[];
}

interface DrawnCard {
  card: TarotCard;
  position: string;
  reversed: boolean;
}

@Injectable()
export class TarotService {
  private readonly tarotDeck: TarotCard[] = this.initializeDeck();

  constructor(
    @InjectRepository(TarotReading)
    private tarotRepository: Repository<TarotReading>,
  ) {}

  private initializeDeck(): TarotCard[] {
    const majorArcana: TarotCard[] = [
      { id: 0, name: 'The Fool', arcana: 'major', uprightMeaning: 'New beginnings, innocence, spontaneity, a free spirit', reversedMeaning: 'Recklessness, taken advantage of, inconsideration', keywords: ['beginnings', 'innocence', 'spontaneity'] },
      { id: 1, name: 'The Magician', arcana: 'major', uprightMeaning: 'Manifestation, resourcefulness, power, inspired action', reversedMeaning: 'Manipulation, poor planning, untapped talents', keywords: ['manifestation', 'power', 'action'] },
      { id: 2, name: 'The High Priestess', arcana: 'major', uprightMeaning: 'Intuition, sacred knowledge, divine feminine, the subconscious', reversedMeaning: 'Secrets, disconnected from intuition, withdrawal', keywords: ['intuition', 'mystery', 'wisdom'] },
      { id: 3, name: 'The Empress', arcana: 'major', uprightMeaning: 'Femininity, beauty, nature, nurturing, abundance', reversedMeaning: 'Creative block, dependence on others', keywords: ['abundance', 'nurture', 'fertility'] },
      { id: 4, name: 'The Emperor', arcana: 'major', uprightMeaning: 'Authority, establishment, structure, a father figure', reversedMeaning: 'Domination, excessive control, lack of discipline', keywords: ['authority', 'structure', 'control'] },
      { id: 5, name: 'The Hierophant', arcana: 'major', uprightMeaning: 'Spiritual wisdom, religious beliefs, conformity, tradition', reversedMeaning: 'Personal beliefs, freedom, challenging the status quo', keywords: ['tradition', 'conformity', 'wisdom'] },
      { id: 6, name: 'The Lovers', arcana: 'major', uprightMeaning: 'Love, harmony, relationships, values alignment, choices', reversedMeaning: 'Self-love, disharmony, imbalance, misalignment', keywords: ['love', 'harmony', 'choices'] },
      { id: 7, name: 'The Chariot', arcana: 'major', uprightMeaning: 'Control, willpower, success, action, determination', reversedMeaning: 'Lack of control, lack of direction, aggression', keywords: ['willpower', 'determination', 'victory'] },
      { id: 8, name: 'Strength', arcana: 'major', uprightMeaning: 'Strength, courage, persuasion, influence, compassion', reversedMeaning: 'Inner strength, self-doubt, low energy, raw emotion', keywords: ['courage', 'patience', 'control'] },
      { id: 9, name: 'The Hermit', arcana: 'major', uprightMeaning: 'Soul searching, introspection, being alone, inner guidance', reversedMeaning: 'Isolation, loneliness, withdrawal', keywords: ['introspection', 'wisdom', 'solitude'] },
      { id: 10, name: 'Wheel of Fortune', arcana: 'major', uprightMeaning: 'Good luck, karma, life cycles, destiny, a turning point', reversedMeaning: 'Bad luck, resistance to change, breaking cycles', keywords: ['destiny', 'change', 'cycles'] },
      { id: 11, name: 'Justice', arcana: 'major', uprightMeaning: 'Justice, fairness, truth, cause and effect, law', reversedMeaning: 'Unfairness, lack of accountability, dishonesty', keywords: ['justice', 'truth', 'balance'] },
      { id: 12, name: 'The Hanged Man', arcana: 'major', uprightMeaning: 'Pause, surrender, letting go, new perspectives', reversedMeaning: 'Delays, resistance, stalling, indecision', keywords: ['surrender', 'release', 'perspective'] },
      { id: 13, name: 'Death', arcana: 'major', uprightMeaning: 'Endings, change, transformation, transition', reversedMeaning: 'Resistance to change, unable to move on', keywords: ['transformation', 'endings', 'rebirth'] },
      { id: 14, name: 'Temperance', arcana: 'major', uprightMeaning: 'Balance, moderation, patience, purpose', reversedMeaning: 'Imbalance, excess, self-healing, re-alignment', keywords: ['balance', 'moderation', 'patience'] },
      { id: 15, name: 'The Devil', arcana: 'major', uprightMeaning: 'Shadow self, attachment, addiction, restriction, sexuality', reversedMeaning: 'Releasing limiting beliefs, exploring dark thoughts', keywords: ['bondage', 'addiction', 'materialism'] },
      { id: 16, name: 'The Tower', arcana: 'major', uprightMeaning: 'Sudden change, upheaval, chaos, revelation, awakening', reversedMeaning: 'Personal transformation, fear of change, averting disaster', keywords: ['upheaval', 'awakening', 'chaos'] },
      { id: 17, name: 'The Star', arcana: 'major', uprightMeaning: 'Hope, faith, purpose, renewal, spirituality', reversedMeaning: 'Lack of faith, despair, self-trust, disconnection', keywords: ['hope', 'faith', 'inspiration'] },
      { id: 18, name: 'The Moon', arcana: 'major', uprightMeaning: 'Illusion, fear, anxiety, subconscious, intuition', reversedMeaning: 'Release of fear, repressed emotion, inner confusion', keywords: ['illusion', 'intuition', 'mystery'] },
      { id: 19, name: 'The Sun', arcana: 'major', uprightMeaning: 'Positivity, fun, warmth, success, vitality', reversedMeaning: 'Inner child, feeling down, overly optimistic', keywords: ['joy', 'success', 'vitality'] },
      { id: 20, name: 'Judgement', arcana: 'major', uprightMeaning: 'Judgement, rebirth, inner calling, absolution', reversedMeaning: 'Self-doubt, inner critic, ignoring the call', keywords: ['judgement', 'rebirth', 'calling'] },
      { id: 21, name: 'The World', arcana: 'major', uprightMeaning: 'Completion, integration, accomplishment, travel', reversedMeaning: 'Seeking personal closure, short-cuts, delays', keywords: ['completion', 'accomplishment', 'travel'] },
    ];

    const minorArcana: TarotCard[] = [];
    const suits = ['Wands', 'Cups', 'Swords', 'Pentacles'];
    const suitMeanings = {
      Wands: { upright: 'creativity, action, passion', reversed: 'delays, lack of energy' },
      Cups: { upright: 'emotions, relationships, love', reversed: 'emotional turmoil, withdrawal' },
      Swords: { upright: 'intellect, thoughts, conflict', reversed: 'confusion, miscommunication' },
      Pentacles: { upright: 'material wealth, practical matters', reversed: 'financial loss, insecurity' },
    };

    suits.forEach((suit, suitIndex) => {
      // Ace
      minorArcana.push({
        id: 22 + suitIndex * 14,
        name: `Ace of ${suit}`,
        suit,
        arcana: 'minor',
        uprightMeaning: `New beginning in ${suitMeanings[suit].upright}`,
        reversedMeaning: `Blocked energy in ${suitMeanings[suit].upright}`,
        keywords: ['new beginning', suit.toLowerCase(), 'opportunity'],
      });

      // Numbers 2-10
      for (let i = 2; i <= 10; i++) {
        minorArcana.push({
          id: 22 + suitIndex * 14 + i - 1,
          name: `${i} of ${suit}`,
          suit,
          arcana: 'minor',
          uprightMeaning: `${suitMeanings[suit].upright} at level ${i}`,
          reversedMeaning: `${suitMeanings[suit].reversed} at level ${i}`,
          keywords: [suit.toLowerCase(), 'growth', 'development'],
        });
      }

      // Court cards
      const courtCards = ['Page', 'Knight', 'Queen', 'King'];
      courtCards.forEach((court, courtIndex) => {
        minorArcana.push({
          id: 22 + suitIndex * 14 + 10 + courtIndex,
          name: `${court} of ${suit}`,
          suit,
          arcana: 'minor',
          uprightMeaning: `${court} personality in ${suitMeanings[suit].upright}`,
          reversedMeaning: `Immature ${court} in ${suitMeanings[suit].upright}`,
          keywords: [court.toLowerCase(), suit.toLowerCase(), 'personality'],
        });
      });
    });

    return [...majorArcana, ...minorArcana];
  }

  private shuffleAndDraw(count: number): DrawnCard[] {
    // Fisher-Yates shuffle
    const shuffled = [...this.tarotDeck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Draw cards and randomly reverse 30% of them
    return shuffled.slice(0, count).map((card) => ({
      card,
      position: '',
      reversed: Math.random() < 0.3,
    }));
  }

  private getSpreadPositions(spreadType: string): string[] {
    switch (spreadType) {
      case 'single_card':
        return ['Present Situation'];
      case 'three_card':
        return ['Past', 'Present', 'Future'];
      case 'celtic_cross':
        return [
          'Present',
          'Challenge',
          'Past',
          'Future',
          'Above',
          'Below',
          'Advice',
          'External Influences',
          'Hopes and Fears',
          'Outcome',
        ];
      case 'love_spread':
        return ['You', 'Your Partner', 'The Relationship', 'Challenges', 'Outcome'];
      case 'career_spread':
        return ['Current Situation', 'Obstacles', 'Strengths', 'Advice', 'Outcome'];
      default:
        return ['Card 1', 'Card 2', 'Card 3'];
    }
  }

  private generateInterpretation(drawnCards: DrawnCard[], question: string, spreadType: string): string {
    let interpretation = `${spreadType.replace('_', ' ').toUpperCase()} READING\n\n`;

    if (question) {
      interpretation += `Question: "${question}"\n\n`;
    }

    interpretation += `CARDS DRAWN:\n`;
    drawnCards.forEach((drawn) => {
      const meaning = drawn.reversed ? drawn.card.reversedMeaning : drawn.card.uprightMeaning;
      interpretation += `\n${drawn.position}: ${drawn.card.name} ${drawn.reversed ? '(Reversed)' : ''}\n`;
      interpretation += `Meaning: ${meaning}\n`;
    });

    interpretation += `\n\nOVERALL INTERPRETATION:\n`;

    // Generate contextual interpretation based on spread type
    if (spreadType === 'three_card') {
      interpretation += `The past shows ${drawnCards[0].card.name}, indicating ${drawnCards[0].reversed ? 'challenges in' : 'the foundation of'} your journey. `;
      interpretation += `Currently, ${drawnCards[1].card.name} reveals your present situation. `;
      interpretation += `Looking ahead, ${drawnCards[2].card.name} ${drawnCards[2].reversed ? 'cautions you about' : 'promises'} what's to come.`;
    } else if (spreadType === 'celtic_cross') {
      interpretation += `This comprehensive reading reveals a complex situation. `;
      interpretation += `The central card, ${drawnCards[0].card.name}, represents your current position. `;
      interpretation += `With ${drawnCards[9].card.name} as the outcome, the cards suggest a journey of transformation and growth.`;
    } else {
      interpretation += `The cards reveal important insights about your question. `;
      interpretation += `Pay special attention to ${drawnCards[0].card.name}, as it holds the key to understanding your path forward.`;
    }

    return interpretation;
  }

  async createReading(userId: string, question: string, spreadType: string) {
    const positions = this.getSpreadPositions(spreadType);
    const drawnCards = this.shuffleAndDraw(positions.length);

    // Assign positions
    drawnCards.forEach((drawn, index) => {
      drawn.position = positions[index];
    });

    // Generate interpretation
    const interpretation = this.generateInterpretation(drawnCards, question, spreadType);

    // Prepare cards for storage
    const cardsData = drawnCards.map((drawn) => ({
      name: drawn.card.name,
      position: drawn.position,
      reversed: drawn.reversed,
      meaning: drawn.reversed ? drawn.card.reversedMeaning : drawn.card.uprightMeaning,
      keywords: drawn.card.keywords,
    }));

    const reading = this.tarotRepository.create({
      user: { id: userId } as any,
      question,
      spreadType,
      cards: cardsData,
      interpretation,
    });

    return this.tarotRepository.save(reading);
  }

  async getReadings(userId: string) {
    return this.tarotRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getReading(userId: string, readingId: string) {
    return this.tarotRepository.findOne({
      where: { id: readingId, user: { id: userId } },
    });
  }
}
