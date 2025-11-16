import { apiClient } from './client';

export interface CityAnalysis {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  lifeRating: number;
  loveRating: number;
  careerRating: number;
  summary: string;
  influences: string[];
}

export interface PlanetaryLine {
  planet: string;
  lineType: string;
  coordinates: Array<{ lat: number; lng: number }>;
}

export const astroMapApi = {
  analyzeCity: async (profileId: string, city: string): Promise<CityAnalysis> => {
    const response = await apiClient.post('/astro-map/analyze', {
      profileId,
      city,
    });
    return response.data;
  },

  getPlanetaryLines: async (profileId: string): Promise<PlanetaryLine[]> => {
    const response = await apiClient.get(`/astro-map/lines/${profileId}`);
    return response.data;
  },

  getThemedView: async (
    profileId: string,
    theme: 'life' | 'love' | 'career'
  ): Promise<any> => {
    const response = await apiClient.get(`/astro-map/theme/${profileId}/${theme}`);
    return response.data;
  },
};
