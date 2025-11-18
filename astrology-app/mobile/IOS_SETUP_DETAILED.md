# iOS Native Setup Guide

## 📱 iOS Configuration for Astrology App

Bu rehber Expo-managed iOS app'ı native features (Widgets, App Groups) ile entegre etmeyi gösterir.

---

## 1. Xcode Project Setup

### 1.1 iOS Project Oluştur

```bash
# Expo prebuild ile iOS project generate et
cd astrology-app/mobile
npx expo prebuild --platform ios --clean
```

**Output:**
```
✅ Generated iOS project at: ./ios
- com.astrologyapp.superapp.xcodeproj
- Podfile
```

### 1.2 App Groups Enable Et

**Xcode'da adımlar:**

1. **Project Seç:**
   - `ios/AstrologyApp.xcodeproj` aç
   - `Astrology Super App` target seç

2. **Signing & Capabilities:**
   - `Signing & Capabilities` tab'ı aç
   - `+ Capability` tıkla
   - `App Groups` seç
   - Container name gir: `group.com.astrologyapp.superapp`

3. **Widget Target'ı Ekle:**
   - File > New > Target
   - `WidgetKit Extension` seç
   - Name: `AstroWidgets`
   - Team ID seç
   - Deployment Target: iOS 15.0+

4. **Widget Target'ına App Groups Ekle:**
   - Widget target seç
   - Signing & Capabilities > + Capability
   - `App Groups` seç
   - Same container: `group.com.astrologyapp.superapp`

---

## 2. Widget Extension Setup

### 2.1 Swift Files Ekle

Aşağıdaki Swift dosyalarını `ios/AstroWidgets/` klasörüne kopyala:

```bash
cp -r astrology-app/ios-widgets/*.swift ios/AstroWidgets/
```

**Dosyalar:**
- `WidgetDataManager.swift` — SharedDefaults ve Codable models
- `TodayWidget.swift` — Small, Medium, Large widget views
- `MoonPhaseWidget.swift` — Moon phase display
- `AstroWidget.swift` — Main widget bundle

### 2.2 Objective-C Bridge Ekle (Optional)

For native communication:

```bash
cp astrology-app/ios-widgets/WidgetDataManager-Bridge.m ios/AstroWidgets/
cp astrology-app/ios-widgets/WidgetDataManager.m ios/AstroWidgets/
```

### 2.3 Info.plist Düzenle

**ios/AstroWidgets/Info.plist:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSExtensionPointIdentifier</key>
    <string>com.apple.widgetkit-extension</string>
    <key>NSExtensionPrincipalClass</key>
    <string>AstroWidget</string>
    <key>IPC_APP_GROUPS</key>
    <array>
        <string>group.com.astrologyapp.superapp</string>
    </array>
</dict>
</plist>
```

---

## 3. React Native Bridge

### 3.1 useWidgetUpdates Hook

File: `astrology-app/mobile/src/hooks/useWidgetUpdates.ts`

```typescript
import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { WidgetDataManager } = NativeModules;

interface WidgetData {
  dailyMessage: string;
  moonPhase: string;
  date: string;
}

export const useWidgetUpdates = () => {
  const updateWidgetData = async (data: WidgetData) => {
    try {
      if (WidgetDataManager) {
        await WidgetDataManager.updateWidgetData(data);
      } else {
        // Fallback: AsyncStorage (Android uyumluluk)
        await AsyncStorage.setItem(
          'widget_data',
          JSON.stringify(data)
        );
      }
    } catch (error) {
      console.error('Widget update failed:', error);
    }
  };

  return { updateWidgetData };
};
```

### 3.2 App Initialization

File: `astrology-app/mobile/App.tsx`

```typescript
import { useEffect } from 'react';
import { useWidgetUpdates } from './src/hooks/useWidgetUpdates';

