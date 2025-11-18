# Apple Watch App - Development Guide

## 🎯 Overview

Apple Watch app for Astrology Super App with WatchKit Extension, Complications, and real-time data sync.

---

## 1. Project Structure

```
ios-watchapp/
├── Astro Watch.swift              # Main app entry
├── ContentView.swift               # Root view
├── Views/
│   ├── MainView.swift              # Tab navigation
│   ├── HoroscopeView.swift         # Daily horoscope
│   ├── MoonPhaseView.swift         # Moon phase display
│   ├── BiorhythmMiniView.swift     # Quick biorhythm
│   └── SettingsView.swift          # App settings
├── Models/
│   ├── WatchData.swift             # Data models
│   └── ClockKit+Extensions.swift   # Complications
├── Services/
│   ├── WatchConnectivity.swift     # iPhone sync
│   ├── HealthKit.swift             # Biometric data
│   └── DataStore.swift             # Local storage
└── Widgets/
    ├── ClockWidget.swift           # Lock screen widget
    └── SmartStack.swift            # Smart stack content
```

---

## 2. WatchKit Setup

### 2.1 Create Watch Target

**In Xcode:**

1. File → New → Target
2. Select "Watch App"
3. Product Name: "Astro Watch"
4. Deployment Target: watchOS 9.0+
5. Finish

### 2.2 Add Watch Extension

```bash
# Automatically created with Watch App target
ios/Astro Watch Extension/
├── ExtensionDelegate.swift
├── ComplicationController.swift
└── Assets.xcassets
```

---

## 3. Data Sync (WatchConnectivity)

File: `ios/Services/WatchConnectivity.swift`

```swift
import WatchConnectivity

class WatchConnectivityManager: NSObject, WCSessionDelegate {
    static let shared = WatchConnectivityManager()
    
    private let session = WCSession.default
    
    override init() {
        super.init()
        
        if WCSession.isSupported() {
            session.delegate = self
            session.activate()
        }
    }
    
    // Send daily horoscope to watch
    func sendHoroscope(message: String) {
        guard session.isReachable else {
            print("Watch not reachable")
            return
        }
        
        let data: [String: Any] = [
            "type": "horoscope",
            "message": message,
            "timestamp": Date().timeIntervalSince1970
        ]
        
        session.sendMessage(data) { _ in
            print("Horoscope sent to watch")
        }
    }
    
    // Send moon phase
    func sendMoonPhase(phase: String, illumination: Double) {
        let data: [String: Any] = [
            "type": "moon_phase",
            "phase": phase,
            "illumination": illumination,
            "timestamp": Date().timeIntervalSince1970
        ]
        
        session.sendMessage(data) { _ in
            print("Moon phase sent to watch")
        }
    }
    
    // Send biorhythm data
    func sendBiorhythm(physical: Double, emotional: Double, intellectual: Double) {
        let data: [String: Any] = [
            "type": "biorhythm",
            "physical": physical,
            "emotional": emotional,
            "intellectual": intellectual,
            "timestamp": Date().timeIntervalSince1970
        ]
        
        session.sendMessage(data) { _ in
            print("Biorhythm sent to watch")
        }
    }
    
    // MARK: - WCSessionDelegate
    
    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        print("Watch session activated: \(activationState.rawValue)")
    }
    
    func sessionDidBecomeInactive(_ session: WCSession) {}
    func sessionDidDeactivate(_ session: WCSession) {}
    
    func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
        DispatchQueue.main.async {
            print("Received from watch: \(message)")
        }
    }
}
```

---

## 4. Main Watch App

File: `ios-watchapp/Astro Watch/ContentView.swift`

