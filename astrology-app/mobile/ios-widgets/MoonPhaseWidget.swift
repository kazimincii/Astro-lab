// MoonPhaseWidget.swift
// Displays current moon phase and sign

import WidgetKit
import SwiftUI

struct MoonPhaseWidget: Widget {
    let kind: String = "MoonPhaseWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: MoonPhaseProvider()) { entry in
            MoonPhaseWidgetView(entry: entry)
        }
        .configurationDisplayName("Moon Phase")
        .description("Current moon phase and astrological sign")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

// MARK: - Timeline Provider

struct MoonPhaseProvider: TimelineProvider {
    func placeholder(in context: Context) -> MoonPhaseEntry {
        MoonPhaseEntry(date: Date(), widgetData: WidgetDataManager.placeholderData)
    }

    func getSnapshot(in context: Context, completion: @escaping (MoonPhaseEntry) -> ()) {
        let data = WidgetDataManager.getWidgetData() ?? WidgetDataManager.placeholderData
        let entry = MoonPhaseEntry(date: Date(), widgetData: data)
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        let currentDate = Date()
        let data = WidgetDataManager.getWidgetData() ?? WidgetDataManager.placeholderData
        let entry = MoonPhaseEntry(date: currentDate, widgetData: data)

        // Update every 6 hours
        let nextUpdate = Calendar.current.date(byAdding: .hour, value: 6, to: currentDate)!
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }
}

struct MoonPhaseEntry: TimelineEntry {
    let date: Date
    let widgetData: WidgetData
}

// MARK: - Widget Views

struct MoonPhaseWidgetView: View {
    var entry: MoonPhaseProvider.Entry
    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .systemSmall:
            SmallMoonPhaseView(entry: entry)
        case .systemMedium:
            MediumMoonPhaseView(entry: entry)
        @unknown default:
            SmallMoonPhaseView(entry: entry)
        }
    }
}

// MARK: - Small Widget

struct SmallMoonPhaseView: View {
    var entry: MoonPhaseEntry

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [Color(hex: "#0f0f1e"), Color(hex: "#1a1a2e")],
                startPoint: .top,
                endPoint: .bottom
            )

            if let moon = entry.widgetData.moonPhase {
                VStack(spacing: 12) {
                    Text(moon.emoji)
                        .font(.system(size: 60))

                    Text(moon.phase)
                        .font(.headline)
                        .foregroundColor(.white)
                        .multilineTextAlignment(.center)

                    Text("in \(moon.sign)")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.8))

                    Text("\(Int(moon.illumination * 100))% illuminated")
                        .font(.caption2)
                        .foregroundColor(.white.opacity(0.6))
                }
                .padding()
            }
        }
        .widgetURL(URL(string: "astrology://moon"))
    }
}

// MARK: - Medium Widget

struct MediumMoonPhaseView: View {
    var entry: MoonPhaseEntry

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [Color(hex: "#0f0f1e"), Color(hex: "#1a1a2e")],
                startPoint: .top,
                endPoint: .bottom
            )

            if let moon = entry.widgetData.moonPhase {
                HStack(spacing: 20) {
                    // Left - Moon emoji
                    Text(moon.emoji)
                        .font(.system(size: 80))

                    // Right - Info
                    VStack(alignment: .leading, spacing: 8) {
                        Text(moon.phase)
                            .font(.title3)
                            .fontWeight(.bold)
                            .foregroundColor(.white)

                        HStack {
                            Image(systemName: "moon.stars.fill")
                                .foregroundColor(.purple)
                            Text(moon.sign)
                                .font(.body)
                                .foregroundColor(.white)
                        }

                        ProgressView(value: moon.illumination)
                            .tint(.purple)

                        Text("\(Int(moon.illumination * 100))% illuminated")
                            .font(.caption)
                            .foregroundColor(.white.opacity(0.7))
                    }

                    Spacer()
                }
                .padding()
            }
        }
        .widgetURL(URL(string: "astrology://moon"))
    }
}
