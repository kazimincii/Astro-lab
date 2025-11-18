import SwiftUI

struct ContentView: View {
    @State private var selectedTab: Int = 0
    @Binding var horoscope: String
    @Binding var moonPhase: String
    @Binding var biorhythmData: BiorhythmData?
    
    var body: some View {
        TabView(selection: $selectedTab) {
            // Horoscope Tab
            VStack(spacing: 8) {
                Text("Daily Horoscope")
                    .font(.caption)
                    .foregroundColor(.gray)
                
                ScrollView {
                    Text(horoscope)
                        .font(.body)
                        .lineLimit(nil)
                }
            }
            .padding()
            .tag(0)
            
            // Moon Phase Tab
            VStack(spacing: 12) {
                Text(moonPhase)
                    .font(.system(size: 48))
                
                Text("Moon Phase")
                    .font(.caption)
                    .foregroundColor(.gray)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .tag(1)
            
            // Biorhythm Tab
            if let biorhythm = biorhythmData {
                VStack(spacing: 10) {
                    Text("Biorhythm")
                        .font(.caption)
                        .foregroundColor(.gray)
                    
                    VStack(alignment: .leading, spacing: 6) {
                        HStack {
                            Text("Physical")
                                .font(.caption2)
                            Spacer()
                            Text("\(Int(biorhythm.physical * 100))%")
                                .font(.caption2)
                                .foregroundColor(.green)
                        }
                        ProgressView(value: biorhythm.physical)
                            .tint(.green)
                        
                        HStack {
                            Text("Emotional")
                                .font(.caption2)
                            Spacer()
                            Text("\(Int(biorhythm.emotional * 100))%")
                                .font(.caption2)
                                .foregroundColor(.blue)
                        }
                        ProgressView(value: biorhythm.emotional)
                            .tint(.blue)
                        
                        HStack {
                            Text("Intellectual")
                                .font(.caption2)
                            Spacer()
                            Text("\(Int(biorhythm.intellectual * 100))%")
                                .font(.caption2)
                                .foregroundColor(.purple)
                        }
                        ProgressView(value: biorhythm.intellectual)
                            .tint(.purple)
                    }
                    .padding(.top, 4)
                }
                .padding()
                .tag(2)
            }
            
            // Settings Tab
            VStack(spacing: 12) {
                Link(destination: URL(string: "tel:")!) {
                    Label("Open App", systemImage: "arrow.up.right")
                        .font(.caption)
                }
                
                VStack(alignment: .leading, spacing: 4) {
                    Text("App Info")
                        .font(.caption2)
                        .foregroundColor(.gray)
                    Text("Astrology")
                        .font(.caption)
                    Text("v1.0.0")
                        .font(.caption2)
                        .foregroundColor(.gray)
                }
                
                Spacer()
            }
            .padding()
            .tag(3)
        }
        .tabViewStyle(.page)
    }
}

#Preview {
    ContentView(
        horoscope: .constant("Your horoscope for today..."),
        moonPhase: .constant("🌕"),
        biorhythmData: .constant(
            BiorhythmData(physical: 0.75, emotional: 0.60, intellectual: 0.85, timestamp: Date().timeIntervalSince1970)
        )
    )
}
