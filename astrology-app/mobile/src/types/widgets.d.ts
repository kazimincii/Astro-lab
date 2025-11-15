/**
 * iOS Widget Native Module Type Definitions
 */

declare module 'react-native' {
  export interface NativeModulesStatic {
    WidgetDataManager: {
      /**
       * Save widget data to shared UserDefaults
       * @param data JSON string of widget data
       */
      saveData(data: string): Promise<void>;

      /**
       * Get widget data from shared UserDefaults
       * @returns JSON string of widget data or null
       */
      getData(): Promise<string | null>;

      /**
       * Clear all widget data
       */
      clearData(): Promise<void>;

      /**
       * Reload all widget timelines
       * Forces immediate widget refresh
       */
      reloadAllTimelines(): Promise<void>;

      /**
       * Get current timeline for a specific widget
       * @param kind Widget kind identifier
       */
      getCurrentTimeline(kind: string): Promise<any>;
    };
  }
}

export {};
