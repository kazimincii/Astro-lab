import Foundation
import WidgetKit

/// Manages data sharing between main app and widgets via App Groups
struct WidgetDataManager {
    static let containerID = "group.com.astrologyapp.superapp"
    
    static var sharedDefaults: UserDefaults? {
        UserDefaults(suiteName: containerID)
    }
    
    // MARK: - Today's Horoscope
    
    static func saveHoroscope(_ horoscope: HoroscopeData) {
        guard let defaults = sharedDefaults else { return }
        
        let encoder = JSONEncoder()
        if let encoded = try? encoder.encode(horoscope) {
            defaults.set(encoded, forKey: "daily_horoscope")
            WidgetCenter.shared.reloadAllTimelines()
        }
    }
    
    static func getHoroscope() -> HoroscopeData? {
        guard let defaults = sharedDefaults,
              let data = defaults.data(forKey: "daily_horoscope") else {
            return nil
        }
        
        let decoder = JSONDecoder()
        return try? decoder.decode(HoroscopeData.self, from: data)
    }
    
    // MARK: - Moon Phase
    
    static func saveMoonPhase(_ phase: MoonPhaseData) {
        guard let defaults = sharedDefaults else { return }
        
        let encoder = JSONEncoder()
        if let encoded = try? encoder.encode(phase) {
            defaults.set(encoded, forKey: "moon_phase")
            WidgetCenter.shared.reloadAllTimelines()
        }
    }
    
    static func getMoonPhase() -> MoonPhaseData? {
        guard let defaults = sharedDefaults,
              let data = defaults.data(forKey: "moon_phase") else {
            return nil
        }
        
        let decoder = JSONDecoder()
        return try? decoder.decode(MoonPhaseData.self, from: data)
    }
    
    // MARK: - Profile Data
    
    static func saveProfileData(_ profile: ProfileWidgetData) {
        guard let defaults = sharedDefaults else { return }
        
        let encoder = JSONEncoder()
        if let encoded = try? encoder.encode(profile) {
            defaults.set(encoded, forKey: "profile_widget_data")
            WidgetCenter.shared.reloadAllTimelines()
        }
    }
    
    static func getProfileData() -> ProfileWidgetData? {
        guard let defaults = sharedDefaults,
              let data = defaults.data(forKey: "profile_widget_data") else {
            return nil
        }
        
        let decoder = JSONDecoder()
        return try? decoder.decode(ProfileWidgetData.self, from: data)
    }
}

// MARK: - Data Models

struct HoroscopeData: Codable {
    let date: Date
    let sign: String
    let text: String
    let luckyNumbers: [Int]
    let luckyColor: String
    let mood: String
}

struct MoonPhaseData: Codable {
    let phase: String // "New Moon", "Waxing Crescent", "Full Moon", etc.
    let percentage: Double // 0-100
    let emoji: String // 🌑, 🌙, ⭐, etc.
    let date: Date
    let illumination: Double // 0-1
}

struct ProfileWidgetData: Codable {
    let id: String
    let name: String
    let zodiacSign: String
    let birthDate: String
    let currentHoroscope: String
    let luckyNumbers: [Int]
    let updated: Date
}
