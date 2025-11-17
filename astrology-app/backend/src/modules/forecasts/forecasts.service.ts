import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyForecast } from '@/entities/daily-forecast.entity';
import { PersonProfile } from '@/entities/person-profile.entity';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { ActionType } from '@/entities/action-log.entity';

type ElementType = 'fire' | 'earth' | 'air' | 'water';

interface SignMetadata {
  name: string;
  element: ElementType;
  luckyColor: string;
  luckyGem: string;
  rulingPlanet: string;
  traits: string[];
  focus: string[];
  affirmations: string[];
}

const SIGN_METADATA: Record<string, SignMetadata> = {
  aries: {
    name: 'Aries',
    element: 'fire',
    luckyColor: '#F97316',
    luckyGem: 'Carnelian',
    rulingPlanet: 'mars',
    traits: ['bold honesty', 'decisive choices', 'fierce loyalty'],
    focus: [
      'starting something new',
      'letting passion lead',
      'trusting your instincts',
    ],
    affirmations: [
      'I move first and trust the path forming beneath me',
      'My courage inspires others to rise with me',
      'I act with heart-led clarity',
    ],
  },
  taurus: {
    name: 'Taurus',
    element: 'earth',
    luckyColor: '#84CC16',
    luckyGem: 'Emerald',
    rulingPlanet: 'venus',
    traits: ['steady devotion', 'calm confidence', 'sensual presence'],
    focus: [
      'building rituals that last',
      'listening to your body',
      'choosing quality over speed',
    ],
    affirmations: [
      'I create lasting beauty through small, consistent acts',
      'My patience magnetizes aligned opportunities',
      'I ground myself in pleasure and purpose',
    ],
  },
  gemini: {
    name: 'Gemini',
    element: 'air',
    luckyColor: '#38BDF8',
    luckyGem: 'Agate',
    rulingPlanet: 'mercury',
    traits: ['curious dialogue', 'clever adaptability', 'sparkling wit'],
    focus: [
      'staying open to new information',
      'asking better questions',
      'sharing your story',
    ],
    affirmations: [
      'My words carry clarity and care',
      'I allow duality to make me whole',
      'Inspired ideas choose me daily',
    ],
  },
  cancer: {
    name: 'Cancer',
    element: 'water',
    luckyColor: '#94A3B8',
    luckyGem: 'Moonstone',
    rulingPlanet: 'moon',
    traits: ['deep empathy', 'protective instincts', 'intuitive wisdom'],
    focus: [
      'letting feelings inform the plan',
      'recharging your inner home',
      'nourishing chosen family',
    ],
    affirmations: [
      'My softness is a superpower',
      'I listen to my tides and respond with care',
      'I set boundaries that honor my heart',
    ],
  },
  leo: {
    name: 'Leo',
    element: 'fire',
    luckyColor: '#FACC15',
    luckyGem: 'Citrine',
    rulingPlanet: 'sun',
    traits: ['generous leadership', 'regal warmth', 'creative fire'],
    focus: [
      'letting joy be witnessed',
      'leading with generosity',
      'celebrating progress loudly',
    ],
    affirmations: [
      'My light is medicine for the room',
      'I create fearless from the heart outward',
      'Confidence is my resting state',
    ],
  },
  virgo: {
    name: 'Virgo',
    element: 'earth',
    luckyColor: '#A3E635',
    luckyGem: 'Peridot',
    rulingPlanet: 'mercury',
    traits: ['practical intuition', 'mindful service', 'restorative details'],
    focus: [
      'refining without perfectionism',
      'honoring routines that heal',
      'speaking with clear kindness',
    ],
    affirmations: [
      'Every small improvement is sacred',
      'I trust the wisdom in my rituals',
      'My discernment keeps me aligned',
    ],
  },
  libra: {
    name: 'Libra',
    element: 'air',
    luckyColor: '#F472B6',
    luckyGem: 'Lapis Lazuli',
    rulingPlanet: 'venus',
    traits: ['diplomatic magic', 'artful presence', 'balanced action'],
    focus: [
      'creating harmony in motion',
      'aiming for fairness over perfection',
      'beautifying the mundane',
    ],
    affirmations: [
      'I invite harmony without abandoning myself',
      'My choices can be graceful and firm',
      'Beauty follows my curiosity',
    ],
  },
  scorpio: {
    name: 'Scorpio',
    element: 'water',
    luckyColor: '#BE123C',
    luckyGem: 'Obsidian',
    rulingPlanet: 'pluto',
    traits: ['transformative focus', 'magnetic intensity', 'sacred secrets'],
    focus: [
      'trusting the regenerative cycle',
      'naming what has power over you',
      'moving with soulful strategy',
    ],
    affirmations: [
      'I alchemize every ending into medicine',
      'My intuition pierces through the noise',
      'Depth is a gift I offer with intention',
    ],
  },
  sagittarius: {
    name: 'Sagittarius',
    element: 'fire',
    luckyColor: '#FB7185',
    luckyGem: 'Turquoise',
    rulingPlanet: 'jupiter',
    traits: ['wild optimism', 'quest for meaning', 'truth-telling'],
    focus: [
      'expanding your field of play',
      'learning from the horizon',
      'sharing wisdom with humor',
    ],
    affirmations: [
      'The world opens when I do',
      'My curiosity keeps life adventurous',
      'I trust detours to reveal treasure',
    ],
  },
  capricorn: {
    name: 'Capricorn',
    element: 'earth',
    luckyColor: '#6B7280',
    luckyGem: 'Garnet',
    rulingPlanet: 'saturn',
    traits: ['strategic patience', 'mountain-moving focus', 'dry wit'],
    focus: [
      'laying foundations step by step',
      'setting realistic mile markers',
      'honoring your own pace',
    ],
    affirmations: [
      'I climb consistently and celebrate every ledge',
      'Structure gives my magic a place to land',
      'I trust time to work with me',
    ],
  },
  aquarius: {
    name: 'Aquarius',
    element: 'air',
    luckyColor: '#38BDF8',
    luckyGem: 'Amethyst',
    rulingPlanet: 'uranus',
    traits: ['visionary thinking', 'inventive rebellion', 'future focus'],
    focus: [
      'sharing unconventional solutions',
      'choosing community with intention',
      'staying loyal to your weird',
    ],
    affirmations: [
      'My originality is the blueprint',
      'I connect brilliant minds by being myself',
      'Reform begins with one bold idea',
    ],
  },
  pisces: {
    name: 'Pisces',
    element: 'water',
    luckyColor: '#A5B4FC',
    luckyGem: 'Aquamarine',
    rulingPlanet: 'neptune',
    traits: ['dream-infused empathy', 'artistic flow', 'spiritual resilience'],
    focus: [
      'turning feelings into art',
      'listening to symbolic messages',
      'protecting your energetic field',
    ],
    affirmations: [
      'My intuition paints new realities',
      'Compassion starts with me',
      'I flow around obstacles with grace',
    ],
  },
};

