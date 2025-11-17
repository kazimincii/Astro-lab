/**
 * Widget Data Manager
 *
 * Native module to share data between React Native app and iOS widgets
 * Uses App Groups and UserDefaults
 */

import Foundation
import WidgetKit

@objc(WidgetDataManager)
class WidgetDataManager: NSObject {
    static let appGroupId = "group.com.astrology.shared"
    static let widgetDataKey = "widgetData"

    // MARK: - React Native Methods

    @objc
    static func requiresMainQueueSetup() -> Bool {
        return false
    }

    @objc
    func saveData(_ data: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        guard let userDefaults = UserDefaults(suiteName: WidgetDataManager.appGroupId) else {
            reject("WIDGET_ERROR", "Failed to access App Group", nil)
            return
        }

        userDefaults.set(data, forKey: WidgetDataManager.widgetDataKey)
        userDefaults.synchronize()

        resolve(nil)
    }

    @objc
    func getData(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        guard let userDefaults = UserDefaults(suiteName: WidgetDataManager.appGroupId) else {
            reject("WIDGET_ERROR", "Failed to access App Group", nil)
            return
        }

        let data = userDefaults.string(forKey: WidgetDataManager.widgetDataKey)
        resolve(data)
    }

    @objc
    func clearData(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        guard let userDefaults = UserDefaults(suiteName: WidgetDataManager.appGroupId) else {
            reject("WIDGET_ERROR", "Failed to access App Group", nil)
            return
        }

        userDefaults.removeObject(forKey: WidgetDataManager.widgetDataKey)
        userDefaults.synchronize()

        resolve(nil)
    }

    @objc
    func reloadAllTimelines(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadAllTimelines()
            resolve(nil)
        } else {
            reject("WIDGET_ERROR", "Widgets require iOS 14+", nil)
        }
    }

    @objc
    func getCurrentTimeline(_ kind: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        if #available(iOS 14.0, *) {
            WidgetCenter.shared.getCurrentConfigurations { result in
                switch result {
                case .success(let infos):
                    let info = infos.first(where: { $0.kind == kind })
                    resolve(info?.description)
                case .failure(let error):
                    reject("WIDGET_ERROR", error.localizedDescription, error)
                }
            }
        } else {
            reject("WIDGET_ERROR", "Widgets require iOS 14+", nil)
        }
    }
}

// MARK: - Widget Data Helper

@available(iOS 14.0, *)
class WidgetDataHelper {
    static func getWidgetData() -> WidgetData? {
        guard let userDefaults = UserDefaults(suiteName: WidgetDataManager.appGroupId),
              let jsonString = userDefaults.string(forKey: WidgetDataManager.widgetDataKey),
              let jsonData = jsonString.data(using: .utf8) else {
            return nil
        }

        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601

        return try? decoder.decode(WidgetData.self, from: jsonData)
    }
}

// MARK: - Data Models

struct WidgetData: Codable {
    let todayHoroscope: Horoscope
    let moonPhase: MoonPhase
    let birthChart: BirthChart?
    let transits: [Transit]?
    let lastUpdated: String

    struct Horoscope: Codable {
        let sign: String
        let text: String
        let date: String
        let mood: String
        let luckyNumber: Int
        let luckyColor: String
    }

    struct MoonPhase: Codable {
        let phase: String
        let illumination: Double
        let emoji: String
    }

    struct BirthChart: Codable {
        let sunSign: String
        let moonSign: String
        let ascendant: String
        let mercury: String
        let venus: String
        let mars: String
    }

    struct Transit: Codable {
        let title: String
        let description: String
        let date: String
    }
}
