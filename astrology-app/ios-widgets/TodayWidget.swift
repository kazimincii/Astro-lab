import WidgetKit
import SwiftUI

struct TodayWidgetProvider: TimelineProvider {
    func placeholder(in context: Context) -> TodayWidgetEntry {
        TodayWidgetEntry(
            date: Date(),
            horoscope: .preview,
            moonPhase: .preview,
            isAvailable: true
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (TodayWidgetEntry) -> ()) {
        let entry = TodayWidgetEntry(
            date: Date(),
            horoscope: WidgetDataManager.getHoroscope() ?? .preview,
            moonPhase: WidgetDataManager.getMoonPhase() ?? .preview,
            isAvailable: true
        )
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        var entries: [TodayWidgetEntry] = []

        // Generate timeline with hourly updates
        let currentDate = Date()
        for hourOffset in 0 ..< 24 {
            let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
            let entry = TodayWidgetEntry(
                date: entryDate,
                horoscope: WidgetDataManager.getHoroscope() ?? .preview,
                moonPhase: WidgetDataManager.getMoonPhase() ?? .preview,
                isAvailable: true
            )
            entries.append(entry)
        }

        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
    }
}

struct TodayWidgetEntry: TimelineEntry {
    let date: Date
    let horoscope: HoroscopeData
    let moonPhase: MoonPhaseData
    let isAvailable: Bool
}

struct TodayWidgetEntryView : View {
    var entry: TodayWidgetProvider.Entry

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Header
            HStack {
                Text("Daily Horoscope")
                    .font(.headline)
                    .foregroundColor(.white)
                
                Spacer()
                
                Text(entry.moonPhase.emoji)
                    .font(.title2)
            }
            .padding(.bottom, 4)
            
            // Horoscope preview
            VStack(alignment: .leading, spacing: 4) {
                Text(entry.horoscope.sign.uppercased())
                    .font(.caption)
                    .foregroundColor(.yellow)
                
                Text(entry.horoscope.text)
                    .font(.caption)
                    .lineLimit(2)
                    .foregroundColor(.white)
            }
            
            // Lucky numbers
            HStack(spacing: 4) {
                Text("Lucky:")
                    .font(.caption2)
                    .foregroundColor(.gray)
                
                ForEach(entry.horoscope.luckyNumbers.prefix(3), id: \.self) { number in
                    Text("\(number)")
                        .font(.caption2)
                        .foregroundColor(.yellow)
                        .padding(.horizontal, 4)
                        .background(Color.yellow.opacity(0.2))
                        .cornerRadius(4)
                }
            }
            
            Spacer()
        }
        .padding()
        .background(
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(red: 0.1, green: 0.1, blue: 0.3),
                    Color(red: 0.2, green: 0.15, blue: 0.35)
                ]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
    }
}

struct TodayWidget: Widget {
    let kind: String = "TodayWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: TodayWidgetProvider()) { entry in
            TodayWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Daily Horoscope")
        .description("Shows your daily horoscope and moon phase")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

// Preview
struct TodayWidget_Previews: PreviewProvider {
    static var previews: some View {
        TodayWidgetEntryView(entry: TodayWidgetEntry(
            date: Date(),
            horoscope: .preview,
            moonPhase: .preview,
            isAvailable: true
        ))
        .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}

// Preview data
extension HoroscopeData {
    static var preview: HoroscopeData {
        HoroscopeData(
            date: Date(),
            sign: "Aries",
            text: "A great day awaits you! Your energy is high and luck is on your side.",
            luckyNumbers: [7, 14, 21],
            luckyColor: "Red",
            mood: "Optimistic"
        )
    }
}

extension MoonPhaseData {
    static var preview: MoonPhaseData {
        MoonPhaseData(
            phase: "Waxing Gibbous",
            percentage: 75,
            emoji: "🌔",
            date: Date(),
            illumination: 0.75
        )
    }
}