const ELEMENT_SNIPPETS: Record<
  ElementType,
  { general: string[]; love: string[]; career: string[]; health: string[] }
> = {
  fire: {
    general: [
      'Momentum builds quickly today—channel it into one meaningful move.',
      'Your spark lights the room; share an idea before doubts creep in.',
      'Courage beats over-planning now, so act while the inspiration is hot.',
    ],
    love: [
      'Lead with warmth and invite someone into your excitement.',
      'Bold honesty deepens the connection you are craving.',
      'Share the vulnerable side of your passion to balance the heat.',
    ],
    career: [
      'Pitch the project that feels a little audacious.',
      'Your leadership is magnetic when you let enthusiasm show.',
      'Choose the path that scares you just enough to guarantee growth.',
    ],
    health: [
      'Channel extra energy into movement that feels playful.',
      'Burnout fades when you alternate intensity with rest.',
      'Hydration and grounded meals keep the flame sustainable.',
    ],
  },
  earth: {
    general: [
      'Small, steady steps anchor a breakthrough today.',
      'Refine your routine and the results will follow naturally.',
      'Tend to the details that quietly build your future.',
    ],
    love: [
      'Show consistency; devotion is your love language right now.',
      'Plan a sensual ritual that engages all five senses.',
      'Quality time over quantity turns the dial toward intimacy.',
    ],
    career: [
      'Systematize one chaotic corner of your work.',
      'Your patience makes complex negotiations smoother.',
      'Invest in tools or education that signal long-term commitment.',
    ],
    health: [
      'Stretch the body before asking it to carry the world.',
      'Whole foods and mindful chewing soothe your nervous system.',
      'Ground in nature or with a tactile hobby to reset.',
    ],
  },
  air: {
    general: [
      'Ideas arrive quickly—capture them before analysis paralysis hits.',
      'Conversations mirror your inner shifts today.',
      'Saying it out loud creates the clarity you were hunting for.',
    ],
    love: [
      'Ask curious questions and let answers surprise you.',
      'Speak the compliment you assume they already know.',
      'Playful banter keeps the chemistry buoyant.',
    ],
    career: [
      'Teach, present, or write—your voice carries influence.',
      'Collaborate with the person who thinks opposite of you.',
      'Document your brainstorms; one becomes a concrete plan soon.',
    ],
    health: [
      'Breathwork or singing releases the static buzzing in your mind.',
      'Digital detox brings the nervous system back to neutral.',
      'Move in ways that open the chest and shoulders to stay present.',
    ],
  },
  water: {
    general: [
      'Emotions are intel—let them guide your next brave choice.',
      'Offer yourself softness before making the hard call.',
      'Restoring your inner waters becomes the priority.',
    ],
    love: [
      'Lead with empathy and a listening ear.',
      'Share a dream or story that reveals your inner world.',
      'Merging imagination with reality keeps romance alive.',
    ],
    career: [
      'Trust intuitive nudges when analyzing a partnership.',
      'Channel feelings into artful or healing work.',
      'Focus on impact rather than speed—depth wins today.',
    ],
    health: [
      'Prioritize sleep and hydration to keep sensitivity sustainable.',
      'Gentle movement and stretching keeps emotions flowing.',
      'Create a soothing evening ritual to unclench from the day.',
    ],
  },
};

