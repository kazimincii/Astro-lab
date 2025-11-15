/**
 * iOS Widget Service
 *
 * Manages data sharing between React Native app and iOS widgets
 * Uses App Groups and UserDefaults for data persistence
 */

import { Platform, NativeModules } from 'react-native';

const { WidgetDataManager } = NativeModules;

export interface WidgetData {
  todayHoroscope: {
    sign: string;
    text: string;
    date: string;
    mood: string;
    luckyNumber: number;
    luckyColor: string;
  };
  moonPhase: {
    phase: string;
    illumination: number;
    emoji: string;
  };
  birthChart?: {
    sunSign: string;
    moonSign: string;
    ascendant: string;
    mercury: string;
    venus: string;
    mars: string;
  };
  transits?: {
    title: string;
    description: string;
    date: string;
  }[];
  lastUpdated: string;
}

class WidgetService {
  private isSupported: boolean;

  constructor() {
    // Widgets only supported on iOS 14+
    this.isSupported = Platform.OS === 'ios' && WidgetDataManager !== undefined;
  }

  /**
   * Check if widgets are supported on this device
   */
  isWidgetSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Update widget data
   * @param data Widget data to save
   */
  async updateWidgetData(data: WidgetData): Promise<void> {
    if (!this.isSupported) {
      console.log('Widgets not supported on this platform');
      return;
    }

    try {
      const jsonData = JSON.stringify(data);
      await WidgetDataManager.saveData(jsonData);
      console.log('Widget data updated successfully');
    } catch (error) {
      console.error('Failed to update widget data:', error);
      throw error;
    }
  }

  /**
   * Reload all widget timelines
   * Call this after updating widget data to force immediate refresh
   */
  async reloadWidgets(): Promise<void> {
    if (!this.isSupported) {
      return;
    }

    try {
      await WidgetDataManager.reloadAllTimelines();
      console.log('Widgets reloaded successfully');
    } catch (error) {
      console.error('Failed to reload widgets:', error);
      throw error;
    }
  }

  /**
   * Get current widget data
   * Useful for debugging
   */
  async getWidgetData(): Promise<WidgetData | null> {
    if (!this.isSupported) {
      return null;
    }

    try {
      const jsonData = await WidgetDataManager.getData();
      return jsonData ? JSON.parse(jsonData) : null;
    } catch (error) {
      console.error('Failed to get widget data:', error);
      return null;
    }
  }

  /**
   * Update only horoscope data
   */
  async updateHoroscope(horoscope: WidgetData['todayHoroscope']): Promise<void> {
    const currentData = await this.getWidgetData();
    const newData: WidgetData = {
      ...currentData,
      todayHoroscope: horoscope,
      lastUpdated: new Date().toISOString(),
    } as WidgetData;

    await this.updateWidgetData(newData);
    await this.reloadWidgets();
  }

  /**
   * Update only moon phase data
   */
  async updateMoonPhase(moonPhase: WidgetData['moonPhase']): Promise<void> {
    const currentData = await this.getWidgetData();
    const newData: WidgetData = {
      ...currentData,
      moonPhase,
      lastUpdated: new Date().toISOString(),
    } as WidgetData;

    await this.updateWidgetData(newData);
    await this.reloadWidgets();
  }

  /**
   * Update birth chart data
   */
  async updateBirthChart(birthChart: WidgetData['birthChart']): Promise<void> {
    const currentData = await this.getWidgetData();
    const newData: WidgetData = {
      ...currentData,
      birthChart,
      lastUpdated: new Date().toISOString(),
    } as WidgetData;

    await this.updateWidgetData(newData);
    await this.reloadWidgets();
  }

  /**
   * Clear all widget data
   */
  async clearWidgetData(): Promise<void> {
    if (!this.isSupported) {
      return;
    }

    try {
      await WidgetDataManager.clearData();
      await this.reloadWidgets();
      console.log('Widget data cleared');
    } catch (error) {
      console.error('Failed to clear widget data:', error);
      throw error;
    }
  }
}

export const widgetService = new WidgetService();
