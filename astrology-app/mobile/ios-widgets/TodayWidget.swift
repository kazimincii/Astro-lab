/**
 * Today Widget
 *
 * Shows daily horoscope on iOS home screen
 * Supports Small, Medium, and Large sizes
 */

import WidgetKit
import SwiftUI

// MARK: - Widget Configuration

struct TodayWidget: Widget {
    let kind: String = "TodayWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: TodayProvider()) { entry in
            TodayWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Today's Horoscope")
        .description("See your daily horoscope and cosmic insights")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

// MARK: - Timeline Provider

struct TodayProvider: TimelineProvider {
    func placeholder(in context: Context) -> TodayEntry {
        TodayEntry(date: Date(), horoscope: placeholderHoroscope(), moonPhase: placeholderMoonPhase())
    }

    func getSnapshot(in context: Context, completion: @escaping (TodayEntry) -> ()) {
        let entry = makeEntry()
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        let currentDate = Date()
        let entry = makeEntry()

        // Refresh at midnight for new daily horoscope
        let midnight = Calendar.current.startOfDay(for: currentDate.addingTimeInterval(86400))

        let timeline = Timeline(entries: [entry], policy: .after(midnight))
        completion(timeline)
    }

    private func makeEntry() -> TodayEntry {
        let data = WidgetDataHelper.getWidgetData()
        return TodayEntry(
            date: Date(),
            horoscope: data?.todayHoroscope ?? placeholderHoroscope(),
            moonPhase: data?.moonPhase ?? placeholderMoonPhase()
        )
    }

    private func placeholderHoroscope() -> WidgetData.Horoscope {
        return WidgetData.Horoscope(
            sign: "Aries",
            text: "Open the app to see your personalized daily horoscope and cosmic insights.",
            date: formatDate(Date()),
            mood: "optimistic",
            luckyNumber: 7,
            luckyColor: "purple"
        )
    }

    private func placeholderMoonPhase() -> WidgetData.MoonPhase {
        return WidgetData.MoonPhase(
            phase: "Waxing Crescent",
            illumination: 0.35,
            emoji: "🌒"
        )
    }

    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: date)
    }
}

// MARK: - Timeline Entry

struct TodayEntry: TimelineEntry {
    let date: Date
    let horoscope: WidgetData.Horoscope
    let moonPhase: WidgetData.MoonPhase
}

// MARK: - Widget Views

struct TodayWidgetEntryView: View {
    @Environment(\.widgetFamily) var family
    var entry: TodayProvider.Entry

    var body: some View {
        switch family {
        case .systemSmall:
            SmallTodayWidget(entry: entry)
        case .systemMedium:
            MediumTodayWidget(entry: entry)
        case .systemLarge:
            LargeTodayWidget(entry: entry)
        @unknown default:
            SmallTodayWidget(entry: entry)
        }
    }
}

// MARK: - Small Widget

struct SmallTodayWidget: View {
    var entry: TodayEntry

    var body: some View {
        ZStack {
            CosmicGradient()

            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    Image(systemName: getSignIcon())
                        .foregroundColor(.yellow)
                        .font(.system(size: 16))

                    Text(entry.horoscope.sign)
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.white)

                    Spacer()
                }

                Text(entry.horoscope.text)
                    .font(.system(size: 11))
                    .foregroundColor(.white.opacity(0.9))
                    .lineLimit(4)

                Spacer()

                HStack {
                    Text(entry.moonPhase.emoji)
                        .font(.system(size: 14))

                    Text(entry.moonPhase.phase)
                        .font(.system(size: 9))
                        .foregroundColor(.white.opacity(0.7))

                    Spacer()
                }
            }
            .padding(12)
        }
        .widgetURL(URL(string: "astrology://today"))
    }

    private func getSignIcon() -> String {
        switch entry.horoscope.sign.lowercased() {
        case "aries": return "flame.fill"
        case "taurus": return "leaf.fill"
        case "gemini": return "wind"
        case "cancer": return "moonphase.waxing.crescent"
        case "leo": return "sun.max.fill"
        case "virgo": return "sparkles"
        case "libra": return "scale.3d"
        case "scorpio": return "drop.fill"
        case "sagittarius": return "arrow.up.right"
        case "capricorn": return "mountain.2.fill"
        case "aquarius": return "wave.3.right"
        case "pisces": return "drop.triangle"
        default: return "sparkles"
        }
    }
}

// MARK: - Medium Widget

struct MediumTodayWidget: View {
    var entry: TodayEntry

    var body: some View {
        ZStack {
            CosmicGradient()

            HStack(spacing: 16) {
                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Image(systemName: "sparkles")
                            .foregroundColor(.yellow)

                        Text(entry.horoscope.sign)
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.white)
                    }

                    Text(entry.horoscope.text)
                        .font(.system(size: 12))
                        .foregroundColor(.white.opacity(0.9))
                        .lineLimit(4)

                    Spacer()

                    HStack(spacing: 16) {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Lucky #")
                                .font(.system(size: 9))
                                .foregroundColor(.white.opacity(0.6))
                            Text("\(entry.horoscope.luckyNumber)")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.yellow)
                        }

