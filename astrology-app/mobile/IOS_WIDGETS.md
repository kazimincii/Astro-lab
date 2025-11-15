# iOS Widgets Implementation Guide

Bu rehber Astrology App için iOS widget'larının nasıl implement edileceğini açıklar.

## Genel Bakış

iOS 14+ ile gelen WidgetKit kullanarak home screen widget'ları oluşturuyoruz:

1. **Today Widget**: Günlük burç yorumu ve önemli transit'ler
2. **Chart Widget**: Doğum haritası özeti
3. **Moon Phase Widget**: Mevcut ay fazı

## Teknik Stack

- **WidgetKit**: iOS widget framework (iOS 14+)
- **SwiftUI**: Widget UI
- **App Groups**: App ve widget arasında veri paylaşımı
- **UserDefaults**: Shared data storage

## Kurulum Adımları

### 1. Expo Dev Client Setup

Widgets native kod gerektirdiği için Expo Dev Client kullanmalıyız:

```bash
# Expo dev client kurulumu
npx expo install expo-dev-client

# iOS için prebuild
npx expo prebuild --platform ios

# Development build
npx expo run:ios
```

### 2. Widget Extension Oluşturma

Xcode'da:

1. File → New → Target
2. "Widget Extension" seçin
3. Widget adı: `AstrologyWidgets`
4. "Include Configuration Intent" seçeneğini işaretleyin

### 3. App Groups Configuration

#### iOS App için:

1. Xcode → Signing & Capabilities
2. "+ Capability" → App Groups
3. Yeni grup ekle: `group.com.astrology.shared`

#### Widget Extension için:

Aynı App Group'u widget target'ına da ekleyin.

### 4. Info.plist Güncellemeleri

`app.json` dosyasına ekleyin:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSUserActivityTypes": ["ViewTodayHoroscope", "ViewBirthChart"]
      },
      "entitlements": {
        "com.apple.security.application-groups": ["group.com.astrology.shared"]
      }
    },
    "plugins": [
      [
        "expo-build-properties",
        {
          "ios": {
            "deploymentTarget": "14.0"
          }
        }
      ]
    ]
  }
}
```

## Widget Tipleri

### Small Widget (2x2)
- Günlük tek burç yorumu
- Ay fazı göstergesi

### Medium Widget (4x2)
- Günlük burç + yükselen burç
- Önemli transit'ler

### Large Widget (4x4)
- Doğum haritası özeti
- Tüm planet pozisyonları

## Veri Paylaşımı

### React Native'den Widget'a Veri Gönderme

```typescript
// src/services/widgetService.ts
import { NativeModules } from 'react-native';

const { WidgetDataManager } = NativeModules;

export const updateWidgetData = async (data: WidgetData) => {
  try {
    await WidgetDataManager.saveData(JSON.stringify(data));
    await WidgetDataManager.reloadAllTimelines();
  } catch (error) {
    console.error('Widget update failed:', error);
  }
};

interface WidgetData {
  todayHoroscope: {
    sign: string;
    text: string;
    date: string;
  };
  moonPhase: {
    phase: string;
    illumination: number;
  };
  birthChart?: {
    sunSign: string;
    moonSign: string;
    ascendant: string;
  };
}
```

### Swift'de Shared UserDefaults

```swift
// WidgetDataManager.swift
import Foundation

class WidgetDataManager {
    static let appGroupId = "group.com.astrology.shared"

    static func saveWidgetData(_ data: String) {
        if let defaults = UserDefaults(suiteName: appGroupId) {
            defaults.set(data, forKey: "widgetData")
            defaults.synchronize()
        }
    }

    static func getWidgetData() -> WidgetData? {
        if let defaults = UserDefaults(suiteName: appGroupId),
           let jsonString = defaults.string(forKey: "widgetData"),
           let jsonData = jsonString.data(using: .utf8) {
            return try? JSONDecoder().decode(WidgetData.self, from: jsonData)
        }
        return nil
    }
}

struct WidgetData: Codable {
    let todayHoroscope: Horoscope
    let moonPhase: MoonPhase
    let birthChart: BirthChart?

    struct Horoscope: Codable {
        let sign: String
        let text: String
        let date: String
    }

    struct MoonPhase: Codable {
        let phase: String
        let illumination: Double
    }

    struct BirthChart: Codable {
        let sunSign: String
        let moonSign: String
        let ascendant: String
    }
}
```

## Widget Implementation

Widget kodları `ios/AstrologyWidgets/` klasöründe olacak.

### Ana Widget Dosyası

```swift
// AstrologyWidget.swift
import WidgetKit
import SwiftUI

@main
struct AstrologyWidgets: WidgetBundle {
    var body: some Widget {
        TodayWidget()
        ChartWidget()
        MoonPhaseWidget()
    }
}
```

### Today Widget Örneği

```swift
// TodayWidget.swift
import WidgetKit
import SwiftUI

