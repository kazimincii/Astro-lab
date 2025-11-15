package com.astrology.app.widgets

import android.content.Context
import android.content.SharedPreferences
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * React Native bridge module for Android widgets
 * Manages data sharing between React Native app and native Android widgets
 */
class WidgetDataModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val PREFS_NAME = "astrology_widget_data"
        const val KEY_WIDGET_DATA = "widget_data"
        const val KEY_LAST_UPDATE = "last_update"
    }

    override fun getName() = "WidgetDataManager"

    /**
     * Save widget data to SharedPreferences
     * @param jsonData JSON string containing widget data
     * @param promise Promise to resolve/reject
     */
    @ReactMethod
    fun saveData(jsonData: String, promise: Promise) {
        try {
            val prefs = getSharedPrefs()
            prefs.edit()
                .putString(KEY_WIDGET_DATA, jsonData)
                .putLong(KEY_LAST_UPDATE, System.currentTimeMillis())
                .apply()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SAVE_ERROR", "Failed to save widget data: ${e.message}", e)
        }
    }

    /**
     * Get widget data from SharedPreferences
     * @param promise Promise returning JSON string or null
     */
    @ReactMethod
    fun getData(promise: Promise) {
        try {
            val prefs = getSharedPrefs()
            val data = prefs.getString(KEY_WIDGET_DATA, null)
            promise.resolve(data)
        } catch (e: Exception) {
            promise.reject("GET_ERROR", "Failed to get widget data: ${e.message}", e)
        }
    }

    /**
     * Clear all widget data
     * @param promise Promise to resolve/reject
     */
    @ReactMethod
    fun clearData(promise: Promise) {
        try {
            val prefs = getSharedPrefs()
            prefs.edit().clear().apply()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("CLEAR_ERROR", "Failed to clear widget data: ${e.message}", e)
        }
    }

    /**
     * Trigger widget updates
     * @param promise Promise to resolve/reject
     */
    @ReactMethod
    fun updateWidgets(promise: Promise) {
        try {
            WidgetUpdateReceiver.updateAllWidgets(reactApplicationContext)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("UPDATE_ERROR", "Failed to update widgets: ${e.message}", e)
        }
    }

    /**
     * Get last update timestamp
     * @param promise Promise returning timestamp in milliseconds
     */
    @ReactMethod
    fun getLastUpdate(promise: Promise) {
        try {
            val prefs = getSharedPrefs()
            val timestamp = prefs.getLong(KEY_LAST_UPDATE, 0)
            promise.resolve(timestamp.toDouble())
        } catch (e: Exception) {
            promise.reject("GET_TIMESTAMP_ERROR", "Failed to get last update: ${e.message}", e)
        }
    }

    /**
     * Get SharedPreferences instance
     */
    private fun getSharedPrefs(): SharedPreferences {
        return reactApplicationContext.getSharedPreferences(
            PREFS_NAME,
            Context.MODE_PRIVATE
        )
    }
}
