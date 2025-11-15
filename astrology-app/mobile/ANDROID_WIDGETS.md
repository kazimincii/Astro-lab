# Android Widgets Implementation Guide

This guide explains how to implement Android home screen widgets for the Astrology App.

## Overview

Using Android's App Widgets framework to create home screen widgets:

1. **Today Widget**: Daily horoscope and important transits
2. **Chart Widget**: Birth chart summary
3. **Moon Phase Widget**: Current moon phase

## Technical Stack

- **Android App Widgets**: Native Android widget framework (API 14+)
- **RemoteViews**: Widget UI rendering
- **SharedPreferences**: Data storage between app and widgets
- **WorkManager**: Background data updates
- **Glance (Optional)**: Jetpack Compose for Widgets (modern approach)

## Setup Steps

### 1. Expo Config Plugin

Add to `app.json`:

```json
{
  "expo": {
    "android": {
      "package": "com.astrology.app",
      "permissions": [
        "android.permission.INTERNET",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.RECEIVE_BOOT_COMPLETED"
      ]
    },
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "minSdkVersion": 24,
            "compileSdkVersion": 34,
            "targetSdkVersion": 34,
            "kotlinVersion": "1.9.0"
          }
        }
      ]
    ]
  }
}
```

### 2. Prebuild for Android

```bash
# Generate native Android project
npx expo prebuild --platform android

# Run on Android
npx expo run:android
```

### 3. Widget Files Structure

```
android/
├── app/
│   └── src/
│       └── main/
│           ├── java/com/astrology/app/
│           │   ├── widgets/
│           │   │   ├── TodayWidget.kt
│           │   │   ├── ChartWidget.kt
│           │   │   ├── MoonPhaseWidget.kt
│           │   │   ├── WidgetDataProvider.kt
│           │   │   └── WidgetUpdateReceiver.kt
│           │   └── WidgetDataModule.kt
│           └── res/
│               ├── layout/
│               │   ├── widget_today_small.xml
│               │   ├── widget_today_medium.xml
│               │   ├── widget_chart.xml
│               │   └── widget_moon_phase.xml
│               ├── xml/
│               │   ├── widget_today_info.xml
│               │   ├── widget_chart_info.xml
│               │   └── widget_moon_phase_info.xml
│               └── drawable/
│                   └── widget_preview.png
```

## Widget Types

### Small Widget (2x2 cells)
- Daily single horoscope
- Moon phase indicator
- Size: ~110x110 dp

### Medium Widget (4x2 cells)
- Daily horoscope + rising sign
- Important transits
- Size: ~250x110 dp

### Large Widget (4x4 cells)
- Birth chart summary
- All planet positions
- Size: ~250x250 dp

## Data Sharing

### React Native to Android Widget

```typescript
// src/services/widgetService.ts
import { NativeModules } from 'react-native';

const { WidgetDataManager } = NativeModules;

export const updateAndroidWidget = async (data: WidgetData) => {
  try {
    await WidgetDataManager.saveData(JSON.stringify(data));
    await WidgetDataManager.updateWidgets();
  } catch (error) {
    console.error('Android widget update failed:', error);
  }
};

interface WidgetData {
  todayHoroscope: {
    sign: string;
    text: string;
    date: string;
    luckyNumber?: number;
    luckyColor?: string;
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
    planets: Record<string, string>;
  };
}
```

### Kotlin SharedPreferences Manager