const PLANETARY_LIBRARY: Record<
  string,
  { theme: string; guidance: string }[]
> = {
  sun: [
    { theme: 'Confidence Boost', guidance: 'Own the spotlight with intention.' },
    { theme: 'Identity Clarity', guidance: 'Lead from values, not trends.' },
    { theme: 'Creative Charge', guidance: 'Share a bold idea before hesitation wins.' },
  ],
  moon: [
    { theme: 'Emotional Reset', guidance: 'Name what you feel before acting.' },
    { theme: 'Intuitive Whisper', guidance: 'Stay close to routines that soothe.' },
    { theme: 'Nurturing Flow', guidance: 'Protect the spaces that feel like home.' },
  ],
  mercury: [
    { theme: 'Mental Sparks', guidance: 'Journal the idea streak before it fades.' },
    { theme: 'Communication Wins', guidance: 'Choose clarity over cleverness in conversations.' },
    { theme: 'Learning Curve', guidance: 'Sign up for the class that keeps calling you.' },
  ],
  venus: [
    { theme: 'Heart-Centered Beauty', guidance: 'Surround yourself with colors and textures you adore.' },
    { theme: 'Relationship Grace', guidance: 'Lead with curiosity during delicate talks.' },
    { theme: 'Pleasure Priority', guidance: 'Slow down and savor small luxuries.' },
  ],
  mars: [
    { theme: 'Clean Motivation', guidance: 'Aim your fire at one goal instead of many.' },
    { theme: 'Boundaries Upgrade', guidance: 'Say no quicker so a bigger yes can arrive.' },
    { theme: 'Courage Pulse', guidance: 'Take action even if the path is forming beneath you.' },
  ],
  jupiter: [
    { theme: 'Expansion Wave', guidance: 'Say yes to the opportunity that stretches you.' },
    { theme: 'Belief Upgrade', guidance: 'Rewrite the story about what is possible.' },
    { theme: 'Teacher Energy', guidance: 'Share wisdom through humor and humility.' },
  ],
  saturn: [
    { theme: 'Structure Check', guidance: 'Simplify one system so it can support you longer.' },
    { theme: 'Discipline Glow', guidance: 'Consistency beats intensity this round.' },
    { theme: 'Responsibility Shift', guidance: 'Delegate the task that no longer grows you.' },
  ],
  uranus: [
    { theme: 'Breakthrough Sparks', guidance: 'Try the unconventional solution first.' },
    { theme: 'Innovation Call', guidance: 'Update a ritual that has become stale.' },
    { theme: 'Liberation Move', guidance: 'Choose freedom where you once chose fear.' },
  ],
  neptune: [
    { theme: 'Dreamtime Guidance', guidance: 'Meditate or daydream to receive signals.' },
    { theme: 'Spiritual Sync', guidance: 'Trust symbolic messages showing up twice.' },
    { theme: 'Compassion Wave', guidance: 'Let empathy fuel creativity, not exhaustion.' },
  ],
  pluto: [
    { theme: 'Intense Renewal', guidance: 'Release the habit that drains your power.' },
    { theme: 'Shadow Work', guidance: 'Name the truth you have avoided and transform it.' },
    { theme: 'Phoenix Rise', guidance: 'Lean into depth instead of the quick fix.' },
  ],
};