```swift
import SwiftUI
import WatchKit

struct ContentView: View {
    @State private var selectedTab: Int = 0
    @State private var horoscope: String = "Loading..."
    @State private var moonPhase: String = "--"
    
    var body: some View {
        TabView(selection: $selectedTab) {
            // Horoscope Tab
            HoroscopeView(message: $horoscope)
                .tag(0)
            
            // Moon Phase Tab
            MoonPhaseView(phase: $moonPhase)
                .tag(1)
            
            // Biorhythm Tab
            BiorhythmMiniView()
                .tag(2)
            
            // Settings Tab
            SettingsView()
                .tag(3)
        }
        .tabViewStyle(.page)
        .onAppear {
            loadData()
        }
    }
    
    func loadData() {
        // Load from shared storage
        let defaults = UserDefaults(suiteName: "group.com.astrologyapp.superapp")
        if let data = defaults?.string(forKey: "daily_horoscope") {
            horoscope = data
        }
        if let phase = defaults?.string(forKey: "moon_phase") {
            moonPhase = phase
        }
    }
}

#Preview {
    ContentView()
}
```

---

## 5. Complications (ClockKit)

File: `ios/Astro Watch Extension/ComplicationController.swift`

```swift
import ClockKit

class ComplicationController: NSObject, CLKComplicationDataSource {
    
    // MARK: - Complication Configuration
    
    func getComplicationDescriptors(handler: @escaping ([CLKComplicationDescriptor]) -> Void) {
        let descriptors = [
            CLKComplicationDescriptor(
                identifier: "astro_horoscope",
                displayName: "Daily Horoscope",
                supportedFamilies: [
                    .circularSmall,
                    .extraLarge,
                    .graphicCircular,
                    .graphicRectangular
                ]
            ),
            CLKComplicationDescriptor(
                identifier: "moon_phase",
                displayName: "Moon Phase",
                supportedFamilies: [
                    .circularSmall,
                    .graphicCircular,
                    .graphicCornerTextual
                ]
            )
        ]
        handler(descriptors)
    }
    
    // MARK: - Timeline Configuration
    
    func getTimelineForComplication(
        _ complication: CLKComplication,
        withHandler handler: @escaping (CLKComplicationTimeline?) -> Void
    ) {
        switch complication.identifier {
        case "moon_phase":
            let timeline = moonPhaseTimeline()
            handler(timeline)
        case "astro_horoscope":
            let timeline = horoscopeTimeline()
            handler(timeline)
        default:
            handler(nil)
        }
    }
    
    // MARK: - Moon Phase Complications
    
    private func moonPhaseTimeline() -> CLKComplicationTimeline {
        let entries = generateMoonPhaseEntries()
        return CLKComplicationTimeline(
            entries: entries,
            timelineStartDate: Date(),
            timelineEndDate: Date(timeIntervalSinceNow: 86400), // 24 hours
            repeating: .hourly
        )
    }
    
    private func generateMoonPhaseEntries() -> [CLKComplicationTimelineEntry] {
        let phases = ["🌑 New", "🌒 Waxing", "🌕 Full", "🌘 Waning"]
        var entries: [CLKComplicationTimelineEntry] = []
        
        for (index, phase) in phases.enumerated() {
            let date = Date(timeIntervalSinceNow: Double(index * 6 * 3600))
            let template: CLKComplicationTemplate
            
            // Create circular small template
            let smallTemplate = CLKComplicationTemplateCircularSmallSimpleText()
            smallTemplate.textProvider = CLKSimpleTextProvider(text: phase)
            template = smallTemplate
            
            let entry = CLKComplicationTimelineEntry(
                date: date,
                complicationTemplate: template
            )
            entries.append(entry)
        }
        
        return entries
    }
    
    // MARK: - Horoscope Complications
    
    private func horoscopeTimeline() -> CLKComplicationTimeline {
        let entries = generateHoroscopeEntries()
        return CLKComplicationTimeline(
            entries: entries,
            timelineStartDate: Date(),
            timelineEndDate: Date(timeIntervalSinceNow: 86400),
            repeating: .daily
        )
    }
    
    private func generateHoroscopeEntries() -> [CLKComplicationTimelineEntry] {
        let defaults = UserDefaults(suiteName: "group.com.astrologyapp.superapp")
        let horoscope = defaults?.string(forKey: "daily_horoscope") ?? "Check app"
        
        let template = CLKComplicationTemplateExtraLargeSimpleText()
        template.textProvider = CLKSimpleTextProvider(text: horoscope)
        
        let entry = CLKComplicationTimelineEntry(
            date: Date(),
            complicationTemplate: template
        )
        
        return [entry]
    }
    
    // MARK: - Placeholder Templates
    
    func getPlaceholderTemplate(
        for complication: CLKComplication,
        withHandler handler: @escaping (CLKComplicationTemplate?) -> Void
    ) {
        var template: CLKComplicationTemplate?
        
        switch complication.family {
        case .circularSmall:
            let smallTemplate = CLKComplicationTemplateCircularSmallSimpleText()
            smallTemplate.textProvider = CLKSimpleTextProvider(text: "🌙")
            template = smallTemplate
        case .extraLarge:
            let largeTemplate = CLKComplicationTemplateExtraLargeSimpleText()
            largeTemplate.textProvider = CLKSimpleTextProvider(text: "Astro")
            template = largeTemplate
        case .graphicCircular:
            let graphicTemplate = CLKComplicationTemplateGraphicCircularOpenGaugeSimpleText()
            graphicTemplate.textProvider = CLKSimpleTextProvider(text: "🌙")
            template = graphicTemplate
        default:
            break
        }
        
        handler(template)
    }
}
```

