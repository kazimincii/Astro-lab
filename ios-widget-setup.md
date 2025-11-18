# iOS Widget Setup - Adım Adım Rehber

## ⚠️ ÖNEMLİ: Manual Xcode Adımları Gereklidir

Bu rehber **`npx expo prebuild`** çalıştırmanız gereken adımları gösterir. 
Ardından Xcode ile manuel yapılandırma yapılması gereklidir.

---

## ADIM 1: iOS Project Generate Et

```bash
cd c:\Users\kazim\Desktop\Astro-lab-main\astrology-app\mobile

# iOS project oluştur (overwrite existing)
npx expo prebuild --platform ios --clean
```

**Beklenen sonuç:**
```
✅ Generated iOS project at: ./ios
- ios/AstrologyApp.xcodeproj (veya Astrology\ Super\ App.xcodeproj)
- ios/Podfile
- ios/Pods/
```

---

## ADIM 2: Xcode Projesini Aç

```bash
# Xcode workspace'i aç
cd ios
open AstrologyApp.xcworkspace
```

⚠️ **ÖNEMLİ:** `.xcworkspace` aç, `.xcodeproj` değil!

---

## ADIM 3: Widget Extension Target Oluştur

**Xcode'da:**

1. **Ana proje seç** (left sidebar)
   - "AstrologyApp" veya "Astrology Super App" (kök proje)

2. **File → New → Target**
   - Search: "Widget" yazın
   - Select: **"Widget Extension"**
   - Next tıkla

3. **Target yapılandırması:**
   - Product Name: `AstroWidgets`
   - Team: (kendi team ID'niz)
   - Organization: Astrology Super App
   - Bundle Identifier: `com.astrologyapp.superapp.widgets`
   - Language: **Swift**
   - Include Configuration Intent: **OFF** (for now)
   - Finish tıkla

4. **Xcode prompt'unda:**
   - "Activate" tıkla (scheme seçimi için)

---

## ADIM 4: Ana App'e App Groups Ekle

**Xcode'da:**

1. **Target seç:** "AstrologyApp" veya "Astrology Super App" (ana app)

2. **Signing & Capabilities tab'ı aç**

3. **+ Capability** (sol üstte mavi +)

4. Search: "App Groups" yazın
   - Select: **App Groups**

5. **Container name gir:**
   - `group.com.astrologyapp.superapp`

---

## ADIM 5: Widget Target'a App Groups Ekle

**Xcode'da:**

1. **Target seç:** "AstroWidgets" (Widget Extension)

2. **Signing & Capabilities tab'ı aç**

3. **+ Capability**

4. Search: "App Groups"
   - Select: **App Groups**

5. **Same container name:**
   - `group.com.astrologyapp.superapp`

---

## ADIM 6: Widget Swift Dosyalarını Ekle

**Xcode'da:**

1. **"AstroWidgets" folder'ı seç** (left sidebar)

2. **File → Add Files to "AstroWidgets"**

3. **Dosyaları seç** (c:\Users\kazim\Desktop\Astro-lab-main\astrology-app\ios-widgets):
   ```
   ✅ WidgetDataManager.swift
   ✅ TodayWidget.swift
   ✅ MoonPhaseWidget.swift
   ✅ AstroWidget.swift
   ```

4. **Dialog'da:**
   - "Copy items if needed" ✅
   - "Create groups" ✅
   - "Add to target" → Select "AstroWidgets" ✅
   - Finish

---

## ADIM 7: Info.plist Güncelle

**Xcode'da:**

1. **AstroWidgets/Info.plist** seç

2. **Aşağıdaki key'ler var mı kontrol et:**

```xml
<dict>
    <key>NSExtensionPointIdentifier</key>
    <string>com.apple.widgetkit-extension</string>
    
    <key>NSExtensionPrincipalClass</key>
    <string>$(PRODUCT_MODULE_NAME).AstroWidget</string>
</dict>
```

---

## ADIM 8: Pods Güncelle

**Terminal'de:**

```bash
cd ios
pod install --repo-update
cd ..
```

---

## ADIM 9: Build & Test

**Xcode'da build scheme'i kontrol et:**

1. **Top left scheme selector:** "AstroWidgets" seçin
2. **Device/Simulator:** "iPhone 15 Pro" gibi seçin
3. **⌘B** (Build)

**Beklenen sonuç:**
```
✅ Build Succeeded
```

Hatalar varsa:
- Xcode → Product → Clean Build Folder (**⇧⌘K**)
- Tekrar build et

---

## ADIM 10: Simulator'da Widget Test Et

```bash
# Ana app'ı simulator'a install et
npx expo run:ios --simulator "iPhone 15 Pro"
```

**Simulator'da:**

1. **Lock Screen'e git** (sağdan swipe)
2. **"+" tıkla** (widget eklemek için)
3. **Scroll et** → "AstroWidgets" ara
4. **AstroWidgets tıkla** → Widget preview görünür
5. **Widget seç** → Lock Screen'e ekle

**Test:**
- Widget görünmeli
- Tap'le main app açılmalı

---

## ADIM 11: useWidgetUpdates Hook'u Çalıştır

```typescript
// App.tsx'de zaten import edilmiş, kontrol et:

import { useWidgetUpdates } from './src/hooks/useWidgetUpdates';

export default function App() {
  const { updateWidgetData } = useWidgetUpdates();
  
  // Widget data will update automatically
}
```

---

## 🐛 Troubleshooting

### Widget build hatası: "Module not found"
→ `pod install --repo-update` çalıştır

### "App Groups not working"
→ Team ID'leri aynı mı kontrol et (ana app + widget)
→ Container name aynı mı? `group.com.astrologyapp.superapp`

### Widget data sinkronize olmuyor
→ App Groups yapılandırması kontrol et
→ WidgetDataManager.swift dosyası var mı?

### "Xcode hangs on build"
→ Xcode → Product → Clean Build Folder
→ Xcode kapanıp açmayı dene

---

## ✅ Başarı Göstergeleri

- ✅ Xcode build hatası yok
- ✅ Widget simulator'da görünüyor
- ✅ Widget tap'le app açılıyor
- ✅ Widget data güncelleniyor

---

## 📞 Referans

- [WidgetKit Documentation](https://developer.apple.com/documentation/widgetkit)
- [App Groups Guide](https://developer.apple.com/documentation/foundation/appgroups)
- [Expo Prebuild Guide](https://docs.expo.dev/build-reference/ios-builds/)

---

**Durum:** ✅ Tamamlandı
**Estimated Time:** 30-45 dakika (manuel adımlar)
