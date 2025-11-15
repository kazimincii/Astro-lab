# iOS Widgets Implementation Files

Bu klasör iOS widget'ları için Swift implementation dosyalarını içerir.

## Dosya Yapısı

```
ios-widgets/
├── AstrologyWidgets.swift     # Widget bundle (main entry point)
├── TodayWidget.swift          # Today's horoscope widget
├── WidgetDataManager.swift    # Native module for data sharing
└── WidgetDataManager.m        # Objective-C bridge
```

## Kurulum

### 1. Expo Prebuild

```bash
npx expo prebuild --platform ios
```

### 2. Dosyaları Xcode Projesine Ekle

1. Xcode'da projeyi aç: `ios/AstrologyMobile.xcworkspace`
2. File → Add Files to "AstrologyMobile"
3. Bu klasördeki dosyaları seç ve ekle

### 3. Widget Extension Oluştur

1. File → New → Target
2. "Widget Extension" seç
3. Product Name: `AstrologyWidgets`
4. "Include Configuration Intent": Evet
5. Finish

### 4. Widget Extension'a Dosyaları Ekle

1. `AstrologyWidgets.swift` → Widget Extension target
2. `TodayWidget.swift` → Widget Extension target
3. `WidgetDataManager.swift` → Widget Extension target

### 5. App Target'a Native Module Ekle

1. `WidgetDataManager.swift` → AstrologyMobile target
2. `WidgetDataManager.m` → AstrologyMobile target

### 6. App Groups Ekle

#### Main App:
1. Target: AstrologyMobile
2. Signing & Capabilities → + Capability → App Groups
3. Ekle: `group.com.astrology.shared`

#### Widget Extension:
1. Target: AstrologyWidgets
2. Signing & Capabilities → + Capability → App Groups
3. Ekle: `group.com.astrology.shared`

### 7. Info.plist Güncellemeleri

Ana app için `app.json`'a ekle:

```json
{
  "expo": {
    "ios": {
      "entitlements": {
        "com.apple.security.application-groups": [
          "group.com.astrology.shared"
        ]
      }
    }
  }
}
```

## Kullanım

### React Native'den Widget Güncelleme

```typescript
import { widgetService } from '@/services/widgetService';

// Widget data güncelle
await widgetService.updateWidgetData({
  todayHoroscope: {
    sign: 'Aries',
    text: 'Great day ahead!',
    date: '2024-01-15',
    mood: 'optimistic',
    luckyNumber: 7,
    luckyColor: 'purple',
  },
  moonPhase: {
    phase: 'Waxing Crescent',
    illumination: 0.35,
    emoji: '🌒',
  },
  lastUpdated: new Date().toISOString(),
});

// Widget'ları yeniden yükle
await widgetService.reloadWidgets();
```

### Otomatik Güncelleme Hook

```typescript
import { useWidgetUpdates } from '@/hooks/useWidgetUpdates';

function App() {
  useWidgetUpdates({
    enabled: true,
    fetchHoroscope: async () => {
      // API'den horoscope getir
      return {
        sign: 'Aries',
        text: 'Great day ahead!',
        // ...
      };
    },
    fetchMoonPhase: async () => {
      // API'den moon phase getir
      return {
        phase: 'Waxing Crescent',
        illumination: 0.35,
        emoji: '🌒',
      };
    },
  });

  return <YourApp />;
}
```

## Widget Tipleri

### Today Widget (Implemented ✅)

- **Small**: Burç + kısa yorum
- **Medium**: Burç + yorum + ay fazı
- **Large**: Burç + detaylı yorum + şanslı sayı/renk + ay fazı

### Chart Widget (Planned)

- Doğum haritası özeti
- Planet pozisyonları
- Yükselen burç

### Moon Phase Widget (Planned)

- Mevcut ay fazı
- Illumination yüzdesi
- Bir sonraki faz

## Deep Linking

Widget'lara tıklandığında app açılır:

```swift
.widgetURL(URL(string: "astrology://today"))
```

App'te handle etme:

```typescript
import * as Linking from 'expo-linking';

Linking.addEventListener('url', (event) => {
  const { path } = Linking.parse(event.url);
  if (path === 'today') {
    navigation.navigate('Today');
  }
});
```

## Debugging

### Widget Simulator'de Test

1. Xcode'da widget scheme'i seç
2. Run
3. Simulator'de widget ekle
4. Data değişikliklerini test et

### Console Logs

Widget console logs:
```bash
log stream --predicate 'subsystem == "com.apple.widgetkit"' --level debug
```

## Sorun Giderme

### Widget görünmüyor

1. App Groups doğru ayarlandı mı?
2. Widget Extension build edildi mi?
3. Simulator restart dene

### Data güncellenmiyor

1. `WidgetDataManager.saveData()` çağrıldı mı?
2. `WidgetCenter.shared.reloadAllTimelines()` çağrıldı mı?
3. UserDefaults suite name doğru mu?

### Build hatası

1. iOS deployment target 14.0+
2. Swift version 5.0+
3. All required frameworks imported

## Kaynaklar

- [WidgetKit Documentation](https://developer.apple.com/documentation/widgetkit)
- [SwiftUI Tutorial](https://developer.apple.com/tutorials/swiftui)
- [App Groups Guide](https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_security_application-groups)