```kotlin
// WidgetDataManager.kt
package com.astrology.app.widgets

import android.content.Context
import android.content.SharedPreferences
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

class WidgetDataModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val PREFS_NAME = "astrology_widget_data"
        const val KEY_WIDGET_DATA = "widget_data"
    }

    override fun getName() = "WidgetDataManager"

    @ReactMethod
    fun saveData(jsonData: String, promise: Promise) {
        try {
            val prefs = getSharedPrefs()
            prefs.edit().putString(KEY_WIDGET_DATA, jsonData).apply()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SAVE_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun getData(promise: Promise) {
        try {
            val prefs = getSharedPrefs()
            val data = prefs.getString(KEY_WIDGET_DATA, null)
            promise.resolve(data)
        } catch (e: Exception) {
            promise.reject("GET_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun clearData(promise: Promise) {
        try {
            val prefs = getSharedPrefs()
            prefs.edit().clear().apply()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("CLEAR_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun updateWidgets(promise: Promise) {
        try {
            WidgetUpdateReceiver.updateAllWidgets(reactApplicationContext)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("UPDATE_ERROR", e.message, e)
        }
    }

    private fun getSharedPrefs(): SharedPreferences {
        return reactApplicationContext.getSharedPreferences(
            PREFS_NAME,
            Context.MODE_PRIVATE
        )
    }
}

@Serializable
data class WidgetData(
    val todayHoroscope: Horoscope,
    val moonPhase: MoonPhase,
    val birthChart: BirthChart? = null
)

@Serializable
data class Horoscope(
    val sign: String,
    val text: String,
    val date: String,
    val luckyNumber: Int? = null,
    val luckyColor: String? = null
)

@Serializable
data class MoonPhase(
    val phase: String,
    val illumination: Double,
    val emoji: String
)

@Serializable
data class BirthChart(
    val sunSign: String,
    val moonSign: String,
    val ascendant: String,
    val planets: Map<String, String> = emptyMap()
)
```

## Widget Implementation

### 1. Today Widget

**Widget Provider (`TodayWidget.kt`)**:

```kotlin
package com.astrology.app.widgets

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import com.astrology.app.R
import kotlinx.serialization.json.Json

class TodayWidget : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        appWidgetIds.forEach { appWidgetId ->
            updateWidget(context, appWidgetManager, appWidgetId)
        }
    }

    companion object {
        fun updateWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val widgetData = getWidgetData(context)
            val views = RemoteViews(context.packageName, R.layout.widget_today_small)

            if (widgetData != null) {
                views.setTextViewText(R.id.widget_sign, widgetData.todayHoroscope.sign)
                views.setTextViewText(R.id.widget_horoscope, widgetData.todayHoroscope.text)
                views.setTextViewText(R.id.widget_date, widgetData.todayHoroscope.date)

                // Lucky number badge
                widgetData.todayHoroscope.luckyNumber?.let { number ->
                    views.setTextViewText(R.id.widget_lucky_number, number.toString())
                    views.setViewVisibility(R.id.widget_lucky_number_container, android.view.View.VISIBLE)
                }
            } else {
                views.setTextViewText(R.id.widget_sign, "Loading...")
                views.setTextViewText(R.id.widget_horoscope, "Open app to sync")
            }

            // Deep link to app
            val intent = Intent(Intent.ACTION_VIEW).apply {
                data = Uri.parse("astrology://today")
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            val pendingIntent = android.app.PendingIntent.getActivity(
                context, 0, intent,
                android.app.PendingIntent.FLAG_UPDATE_CURRENT or android.app.PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_container, pendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }

        private fun getWidgetData(context: Context): WidgetData? {
            val prefs = context.getSharedPreferences(
                WidgetDataModule.PREFS_NAME,
                Context.MODE_PRIVATE
            )
            val jsonData = prefs.getString(WidgetDataModule.KEY_WIDGET_DATA, null)
            return jsonData?.let {
                try {
                    Json.decodeFromString<WidgetData>(it)
                } catch (e: Exception) {
                    null
                }
            }
        }
    }
}
```

**Widget Layout (`res/layout/widget_today_small.xml`)**:

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/widget_container"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="@drawable/widget_background"
    android:padding="16dp">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:gravity="center_vertical">

        <TextView
            android:id="@+id/widget_sign"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="Aries"
            android:textSize="18sp"
            android:textStyle="bold"
            android:textColor="#FFFFFF" />

        <LinearLayout
            android:id="@+id/widget_lucky_number_container"
            android:layout_width="32dp"
            android:layout_height="32dp"
            android:background="@drawable/badge_background"
            android:gravity="center"
            android:visibility="gone">

            <TextView
                android:id="@+id/widget_lucky_number"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="7"
                android:textSize="16sp"
                android:textStyle="bold"
                android:textColor="#FFD700" />
        </LinearLayout>
    </LinearLayout>

    <TextView
        android:id="@+id/widget_horoscope"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1"
        android:layout_marginTop="8dp"
        android:text="Today brings opportunities..."
        android:textSize="12sp"
        android:textColor="#E0E0E0"
        android:maxLines="4"
        android:ellipsize="end" />

    <TextView
        android:id="@+id/widget_date"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="4dp"
        android:text="Jan 15, 2024"
        android:textSize="10sp"
        android:textColor="#B0B0B0"
        android:gravity="end" />