---

## 6. Health Kit Integration

File: `ios/Services/HealthKit.swift`

```swift
import HealthKit

class HealthKitManager {
    static let shared = HealthKitManager()
    private let healthStore = HKHealthStore()
    
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
    
    func fetchHeartRate(completion: @escaping (Double?) -> Void) {
        let heartRateType = HKObjectType.quantityType(forIdentifier: .heartRate)!
        let query = HKSampleQuery(
            sampleType: heartRateType,
            predicate: nil,
            limit: 1,
            sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: false)]
        ) { _, samples, _ in
            guard let sample = samples?.first as? HKQuantitySample else {
                completion(nil)
                return
            }
            let bpm = sample.quantity.doubleValue(for: HKUnit.count().unitDivided(by: .minute()))
            completion(bpm)
        }
        
        healthStore.execute(query)
    }
    
    func fetchStepCount(completion: @escaping (Int?) -> Void) {
        let stepType = HKObjectType.quantityType(forIdentifier: .stepCount)!
        let calendar = Calendar.current
        let startDate = calendar.startOfDay(for: Date())
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: Date())
        
        let query = HKStatisticsQuery(
            quantityType: stepType,
            quantitySamplePredicate: predicate,
            options: .cumulativeSum
        ) { _, statistics, _ in
            guard let statistics = statistics else {
                completion(nil)
                return
            }
            let steps = Int(statistics.sumQuantity()?.doubleValue(for: HKUnit.count()) ?? 0)
            completion(steps)
        }
        
        healthStore.execute(query)
    }
}
```

---

## 7. Testing Checklist

- [ ] WatchKit app builds without errors
- [ ] Main view displays on watch simulator
- [ ] Horoscope data syncs from iPhone
- [ ] Moon phase updates correctly
- [ ] Complications appear on watch face
- [ ] HealthKit requests authorization
- [ ] Heart rate fetches successfully
- [ ] Step count displays correctly
- [ ] Settings screen accessible
- [ ] Data persists across app restarts

---

## 8. Build & Deploy

### 8.1 Build Watch App

```bash
xcodebuild -project ios/AstrologyApp.xcodeproj \
  -scheme "Astro Watch" \
  -configuration Release \
  -derivedDataPath build \
  build
```

### 8.2 Test on Simulator

```bash
# Launch watch simulator
open /Applications/Simulator.app

# Select Apple Watch (Series 8, watchOS 10)
# Run watch app from Xcode
```

### 8.3 Submit with TestFlight

```bash
eas submit --platform ios --auto-submit-to-testflight
```

---

## 9. Resources

- [WatchKit Overview](https://developer.apple.com/watchkit/)
- [ClockKit Complications](https://developer.apple.com/documentation/clockkit)
- [WatchConnectivity](https://developer.apple.com/documentation/watchconnectivity)
- [HealthKit Framework](https://developer.apple.com/healthkit/)
- [watchOS Design Guide](https://developer.apple.com/design/human-interface-guidelines/watchos)

---

**Next:** Production preparation (Task 5)
