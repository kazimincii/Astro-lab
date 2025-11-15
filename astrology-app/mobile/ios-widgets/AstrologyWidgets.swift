/**
 * Astrology Widgets Bundle
 *
 * Main entry point for all iOS widgets
 * Bundles multiple widget types together
 */

import WidgetKit
import SwiftUI

@main
struct AstrologyWidgets: WidgetBundle {
    var body: some Widget {
        TodayWidget()
        // ChartWidget() // Coming soon
        // MoonPhaseWidget() // Coming soon
    }
}
