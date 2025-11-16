import WidgetKit
import SwiftUI

// MARK: - Widget Configuration
struct AstroWidget: Widget {
    let kind: String = "AstroWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: AstroWidgetProvider()) { entry in
            AstroWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Astro Widget")
        .description("See your daily astrology insights at a glance.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

// MARK: - Widget Provider
struct AstroWidgetProvider: TimelineProvider {
    func placeholder(in context: Context) -> AstroWidgetEntry {
        AstroWidgetEntry(
            date: Date(),
            widgetType: .moonPhase,
            data: MoonPhaseData(
                phase: "Full Moon",
                illumination: 100,
                sign: "Leo"
            )
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (AstroWidgetEntry) -> ()) {
        let entry = AstroWidgetEntry(
            date: Date(),
            widgetType: .moonPhase,
            data: MoonPhaseData(
                phase: "Waxing Crescent",
                illumination: 45,
                sign: "Taurus"
            )
        )
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<AstroWidgetEntry>) -> ()) {
        // Fetch widget data from app or backend
        fetchWidgetData { widgetData in
            let currentDate = Date()
            let entry = AstroWidgetEntry(
                date: currentDate,
                widgetType: widgetData.type,
                data: widgetData.data
            )

            // Update every hour
            let nextUpdate = Calendar.current.date(byAdding: .hour, value: 1, to: currentDate)!
            let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
            completion(timeline)
        }
    }

    // Fetch data from UserDefaults (shared between app and widget)
    private func fetchWidgetData(completion: @escaping (WidgetData) -> Void) {
        if let sharedDefaults = UserDefaults(suiteName: "group.com.astrolab.widgets"),
           let savedData = sharedDefaults.data(forKey: "widgetData"),
           let widgetData = try? JSONDecoder().decode(WidgetData.self, from: savedData) {
            completion(widgetData)
        } else {
            // Return default data
            completion(WidgetData(
                type: .moonPhase,
                data: MoonPhaseData(phase: "New Moon", illumination: 0, sign: "Aries")
            ))
        }
    }
}

// MARK: - Widget Entry
struct AstroWidgetEntry: TimelineEntry {
    let date: Date
    let widgetType: WidgetType
    let data: WidgetDataType
}

// MARK: - Widget Data Types
enum WidgetType: String, Codable {
    case moonPhase
    case starMessage
    case todaySummary
    case dailyForecast
}

protocol WidgetDataType: Codable {}

struct MoonPhaseData: WidgetDataType {
    let phase: String
    let illumination: Int
    let sign: String
}

struct StarMessageData: WidgetDataType {
    let message: String
    let date: String
}

struct TodaySummaryData: WidgetDataType {
    let moonPhase: String
    let moonSign: String
    let keyTransit: String
    let forecast: String
}

struct WidgetData: Codable {
    let type: WidgetType
    let data: AnyEncodable

    init(type: WidgetType, data: any WidgetDataType) {
        self.type = type
        self.data = AnyEncodable(data)
    }
}

// Helper for encoding heterogeneous data
struct AnyEncodable: Codable {
    let value: Any

    init<T: Encodable>(_ value: T) {
        self.value = value
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        if let intValue = value as? Int {
            try container.encode(intValue)
        } else if let stringValue = value as? String {
            try container.encode(stringValue)
        } else if let encodable = value as? Encodable {
            try container.encode(AnyCodable(encodable))
        }
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if let intValue = try? container.decode(Int.self) {
            value = intValue
        } else if let stringValue = try? container.decode(String.self) {
            value = stringValue
        } else {
            value = ""
        }
    }
}

struct AnyCodable: Codable {
    let value: Encodable

    init(_ value: Encodable) {
        self.value = value
    }

    func encode(to encoder: Encoder) throws {
        try value.encode(to: encoder)
    }

    init(from decoder: Decoder) throws {
        fatalError("AnyCodable decoding not supported")
    }
}

// MARK: - Widget Views
struct AstroWidgetEntryView: View {
    var entry: AstroWidgetProvider.Entry
    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .systemSmall:
            SmallWidgetView(entry: entry)
        case .systemMedium:
            MediumWidgetView(entry: entry)
        case .systemLarge:
            LargeWidgetView(entry: entry)
        default:
            SmallWidgetView(entry: entry)
        }
    }
}

// Small Widget - Moon Phase
struct SmallWidgetView: View {
    let entry: AstroWidgetEntry

