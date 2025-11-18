import WidgetKit
import SwiftUI

struct MoonPhaseWidgetProvider: TimelineProvider {
    func placeholder(in context: Context) -> MoonPhaseWidgetEntry {
        MoonPhaseWidgetEntry(
            date: Date(),
            moonPhase: .preview,
            isAvailable: true
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (MoonPhaseWidgetEntry) -> ()) {
        let entry = MoonPhaseWidgetEntry(
            date: Date(),
            moonPhase: WidgetDataManager.getMoonPhase() ?? .preview,
            isAvailable: true
        )
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        var entries: [MoonPhaseWidgetEntry] = []

        // Generate timeline updating daily at midnight
        let currentDate = Date()
        for dayOffset in 0 ..< 7 {
            let entryDate = Calendar.current.date(byAdding: .day, value: dayOffset, to: currentDate)!
            let entry = MoonPhaseWidgetEntry(
                date: entryDate,
                moonPhase: WidgetDataManager.getMoonPhase() ?? .preview,
                isAvailable: true
            )
            entries.append(entry)
        }

        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
    }
}

struct MoonPhaseWidgetEntry: TimelineEntry {
    let date: Date
    let moonPhase: MoonPhaseData
    let isAvailable: Bool
}

struct MoonPhaseWidgetEntryView : View {
    var entry: MoonPhaseWidgetProvider.Entry

    var body: some View {
        VStack(spacing: 12) {
            // Large moon emoji
            Text(entry.moonPhase.emoji)
                .font(.system(size: 64))
            
            // Phase name
            Text(entry.moonPhase.phase)
                .font(.headline)
                .foregroundColor(.white)
            
            // Illumination percentage
            VStack(spacing: 4) {
                HStack {
                    Text("Illumination")
                        .font(.caption)
                        .foregroundColor(.gray)
                    
                    Spacer()
                    
                    Text("\(Int(entry.moonPhase.illumination * 100))%")
                        .font(.caption)
                        .foregroundColor(.yellow)
                }
                
                // Progress bar
                GeometryReader { geometry in
                    ZStack(alignment: .leading) {
                        RoundedRectangle(cornerRadius: 4)
                            .fill(Color.yellow.opacity(0.2))
                        
                        RoundedRectangle(cornerRadius: 4)
                            .fill(Color.yellow)
                            .frame(width: geometry.size.width * entry.moonPhase.illumination)
                    }
                }
                .frame(height: 6)
            }
            
            Spacer()
        }
        .padding()
        .background(
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(red: 0.1, green: 0.1, blue: 0.3),
                    Color(red: 0.15, green: 0.1, blue: 0.25)
                ]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
    }
}

struct MoonPhaseWidget: Widget {
    let kind: String = "MoonPhaseWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: MoonPhaseWidgetProvider()) { entry in
            MoonPhaseWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Moon Phase")
        .description("Track the current moon phase")
        .supportedFamilies([.systemSmall, .systemCircular])
    }
}

// Preview
struct MoonPhaseWidget_Previews: PreviewProvider {
    static var previews: some View {
        MoonPhaseWidgetEntryView(entry: MoonPhaseWidgetEntry(
            date: Date(),
            moonPhase: .preview,
            isAvailable: true
        ))
        .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}
