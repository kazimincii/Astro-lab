import apiClient from './client';

export enum ContentCategory {
  PLANETS = 'planets',
  HOUSES = 'houses',
  ASPECTS = 'aspects',
  SIGNS = 'signs',
  RETROGRADES = 'retrogrades',
  TRANSITS = 'transits',
  BASICS = 'basics',
  ADVANCED = 'advanced',
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export interface EducationContent {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: ContentCategory;
  difficulty: DifficultyLevel;
  tags: string[];
  readingTimeMinutes: number;
  sortOrder: number;
  iconUrl: string | null;
  relatedTopics: string[];
  isPublished: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export const educationApi = {
  getAllContent: async (category?: ContentCategory): Promise<EducationContent[]> => {
    const params = category ? { category } : {};
    const response = await apiClient.get('/education', { params });
    return response.data;
  },

  getContentByCategory: async (category: ContentCategory): Promise<EducationContent[]> => {
    const response = await apiClient.get(`/education/category/${category}`);
    return response.data;
  },

  getContentById: async (id: string): Promise<EducationContent> => {
    const response = await apiClient.get(`/education/${id}`);
    return response.data;
  },
};
