package com.astrology.app.widgets

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import com.astrology.app.R
import org.json.JSONObject

/**
 * Moon Phase Widget - Shows current moon phase
 * Small widget (2x2) showing moon emoji and phase name
 */
class MoonPhaseWidget : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        appWidgetIds.forEach { appWidgetId ->
            updateWidget(context, appWidgetManager, appWidgetId)
        }
    }

    companion fun {
        /**
         * Update widget with latest moon phase data
         */
        fun updateWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val widgetData = getWidgetData(context)
            val views = RemoteViews(context.packageName, R.layout.widget_moon_phase)

            if (widgetData != null) {
                try {
                    val moonPhase = widgetData.getJSONObject("moonPhase")

                    // Moon phase emoji
                    val emoji = moonPhase.getString("emoji")
                    views.setTextViewText(R.id.widget_moon_emoji, emoji)

                    // Phase name
                    val phaseName = moonPhase.getString("phase")
                    views.setTextViewText(R.id.widget_moon_phase, phaseName)

                    // Illumination percentage
                    val illumination = (moonPhase.getDouble("illumination") * 100).toInt()
                    views.setTextViewText(
                        R.id.widget_moon_illumination,
                        "$illumination% Illuminated"
                    )
                } catch (e: Exception) {
                    showPlaceholder(views)
                }
            } else {
                showPlaceholder(views)
            }

            // Set up deep link
            val intent = Intent(Intent.ACTION_VIEW).apply {
                data = Uri.parse("astrology://moon")
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }
            val pendingIntent = PendingIntent.getActivity(
                context,
                appWidgetId,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_container, pendingIntent)

            // Update widget
            appWidgetManager.updateAppWidget(appWidgetId, views)
        }

        /**
         * Show placeholder when no data available
         */
        private fun showPlaceholder(views: RemoteViews) {
            views.setTextViewText(R.id.widget_moon_emoji, "🌙")
            views.setTextViewText(R.id.widget_moon_phase, "Moon Phase")
            views.setTextViewText(R.id.widget_moon_illumination, "Open app to sync")
        }

        /**
         * Get widget data from SharedPreferences
         */
        private fun getWidgetData(context: Context): JSONObject? {
            val prefs = context.getSharedPreferences(
                WidgetDataModule.PREFS_NAME,
                Context.MODE_PRIVATE
            )
            val jsonData = prefs.getString(WidgetDataModule.KEY_WIDGET_DATA, null)
            return jsonData?.let {
                try {
                    JSONObject(it)
                } catch (e: Exception) {
                    null
                }
            }
        }
    }
}
