import SwiftUI
import WatchConnectivity

@main
struct AstroWatchApp: App {
    @State private var horoscope: String = "Loading..."
    @State private var moonPhase: String = "🌙"
    @State private var biorhythmData: BiorhythmData?
    @State private var session: WCSession?
    
    var body: some Scene {
        WindowGroup {
            ContentView(
                horoscope: $horoscope,
                moonPhase: $moonPhase,
                biorhythmData: $biorhythmData
            )
        }
        .onAppear {
            initializeWatchConnectivity()
            loadSharedData()
        }
    }
    
    private func initializeWatchConnectivity() {
        if WCSession.isSupported() {
            let session = WCSession.default
            session.delegate = WatchConnectivityDelegate.shared
            session.activate()
            self.session = session
        }
    }
    
    private func loadSharedData() {
        let defaults = UserDefaults(suiteName: "group.com.astrologyapp.superapp")
        
        if let horoscope = defaults?.string(forKey: "daily_horoscope") {
            self.horoscope = horoscope
        }
        
        if let moonPhase = defaults?.string(forKey: "moon_phase") {
            self.moonPhase = moonPhase
        }
        
        // Decode biorhythm data
        if let data = defaults?.data(forKey: "biorhythm_data"),
           let decoded = try? JSONDecoder().decode(BiorhythmData.self, from: data) {
            self.biorhythmData = decoded
        }
    }
}

// MARK: - Models

struct BiorhythmData: Codable {
    let physical: Double
    let emotional: Double
    let intellectual: Double
    let timestamp: TimeInterval
}

// MARK: - WatchConnectivity Delegate

class WatchConnectivityDelegate: NSObject, WCSessionDelegate {
    static let shared = WatchConnectivityDelegate()
    
    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        print("Watch session activated: \(activationState.rawValue)")
    }
    
    func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
        DispatchQueue.main.async {
            // Update UI with received message
            print("Watch received: \(message)")
        }
    }
}
