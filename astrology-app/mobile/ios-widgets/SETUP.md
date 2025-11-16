# iOS Widgets Setup Guide

Bu rehber, iOS widget'ları için React Native bridge kurulumunu açıklar.

## Gereksinimler

- iOS 14.0+
- Xcode 12+
- React Native 0.70+
- Expo Dev Client veya Bare React Native

## 1. Dosya Yapısı

```
ios/
├── AstrologyApp/              # Ana uygulama
│   ├── AppDelegate.swift
│   └── Info.plist
└── AstrologyWidgets/          # Widget extension
    ├── AstrologyWidgets.swift       # Widget bundle
    ├── WidgetDataManager.swift      # Data manager (Swift)
    ├── WidgetDataManager-Bridge.m   # React Native bridge
    ├── TodayWidget.swift            # Today widget
    ├── MoonPhaseWidget.swift        # Moon phase widget
    └── Info.plist
```

## 2. Xcode Konfigürasyonu

### 2.1 Widget Extension Oluşturma

1. Xcode'da projeyi aç:
   ```bash
   cd ios
   open AstrologyApp.xcworkspace
   ```

2. File → New → Target → Widget Extension

3. İsim: `AstrologyWidgets`

4. "Include Configuration Intent" **seçmeyin** (StaticConfiguration kullanıyoruz)

### 2.2 App Groups Setup

**Ana uygulama için:**

1. Ana app target'ı seç
2. Signing & Capabilities
3. "+ Capability" → App Groups
4. Grup ekle: `group.com.astrology.shared`

**Widget extension için:**

1. Widget target'ı seç
2. Aynı adımları tekrarla
3. Aynı grup ID'sini kullan: `group.com.astrology.shared`

### 2.3 Dosyaları Kopyalama

`ios-widgets/` klasöründeki dosyaları Xcode projesine ekle:

1. `AstrologyWidgets.swift` → Widget extension'a
2. `TodayWidget.swift` → Widget extension'a
3. `MoonPhaseWidget.swift` → Widget extension'a
4. `WidgetDataManager.swift` → **Hem ana app hem widget extension'a**
5. `WidgetDataManager-Bridge.m` → **Sadece ana app'e**

**Önemli:** Bridge dosyası (`.m`) sadece ana uygulamaya eklenmeli!

## 3. Build Settings

### Widget Extension için:

- **Deployment Target:** iOS 14.0
- **Swift Language Version:** Swift 5
- **Enable Bitcode:** NO (Expo/React Native ile uyumluluk)

### App Groups ID Kontrolü

`WidgetDataManager.swift` dosyasında:

```swift
static let appGroupId = "group.com.astrology.shared"
```

Bu ID, Xcode'da yapılandırdığınız App Group ID'si ile **tam olarak aynı** olmalı.

## 4. React Native Tarafı

### 4.1 Widget Service Kullanımı

```typescript
import { widgetService } from '@/services/widgetService';

// Widget'ları güncelle
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

### 4.2 Otomatik Güncellemeler (Hook)

```typescript
import { useWidgetUpdates } from '@/hooks/useWidgetUpdates';

function App() {
  useWidgetUpdates({
    enabled: true,
    fetchHoroscope: async () => {
      // API'den horoscope data çek
      return {
        sign: 'Aries',
        text: '...',
        // ...
      };
    },
    fetchMoonPhase: async () => {
      // API'den moon phase data çek
      return {
        phase: 'Full Moon',
        illumination: 1.0,
        emoji: '🌕',
      };
    },
  });

  return <YourApp />;
}
```

## 5. Build & Test

### 5.1 Build

```bash
# iOS için prebuild (Expo)
npx expo prebuild --platform ios

# Development build
npx expo run:ios
```

### 5.2 Widget'ı Test Etme

1. App'i simulator veya device'da çalıştır
2. Home screen'e git
3. Long press → "+" butonu
4. "AstrologyWidgets" ara
5. Widget'ı home screen'e ekle
6. App'i aç, data güncellenmeli
7. Widget'ın güncellendiğini kontrol et

## 6. Deep Linking

Widget'lardan app'e geçiş:

```swift
// Widget View'da
.widgetURL(URL(string: "astrology://today"))
```

React Native'de:

```typescript
import * as Linking from 'expo-linking';

// URL handler
Linking.addEventListener('url', (event) => {
  const { path } = Linking.parse(event.url);

  if (path === 'today') {
    navigation.navigate('Today');
  }
});
```

## 7. Troubleshooting

### Widget görünmüyor

- App Groups yapılandırması kontrol et
- Bundle ID'ler doğru mu?
- Deployment target 14.0+ mı?
- Development team seçili mi?

### Bridge çalışmıyor

- `WidgetDataManager-Bridge.m` ana app target'ında mı?
- `WidgetDataManager.swift` hem app hem widget'ta mı?
- App Groups ID'si her yerde aynı mı?
- Build → Clean Build Folder dene

### Data güncellenmiyor

```typescript
// Debug için
const data = await widgetService.getWidgetData();
console.log('Current widget data:', data);
```

- `reloadAllTimelines()` çağrıldı mı?
- App Groups erişimi var mı?
- Widget timeline policy doğru mu?

### Build hataları

- Swift version uyumlu mu?
- WidgetKit import edildi mi?
- Missing framework → Embed & Sign olarak işaretle

## 8. Production Checklist

- [ ] App Groups production bundle ID ile yapılandırıldı
- [ ] Widget extension signing yapıldı
- [ ] Deep linking test edildi
- [ ] Widget data encryption (opsiyonel)
- [ ] Widget timeline optimizasyonu
- [ ] Memory limits kontrol edildi (30MB/60MB/90MB)
- [ ] Background refresh ayarlandı

## Kaynaklar

- [WidgetKit Documentation](https://developer.apple.com/documentation/widgetkit)
- [App Groups Guide](https://developer.apple.com/documentation/xcode/configuring-app-groups)
- [React Native Native Modules](https://reactnative.dev/docs/native-modules-ios)
- [Expo Custom Native Code](https://docs.expo.dev/workflow/customizing/)
