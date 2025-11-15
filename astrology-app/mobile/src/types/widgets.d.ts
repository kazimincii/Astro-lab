/**
 * iOS & Android Widget Native Module Type Definitions
 */

declare module 'react-native' {
  export interface NativeModulesStatic {
    WidgetDataManager: {
      /**
       * Save widget data to shared storage (UserDefaults on iOS, SharedPreferences on Android)
       * @param data JSON string of widget data
       */
      saveData(data: string): Promise<void>;

      /**
       * Get widget data from shared storage
       * @returns JSON string of widget data or null
       */
      getData(): Promise<string | null>;

      /**
       * Clear all widget data
       */
      clearData(): Promise<void>;

      /**
       * Reload all widget timelines (iOS only)
       * Forces immediate widget refresh
       */
      reloadAllTimelines(): Promise<void>;

      /**
       * Get current timeline for a specific widget (iOS only)
       * @param kind Widget kind identifier
       */
      getCurrentTimeline(kind: string): Promise<any>;

      /**
       * Update all widgets (Android only)
       * Triggers immediate widget update broadcast
       */
      updateWidgets(): Promise<void>;

      /**
       * Get last update timestamp (Android only)
       * @returns Timestamp in milliseconds
       */
      getLastUpdate(): Promise<number>;
    };
  }
}

export {};
