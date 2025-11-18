# iOS Widget Implementation - Hands-On Guide

## ✅ Başarıyla Oluşturulan Dosyalar

### Swift Files (iOS Widgets)
```
✅ ios-widgets/WidgetDataManager.swift
✅ ios-widgets/TodayWidget.swift  
✅ ios-widgets/MoonPhaseWidget.swift
✅ ios-widgets/AstroWidget.swift (Widget Bundle)
```

### React Native Bridge
```
✅ ios-widgets/WidgetDataManager-Bridge.m (Objective-C bridge)
✅ mobile/src/hooks/useWidgetUpdates.ts (Already exists - verified)
```

---

## 🎯 Sonraki Adımlar

### Adım 1: macOS Üzerinde iOS Project Generate Et

> **⚠️ IMPORTANT:** `npx expo prebuild` sadece macOS/Linux'te çalışır.
> Windows'ta bu adımı Mac'te yapmanız gerekir.

```bash
# macOS terminali'nde:
cd astrology-app/mobile
npx expo prebuild --platform ios --clean
```

**Beklenen sonuç:**
```
✅ Generated iOS project at: ./ios
- ios/Astrology\ Super\ App.xcodeproj
- ios/AstrologyApp.xcworkspace
- ios/Podfile
```

---

### Adım 2: Xcode'da Widget Extension Konfigure Et

**Xcode'da aşağıdaki adımları izleyin:**

#### 2.1 Workspace'i aç
```bash
cd ios
open Astrology\ Super\ App.xcworkspace
```

#### 2.2 Widget Extension Target Oluştur
1. **Main project seç** (left sidebar: "Astrology Super App")
2. **File → New → Target**
3. Search: "Widget" → Select **Widget Extension**
4. **Configuration:**
   - Product Name: `AstroWidgets`
   - Team: (your team)
   - Bundle Identifier: `com.astrologyapp.superapp.widgets`
   - Language: **Swift**
   - Include Configuration Intent: **OFF**
5. **Activate** scheme'i seç

#### 2.3 App Groups ekle - Main App
1. **Target: "AstrologyApp"** seç (main app)
2. **Signing & Capabilities tab**
3. **+ Capability → App Groups**
4. **Container name:** `group.com.astrologyapp.superapp`

#### 2.4 App Groups ekle - Widget Target
1. **Target: "AstroWidgets"** seç
2. **Signing & Capabilities tab**
3. **+ Capability → App Groups**
4. **Container name:** `group.com.astrologyapp.superapp` (same!)

---

### Adım 3: Swift Dosyalarını Xcode'a Ekle

1. **"AstroWidgets" folder'ı seç** (left sidebar)
2. **File → Add Files to "AstroWidgets"**
3. **Dosyaları seç** (c:\Users\kazim\Desktop\Astro-lab-main\astrology-app\ios-widgets):
   ```
   ✅ WidgetDataManager.swift
   ✅ TodayWidget.swift
   ✅ MoonPhaseWidget.swift
   ✅ AstroWidget.swift
   ```
4. **Dialog options:**
   - "Copy items if needed" ✅
   - "Create groups" ✅
   - "Add to targets" → Select "AstroWidgets" ✅

---

### Adım 4: Build ve Test Et

```bash
# Xcode'da:
# 1. Scheme selector (top left): "AstroWidgets" seç
# 2. Device: iPhone 15 Pro (simulator)
# 3. Build: ⌘B
```

**Beklenen sonuç:**
```
✅ Build Succeeded
✅ No warnings
```

Hatalar varsa:
```bash
# Clean build
⇧⌘K (or Xcode → Product → Clean Build Folder)

# Then build again
⌘B
```

---

### Adım 5: Simulator'da Widget Test Et

```bash
# Terminal'de main app'ı simulator'a install et
cd mobile
npx expo run:ios --simulator "iPhone 15 Pro"
```

**Simulator'da:**
1. **Lock screen'e git** (sağdan swipe)
2. **"+" tıkla** (widget eklemek için)
3. **"AstroWidgets" ara** → tap
4. **Widget preview açılır**
5. **Widget seç → Lock screen'e ekle**

**Test:**
- ✅ Widget görünür mü?
- ✅ Tap ile app açılır mı?
- ✅ Data gösterilir mi?

---

### Adım 6: Widget Data Sync Test Et

```typescript
// App.tsx içinde:

import { useWidgetUpdates } from './src/hooks/useWidgetUpdates';

export default function App() {
  const { updateWidgetData } = useWidgetUpdates();
  
  // When user gets horoscope:
  useEffect(() => {
    if (userProfile && todayHoroscope) {
      updateWidgetData({
        horoscope: {
          date: new Date().toISOString(),
          sign: userProfile.zodiacSign,
          text: todayHoroscope.text,
          luckyNumbers: todayHoroscope.luckyNumbers,
          luckyColor: todayHoroscope.color,
          mood: todayHoroscope.mood,
        },
        moonPhase: {
          phase: moonData.phase,
          percentage: moonData.percentage,
          emoji: moonData.emoji,
          illumination: moonData.illumination,
        },
      });
    }
  }, [userProfile, todayHoroscope]);
  
  return (
    // ... your app
  );
}
```

---

## 🔧 Troubleshooting

### Widget Build Hatası: "Module not found"
```bash
cd ios
pod install --repo-update
cd ..
```

### "App Groups not working"
- ✅ Team ID'leri aynı mı? (main app + widget)
- ✅ Container name aynı mı? `group.com.astrologyapp.superapp`
- ✅ Entitlements.plist var mı?

### Widget Data Sinkronize Olmuyor
- ✅ App Groups yapılandırması kontrol et
- ✅ WidgetDataManager.swift var mı?
- ✅ `sharedDefaults` container accessible mi?

### "Xcode Hangs"
```
Xcode → Product → Clean Build Folder (⇧⌘K)
Xcode'ı kapat ve tekrar aç
⌘B ile build et
```

---

## ✅ Başarı Göstergeleri

```
✅ Xcode build hatasız tamamlandı
✅ Widget Swift dosyaları compile edildi
✅ App Groups yapılandırması complete
✅ Widget simulator'da görünür
✅ Widget data sinkronize oluyor
✅ Main app'dan widget accessibility açık
```

---

## 📊 Implementation Checklist

- [ ] macOS'ta `npx expo prebuild --platform ios --clean` çalıştırıldı
- [ ] Xcode workspace açıldı
- [ ] Widget Extension target oluşturuldu (AstroWidgets)
- [ ] Main app'a App Groups eklendi
- [ ] Widget target'a App Groups eklendi
- [ ] Swift dosyaları Xcode'a eklendi
- [ ] Info.plist konfigüre edildi
- [ ] `pod install --repo-update` çalıştırıldı
- [ ] Build başarılı (⌘B)
- [ ] Widget simulator'da test edildi
- [ ] Widget data sync çalışıyor
- [ ] Hook'lar App.tsx'te integrate edildi

---

## 📞 Referans Linkler

- [WidgetKit Documentation](https://developer.apple.com/documentation/widgetkit)
- [App Groups Guide](https://developer.apple.com/documentation/foundation/appgroups)
- [Expo Prebuild Guide](https://docs.expo.dev/build-reference/ios-builds/)
- [React Native iOS Module Setup](https://reactnative.dev/docs/native-modules-ios)

---

**Durum:** ✅ Implementation Ready
**Estimated Time:** 1-2 hours (manual Xcode steps)
**Device Required:** macOS for prebuild
