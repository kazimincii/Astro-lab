# Android Widgets Implementation

This directory contains Android widget implementations for the Astrology App.

## Overview

Three home screen widgets are available:
- **Today Widget**: Daily horoscope (small 2x2, medium 4x2)
- **Moon Phase Widget**: Current moon phase (small 2x2)
- **Chart Widget**: Birth chart summary (large 4x4) - Coming soon

## Directory Structure

```
android-widgets/
├── kotlin/                      # Kotlin source files
│   ├── WidgetDataModule.kt     # React Native bridge
│   ├── TodayWidget.kt          # Today horoscope widget
│   ├── MoonPhaseWidget.kt      # Moon phase widget
│   └── WidgetUpdateReceiver.kt # Update coordinator
├── layouts/                     # XML layouts (to be added to res/layout/)
└── README.md                    # This file
```

## Integration Steps

### 1. Copy Kotlin Files

Copy all `.kt` files from `kotlin/` to your Android project:

```bash
cp android-widgets/kotlin/*.kt android/app/src/main/java/com/astrology/app/widgets/
```

### 2. Register Native Module

Add to `MainApplication.kt`:

```kotlin
import com.astrology.app.widgets.WidgetDataModule

class MainApplication : Application(), ReactApplication {
    // ... existing code ...

    override fun onCreate() {
        super.onCreate()
        // ... existing code ...
    }

    override fun getPackages(): List<ReactPackage> {
        return PackageList(this).packages.apply {
            // Add widget data module
            add(object : ReactPackage {
                override fun createNativeModules(reactContext: ReactApplicationContext) =
                    listOf(WidgetDataModule(reactContext))

                override fun createViewManagers(reactContext: ReactApplicationContext) =
                    emptyList<ViewManager<*, *>>()
            })
        }
    }
}
```

### 3. Update AndroidManifest.xml

Add widget receivers to `AndroidManifest.xml`:

```xml
<application>
    <!-- ... existing config ... -->

    <!-- Today Widget -->
    <receiver
        android:name=".widgets.TodayWidget"
        android:exported="true"
        android:label="Today's Horoscope">
        <intent-filter>
            <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
        </intent-filter>
        <meta-data
            android:name="android.appwidget.provider"
            android:resource="@xml/widget_today_info" />
    </receiver>

    <!-- Moon Phase Widget -->
    <receiver
        android:name=".widgets.MoonPhaseWidget"
        android:exported="true"
        android:label="Moon Phase">
        <intent-filter>
            <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
        </intent-filter>
        <meta-data
            android:name="android.appwidget.provider"
            android:resource="@xml/widget_moon_phase_info" />
    </receiver>

    <!-- Widget Update Receiver -->
    <receiver
        android:name=".widgets.WidgetUpdateReceiver"
        android:exported="false">
        <intent-filter>
            <action android:name="com.astrology.app.UPDATE_WIDGETS" />
            <action android:name="android.intent.action.BOOT_COMPLETED" />
            <action android:name="android.intent.action.MY_PACKAGE_REPLACED" />
        </intent-filter>
    </receiver>
</application>

<!-- Required Permissions -->
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
```

### 4. Add Widget Resources

Create the following XML files in `android/app/src/main/res/`:

**res/xml/widget_today_info.xml**:
```xml
<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="110dp"
    android:minHeight="110dp"
    android:targetCellWidth="2"
    android:targetCellHeight="2"
    android:updatePeriodMillis="3600000"
    android:initialLayout="@layout/widget_today_small"
    android:resizeMode="horizontal|vertical"
    android:widgetCategory="home_screen"
    android:description="@string/widget_today_description"
    android:previewImage="@drawable/widget_today_preview" />
```

**res/xml/widget_moon_phase_info.xml**:
```xml
<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="110dp"
    android:minHeight="110dp"
    android:targetCellWidth="2"
    android:targetCellHeight="2"
    android:updatePeriodMillis="3600000"
    android:initialLayout="@layout/widget_moon_phase"
    android:resizeMode="none"
    android:widgetCategory="home_screen"
    android:description="@string/widget_moon_phase_description"
    android:previewImage="@drawable/widget_moon_preview" />
```

**res/values/strings.xml** (add these):
```xml
<string name="widget_today_description">View your daily horoscope</string>
<string name="widget_moon_phase_description">See the current moon phase</string>
```

### 5. Create Widget Layouts

See `ANDROID_WIDGETS.md` for complete layout XML examples, or create your own based on your design system.

### 6. Update Type Definitions

Update `src/types/widgets.d.ts` to include Android methods:

```typescript
declare module 'react-native' {
  export interface NativeModulesStatic {
    WidgetDataManager: {
      // iOS methods
      saveData(data: string): Promise<void>;
      getData(): Promise<string | null>;
      clearData(): Promise<void>;
      reloadAllTimelines(): Promise<void>;
      getCurrentTimeline(kind: string): Promise<any>;

      // Android methods
      updateWidgets(): Promise<void>; // Android-specific
      getLastUpdate(): Promise<number>; // Android-specific
    };
  }
}
```

### 7. Use in React Native

```typescript
import { NativeModules, Platform } from 'react-native';

const { WidgetDataManager } = NativeModules;

// Update widgets from React Native
const updateWidgets = async (data: WidgetData) => {
  try {
    await WidgetDataManager.saveData(JSON.stringify(data));

    if (Platform.OS === 'ios') {
      await WidgetDataManager.reloadAllTimelines();
    } else if (Platform.OS === 'android') {
      await WidgetDataManager.updateWidgets();
    }
  } catch (error) {
    console.error('Widget update failed:', error);
  }
};
```

## Testing

1. Build the app:
   ```bash
   npx expo run:android
   ```

2. Add widget to home screen:
   - Long-press home screen
   - Tap "Widgets"
   - Find "Astrology" widgets
   - Drag to home screen

3. Test data sync:
   - Open the React Native app
   - Navigate to a screen that triggers widget update
   - Verify widget shows updated data

4. Test deep linking:
   - Tap on widget
   - Verify app opens to correct screen

## Debugging

Enable logging and check logcat:

```bash
adb logcat -s TodayWidget MoonPhaseWidget WidgetUpdateReceiver
```

Check if data is being saved:

```bash
adb shell run-as com.astrology.app cat /data/data/com.astrology.app/shared_prefs/astrology_widget_data.xml
```

## Common Issues

### Widget not appearing
- Check `AndroidManifest.xml` registration
- Verify package name matches
- Check minimum SDK version (24+)

### Data not updating
- Verify SharedPreferences key names match
- Check if `updateWidgets()` is being called
- Review logcat for errors

### Build errors
- Ensure Kotlin version compatibility (1.9.0+)
- Check Gradle dependencies
- Verify AndroidX migration complete

## Next Steps

1. Create custom layouts matching your design system
2. Add preview images for widget picker
3. Implement WorkManager for background updates
4. Add chart widget implementation
5. Customize colors and styling

## Resources

- See `ANDROID_WIDGETS.md` for complete implementation guide
- [Android App Widgets Documentation](https://developer.android.com/develop/ui/views/appwidgets)
- [RemoteViews Reference](https://developer.android.com/reference/android/widget/RemoteViews)
