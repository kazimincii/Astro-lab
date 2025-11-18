# Apple Watch App Setup Guide

## ⌚ WatchKit Target Creation

### ADIM 1: Xcode'da Watch Target Oluştur

```bash
# Xcode workspace'i aç
cd ios
open AstrologyApp.xcworkspace
```

**Xcode'da:**

1. **Ana proje seç** (AstrologyApp)

2. **File → New → Target**
   - Search: "Watch" yazın
   - Select: **"Watch App"**
   - Next

3. **Configure Target:**
   - Product Name: `Astro Watch`
   - Organization: Astrology Super App
   - Bundle Identifier: `com.astrologyapp.superapp.watchkit`
   - Language: **Swift**
   - Life Cycle: **SwiftUI App**
   - Finish

4. **Xcode Prompt:**
   - "Activate" tıkla (scheme seçimi)

---

### ADIM 2: Watch Extension Target Oluştur (Otomatik)

Watch App oluştururken, "Watch App Extension" otomatik oluşturulacaktır.
Bu extension, watch app'ında çalışacak kodu içerir.

---

## 📱 WatchConnectivity Setup

### ADIM 3: Swift Dosyalarını Ekle

**Xcode'da:**

1. **"Astro Watch" folder seç** (left sidebar)

2. **File → Add Files to "Astro Watch"**

3. **Dosyaları seç** (c:\Users\kazim\Desktop\Astro-lab-main\astrology-app\ios-watchapp):
   ```
   ✅ Astro_WatchApp.swift
   ✅ ContentView.swift
   ```

4. **Dialog:**
   - "Copy items if needed" ✅
   - "Add to target" → "Astro Watch" ✅
   - Finish

---

### ADIM 4: WatchConnectivity yapılandır

**Astro_WatchApp.swift'de zaten mevcut:**

```swift
private func initializeWatchConnectivity() {
    if WCSession.isSupported() {
        let session = WCSession.default
        session.delegate = WatchConnectivityDelegate.shared
        session.activate()
        self.session = session
    }
}
```

Bu otomatik olarak iPhone'dan data alma yapacak.

---

### ADIM 5: App Groups Ekle

**Xcode'da:**

1. **Watch target seç**: "Astro Watch Extension"

2. **Signing & Capabilities tab**

3. **+ Capability**
   - Search: "App Groups"
   - Select: **App Groups**

4. **Container name:**
   - `group.com.astrologyapp.superapp`

(Ana app'la aynı container!)

---

## 🎨 WatchKit UI Testing

### ADIM 6: Simulator'da Test Et

```bash
# Watch simulator başlat
xcrun simctl list devices | grep Apple\ Watch

# Build watch app
xcodebuild -workspace ios/AstrologyApp.xcworkspace \
  -scheme "Astro Watch" \
  -configuration Debug \
  -sdk watchsimulator \
  -derivedDataPath build
```

**Xcode'da:**

1. **Scheme seç:** "Astro Watch"
2. **Device seç:** "Apple Watch Series 8 - 45mm"
3. **⌘R** (Run)

---

## 📡 ClockKit Complications Setup

### ADIM 7: Complications Ekle

**DEVELOPMENT_GUIDE.md'de detaylı:**

```swift
// ComplicationController.swift
// Moon phase, Daily horoscope complications
// Timeline generation, placeholder templates
```

Bu zaten DEVELOPMENT_GUIDE.md'de implement edilmiş.

---

### ADIM 8: Watch Face'e Ekle

**Simulator'da:**

1. **Clock app aç**
2. **Crown'ı döndür** → customization
3. **+ tıkla** → complication add
4. **"Astro" ara** → select
5. **Moon Phase complication seç**

---

## 🏥 Health Data Integration

### ADIM 9: HealthKit Ekle

**Watch target'a ekle:**

1. **+ Capability**
   - "HealthKit" seç

2. **Resources'da HealthKit manager:**

```swift
class HealthKitManager {
    static let shared = HealthKitManager()
    
    func requestAuthorization(completion: @escaping (Bool, Error?) -> Void) {
        let types = Set([
            HKObjectType.quantityType(forIdentifier: .heartRate)!,
            HKObjectType.quantityType(forIdentifier: .stepCount)!,
        ])
        
        healthStore.requestAuthorization(
            toShare: [],
            read: types,
            completion: completion
        )
    }
}
```

---

## 🧪 Testing Checklist

- [ ] Watch app builds without errors
- [ ] App launches on watch simulator
- [ ] Main view displays correctly
- [ ] Tab navigation works (4 tabs)
- [ ] Horoscope text visible
- [ ] Moon phase emoji shows
- [ ] Biorhythm progress bars display
- [ ] Settings screen accessible
- [ ] WatchConnectivity syncs data
- [ ] Open App button launches main app
- [ ] App responds to watch interactions
- [ ] No crashes on tap/swipe

---

## 📦 Build & Submit

### ADIM 10: Build for App Store

```bash
# Watch app included in main app binary
eas build --platform ios --profile production

# Watch app automatically included in submission
```

Watch app iOS 15.0+ için otomatik olarak include edilecektir.

---

## 🐛 Troubleshooting

### Watch app won't build
→ `pod install --repo-update` çalıştır
→ Xcode clean: ⇧⌘K
→ Xcode kapanıp aç

### WatchConnectivity not syncing
→ Both targets App Groups setup mı kontrol et
→ Container name aynı mı?
→ Watch + iPhone simulator'da çalışıyor mu?

### Complications not appearing
→ ComplicationController implement mi?
→ Timeline provider methods complete mi?
→ Watch face komplication support ediyor mu?

### "Invalid Bundle"
→ Bundle ID'ler unique mi? (com.astrologyapp.superapp.watchkit)
→ Team ID'ler match ediyor mu?

---

## ✅ Success Indicators

- ✅ Watch app builds successfully
- ✅ All 4 tabs work on watch simulator
- ✅ Data syncs from iPhone
- ✅ Complications appear on watch face
- ✅ No crashes on interaction
- ✅ Performance smooth (60fps)

---

## 📚 Resources

- [WatchKit Documentation](https://developer.apple.com/documentation/watchkit)
- [ClockKit Complications](https://developer.apple.com/documentation/clockkit)
- [WatchConnectivity Guide](https://developer.apple.com/documentation/watchconnectivity)
- [HealthKit Framework](https://developer.apple.com/healthkit/)
- [watchOS Design Guide](https://developer.apple.com/design/human-interface-guidelines/watchos)

---

**Estimated Time:** 4-6 hours (setup + testing)
**Status:** Ready for Xcode integration
