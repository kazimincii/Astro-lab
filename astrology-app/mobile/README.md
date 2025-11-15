# Astrology Mobile App

React Native Expo ile geliştirilmiş astroloji mobil uygulaması.

## Kurulum

```bash
npm install
```

## Çalıştırma

```bash
# Development server başlat
npm start

# iOS simulator
npm run ios

# Android emulator
npm run android

# Web browser
npm run web
```

## Proje Yapısı

```
src/
├── api/              # API client ve endpoint'ler
├── components/       # Yeniden kullanılabilir bileşenler
├── navigation/       # Navigation yapılandırması
├── screens/          # Ekran bileşenleri
│   ├── auth/         # Giriş/Kayıt ekranları
│   └── main/         # Ana uygulama ekranları
├── store/            # Zustand state management
├── theme/            # Tema ve stil dosyaları
└── types/            # TypeScript tip tanımlamaları
```

## Özellikler

### Auth Flow
- Hoş geldiniz ekranı
- Giriş yapma
- Kayıt olma
- Otomatik token yenileme

### Ana Özellikler
- **Today**: Günlük tahminler ve burç yorumları
- **Profiles**: Doğum profilleri yönetimi
- **Explore**: Tarot, kahve falı, numeroloji gibi özellikler
- **AI Assistant**: AI destekli astroloji asistanı
- **Settings**: Kullanıcı ayarları ve hesap yönetimi

## Tema

Uygulama cosmic (kozmik) temalı dark mode tasarıma sahiptir:

```javascript
colors: {
  cosmic: {
    bg: '#0f0f1e',
    card: '#1a1b2e',
    purple: '#6366f1',
    pink: '#ec4899',
    blue: '#3b82f6',
    gold: '#f59e0b',
  },
  zodiac: {
    aries: '#ff4444',
    taurus: '#44ff44',
    // ... diğer burçlar
  }
}
```

## State Management

Zustand kullanılarak basit ve etkili state management:

```typescript
// Auth store örneği
const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  login: (user, token) => set({ isAuthenticated: true, user, token }),
  logout: () => set({ isAuthenticated: false, user: null, token: null }),
}));
```

## API Bağlantısı

Backend API URL'i `src/api/client.ts` dosyasında yapılandırılır:

```typescript
const API_URL = 'http://localhost:3000/api/v1';
```

Fiziksel cihaz için bilgisayarınızın local IP'sini kullanın:
```typescript
const API_URL = 'http://192.168.1.X:3000/api/v1';
```

## Build

```bash
# Development build
eas build --profile development --platform ios
eas build --profile development --platform android

# Production build
eas build --profile production --platform all
```

## Yayınlama

```bash
# Expo'ya yayınla
eas update

# App Store / Google Play
eas submit
```

## Gereksinimler

- Node.js 18+
- Expo CLI
- iOS: macOS + Xcode
- Android: Android Studio

## Faydalı Komutlar

```bash
# Cache temizle
expo start -c

# TypeScript kontrol
npx tsc --noEmit

# Bağımlılıkları güncelle
expo install --fix
```