export default function App() {
  const { updateWidgetData } = useWidgetUpdates();

  useEffect(() => {
    // App başladığında widget'ı update et
    updateWidgetData({
      dailyMessage: 'Welcome to Astrology App',
      moonPhase: 'Waxing Crescent',
      date: new Date().toISOString(),
    });
  }, [updateWidgetData]);

  return (
    // ... existing app code
  );
}
```

---

## 4. Build & Test

### 4.1 Local Development Build

```bash
# Development build ile test et
eas build --platform ios --profile preview

# Output: AstroApp.tar.gz
```

### 4.2 Simulator'da Test Et

```bash
# Simulator başlat
open -a Simulator

# Build'i simulator'a install et
xcrun simctl install booted AstroApp.app

# App'ı launch et
xcrun simctl launch booted com.astrologyapp.superapp
```

### 4.3 Widget Test Et

**Simulator'da:**
1. Sağdan swipe et → Widget tarama aç
2. "+" tıkla
3. "AstroWidgets" ara ve ekle
4. Widget lock screen'e ekle

**Expected behavior:**
- Moon phase gösterilir
- Daily message güncellenmiş olur
- Tap ile app açılır

---

## 5. Production Build

### 5.1 App Store Preparation

```bash
# Production build
eas build --platform ios --profile production

# Upload to App Store Connect
eas submit --platform ios
```

### 5.2 TestFlight Beta Testing

```bash
# Automatic submission to TestFlight
eas submit --platform ios --auto-submit-to-testflight
```

---

## 6. Entitlements File

File: `ios/Astrology Super App/Astrology Super App.entitlements`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.application-groups</key>
    <array>
        <string>group.com.astrologyapp.superapp</string>
    </array>
    <key>com.apple.developer.aps-environment</key>
    <string>production</string>
</dict>
</plist>
```

---

## 7. Debugging

### 7.1 Widget Data Inspection

```bash
# Simulator shell'de
xcrun simctl spawn booted log stream --predicate 'process=="AstroWidgets"'
```

### 7.2 App Groups Access

```swift
// In WidgetDataManager.swift
let defaults = UserDefaults(suiteName: "group.com.astrologyapp.superapp")
print("Shared data:", defaults?.dictionary(forKey: "widget_data"))
```

### 7.3 Common Issues

| Issue | Solution |
|-------|----------|
| Widget doesn't update | App Groups container name eşit mi? |
| App crashes on widget | WidgetDataManager bridge'i import ettiniz mi? |
| Build fails | Pods update: `cd ios && pod update` |
| Widget slow | Async operations kullanın, MainThread'te beklemeyin |

---

## 8. Architecture Diagram

```
┌─────────────────────────────────────┐
│       React Native App              │
│  - useWidgetUpdates hook            │
│  - SharedDefaults update            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      App Groups Container           │
│  group.com.astrologyapp.superapp    │
│  - Shared UserDefaults              │
│  - Shared FileManager directory     │
└──────────────┬──────────────────────┘
               │
         ┌─────┴─────┐
         ▼           ▼
    ┌─────────┐  ┌────────────┐
    │ TodayW. │  │MoonPhaseW. │
    │ Widget  │  │  Widget    │
    └─────────┘  └────────────┘
```

---

## 9. Checklist

- [ ] `npx expo prebuild --platform ios` çalıştırıldı
- [ ] App Groups enabled in both targets
- [ ] WidgetDataManager.swift dosyaları kopyalandı
- [ ] useWidgetUpdates hook'u integrate edildi
- [ ] App.tsx'te widget initialization eklenildi
- [ ] Entitlements file'ı configure edildi
- [ ] Local simulator test geçti
- [ ] TestFlight beta ready

---

## 10. Resources

- [WidgetKit Documentation](https://developer.apple.com/documentation/widgetkit)
- [App Groups Guide](https://developer.apple.com/documentation/foundation/appgroups)
- [Expo EAS Build](https://docs.expo.dev/build-reference/ios-builds/)
- [SwiftUI Widgets](https://developer.apple.com/tutorials/swiftui/creating-widgets)

---

**Next:** Prod configuration ve TestFlight submission (Task 5)
