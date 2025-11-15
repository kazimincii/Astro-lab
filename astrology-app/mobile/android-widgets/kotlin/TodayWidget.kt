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
 * Today Widget - Shows daily horoscope
 * Supports small (2x2) and medium (4x2) sizes
 */
class TodayWidget : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        appWidgetIds.forEach { appWidgetId ->
            updateWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onDeleted(context: Context, appWidgetIds: IntArray) {
        // Cleanup if needed
    }

    override fun onEnabled(context: Context) {
        // First widget added
    }

    override fun onDisabled(context: Context) {
        // Last widget removed
    }

    companion object {
        /**
         * Update widget with latest data
         */
        fun updateWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val widgetData = getWidgetData(context)

            // Determine widget size
            val options = appWidgetManager.getAppWidgetOptions(appWidgetId)
            val minWidth = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH)
            val layoutId = if (minWidth < 250) {
                R.layout.widget_today_small
            } else {
                R.layout.widget_today_medium
            }

            val views = RemoteViews(context.packageName, layoutId)

            if (widgetData != null) {
                try {
                    val horoscope = widgetData.getJSONObject("todayHoroscope")

                    // Set text content
                    views.setTextViewText(R.id.widget_sign, horoscope.getString("sign"))
                    views.setTextViewText(R.id.widget_horoscope, horoscope.getString("text"))
                    views.setTextViewText(R.id.widget_date, horoscope.getString("date"))

                    // Lucky number (if available)
                    if (horoscope.has("luckyNumber")) {
                        val luckyNumber = horoscope.getInt("luckyNumber")
                        views.setTextViewText(R.id.widget_lucky_number, luckyNumber.toString())
                        views.setViewVisibility(
                            R.id.widget_lucky_number_container,
                            android.view.View.VISIBLE
                        )
                    } else {
                        views.setViewVisibility(
                            R.id.widget_lucky_number_container,
                            android.view.View.GONE
                        )
                    }

                    // Lucky color indicator (if available)
                    if (horoscope.has("luckyColor") && minWidth >= 250) {
                        // Set color indicator background
                        views.setViewVisibility(R.id.widget_color_indicator, android.view.View.VISIBLE)
                    }
                } catch (e: Exception) {
                    showPlaceholder(views)
                }
            } else {
                showPlaceholder(views)
            }

            // Set up deep link
            val intent = Intent(Intent.ACTION_VIEW).apply {
                data = Uri.parse("astrology://today")
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
         * Show placeholder text when no data available
         */
        private fun showPlaceholder(views: RemoteViews) {
            views.setTextViewText(R.id.widget_sign, "Astrology")
            views.setTextViewText(R.id.widget_horoscope, "Open app to sync your daily horoscope")
            views.setTextViewText(R.id.widget_date, "")
            views.setViewVisibility(R.id.widget_lucky_number_container, android.view.View.GONE)
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
