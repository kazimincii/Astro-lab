import { soulmateApi, SoulmateProfile, ConnectionType, UserConnection } from '../soulmate';
import apiClient from '../client';

// Mock apiClient - uses centralized mock from __mocks__/client.ts
jest.mock('../client');

describe('soulmateApi', () => {
  const mockSoulmateProfile: SoulmateProfile = {
    id: 'soulmate-123',
    personId: 'person-456',
    archetype: 'The Cosmic Companion',
    description: 'You are destined to meet someone who complements your cosmic energy perfectly.',
    meetingScenarios: [
      {
        context: 'Through mutual friends',
        description: 'Likely to meet at a social gathering or through a shared connection.',
        probability: 0.65,
      },
      {
        context: 'Professional setting',
        description: 'Career-related events may bring you together.',
        probability: 0.45,
      },
      {
        context: 'Spiritual or wellness event',
        description: 'A yoga class, meditation retreat, or similar event.',
        probability: 0.55,
      },
    ],
    partnerPreferences: {
      sunSigns: ['Taurus', 'Virgo', 'Capricorn'],
      moonSigns: ['Cancer', 'Scorpio', 'Pisces'],
      risingSigns: ['Libra', 'Aquarius'],
      venusSign: 'Pisces',
      marsSign: 'Scorpio',
      traits: ['compassionate', 'loyal', 'creative', 'ambitious'],
    },
    idealPartnerQualities: [
      'Emotional intelligence',
      'Strong communication skills',
      'Shared spiritual interests',
      'Sense of humor',
    ],
    relationshipGuidance: 'Focus on building emotional connections before rushing into commitment.',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  };

  const mockUserConnection: UserConnection = {
    id: 'connection-123',
    user1Id: 'user-1',
    user2Id: 'user-2',
    type: ConnectionType.ROMANTIC,
    status: 'pending',
    createdAt: '2024-01-15T10:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateSoulmateProfile', () => {
    it('should generate soulmate profile for person', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockSoulmateProfile });

      const result = await soulmateApi.generateSoulmateProfile('person-456');

      expect(apiClient.post).toHaveBeenCalledWith('/soulmate/person-456/generate');
      expect(result).toEqual(mockSoulmateProfile);
    });

    it('should return profile with archetype', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockSoulmateProfile });

      const result = await soulmateApi.generateSoulmateProfile('person-456');

      expect(result.archetype).toBe('The Cosmic Companion');
    });

    it('should return profile with meeting scenarios', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockSoulmateProfile });

      const result = await soulmateApi.generateSoulmateProfile('person-456');

      expect(Array.isArray(result.meetingScenarios)).toBe(true);
      expect(result.meetingScenarios.length).toBeGreaterThan(0);
      expect(result.meetingScenarios[0]).toHaveProperty('context');
      expect(result.meetingScenarios[0]).toHaveProperty('description');
      expect(result.meetingScenarios[0]).toHaveProperty('probability');
    });

    it('should return partner preferences with astrological signs', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockSoulmateProfile });

      const result = await soulmateApi.generateSoulmateProfile('person-456');

      expect(result.partnerPreferences).toBeDefined();
      expect(Array.isArray(result.partnerPreferences?.sunSigns)).toBe(true);
      expect(Array.isArray(result.partnerPreferences?.moonSigns)).toBe(true);
      expect(Array.isArray(result.partnerPreferences?.risingSigns)).toBe(true);
      expect(result.partnerPreferences?.venusSign).toBeDefined();
      expect(result.partnerPreferences?.marsSign).toBeDefined();
    });

    it('should return partner traits', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockSoulmateProfile });

      const result = await soulmateApi.generateSoulmateProfile('person-456');

      expect(Array.isArray(result.partnerPreferences?.traits)).toBe(true);
      expect(result.partnerPreferences?.traits).toContain('compassionate');
    });

    it('should return ideal partner qualities', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockSoulmateProfile });

      const result = await soulmateApi.generateSoulmateProfile('person-456');

      expect(Array.isArray(result.idealPartnerQualities)).toBe(true);
      expect(result.idealPartnerQualities).toContain('Emotional intelligence');
    });

    it('should return relationship guidance', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockSoulmateProfile });

      const result = await soulmateApi.generateSoulmateProfile('person-456');

      expect(result.relationshipGuidance).toBeDefined();
      expect(typeof result.relationshipGuidance).toBe('string');
    });

    it('should handle API errors', async () => {
      const mockError = new Error('Failed to generate profile');
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(
        soulmateApi.generateSoulmateProfile('person-456'),
      ).rejects.toThrow('Failed to generate profile');
    });
  });

  describe('getSoulmateProfile', () => {
    it('should get existing soulmate profile', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockSoulmateProfile });

      const result = await soulmateApi.getSoulmateProfile('person-456');

      expect(apiClient.get).toHaveBeenCalledWith('/soulmate/person-456');
      expect(result).toEqual(mockSoulmateProfile);
    });

    it('should return complete profile structure', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockSoulmateProfile });

      const result = await soulmateApi.getSoulmateProfile('person-456');

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('personId');
      expect(result).toHaveProperty('archetype');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('meetingScenarios');
      expect(result).toHaveProperty('partnerPreferences');
      expect(result).toHaveProperty('idealPartnerQualities');
      expect(result).toHaveProperty('relationshipGuidance');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });

    it('should handle 404 when profile not found', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Soulmate profile not found' },
        },
      };
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(soulmateApi.getSoulmateProfile('person-456')).rejects.toEqual(
        mockError,
      );
    });
  });

  describe('findMatches', () => {
    it('should find soulmate matches', async () => {
      const mockMatches = [
        {
          userId: 'user-2',
          compatibilityScore: 0.85,
          sharedInterests: ['spirituality', 'yoga', 'travel'],
          astrologicalAlignment: 'Very compatible sun and moon signs',
        },
        {
          userId: 'user-3',
          compatibilityScore: 0.72,
          sharedInterests: ['meditation', 'reading'],
          astrologicalAlignment: 'Good Venus-Mars aspect',
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockMatches });

      const result = await soulmateApi.findMatches();

      expect(apiClient.get).toHaveBeenCalledWith('/soulmate/matches');
      expect(result).toEqual(mockMatches);
    });

    it('should return array of matches', async () => {
      const mockMatches = [{ userId: 'user-2' }, { userId: 'user-3' }];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockMatches });

      const result = await soulmateApi.findMatches();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });

    it('should return empty array when no matches found', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });

      const result = await soulmateApi.findMatches();

      expect(result).toEqual([]);
    });

    it('should handle network errors', async () => {
      const mockError = new Error('Network timeout');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(soulmateApi.findMatches()).rejects.toThrow('Network timeout');
    });
  });

  describe('createConnection', () => {
    it('should create romantic connection', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockUserConnection });

      const result = await soulmateApi.createConnection('user-2', ConnectionType.ROMANTIC);

      expect(apiClient.post).toHaveBeenCalledWith('/soulmate/connect', {
        user2Id: 'user-2',
        type: ConnectionType.ROMANTIC,
      });
      expect(result).toEqual(mockUserConnection);
    });

    it('should create friend connection', async () => {
      const friendConnection = {
        ...mockUserConnection,
        type: ConnectionType.FRIEND,
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: friendConnection });

      const result = await soulmateApi.createConnection('user-2', ConnectionType.FRIEND);

      expect(apiClient.post).toHaveBeenCalledWith('/soulmate/connect', {
        user2Id: 'user-2',
        type: ConnectionType.FRIEND,
      });
      expect(result.type).toBe(ConnectionType.FRIEND);
    });

    it('should create mentor connection', async () => {
      const mentorConnection = {
        ...mockUserConnection,
        type: ConnectionType.MENTOR,
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mentorConnection });

      const result = await soulmateApi.createConnection('user-2', ConnectionType.MENTOR);

      expect(result.type).toBe(ConnectionType.MENTOR);
    });

    it('should create other type connection', async () => {
      const otherConnection = {
        ...mockUserConnection,
        type: ConnectionType.OTHER,
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: otherConnection });

      const result = await soulmateApi.createConnection('user-2', ConnectionType.OTHER);

      expect(result.type).toBe(ConnectionType.OTHER);
    });

    it('should return connection with pending status', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockUserConnection });

      const result = await soulmateApi.createConnection('user-2', ConnectionType.ROMANTIC);

      expect(result.status).toBe('pending');
    });

    it('should include both user IDs', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockUserConnection });

      const result = await soulmateApi.createConnection('user-2', ConnectionType.ROMANTIC);

      expect(result).toHaveProperty('user1Id');
      expect(result).toHaveProperty('user2Id');
      expect(result.user2Id).toBe('user-2');
    });

    it('should handle duplicate connection errors', async () => {
      const mockError = {
        response: {
          status: 409,
          data: { message: 'Connection already exists' },
        },
      };
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(
        soulmateApi.createConnection('user-2', ConnectionType.ROMANTIC),
      ).rejects.toEqual(mockError);
    });
  });

  describe('acceptConnection', () => {
    it('should accept connection request', async () => {
      const acceptedConnection = {
        ...mockUserConnection,
        status: 'accepted',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: acceptedConnection });

      const result = await soulmateApi.acceptConnection('connection-123');

      expect(apiClient.post).toHaveBeenCalledWith('/soulmate/connection/connection-123/accept');
      expect(result).toEqual(acceptedConnection);
    });

    it('should update connection status to accepted', async () => {
      const acceptedConnection = {
        ...mockUserConnection,
        status: 'accepted',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: acceptedConnection });

      const result = await soulmateApi.acceptConnection('connection-123');

      expect(result.status).toBe('accepted');
    });

    it('should handle different connection IDs', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({
        data: { ...mockUserConnection, status: 'accepted' },
      });

      await soulmateApi.acceptConnection('connection-456');

      expect(apiClient.post).toHaveBeenCalledWith('/soulmate/connection/connection-456/accept');
    });

    it('should handle 404 when connection not found', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Connection not found' },
        },
      };
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(soulmateApi.acceptConnection('non-existent')).rejects.toEqual(
        mockError,
      );
    });

    it('should handle already accepted connections', async () => {
      const mockError = {
        response: {
          status: 400,
          data: { message: 'Connection already accepted' },
        },
      };
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(soulmateApi.acceptConnection('connection-123')).rejects.toEqual(
        mockError,
      );
    });
  });

  describe('connection types', () => {
    it('should have correct connection type values', () => {
      expect(ConnectionType.FRIEND).toBe('friend');
      expect(ConnectionType.ROMANTIC).toBe('romantic');
      expect(ConnectionType.MENTOR).toBe('mentor');
      expect(ConnectionType.OTHER).toBe('other');
    });
  });
});