    var body: some View {
        if let moonData = entry.data as? MoonPhaseData {
            ZStack {
                LinearGradient(
                    colors: [Color(hex: "1a1a2e"), Color(hex: "6366f1")],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )

                VStack(spacing: 8) {
                    Text(getMoonEmoji(phase: moonData.phase))
                        .font(.system(size: 50))

                    Text(moonData.phase)
                        .font(.caption)
                        .fontWeight(.semibold)
                        .foregroundColor(.white)

                    Text("\(moonData.illumination)% illuminated")
                        .font(.caption2)
                        .foregroundColor(.white.opacity(0.8))

                    Text("in \(moonData.sign)")
                        .font(.caption2)
                        .foregroundColor(Color(hex: "fbbf24"))
                }
            }
        }
    }

    private func getMoonEmoji(phase: String) -> String {
        switch phase {
        case "New Moon": return "🌑"
        case "Waxing Crescent": return "🌒"
        case "First Quarter": return "🌓"
        case "Waxing Gibbous": return "🌔"
        case "Full Moon": return "🌕"
        case "Waning Gibbous": return "🌖"
        case "Last Quarter": return "🌗"
        case "Waning Crescent": return "🌘"
        default: return "🌙"
        }
    }
}

// Medium Widget - Star Message
struct MediumWidgetView: View {
    let entry: AstroWidgetEntry

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [Color(hex: "1a1a2e"), Color(hex: "8b5cf6")],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    Text("⭐️")
                        .font(.title)
                    Text("Star Message")
                        .font(.headline)
                        .foregroundColor(.white)
                    Spacer()
                }

                if let messageData = entry.data as? StarMessageData {
                    Text(messageData.message)
                        .font(.subheadline)
                        .foregroundColor(.white.opacity(0.9))
                        .lineLimit(3)
                } else {
                    Text("Your cosmic guidance for today")
                        .font(.subheadline)
                        .foregroundColor(.white.opacity(0.9))
                }

                Spacer()

                Text(Date(), style: .date)
                    .font(.caption2)
                    .foregroundColor(.white.opacity(0.6))
            }
            .padding()
        }
    }
}

// Large Widget - Today Summary
struct LargeWidgetView: View {
    let entry: AstroWidgetEntry

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [Color(hex: "0f0f1e"), Color(hex: "6366f1"), Color(hex: "8b5cf6")],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            VStack(alignment: .leading, spacing: 16) {
                Text("Today's Astro Summary")
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(.white)

                if let summaryData = entry.data as? TodaySummaryData {
                    VStack(alignment: .leading, spacing: 12) {
                        InfoRow(icon: "🌙", title: "Moon", value: "\(summaryData.moonPhase) in \(summaryData.moonSign)")
                        InfoRow(icon: "✨", title: "Key Transit", value: summaryData.keyTransit)

                        Divider()
                            .background(Color.white.opacity(0.3))

                        Text("Today's Forecast")
                            .font(.caption)
                            .fontWeight(.semibold)
                            .foregroundColor(.white.opacity(0.8))

                        Text(summaryData.forecast)
                            .font(.caption)
                            .foregroundColor(.white.opacity(0.9))
                            .lineLimit(4)
                    }
                }

                Spacer()
            }
            .padding()
        }
    }
}

struct InfoRow: View {
    let icon: String
    let title: String
    let value: String

    var body: some View {
        HStack {
            Text(icon)
                .font(.title3)
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.caption)
                    .foregroundColor(.white.opacity(0.7))
                Text(value)
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundColor(.white)
            }
        }
    }
}

// Color extension for hex colors
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - Widget Preview
struct AstroWidget_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            AstroWidgetEntryView(entry: AstroWidgetEntry(
                date: Date(),
                widgetType: .moonPhase,
                data: MoonPhaseData(phase: "Full Moon", illumination: 100, sign: "Leo")
            ))
            .previewContext(WidgetPreviewContext(family: .systemSmall))

            AstroWidgetEntryView(entry: AstroWidgetEntry(
                date: Date(),
                widgetType: .starMessage,
                data: StarMessageData(message: "Today brings opportunities for growth and transformation. Trust your intuition.", date: "Today")
            ))
            .previewContext(WidgetPreviewContext(family: .systemMedium))

            AstroWidgetEntryView(entry: AstroWidgetEntry(
                date: Date(),
                widgetType: .todaySummary,
                data: TodaySummaryData(
                    moonPhase: "Waxing Gibbous",
                    moonSign: "Sagittarius",
                    keyTransit: "Venus trine Jupiter",
                    forecast: "A harmonious day ahead. Focus on relationships and creative pursuits."
                )
            ))
            .previewContext(WidgetPreviewContext(family: .systemLarge))
        }
    }
}
