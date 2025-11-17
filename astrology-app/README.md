# Astrology Super App 🌟

Kapsamlı, production-ready astroloji süper uygulaması - Backend API, Mobile App, ve iOS Widgets içeren tam stack proje.

## 🎯 Proje Durumu

### ✅ Tamamlanan Özellikler
- **Backend API**: Production-ready NestJS backend
- **Mobile App**: React Native Expo uygulaması
- **iOS Widgets**: Home screen widget'ları
- **Testing**: Comprehensive test infrastructure
- **Production**: Docker, logging, monitoring, security
- **Documentation**: Detaylı kurulum ve deployment rehberleri

### 📊 Test Coverage
- Backend: 22/23 tests passing (95.6%)
- Mobile: Test infrastructure ready
- E2E: Ready for implementation

## 📁 Proje Yapısı

```
astrology-app/
├── backend/              # NestJS Backend API
│   ├── src/
│   │   ├── modules/      # Feature modules
│   │   ├── entities/     # TypeORM entities
│   │   ├── services/     # Business logic
│   │   ├── common/       # Shared utilities
│   │   └── config/       # Configuration
│   ├── test/             # E2E tests
│   ├── Dockerfile        # Docker configuration
│   └── PRODUCTION.md     # Deployment guide
│
└── mobile/               # React Native Expo App
    ├── src/
    │   ├── screens/      # App screens
    │   ├── hooks/        # Custom hooks
    │   ├── services/     # API services
    │   └── types/        # TypeScript types
    ├── ios-widgets/      # iOS Widget Swift code
    ├── TESTING.md        # Testing guide
    └── IOS_WIDGETS.md    # Widget setup guide
```

## 🌟 Ana Özellikler

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
- Aura scan
- Chakra analizi

### Core Features
- ✅ Doğum haritası hesaplama (Swiss Ephemeris)
- ✅ Günlük burç yorumları
- ✅ Çoklu profil yönetimi
- ✅ Tarot falı
- ✅ Kahve falı (AI görüntü analizi)
- ✅ Numeroloji hesaplamaları
- ✅ AI destekli asistan (OpenAI/Claude)
- ✅ Uyumluluk analizleri
- ✅ Stripe ile ödeme sistemi
- ✅ iOS Home Screen Widgets
- ✅ Deep linking support

## 🚀 Backend Setup

### Gereksinimler
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker (optional)

### Hızlı Başlangıç

```bash
cd backend
npm install

# .env dosyası oluştur
cp .env.example .env
# .env dosyasını düzenle

# Docker ile servisler
docker-compose up -d

# veya manuel
docker run --name astrology-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=astrology_db -p 5432:5432 -d postgres:15
docker run --name astrology-redis -p 6379:6379 -d redis:7

# Geliştirme sunucusu
npm run start:dev

# Testleri çalıştır
npm test

# Build
npm run build
```

Backend http://localhost:3000 adresinde çalışacak.

### Production Deployment

```bash
# Docker ile
docker-compose -f docker-compose.prod.yml up -d

# veya PM2 ile
npm run build
pm2 start dist/main.js -i max

# Detaylı bilgi için
cat PRODUCTION.md
```

## 📱 Mobile Setup

### Gereksinimler
- Node.js 18+
- Expo CLI
- iOS Simulator veya fiziksel cihaz
- Android Studio (Android için)

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

# Testleri çalıştır
npm test
```

### iOS Widgets

iOS 14+ için home screen widget'ları:

```bash
# Expo dev client build
npx expo prebuild --platform ios

