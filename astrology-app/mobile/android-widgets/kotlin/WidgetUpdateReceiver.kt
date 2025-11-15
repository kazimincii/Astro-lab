package com.astrology.app.widgets

import android.appwidget.AppWidgetManager
import android.content.BroadcastReceiver
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.util.Log

/**
 * Broadcast receiver to update all widgets
 * Handles manual updates and boot-time initialization
 */
class WidgetUpdateReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        Log.d(TAG, "Received broadcast: ${intent.action}")

        when (intent.action) {
            ACTION_UPDATE_WIDGETS -> {
                Log.d(TAG, "Updating all widgets")
                updateAllWidgets(context)
            }
            Intent.ACTION_BOOT_COMPLETED -> {
                Log.d(TAG, "Device booted, scheduling widget updates")
                scheduleUpdates(context)
            }
            Intent.ACTION_MY_PACKAGE_REPLACED -> {
                Log.d(TAG, "App updated, rescheduling widget updates")
                scheduleUpdates(context)
            }
        }
    }

    companion object {
        private const val TAG = "WidgetUpdateReceiver"
        const val ACTION_UPDATE_WIDGETS = "com.astrology.app.UPDATE_WIDGETS"

        /**
         * Update all installed widgets
         */
        fun updateAllWidgets(context: Context) {
            val appWidgetManager = AppWidgetManager.getInstance(context)

            try {
                // Update Today Widgets
                val todayWidgetIds = appWidgetManager.getAppWidgetIds(
                    ComponentName(context, TodayWidget::class.java)
                )
                Log.d(TAG, "Updating ${todayWidgetIds.size} Today widgets")
                todayWidgetIds.forEach { id ->
                    TodayWidget.updateWidget(context, appWidgetManager, id)
                }

                // Update Moon Phase Widgets
                val moonWidgetIds = appWidgetManager.getAppWidgetIds(
                    ComponentName(context, MoonPhaseWidget::class.java)
                )
                Log.d(TAG, "Updating ${moonWidgetIds.size} Moon Phase widgets")
                moonWidgetIds.forEach { id ->
                    MoonPhaseWidget.updateWidget(context, appWidgetManager, id)
                }

                // Update Chart Widgets (if implemented)
                // val chartWidgetIds = appWidgetManager.getAppWidgetIds(
                //     ComponentName(context, ChartWidget::class.java)
                // )
                // chartWidgetIds.forEach { id ->
                //     ChartWidget.updateWidget(context, appWidgetManager, id)
                // }

                Log.d(TAG, "All widgets updated successfully")
            } catch (e: Exception) {
                Log.e(TAG, "Error updating widgets", e)
            }
        }

        /**
         * Schedule periodic widget updates
         * Can be enhanced with WorkManager for more reliable updates
         */
        private fun scheduleUpdates(context: Context) {
            // Basic implementation - just update immediately
            updateAllWidgets(context)

            // TODO: Implement WorkManager for periodic background updates
            // Example:
            // val workRequest = PeriodicWorkRequestBuilder<WidgetUpdateWorker>(
            //     6, TimeUnit.HOURS
            // ).build()
            // WorkManager.getInstance(context).enqueueUniquePeriodicWork(
            //     "widget_updates",
            //     ExistingPeriodicWorkPolicy.KEEP,
            //     workRequest
            // )
        }

        /**
         * Trigger widget update from React Native
         */
        fun triggerUpdate(context: Context) {
            val intent = Intent(context, WidgetUpdateReceiver::class.java).apply {
                action = ACTION_UPDATE_WIDGETS
            }
            context.sendBroadcast(intent)
        }
    }
}