struct TodayWidget: Widget {
    let kind: String = "TodayWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            TodayWidgetView(entry: entry)
        }
        .configurationDisplayName("Today's Horoscope")
        .description("See your daily horoscope")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), horoscope: placeholderHoroscope)
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), horoscope: getHoroscope())
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        let currentDate = Date()
        let horoscope = getHoroscope()
        let entry = SimpleEntry(date: currentDate, horoscope: horoscope)

        // Update at midnight
        let midnight = Calendar.current.startOfDay(for: currentDate.addingTimeInterval(86400))
        let timeline = Timeline(entries: [entry], policy: .after(midnight))
        completion(timeline)
    }

    private func getHoroscope() -> Horoscope {
        if let data = WidgetDataManager.getWidgetData() {
            return data.todayHoroscope
        }
        return placeholderHoroscope
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let horoscope: Horoscope
}

struct TodayWidgetView: View {
    var entry: Provider.Entry

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [Color(hex: "#1a0033"), Color(hex: "#2d1b4e")],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Image(systemName: "sparkles")
                        .foregroundColor(.yellow)
                    Text(entry.horoscope.sign)
                        .font(.headline)
                        .foregroundColor(.white)
                }

                Text(entry.horoscope.text)
                    .font(.caption)
                    .foregroundColor(.white.opacity(0.9))
                    .lineLimit(4)

                Spacer()

                Text(entry.date, style: .date)
                    .font(.caption2)
                    .foregroundColor(.white.opacity(0.6))
            }
            .padding()
        }
    }
}
```

## Deep Linking

Widget'dan app'e geçiş:

```swift
// Widget View'da
.widgetURL(URL(string: "astrology://today"))

// App.tsx'de
import * as Linking from 'expo-linking';

useEffect(() => {
  const subscription = Linking.addEventListener('url', handleDeepLink);
  return () => subscription.remove();
}, []);

const handleDeepLink = (event: { url: string }) => {
  const { path, queryParams } = Linking.parse(event.url);

  if (path === 'today') {
    navigation.navigate('Today');
  } else if (path === 'chart') {
    navigation.navigate('Chart');
  }
};
```

## Güncelleme Stratejisi

### Otomatik Güncellemeler

```typescript
// src/hooks/useWidgetUpdates.ts
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { updateWidgetData } from '@/services/widgetService';
import { useProfileStore } from '@/store/profileStore';

export const useWidgetUpdates = () => {
  const { currentProfile } = useProfileStore();

  useEffect(() => {
    const updateWidgets = async () => {
      if (!currentProfile) return;

      const data = {
        todayHoroscope: await fetchTodayHoroscope(currentProfile),
        moonPhase: await fetchMoonPhase(),
        birthChart: currentProfile.birthChart,
      };

      await updateWidgetData(data);
    };

    // Update on app launch
    updateWidgets();

    // Update when app returns to foreground
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        updateWidgets();
      }
    });

    return () => subscription.remove();
  }, [currentProfile]);
};
```

### Background Refresh

```swift
// AppDelegate.swift'e ekle
func application(
    _ application: UIApplication,
    performFetchWithCompletionHandler completionHandler:
    @escaping (UIBackgroundFetchResult) -> Void
) {
    // Fetch new data
    // Update widget data
    WidgetCenter.shared.reloadAllTimelines()
    completionHandler(.newData)
}
```

## Test Etme

### Widget Önizleme (Xcode)

```swift
struct TodayWidget_Previews: PreviewProvider {
    static var previews: some View {
        TodayWidgetView(entry: SimpleEntry(
            date: Date(),
            horoscope: Horoscope(
                sign: "Aries",
                text: "Today brings opportunities for growth...",
                date: "2024-01-15"
            )
        ))
        .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}
```

### Simulator'de Test

1. Build & Run widget scheme
2. Home screen'e widget ekle: Long press → "+" → AstrologyWidgets
3. React Native app'den veri gönder
4. Widget'ın güncellenmesini gözle

## Performans Optimizasyonu

1. **Timeline Limiti**: Maximum 100 entry
2. **Update Frequency**: En az 15 dakika aralıklarla
3. **Memory Limit**: 30MB (Small), 60MB (Medium), 90MB (Large)
4. **Veri Boyutu**: Shared UserDefaults'ta minimum veri sakla

## Troubleshooting

### Widget görünmüyor
- App Groups configuration kontrolü
- Bundle identifier doğru mu?
- Development team seçili mi?

### Veri güncellenmiyor
- UserDefaults suite name doğru mu?
- synchronize() çağrıldı mı?
- WidgetCenter.shared.reloadAllTimelines() çağrıldı mı?

### Build hataları
- iOS deployment target 14.0+
- Swift version uyumlu mu?
- Missing framework imports

## Kaynaklar

- [Apple WidgetKit Documentation](https://developer.apple.com/documentation/widgetkit)
- [Expo Custom Native Code](https://docs.expo.dev/workflow/customizing/)
- [App Groups Guide](https://developer.apple.com/documentation/xcode/configuring-app-groups)