@Injectable()
export class ForecastsService {
  constructor(
    @InjectRepository(DailyForecast)
    private forecastsRepository: Repository<DailyForecast>,
    @InjectRepository(PersonProfile)
    private profilesRepository: Repository<PersonProfile>,
    private subscriptionsService: SubscriptionsService,
  ) {}

  async getTodayForecast(profileId: string, userId: string) {
    const profile = await this.profilesRepository.findOne({
      where: { id: profileId, owner: { id: userId } },
      relations: ['owner'],
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const today = this.normalizeDate(new Date());

    let forecast = await this.forecastsRepository.findOne({
      where: { profile: { id: profileId }, date: today },
    });

    if (!forecast) {
      await this.subscriptionsService.consumePremiumAction(
        userId,
        ActionType.DAILY_FORECAST,
        { profileId, date: today.toISOString() },
        `Daily forecast for ${profile.name}`,
      );
      forecast = await this.generateDailyForecast(profile, today);
    }

    return this.formatForecastResponse(forecast, profileId);
  }

  private async generateDailyForecast(
    profile: PersonProfile,
    targetDate: Date,
  ) {
    const normalizedDate = this.normalizeDate(targetDate);
    const sunSign = this.resolveSunSign(profile);
    const signKey = sunSign.toLowerCase();
    const signMeta = SIGN_METADATA[signKey] || SIGN_METADATA.aries;
    const elementMeta = ELEMENT_SNIPPETS[signMeta.element];
    const seed = this.createSeed(profile.id, normalizedDate);
    const displayName = profile.name?.split(' ')[0] || 'You';

    const generalSnippet = this.pickFromList(elementMeta.general, seed);
    const highlight = this.pickFromList(signMeta.focus, seed + 7);
    const affirmation = this.pickFromList(signMeta.affirmations, seed + 13);

    const loveForecast = this.composeSection(
      displayName,
      this.pickFromList(elementMeta.love, seed + 1),
      this.pickFromList(signMeta.traits, seed + 2),
    );
    const careerForecast = this.composeSection(
      displayName,
      this.pickFromList(elementMeta.career, seed + 3),
      this.pickFromList(signMeta.traits, seed + 4),
    );
    const healthForecast = this.composeSection(
      displayName,
      this.pickFromList(elementMeta.health, seed + 5),
      this.pickFromList(signMeta.focus, seed + 6),
    );

    const loveScore = this.generateScore(seed + 8);
    const careerScore = this.generateScore(seed + 9);
    const healthScore = this.generateScore(seed + 10);
    const luckyNumbers = this.generateLuckyNumbers(seed + 20);
    const planetaryTransits = this.buildPlanetaryTransits(
      signMeta.rulingPlanet,
      seed + 30,
    );

    const forecastEntity = this.forecastsRepository.create({
      profile: { id: profile.id } as any,
      date: normalizedDate,
      sunSign,
      generalForecast: `${generalSnippet} Lean into ${highlight} energy. Affirmation: "${affirmation}".`,
      loveForecast,
      careerForecast,
      healthForecast,
      luckyNumbers,
      luckyColor: signMeta.luckyColor,
      luckyGem: signMeta.luckyGem,
      loveScore,
      careerScore,
      healthScore,
      overallScore: Number(
        ((loveScore + careerScore + healthScore) / 3).toFixed(1),
      ),
      planetaryTransits,
      isRead: false,
    });

    return this.forecastsRepository.save(forecastEntity);
  }

  private resolveSunSign(profile: PersonProfile) {
    if (profile.sunSign) {
      return this.capitalize(profile.sunSign);
    }

    const computed = this.determineSunSign(profile.birthDate);
    if (computed !== profile.sunSign) {
      this.profilesRepository.update(profile.id, { sunSign: computed }).catch(
        () => undefined,
      );
    }
    return computed;
  }

  private determineSunSign(birthDate?: Date | string | null): string {
    if (!birthDate) {
      return 'Aries';
    }

    const date = new Date(birthDate);
    if (Number.isNaN(date.getTime())) {
      return 'Aries';
    }

    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
      return 'Sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
      return 'Capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
      return 'Aquarius';
    return 'Pisces';
  }

  private composeSection(name: string, snippet: string, trait: string) {
    return `${snippet} ${name} shines when ${trait} leads the way.`;
  }

  private generateScore(seed: number) {
    const raw = 2.5 + this.seededRandom(seed) * 2.5;
    return Math.round(raw * 10) / 10;
  }

  private generateLuckyNumbers(seed: number) {
    const numbers = new Set<number>();
    let offset = 0;

    while (numbers.size < 4) {
      const value = Math.floor(this.seededRandom(seed + offset) * 88) + 1;
      numbers.add(value);
      offset += 1;
    }

    return Array.from(numbers).map(num => num.toString());
  }

  private buildPlanetaryTransits(rulingPlanet: string, seed: number) {
    const insightFor = (planetKey: string, offset: number) => {
      const key = planetKey.toLowerCase();
      const options = PLANETARY_LIBRARY[key] || PLANETARY_LIBRARY.sun;
      const picked = this.pickFromList(options, seed + offset);
      return {
        planet: this.capitalize(planetKey),
        theme: picked.theme,
        guidance: picked.guidance,
      };
    };

    return {
      sun: insightFor('sun', 0),
      moon: insightFor('moon', 5),
      ruler: insightFor(rulingPlanet || 'sun', 10),
    };
  }

  private normalizeDate(date: Date) {
    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    );
  }

  private createSeed(profileId: string, date: Date) {
    const base = profileId
      .split('')
      .reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 1), 0);
    const dateKey = Number(date.toISOString().slice(0, 10).replace(/-/g, ''));
    return base + dateKey;
  }

  private seededRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  private pickFromList<T>(items: T[], seed: number): T {
    if (!items.length) {
      throw new Error('Cannot pick from an empty list');
    }
    const index = Math.floor(this.seededRandom(seed) * items.length) % items.length;
    return items[index];
  }

  private capitalize(text: string) {
    if (!text) {
      return '';
    }
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  private formatForecastResponse(forecast: DailyForecast, profileId: string) {
    const toNumber = (value?: string | number | null) =>
      value === null || value === undefined ? null : Number(value);

    return {
      id: forecast.id,
      profileId,
      date: forecast.date,
      sunSign: forecast.sunSign,
      generalForecast: forecast.generalForecast,
      loveForecast: forecast.loveForecast,
      careerForecast: forecast.careerForecast,
      healthForecast: forecast.healthForecast,
      luckyNumbers: Array.isArray(forecast.luckyNumbers)
        ? forecast.luckyNumbers
        : [],
      luckyColor: forecast.luckyColor,
      luckyGem: forecast.luckyGem,
      loveScore: toNumber(forecast.loveScore),
      careerScore: toNumber(forecast.careerScore),
      healthScore: toNumber(forecast.healthScore),
      overallScore: toNumber(forecast.overallScore),
      planetaryTransits: forecast.planetaryTransits,
      isRead: forecast.isRead,
      createdAt: forecast.createdAt,
      updatedAt: forecast.updatedAt,
    };
  }
}
