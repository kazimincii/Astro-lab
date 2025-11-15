# Astrology Backend API

NestJS ile geliştirilmiş astroloji uygulaması backend API'si.

## Kurulum

```bash
npm install
```

## Veritabanı Kurulumu

### PostgreSQL (Docker ile)
```bash
docker run --name astrology-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=astrology_db \
  -p 5432:5432 -d postgres:15
```

### Redis (Docker ile)
```bash
docker run --name astrology-redis -p 6379:6379 -d redis:7
```

## Ortam Değişkenleri

`.env.example` dosyasını `.env` olarak kopyalayın ve gerekli değerleri girin:

```bash
cp .env.example .env
```

## Çalıştırma

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod
```

## Veritabanı Migration

```bash
# Migration oluştur
npm run migration:generate -- src/migrations/MigrationName

# Migration çalıştır
npm run migration:run

# Migration geri al
npm run migration:revert
```

## Test

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## API Dokümantasyonu

Sunucu çalıştıktan sonra API endpoint'lerine http://localhost:3000/api/v1 üzerinden erişebilirsiniz.

## Proje Yapısı

```
src/
├── config/           # Konfigürasyon dosyaları
├── entities/         # TypeORM entity'leri
├── modules/          # Feature modülleri
│   ├── auth/         # Authentication
│   ├── users/        # Kullanıcı yönetimi
│   ├── profiles/     # Profil yönetimi
│   ├── charts/       # Doğum haritası
│   ├── forecasts/    # Günlük tahminler
│   ├── tarot/        # Tarot falı
│   ├── coffee-reading/   # Kahve falı
│   ├── numerology/   # Numeroloji
│   └── ai-assistant/ # AI asistan
├── app.module.ts     # Ana modül
└── main.ts           # Giriş noktası
```

## Önemli Notlar

- Development modunda `synchronize: true` aktiftir (TypeORM otomatik schema oluşturur)
- Production'da migration kullanın
- API anahtarlarını asla commit etmeyin
- Rate limiting varsayılan olarak aktiftir (60 saniyede 100 istek)