</LinearLayout>
```

**Widget Configuration (`res/xml/widget_today_info.xml`)**:

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
    android:resizeMode="none"
    android:widgetCategory="home_screen"
    android:description="@string/widget_today_description"
    android:previewImage="@drawable/widget_today_preview" />
```

### 2. Widget Update Receiver

```kotlin
// WidgetUpdateReceiver.kt
package com.astrology.app.widgets

import android.appwidget.AppWidgetManager
import android.content.BroadcastReceiver
import android.content.ComponentName
import android.content.Context
import android.content.Intent

class WidgetUpdateReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        when (intent.action) {
            ACTION_UPDATE_WIDGETS -> updateAllWidgets(context)
            Intent.ACTION_BOOT_COMPLETED -> scheduleUpdates(context)
        }
    }

    companion object {
        const val ACTION_UPDATE_WIDGETS = "com.astrology.app.UPDATE_WIDGETS"

        fun updateAllWidgets(context: Context) {
            val appWidgetManager = AppWidgetManager.getInstance(context)

            // Update Today Widget
            val todayWidgetIds = appWidgetManager.getAppWidgetIds(
                ComponentName(context, TodayWidget::class.java)
            )
            todayWidgetIds.forEach { id ->
                TodayWidget.updateWidget(context, appWidgetManager, id)
            }

            // Update Chart Widget
            val chartWidgetIds = appWidgetManager.getAppWidgetIds(
                ComponentName(context, ChartWidget::class.java)
            )
            chartWidgetIds.forEach { id ->
                ChartWidget.updateWidget(context, appWidgetManager, id)
            }

            // Update Moon Phase Widget
            val moonWidgetIds = appWidgetManager.getAppWidgetIds(
                ComponentName(context, MoonPhaseWidget::class.java)
            )
            moonWidgetIds.forEach { id ->
                MoonPhaseWidget.updateWidget(context, appWidgetManager, id)
            }
        }

        private fun scheduleUpdates(context: Context) {
            // Use WorkManager for periodic updates
            // Implementation depends on update frequency requirements
        }
    }
}
```

### 3. AndroidManifest.xml

```xml
<manifest>
    <application>
        <!-- Today Widget -->
        <receiver
            android:name=".widgets.TodayWidget"
            android:exported="true">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data
                android:name="android.appwidget.provider"
                android:resource="@xml/widget_today_info" />
        </receiver>

        <!-- Chart Widget -->
        <receiver
            android:name=".widgets.ChartWidget"
            android:exported="true">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data
                android:name="android.appwidget.provider"
                android:resource="@xml/widget_chart_info" />
        </receiver>

        <!-- Moon Phase Widget -->
        <receiver
            android:name=".widgets.MoonPhaseWidget"
            android:exported="true">
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
            </intent-filter>
        </receiver>
    </application>

    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
</manifest>
```

## Deep Linking

Handle widget taps in React Native:

```typescript
// App.tsx
import { useEffect } from 'react';
import { Linking } from 'react-native';

useEffect(() => {
  const handleDeepLink = ({ url }: { url: string }) => {
    const route = url.replace(/.*?:\/\//g, '');
    const routeName = route.split('/')[0];

    switch (routeName) {
      case 'today':
        navigation.navigate('Today');
        break;
      case 'chart':
        navigation.navigate('Chart');
        break;
      case 'moon':
        navigation.navigate('MoonPhase');
        break;
    }
  };

  // Check initial URL
  Linking.getInitialURL().then(url => {
    if (url) handleDeepLink({ url });
  });

  // Listen for URL changes
  const subscription = Linking.addEventListener('url', handleDeepLink);

  return () => subscription.remove();
}, []);
```

## Update Strategy

### Auto-Updates Hook

