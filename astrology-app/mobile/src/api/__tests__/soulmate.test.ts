import {
  soulmateApi,
  SoulmateProfile,
  UserConnection,
  ConnectionType,
} from '../soulmate';
import apiClient from '../client';

// Mock apiClient
jest.mock('../client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('soulmateApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockSoulmateProfile: SoulmateProfile = {
    id: 'soulmate_123',
    personId: 'person_456',
    archetype: 'The Healer',
    description:
      'Your soulmate is a compassionate healer who brings emotional depth and nurturing energy.',
    meetingScenarios: [
      {
        context: 'Through mutual friends',
        description: 'A social gathering where deep conversations flow naturally.',
        probability: 65,
      },
      {
        context: 'At a spiritual retreat',
        description: 'During a transformative personal growth experience.',
        probability: 45,
      },
      {
        context: 'Through volunteer work',
        description: 'While helping others and making a difference.',
        probability: 30,
      },
    ],
    partnerPreferences: {
      sunSigns: ['Pisces', 'Cancer', 'Scorpio'],
      moonSigns: ['Cancer', 'Pisces'],
      risingSigns: ['Libra', 'Taurus'],
      venusSign: 'Cancer',
      marsSign: 'Scorpio',
      traits: ['Empathetic', 'Intuitive', 'Artistic', 'Loyal'],
    },
    idealPartnerQualities: [
      'Emotional intelligence',
      'Spiritual awareness',
      'Creative expression',
      'Commitment to growth',
    ],
    relationshipGuidance:
      'Focus on emotional authenticity and shared values. Your soulmate will appreciate vulnerability and deep connection.',
    createdAt: '2024-11-16T10:00:00Z',
    updatedAt: '2024-11-16T10:00:00Z',
  };

  const mockUserConnection: UserConnection = {
    id: 'connection_789',
    user1Id: 'user_123',
    user2Id: 'user_456',
    type: ConnectionType.ROMANTIC,
    status: 'pending',
    createdAt: '2024-11-16T10:00:00Z',
  };

  describe('generateSoulmateProfile', () => {
    it('should generate a soulmate profile for a person', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockSoulmateProfile });

      const result = await soulmateApi.generateSoulmateProfile('person_456');

      expect(apiClient.post).toHaveBeenCalledWith('/soulmate/person_456/generate');
      expect(result).toEqual(mockSoulmateProfile);
      expect(result.archetype).toBe('The Healer');
    });

    it('should include soulmate archetype', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockSoulmateProfile });

      const result = await soulmateApi.generateSoulmateProfile('person_456');

      expect(result.archetype).toBeDefined();
      expect(typeof result.archetype).toBe('string');
    });

    it('should include detailed description', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockSoulmateProfile });

      const result = await soulmateApi.generateSoulmateProfile('person_456');

      expect(result.description).toBeDefined();
      expect(result.description.length).toBeGreaterThan(30);
    });

    it('should include multiple meeting scenarios', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockSoulmateProfile });

      const result = await soulmateApi.generateSoulmateProfile('person_456');

      expect(Array.isArray(result.meetingScenarios)).toBe(true);
      expect(result.meetingScenarios.length).toBeGreaterThan(0);
    });

    it('should have probability scores for meeting scenarios', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockSoulmateProfile });

      const result = await soulmateApi.generateSoulmateProfile('person_456');

      result.meetingScenarios.forEach((scenario) => {
        expect(scenario.probability).toBeGreaterThanOrEqual(0);
        expect(scenario.probability).toBeLessThanOrEqual(100);
      });
    });

    it('should include partner astrological preferences', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockSoulmateProfile });

      const result = await soulmateApi.generateSoulmateProfile('person_456');

      expect(result.partnerPreferences).toBeDefined();
      expect(result.partnerPreferences?.sunSigns).toBeDefined();
      expect(result.partnerPreferences?.moonSigns).toBeDefined();
      expect(result.partnerPreferences?.risingSigns).toBeDefined();
    });

    it('should include ideal partner qualities', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockSoulmateProfile });

      const result = await soulmateApi.generateSoulmateProfile('person_456');

      expect(result.idealPartnerQualities).toBeDefined();
      expect(Array.isArray(result.idealPartnerQualities)).toBe(true);
    });

    it('should include relationship guidance', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockSoulmateProfile });

      const result = await soulmateApi.generateSoulmateProfile('person_456');

      expect(result.relationshipGuidance).toBeDefined();
      if (result.relationshipGuidance) {
        expect(result.relationshipGuidance.length).toBeGreaterThan(20);
      }
    });

    it('should handle different archetypes', async () => {
      const archetypes = [
        'The Healer',
        'The Adventurer',
        'The Intellectual',
        'The Artist',
        'The Leader',
      ];

      for (const archetype of archetypes) {
        const profile: SoulmateProfile = {
          ...mockSoulmateProfile,
          archetype,
          description: `Your soulmate is ${archetype.toLowerCase()}...`,
        };

        (apiClient.post as jest.Mock).mockResolvedValue({ data: profile });

        const result = await soulmateApi.generateSoulmateProfile('person_456');

        expect(result.archetype).toBe(archetype);
      }
    });

    it('should handle errors when generating profile', async () => {
      const mockError = new Error('Person not found');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(soulmateApi.generateSoulmateProfile('invalid_id')).rejects.toThrow(
        'Person not found'
      );
    });
  });

  describe('getSoulmateProfile', () => {
    it('should fetch existing soulmate profile', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockSoulmateProfile });

      const result = await soulmateApi.getSoulmateProfile('person_456');

      expect(apiClient.get).toHaveBeenCalledWith('/soulmate/person_456');
      expect(result).toEqual(mockSoulmateProfile);
    });

    it('should handle profile not found', async () => {
      const mockError = new Error('Soulmate profile not found');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(soulmateApi.getSoulmateProfile('person_456')).rejects.toThrow(
        'Soulmate profile not found'
      );
    });

    it('should fetch profile with null optional fields', async () => {
      const minimalProfile: SoulmateProfile = {
        ...mockSoulmateProfile,
        partnerPreferences: null,
        idealPartnerQualities: null,
        relationshipGuidance: null,
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: minimalProfile });

      const result = await soulmateApi.getSoulmateProfile('person_456');

      expect(result.partnerPreferences).toBeNull();
      expect(result.idealPartnerQualities).toBeNull();
      expect(result.relationshipGuidance).toBeNull();
    });
  });

  describe('findMatches', () => {
    it('should find potential soulmate matches', async () => {
      const mockMatches = [
        {
          userId: 'user_123',
          name: 'Jane Doe',
          compatibilityScore: 85,
          sunSign: 'Pisces',
          sharedInterests: ['Spirituality', 'Art'],
        },
        {
          userId: 'user_456',
          name: 'John Smith',
          compatibilityScore: 78,
          sunSign: 'Cancer',
          sharedInterests: ['Music', 'Meditation'],
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockMatches });

      const result = await soulmateApi.findMatches();

      expect(apiClient.get).toHaveBeenCalledWith('/soulmate/matches');
      expect(result).toEqual(mockMatches);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return empty array when no matches found', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });

      const result = await soulmateApi.findMatches();

      expect(result).toEqual([]);
    });

    it('should handle errors when finding matches', async () => {
      const mockError = new Error('Server error');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(soulmateApi.findMatches()).rejects.toThrow('Server error');
    });
  });

  describe('createConnection', () => {
    it('should create a romantic connection', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockUserConnection });

      const result = await soulmateApi.createConnection('user_456', ConnectionType.ROMANTIC);

      expect(apiClient.post).toHaveBeenCalledWith('/soulmate/connect', {
        user2Id: 'user_456',
        type: ConnectionType.ROMANTIC,
      });
      expect(result).toEqual(mockUserConnection);
      expect(result.type).toBe(ConnectionType.ROMANTIC);
    });

    it('should create a friend connection', async () => {
      const friendConnection: UserConnection = {
        ...mockUserConnection,
        type: ConnectionType.FRIEND,
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: friendConnection });

      const result = await soulmateApi.createConnection('user_456', ConnectionType.FRIEND);

      expect(result.type).toBe(ConnectionType.FRIEND);
    });

    it('should create a mentor connection', async () => {
      const mentorConnection: UserConnection = {
        ...mockUserConnection,
        type: ConnectionType.MENTOR,
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mentorConnection });

      const result = await soulmateApi.createConnection('user_456', ConnectionType.MENTOR);

      expect(result.type).toBe(ConnectionType.MENTOR);
    });

    it('should create other type connection', async () => {
      const otherConnection: UserConnection = {
        ...mockUserConnection,
        type: ConnectionType.OTHER,
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: otherConnection });

      const result = await soulmateApi.createConnection('user_456', ConnectionType.OTHER);

      expect(result.type).toBe(ConnectionType.OTHER);
    });

    it('should have pending status for new connections', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockUserConnection });

      const result = await soulmateApi.createConnection('user_456', ConnectionType.ROMANTIC);

      expect(result.status).toBe('pending');
    });

    it('should handle errors when creating connection', async () => {
      const mockError = new Error('User not found');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(
        soulmateApi.createConnection('invalid_id', ConnectionType.ROMANTIC)
      ).rejects.toThrow('User not found');
    });
  });

  describe('acceptConnection', () => {
    it('should accept a pending connection', async () => {
      const acceptedConnection: UserConnection = {
        ...mockUserConnection,
        status: 'accepted',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: acceptedConnection });

      const result = await soulmateApi.acceptConnection('connection_789');

      expect(apiClient.post).toHaveBeenCalledWith('/soulmate/connection/connection_789/accept');
      expect(result.status).toBe('accepted');
    });

    it('should handle connection not found', async () => {
      const mockError = new Error('Connection not found');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(soulmateApi.acceptConnection('invalid_id')).rejects.toThrow(
        'Connection not found'
      );
    });

    it('should handle already accepted connection', async () => {
      const mockError = new Error('Connection already accepted');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(soulmateApi.acceptConnection('connection_789')).rejects.toThrow(
        'Connection already accepted'
      );
    });
  });

  describe('Meeting Scenarios', () => {
    it('should have diverse meeting contexts', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockSoulmateProfile });

      const result = await soulmateApi.generateSoulmateProfile('person_456');

      expect(result.meetingScenarios.length).toBeGreaterThanOrEqual(2);

      const contexts = result.meetingScenarios.map((s) => s.context);
      const uniqueContexts = new Set(contexts);
      expect(uniqueContexts.size).toBe(contexts.length); // All unique
    });

    it('should have detailed scenario descriptions', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockSoulmateProfile });

      const result = await soulmateApi.generateSoulmateProfile('person_456');

      result.meetingScenarios.forEach((scenario) => {
        expect(scenario.context).toBeDefined();
        expect(scenario.description).toBeDefined();
        expect(scenario.description.length).toBeGreaterThan(10);
      });
    });

    it('should sort scenarios by probability', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockSoulmateProfile });

      const result = await soulmateApi.generateSoulmateProfile('person_456');

      // Check if sorted in descending order
      for (let i = 1; i < result.meetingScenarios.length; i++) {
        expect(result.meetingScenarios[i - 1].probability).toBeGreaterThanOrEqual(
          result.meetingScenarios[i].probability
        );
      }
    });
  });

  describe('Partner Preferences', () => {
    it('should include multiple compatible sun signs', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockSoulmateProfile });

      const result = await soulmateApi.generateSoulmateProfile('person_456');

      if (result.partnerPreferences) {
        expect(result.partnerPreferences.sunSigns.length).toBeGreaterThan(0);
      }
    });

    it('should include Venus and Mars signs', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockSoulmateProfile });

      const result = await soulmateApi.generateSoulmateProfile('person_456');

      if (result.partnerPreferences) {
        expect(result.partnerPreferences.venusSign).toBeDefined();
        expect(result.partnerPreferences.marsSign).toBeDefined();
      }
    });

    it('should include personality traits', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockSoulmateProfile });

      const result = await soulmateApi.generateSoulmateProfile('person_456');

      if (result.partnerPreferences) {
        expect(Array.isArray(result.partnerPreferences.traits)).toBe(true);
        expect(result.partnerPreferences.traits.length).toBeGreaterThan(0);
      }
    });
  });
});
