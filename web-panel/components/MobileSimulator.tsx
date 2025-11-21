'use client';

import { ReactNode, useState } from 'react';

interface MobileSimulatorProps {
  children: ReactNode;
}

export default function MobileSimulator({ children }: MobileSimulatorProps) {
  const [deviceType, setDeviceType] = useState<'iphone' | 'android'>('iphone');

  const deviceConfigs = {
    iphone: {
      width: 390,
      height: 844,
      name: 'iPhone 14',
    },
    android: {
      width: 412,
      height: 915,
      name: 'Pixel 7',
    },
  };

  const config = deviceConfigs[deviceType];

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
      {/* Device Selector */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setDeviceType('iphone')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            deviceType === 'iphone'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          iPhone 14
        </button>
        <button
          onClick={() => setDeviceType('android')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            deviceType === 'android'
              ? 'bg-green-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Pixel 7
        </button>
      </div>

      {/* Device Info */}
      <div className="mb-4 text-gray-400 text-sm">
        {config.name} ({config.width} × {config.height})
      </div>

      {/* Mobile Device Frame */}
      <div className="relative bg-gray-800 rounded-[3rem] p-4 shadow-2xl">
        {/* Device Notch/Camera */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-10" />

        {/* Screen */}
        <div
          className="bg-white rounded-[2.5rem] overflow-hidden shadow-inner relative"
          style={{
            width: `${config.width}px`,
            height: `${config.height}px`,
          }}
        >
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-12 bg-transparent z-10 flex items-center justify-between px-8 text-black text-xs font-semibold">
            <span>9:41</span>
            <div className="flex gap-1 items-center">
              <span>📶</span>
              <span>📡</span>
              <span>🔋</span>
            </div>
          </div>

          {/* App Content */}
          <div className="w-full h-full overflow-auto">
            {children}
          </div>
        </div>

        {/* Home Indicator (iOS) */}
        {deviceType === 'iphone' && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full" />
        )}
      </div>
    </div>
  );
}