```typescript
// src/hooks/useAndroidWidgetUpdates.ts
import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import { updateAndroidWidget } from '@/services/widgetService';
import { useProfileStore } from '@/store/profileStore';
import { fetchTodayHoroscope, fetchMoonPhase } from '@/api/widgets';

export const useAndroidWidgetUpdates = () => {
  const { currentProfile } = useProfileStore();

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const updateWidgets = async () => {
      if (!currentProfile) return;

      try {
        const [horoscope, moonPhase] = await Promise.all([
          fetchTodayHoroscope(currentProfile.sunSign),
          fetchMoonPhase(),
        ]);

        const data = {
          todayHoroscope: {
            sign: currentProfile.sunSign,
            text: horoscope.text,
            date: new Date().toLocaleDateString(),
            luckyNumber: horoscope.luckyNumber,
            luckyColor: horoscope.luckyColor,
          },
          moonPhase: {
            phase: moonPhase.phaseName,
            illumination: moonPhase.illumination,
            emoji: moonPhase.emoji,
          },
          birthChart: {
            sunSign: currentProfile.sunSign,
            moonSign: currentProfile.moonSign,
            ascendant: currentProfile.ascendant,
            planets: currentProfile.planets,
          },
        };

        await updateAndroidWidget(data);
      } catch (error) {
        console.error('Widget update failed:', error);
      }
    };

    // Update on app launch
    updateWidgets();

    // Update when app returns to foreground
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        updateWidgets();
      }
    });

    return () => subscription.remove();
  }, [currentProfile]);
};
```

### Background Updates with WorkManager

```kotlin
// WidgetUpdateWorker.kt
package com.astrology.app.widgets

import android.content.Context
import androidx.work.*
import java.util.concurrent.TimeUnit

class WidgetUpdateWorker(context: Context, params: WorkerParameters) :
    Worker(context, params) {

    override fun doWork(): Result {
        return try {
            WidgetUpdateReceiver.updateAllWidgets(applicationContext)
            Result.success()
        } catch (e: Exception) {
            Result.failure()
        }
    }

    companion object {
        fun schedule(context: Context) {
            val constraints = Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build()

            val updateRequest = PeriodicWorkRequestBuilder<WidgetUpdateWorker>(
                6, TimeUnit.HOURS
            )
                .setConstraints(constraints)
                .build()

            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                "widget_update",
                ExistingPeriodicWorkPolicy.KEEP,
                updateRequest
            )
        }
    }
}
```

## Testing

### Manual Testing

1. Build and install app: `npx expo run:android`
2. Long-press home screen → Widgets
3. Find "Astrology" widgets
4. Add widget to home screen
5. Open React Native app and sync data
6. Verify widget updates

### Debugging

```kotlin
// Add logging to widget updates
import android.util.Log

class TodayWidget : AppWidgetProvider() {
    companion object {
        private const val TAG = "TodayWidget"

        fun updateWidget(...) {
            Log.d(TAG, "Updating widget $appWidgetId")
            val widgetData = getWidgetData(context)
            Log.d(TAG, "Widget data: $widgetData")
            // ... rest of code
        }
    }
}
```

View logs:
```bash
adb logcat -s TodayWidget
```

## Performance Optimization

1. **Update Frequency**: Limit to 1-6 hours
2. **Memory Usage**: Keep RemoteViews lightweight
3. **Bitmap Caching**: Cache any images used in widgets
4. **Data Size**: Keep SharedPreferences data minimal

## Best Practices

1. **Handle Missing Data**: Always show placeholder when data unavailable
2. **Battery Efficiency**: Use WorkManager for background updates
3. **Permissions**: Request minimal permissions
4. **Error Handling**: Gracefully handle all errors
5. **Testing**: Test on multiple Android versions and screen sizes

## Troubleshooting

### Widget not appearing
- Check `AndroidManifest.xml` registration
- Verify package name matches
- Check minimum SDK version (24+)

### Data not updating
- Verify SharedPreferences key names
- Check if `updateWidgets()` is being called
- Review WorkManager constraints

### Build errors
- Ensure Kotlin version compatibility
- Check Gradle dependencies
- Verify AndroidX migration complete

## Resources

- [Android App Widgets](https://developer.android.com/develop/ui/views/appwidgets)
- [RemoteViews](https://developer.android.com/reference/android/widget/RemoteViews)
- [WorkManager](https://developer.android.com/topic/libraries/architecture/workmanager)
- [Glance for Android](https://developer.android.com/jetpack/compose/glance)