# Detaylı kurulum için
cat IOS_WIDGETS.md
```

## 🛠️ Teknoloji Stack

### Backend
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL 15 + TypeORM
- **Cache**: Redis 7
- **Auth**: JWT + Passport
- **AI**: OpenAI GPT-4 / Anthropic Claude
- **Payment**: Stripe
- **Storage**: AWS S3
- **Astrology**: Swiss Ephemeris
- **Testing**: Jest + Supertest
- **Deployment**: Docker + PM2

### Mobile
- **Framework**: React Native 0.73 + Expo 50
- **Styling**: NativeWind (Tailwind CSS)
- **Navigation**: React Navigation 6
- **State**: Zustand
- **Data**: TanStack Query (React Query)
- **API**: Axios
- **Testing**: Jest + React Native Testing Library
- **iOS Widgets**: SwiftUI + WidgetKit

### DevOps & Infrastructure
- **Containerization**: Docker + Docker Compose
- **Process Manager**: PM2
- **Reverse Proxy**: Nginx (example config)
- **Monitoring**: Health checks + Logging
- **Security**: Helmet, CORS, Rate Limiting
- **CI/CD**: Ready for GitHub Actions

## 📚 API Documentation

### Authentication
```http
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh
```

### Profiles
```http
GET    /api/v1/profiles
POST   /api/v1/profiles
GET    /api/v1/profiles/:id
PATCH  /api/v1/profiles/:id
DELETE /api/v1/profiles/:id
```

### Birth Charts
```http
POST /api/v1/charts/generate/:profileId
GET  /api/v1/charts/profile/:profileId
GET  /api/v1/charts/:chartId/detailed
```

### Forecasts
```http
GET /api/v1/forecasts/today/:profileId
GET /api/v1/forecasts/weekly/:profileId
GET /api/v1/forecasts/monthly/:profileId
```

### Divination
```http
POST /api/v1/tarot/reading
GET  /api/v1/tarot/readings
POST /api/v1/coffee-reading
POST /api/v1/numerology/report
```

### AI Assistant
```http
POST /api/v1/ai-assistant/conversation
POST /api/v1/ai-assistant/message
GET  /api/v1/ai-assistant/conversations
```

### Subscriptions
```http
GET  /api/v1/subscriptions/plans
POST /api/v1/subscriptions/subscribe
POST /api/v1/subscriptions/cancel
GET  /api/v1/subscriptions/current
```

### Health Checks
```http
GET /health       # General health
GET /health/ready # Readiness probe
GET /health/live  # Liveness probe
```

## 🔒 Security Features

### Backend
- ✅ Environment variable validation
- ✅ Security headers (Helmet)
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Input validation & sanitization
- ✅ SQL injection prevention (TypeORM)
- ✅ XSS protection
- ✅ JWT token authentication
- ✅ Password hashing (bcrypt)
- ✅ Request logging
- ✅ Error handling

### Mobile
- ✅ Secure token storage
- ✅ API request encryption (HTTPS)
- ✅ Biometric authentication ready
- ✅ Deep linking validation

## 📊 Monitoring & Logging

### Logging
- Structured JSON logs
- Request/response tracking
- Error tracking with stack traces
- Performance metrics
- Sensitive data sanitization

### Metrics
- Response times (P50, P95, P99)
- Error rates
- Database connection pool
- Memory usage
- CPU usage
- Request rates

### Health Checks
- Database connectivity
- Redis connectivity
- Memory usage
- Uptime tracking

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov

# Watch mode
npm run test:watch
```

### Mobile Tests
```bash
cd mobile

# Component tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## 🔧 Environment Variables

### Backend `.env`

```env
# Environment
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=astrology_db

# JWT
JWT_SECRET=your-super-secret-key-min-32-characters
JWT_REFRESH_SECRET=your-refresh-token-secret

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# AI Services
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AWS
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=astrology-dev
AWS_REGION=us-east-1

# CORS
CORS_ORIGIN=http://localhost:19006,http://localhost:8081
```

## 📖 Documentation

### Detailed Guides
- **Backend**: [PRODUCTION.md](backend/PRODUCTION.md) - Deployment guide
- **Mobile**: [TESTING.md](mobile/TESTING.md) - Testing guide
- **iOS Widgets**: [IOS_WIDGETS.md](mobile/IOS_WIDGETS.md) - Widget setup

### API Documentation
- Swagger/OpenAPI: http://localhost:3000/api (planned)
- Postman Collection: Available on request

## 🚢 Production Deployment

### Option 1: Docker

```bash
# Build
docker build -t astrology-backend:latest ./backend

# Run
docker-compose up -d
```

### Option 2: PM2

```bash
cd backend
npm run build
pm2 start dist/main.js -i max --name astrology-api
pm2 save
```

### Option 3: Cloud Platforms
- AWS ECS/Fargate
- Google Cloud Run
- DigitalOcean App Platform
- Heroku

Detaylı bilgi için: [backend/PRODUCTION.md](backend/PRODUCTION.md)

## 🛣️ Roadmap

### ✅ Completed (MVP v1.0)
- [x] Authentication & Authorization
- [x] Profile Management
- [x] Birth Chart Calculation
- [x] Subscription System
- [x] Payment Integration (Stripe)
- [x] Mobile App Infrastructure
- [x] iOS Widgets
- [x] Testing Infrastructure
- [x] Production Deployment Setup
- [x] Error Handling & Logging
- [x] Security Hardening

### 🔄 In Progress
- [ ] AI-powered features enhancement
- [ ] Daily horoscope automation
- [ ] Push notifications

### 📋 Planned (v1.1+)
- [ ] Apple Watch App
- [ ] Android Widgets
- [ ] Social features (share charts)
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Dark/Light theme
- [ ] Offline mode

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Swiss Ephemeris for astronomical calculations
- OpenAI & Anthropic for AI capabilities
- Stripe for payment processing
- The amazing open-source community

## 📞 Support

- 📧 Email: support@astrology-app.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/astrology-app/issues)
- 📖 Docs: [Documentation](https://docs.astrology-app.com)

---

**Built with ❤️ by the Astrology App Team**
