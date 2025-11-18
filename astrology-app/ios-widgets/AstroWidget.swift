import WidgetKit
import SwiftUI

@main
struct AstroWidgets: WidgetBundle {
    var body: some Widget {
        TodayWidget()
        MoonPhaseWidget()
    }
}
