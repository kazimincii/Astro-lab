'use client';

import { useState } from 'react';
import MobileSimulator from '@/components/MobileSimulator';
import Link from 'next/link';

type SettingItem = {
  icon: string;
  label: string;
  path?: string;
  toggle?: boolean;
  dropdown?: boolean;
  value?: boolean | string;
  onChange?: (value: any) => void;
};

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');

  const settingsSections: { title: string; items: SettingItem[] }[] = [
    {
      title: 'Account',
      items: [
        { icon: '👤', label: 'Profile', path: '/main/profiles' },
        { icon: '🔐', label: 'Privacy & Security', path: '#' },
        { icon: '💎', label: 'Subscription', path: '/main/my-plan' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: '🔔', label: 'Notifications', toggle: true, value: notifications, onChange: setNotifications },
        { icon: '🌙', label: 'Dark Mode', toggle: true, value: darkMode, onChange: setDarkMode },
        { icon: '🌍', label: 'Language', dropdown: true, value: language, onChange: setLanguage },
      ],
    },
    {
      title: 'About',
      items: [
        { icon: '📖', label: 'Help & Support', path: '#' },
        { icon: '⭐', label: 'Rate Us', path: '#' },
        { icon: '📜', label: 'Terms & Privacy', path: '#' },
        { icon: 'ℹ️', label: 'About', path: '#' },
      ],
    },
  ];

  return (
    <MobileSimulator>
      <div className="min-h-full bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 pt-16 pb-6">
          <Link href="/" className="text-white mb-4 inline-block">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>

        <div className="px-6 py-6">
          {/* User Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl">
              ♈
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">John Doe</h2>
              <p className="text-gray-500">john.doe@example.com</p>
              <Link href="/main/profiles" className="text-purple-600 text-sm font-semibold">
                View Profile →
              </Link>
            </div>
          </div>

          {/* Settings Sections */}
          {settingsSections.map((section) => (
            <div key={section.title} className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
                {section.title}
              </h3>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {section.items.map((item, index) => (
                  <div key={item.label}>
                    {item.toggle ? (
                      <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <span className="font-medium text-gray-700">{item.label}</span>
                        </div>
                        <button
                          onClick={() => item.onChange?.(!item.value)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            item.value ? 'bg-purple-600' : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                              item.value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ) : item.dropdown ? (
                      <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <span className="font-medium text-gray-700">{item.label}</span>
                        </div>
                        <select
                          value={String(item.value || 'en')}
                          onChange={(e) => item.onChange?.(e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-600"
                        >
                          <option value="en">English</option>
                          <option value="tr">Türkçe</option>
                        </select>
                      </div>
                    ) : (
                      <Link
                        href={item.path || '#'}
                        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <span className="font-medium text-gray-700">{item.label}</span>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                    {index < section.items.length - 1 && (
                      <div className="border-b border-gray-100 mx-4" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Logout Button */}
          <button className="w-full py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors">
            Sign Out
          </button>

          {/* Version */}
          <div className="text-center mt-6 text-gray-400 text-sm">
            Version 1.0.0
          </div>
        </div>
      </div>
    </MobileSimulator>
  );
}