                        VStack(alignment: .leading, spacing: 2) {
                            Text("Mood")
                                .font(.system(size: 9))
                                .foregroundColor(.white.opacity(0.6))
                            Text(entry.horoscope.mood.capitalized)
                                .font(.system(size: 11, weight: .semibold))
                                .foregroundColor(.white)
                        }
                    }
                }
                .padding()

                Divider()
                    .background(Color.white.opacity(0.2))

                VStack(spacing: 8) {
                    Text(entry.moonPhase.emoji)
                        .font(.system(size: 40))

                    Text(entry.moonPhase.phase)
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(.white)
                        .multilineTextAlignment(.center)

                    Text("\(Int(entry.moonPhase.illumination * 100))%")
                        .font(.system(size: 10))
                        .foregroundColor(.white.opacity(0.7))
                }
                .frame(maxWidth: 100)
                .padding()
            }
        }
        .widgetURL(URL(string: "astrology://today"))
    }
}

// MARK: - Large Widget

struct LargeTodayWidget: View {
    var entry: TodayEntry

    var body: some View {
        ZStack {
            CosmicGradient()

            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    Image(systemName: "sparkles")
                        .foregroundColor(.yellow)
                        .font(.system(size: 20))

                    Text(entry.horoscope.sign)
                        .font(.system(size: 22, weight: .bold))
                        .foregroundColor(.white)

                    Spacer()

                    Text(formatDate(entry.date))
                        .font(.system(size: 11))
                        .foregroundColor(.white.opacity(0.6))
                }

                Divider()
                    .background(Color.white.opacity(0.2))

                Text(entry.horoscope.text)
                    .font(.system(size: 14))
                    .foregroundColor(.white.opacity(0.95))
                    .lineLimit(6)

                Spacer()

                HStack(spacing: 20) {
                    InfoCard(title: "Mood", value: entry.horoscope.mood.capitalized, icon: "face.smiling")
                    InfoCard(title: "Lucky #", value: "\(entry.horoscope.luckyNumber)", icon: "star.fill")
                    InfoCard(title: "Color", value: entry.horoscope.luckyColor.capitalized, icon: "paintpalette.fill")
                }

                Divider()
                    .background(Color.white.opacity(0.2))

                HStack {
                    Text(entry.moonPhase.emoji)
                        .font(.system(size: 24))

                    VStack(alignment: .leading, spacing: 2) {
                        Text(entry.moonPhase.phase)
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(.white)

                        Text("\(Int(entry.moonPhase.illumination * 100))% illuminated")
                            .font(.system(size: 10))
                            .foregroundColor(.white.opacity(0.7))
                    }

                    Spacer()
                }
            }
            .padding()
        }
        .widgetURL(URL(string: "astrology://today"))
    }

    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        return formatter.string(from: date)
    }
}

// MARK: - Reusable Components

struct InfoCard: View {
    let title: String
    let value: String
    let icon: String

    var body: some View {
        VStack(spacing: 4) {
            Image(systemName: icon)
                .foregroundColor(.yellow)
                .font(.system(size: 14))

            Text(title)
                .font(.system(size: 9))
                .foregroundColor(.white.opacity(0.6))

            Text(value)
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(.white)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
        .background(Color.white.opacity(0.1))
        .cornerRadius(8)
    }
}

struct CosmicGradient: View {
    var body: some View {
        LinearGradient(
            gradient: Gradient(colors: [
                Color(hex: "#1a0033"),
                Color(hex: "#2d1b4e"),
                Color(hex: "#4a2c6e")
            ]),
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }
}

// MARK: - Color Extension

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

// MARK: - Preview

struct TodayWidget_Previews: PreviewProvider {
    static var previews: some View {
        let entry = TodayEntry(
            date: Date(),
            horoscope: WidgetData.Horoscope(
                sign: "Aries",
                text: "Today brings exciting opportunities for growth and new beginnings. Trust your instincts.",
                date: "2024-01-15",
                mood: "optimistic",
                luckyNumber: 7,
                luckyColor: "purple"
            ),
            moonPhase: WidgetData.MoonPhase(
                phase: "Waxing Crescent",
                illumination: 0.35,
                emoji: "🌒"
            )
        )

        Group {
            TodayWidgetEntryView(entry: entry)
                .previewContext(WidgetPreviewContext(family: .systemSmall))
                .previewDisplayName("Small")

            TodayWidgetEntryView(entry: entry)
                .previewContext(WidgetPreviewContext(family: .systemMedium))
                .previewDisplayName("Medium")

            TodayWidgetEntryView(entry: entry)
                .previewContext(WidgetPreviewContext(family: .systemLarge))
                .previewDisplayName("Large")
        }
    }
}
