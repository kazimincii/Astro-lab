# Astrology Super App

Kapsamlı bir astroloji süper uygulaması - Backend ve Mobile uygulamayı içeren tam stack proje.

## Proje Yapısı

```
astrology-app/
├── backend/          # NestJS Backend API
└── mobile/           # React Native Expo Mobile App
```

## Özellikler

### Üyelik Sistemleri
- **Basic** (Ücretsiz): 2 action/gün, 2 profil
- **Standard** ($10/ay): 4 action/gün, 10 profil
- **Premium** ($19/ay): Sınırsız action, 50+ profil

### Premium Actions
- AI Assistant sorguları
- Detaylı chart yorumları
- Tarot/Kahve falı
- Numeroloji raporları
- Uyumluluk analizi

### Ana Özellikler
- ✅ Doğum haritası hesaplama ve yorumlama
- ✅ Günlük burç yorumları
- ✅ Çoklu profil yönetimi
- ✅ Tarot falı
- ✅ Kahve falı (AI görüntü analizi)
- ✅ Numeroloji hesaplamaları
- ✅ AI destekli asistanSo
- ✅ Uyumluluk analizleri
- ✅ Stripe ile ödeme sistemi

## Backend Kurulumu

### Gereksinimler
- Node.js 18+
- PostgreSQL 15+
- Redis 7+

### Kurulum

```bash
cd backend
npm install

# PostgreSQL (Docker ile)
docker run --name astrology-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=astrology_db -p 5432:5432 -d postgres:15

# Redis (Docker ile)
docker run --name astrology-redis -p 6379:6379 -d redis:7

# .env dosyası oluştur
cp .env.example .env
# .env dosyasını düzenle - API anahtarları ekle

# Geliştirme sunucusu
npm run start:dev
```

Backend http://localhost:3000/api/v1 adresinde çalışacak.

## Mobile Kurulumu

### Gereksinimler
- Node.js 18+
- Expo CLI

### Kurulum

```bash
cd mobile
npm install

# iOS için
npm run ios

# Android için
npm run android

# Web için
npm run web
```

## Teknoloji Stack

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL + TypeORM
- **Cache**: Redis
- **Auth**: JWT + Passport
- **AI**: OpenAI / Anthropic Claude
- **Payment**: Stripe
- **Storage**: AWS S3

### Mobile
- **Framework**: React Native + Expo
- **Styling**: NativeWind (Tailwind CSS)
- **Navigation**: React Navigation
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **API Client**: Axios

## API Endpoints

### Authentication
- POST `/api/v1/auth/register` - Kullanıcı kaydı
- POST `/api/v1/auth/login` - Giriş
- POST `/api/v1/auth/logout` - Çıkış
- POST `/api/v1/auth/refresh` - Token yenileme

### Profiles
- GET `/api/v1/profiles` - Tüm profilleri getir
- POST `/api/v1/profiles` - Yeni profil oluştur
- GET `/api/v1/profiles/:id` - Profil detayı
- PATCH `/api/v1/profiles/:id` - Profil güncelle
- DELETE `/api/v1/profiles/:id` - Profil sil

### Charts
- POST `/api/v1/charts/generate/:profileId` - Doğum haritası oluştur
- GET `/api/v1/charts/profile/:profileId` - Profil haritasını getir
- GET `/api/v1/charts/:chartId/detailed` - Detaylı yorum

### Forecasts
- GET `/api/v1/forecasts/today/:profileId` - Günlük tahmin

### Divination
- POST `/api/v1/tarot/reading` - Tarot falı
- GET `/api/v1/tarot/readings` - Geçmiş okumalar
- POST `/api/v1/coffee-reading` - Kahve falı
- POST `/api/v1/numerology/report` - Numeroloji raporu

### AI Assistant
- POST `/api/v1/ai-assistant/conversation` - Yeni sohbet
- POST `/api/v1/ai-assistant/message` - Mesaj gönder

## Geliştirme Roadmap

### Sprint 1-2 (Hafta 1-4): Core Features
- [x] Authentication sistemi
- [x] Profil yönetimi
- [x] Doğum haritası hesaplama
- [ ] Günlük tahmin sistemi

### Sprint 3-4 (Hafta 5-8): AI & Forecasts
- [ ] OpenAI/Anthropic entegrasyonu
- [ ] AI destekli yorumlar
- [ ] Otomatik günlük tahminler

### Sprint 5-6 (Hafta 9-12): Divination Tools
- [ ] Tarot kart yorumlama
- [ ] Kahve falı görüntü analizi
- [ ] Numeroloji hesaplamaları

### Sprint 7-8 (Hafta 13-16): Polish & Launch
- [ ] Stripe ödeme entegrasyonu
- [ ] Performans optimizasyonu
- [ ] App Store yayınlama

## Ortam Değişkenleri

Backend `.env` dosyası için gerekli değişkenler:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=astrology_db

# JWT
JWT_SECRET=your-secret-key

# AI Services
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Stripe
STRIPE_SECRET_KEY=sk_test_...

# AWS
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
```

## Lisans

MIT

## Destek

Sorularınız için issue açabilirsiniz.
