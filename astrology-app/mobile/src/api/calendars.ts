import client from './client';

export type CalendarType = 'beauty' | 'health' | 'activity' | 'spiritual' | 'transit' | 'moon';

export interface CalendarEntry {
  date: string;
  type: CalendarType;
  rating: number;
  tips: string[];
  favorableActivities?: string[];
  unfavorableActivities?: string[];
}

export const calendarsApi = {
  getCalendar: async (
    type: CalendarType,
    month: number,
    year: number
  ): Promise<CalendarEntry[]> => {
    const response = await client.get(`/calendars/${type}`, {
      params: { month, year },
    });
    return response.data;
  },

  getDay: async (type: CalendarType, date: string): Promise<CalendarEntry> => {
    const response = await client.get(`/calendars/${type}/day/${date}`);
    return response.data;
  },

  getAllCalendarsForDay: async (date: string): Promise<CalendarEntry[]> => {
    const response = await client.get(`/calendars/day/${date}`);
    return response.data;
  },
};
