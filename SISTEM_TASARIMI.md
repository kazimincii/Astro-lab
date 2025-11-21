# 🌟 Astrology Super-App - Kapsamlı Sistem Tasarımı ve Mimari

## İçindekiler
1. [Sistem Genel Bakış](#1-sistem-genel-bakış)
2. [Mimari Tasarım](#2-mimari-tasarım)
3. [Teknoloji Stack](#3-teknoloji-stack)
4. [Veri Modeli](#4-veri-modeli)
5. [Güvenlik Mimarisi](#5-güvenlik-mimarisi)
6. [Ölçeklenebilirlik](#6-ölçeklenebilirlik)
7. [Entegrasyonlar](#7-entegrasyonlar)
8. [DevOps ve CI/CD](#8-devops-ve-cicd)

---

## 1. Sistem Genel Bakış

### 1.1 Proje Tanımı

**Astrology Super-App**, kullanıcılara kişiselleştirilmiş astrolojik analizler, günlük burç yorumları, tarot falı, kahve falı, numeroloji, biyoritim takibi, AI destekli astroloji asistanı ve sosyal özellikler sunan kapsamlı bir iOS/Android mobil uygulamasıdır.

### 1.2 Temel Özellikler

#### Astroloji Özellikleri
- **Doğum Haritası Analizi**: Natal chart, Güneş/Ay/Yükselen burç hesaplamaları
- **İleri Seviye Haritalar**: Transit, Progress, Composite, Davison, Solar Return, Lunar Return, Solar Arcs
- **Günlük/Haftalık/Aylık Burç Yorumları**: Kişiselleştirilmiş tahminler
- **Ay Fazları Takibi**: Güncel ay fazı ve etkileri
- **Astro-Harita**: Coğrafi konuma göre astrolojik enerji analizi
- **Kozmik İklim**: Güncel gezegen hareketleri ve etkileri

#### Fal ve Mistik Özellikler
- **Tarot Falı**: 3 kartlık açılımlar ve AI destekli yorumlar
- **Kahve Falı**: Fotoğraf analizi ile kahve falı yorumlama
- **Aura Tarama**: Fotoğraf tabanlı enerji/kişilik analizi
- **Numeroloji**: Yaşam yolu sayısı, kader sayısı hesaplamaları
- **Çakra Analizi**: Enerji merkezi dengeleme rehberi

#### Sağlık ve Wellness
- **Biyoritim Grafikleri**: Fiziksel, duygusal, entelektüel döngüler
- **HealthKit Entegrasyonu**: Biometrik veri senkronizasyonu
- **Günlük (Journal)**: Kozmik olayları ve kişisel deneyimleri kaydetme

#### Sosyal Özellikler
- **Eş Uyumluluğu**: İki kişinin astrolojik uyumu
- **Ruh Eşi Eşleştirme**: Uyumlu kullanıcıları bulma
- **Gizli Sohbet**: Mahremiyet odaklı mesajlaşma
- **Ünlü Benzerliği**: Ünlü kişilerle harita karşılaştırması

#### AI Özellikleri
- **AI Asistan**: Claude/GPT destekli kişisel astroloji danışmanı
- **Yıldızlara Sor**: Soru-cevap özelliği
- **Akıllı Yorumlama**: Bağlama duyarlı astrolojik analizler

#### Platform Özellikleri
- **iOS Widgets**: Kilit ekranı ve ana ekran widget'ları
- **Apple Watch Uygulaması**: Komplikasyonlar ve minimal uygulama
- **Çevrimdışı Mod**: Önbelleklenmiş verilerle çalışma
- **Çoklu Dil**: İngilizce, Türkçe desteği
- **Karanlık Mod**: Göz dostu arayüz

### 1.3 Üyelik Sistemi

#### Üyelik Planları
1. **Basic (Ücretsiz)**
   - 2 Premium Action / gün
   - 2 profil oluşturma
   - Temel burç yorumları
   - Basit doğum haritası

2. **Standard ($10/ay veya $99/yıl)**
   - 4 Premium Action / gün
   - 10 profil oluşturma
   - Gelişmiş haritalar
   - Detaylı yorumlar

3. **Premium ($19/ay veya $189/yıl)**
   - Sınırsız Premium Action
   - 50+ profil
   - Tüm özelliklere erişim
   - Öncelikli destek
   - Özel AI analizleri

#### Premium Actions
Premium action gerektiren işlemler:
- AI asistan sorguları
- Detaylı harita yorumları
- Tarot/Kahve falı yorumları
- Aura tarama
- Gelişmiş uyumluluk raporları
- Özel tahminler

### 1.4 Hedef Kullanıcılar

- **Yaş**: 18-45
- **Cinsiyet**: Ağırlıklı kadın (%75), erkek (%25)
- **İlgi Alanları**: Astroloji, spiritualite, kişisel gelişim, wellness
- **Teknik Seviye**: Orta-yüksek akıllı telefon kullanımı
- **Coğrafya**: Başlangıçta Türkiye, sonra global

---

## 2. Mimari Tasarım

### 2.1 Sistem Mimarisi Genel Bakış

```
┌─────────────────────────────────────────────────────────────────┐
│                        İSTEMCİLER (Clients)                       │
├─────────────────────────────────────────────────────────────────┤
│  iOS App  │  Android App  │  Apple Watch  │  iOS Widgets        │
│  (React Native + Expo)    │  (SwiftUI)    │  (WidgetKit)        │
└────────────┬──────────────┴───────────────┴─────────────────────┘
             │
             │ HTTPS/REST API + WebSocket
             │
┌────────────▼──────────────────────────────────────────────────┐
│                     API GATEWAY / LOAD BALANCER                │
│                    (Rate Limiting, SSL, CORS)                  │
└────────────┬──────────────────────────────────────────────────┘
             │
             │
┌────────────▼──────────────────────────────────────────────────┐
│                    BACKEND SERVİSLERİ (NestJS)                 │
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐          │
│  │   Auth      │  │  Profiles   │  │   Charts     │          │
│  │  Module     │  │   Module    │  │   Module     │          │
│  └─────────────┘  └─────────────┘  └──────────────┘          │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐          │
│  │  Forecasts  │  │  AI Asst.   │  │   Tarot      │          │
│  │   Module    │  │   Module    │  │   Module     │          │
│  └─────────────┘  └─────────────┘  └──────────────┘          │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐          │
│  │ Numerology  │  │ Biorhythm   │  │  Payments    │          │
│  │   Module    │  │   Module    │  │   Module     │          │
│  └─────────────┘  └─────────────┘  └──────────────┘          │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐          │
│  │Relationship │  │   Social    │  │   Widgets    │          │
│  │   Module    │  │   Module    │  │   Module     │          │
│  └─────────────┘  └─────────────┘  └──────────────┘          │
│                                                                 │
└────────────┬──────────────────────────────────────────────────┘
             │
             │
┌────────────▼──────────────────────────────────────────────────┐
│                    CORE SERVİSLER (Core Services)              │
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────┐    ┌──────────────────────┐          │
│  │ Ephemeris Service   │    │   AI Service         │          │
│  │ (Astro Hesaplamalar)│    │ (Claude/OpenAI API)  │          │
│  └─────────────────────┘    └──────────────────────┘          │
│                                                                 │
│  ┌─────────────────────┐    ┌──────────────────────┐          │
│  │  Storage Service    │    │  Email Service       │          │
│  │  (AWS S3)           │    │  (Nodemailer)        │          │
│  └─────────────────────┘    └──────────────────────┘          │
│                                                                 │
└────────────┬──────────────────────────────────────────────────┘
             │
             │
┌────────────▼──────────────────────────────────────────────────┐
│                   VERİ KATMANI (Data Layer)                    │
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐    ┌──────────────────┐                 │
│  │   PostgreSQL     │    │     Redis        │                 │
│  │ (İlişkisel DB)   │    │  (Cache/Queue)   │                 │
│  └──────────────────┘    └──────────────────┘                 │
│                                                                 │
└───────────────────────────────────────────────────────────────┘
             │
             │
┌────────────▼──────────────────────────────────────────────────┐
│                DIŞ SERVİSLER (External Services)               │
├───────────────────────────────────────────────────────────────┤
│  Stripe  │  Firebase  │  CloudKit  │  Apple Push │  Anthropic │
│ (Ödeme)  │ (Analytics)│  (Sync)    │  (Notif.)   │   (AI)     │
└───────────────────────────────────────────────────────────────┘
```

### 2.2 Katmanlı Mimari Detayları

#### 2.2.1 Sunum Katmanı (Presentation Layer)

**Mobil Uygulama (React Native + Expo)**
- **Framework**: React Native 0.73, Expo SDK 50
- **Dil**: TypeScript 5.x
- **Stil**: NativeWind (Tailwind CSS utilities)
- **Navigasyon**: React Navigation 6.x
- **Durum Yönetimi**: Zustand
- **API İletişimi**: Axios + React Query
- **Animasyonlar**: React Native Reanimated

**Ekran Yapısı**:
```
src/
├── screens/
│   ├── auth/              # Giriş, kayıt, onboarding
│   └── main/              # Ana uygulama ekranları
│       ├── today/         # Bugün ekranı
│       ├── profiles/      # Profil yönetimi
│       ├── charts/        # Harita görüntüleme
│       ├── ai-assistant/  # AI asistan chat
│       ├── tarot/         # Tarot falı
│       ├── numerology/    # Numeroloji
│       ├── calendar/      # Kozmik takvim
│       ├── social/        # Sosyal özellikler
│       └── settings/      # Ayarlar
├── components/            # Yeniden kullanılabilir bileşenler
├── navigation/            # Navigasyon yapılandırması
├── hooks/                 # Custom React hooks
├── services/              # API servis çağrıları
├── store/                 # Zustand store'ları
├── types/                 # TypeScript tipleri
├── theme/                 # Renk, tipografi, spacing
├── i18n/                  # Çoklu dil desteği
└── utils/                 # Yardımcı fonksiyonlar
```

**iOS Native Katmanı (Swift + SwiftUI)**
- **Widgets**: WidgetKit ile kilit ekranı/ana ekran widget'ları
- **Watch App**: WatchKit + SwiftUI
- **Data Sync**: App Groups ile veri paylaşımı
- **Connectivity**: WatchConnectivity framework

#### 2.2.2 İş Mantığı Katmanı (Business Logic Layer)

**Backend Modül Yapısı (NestJS)**:

```
src/
├── app.module.ts          # Ana modül
├── main.ts                # Bootstrap
├── config/                # Konfigürasyonlar
│   ├── database.config.ts
│   ├── auth.config.ts
│   ├── ai.config.ts
│   └── app.config.ts
├── entities/              # TypeORM entity'leri (32 adet)
│   ├── user.entity.ts
│   ├── subscription.entity.ts
│   ├── person-profile.entity.ts
│   ├── birth-chart.entity.ts
│   ├── forecast.entity.ts
│   ├── tarot-reading.entity.ts
│   ├── numerology-profile.entity.ts
│   └── ...
├── modules/               # İş mantığı modülleri (31 adet)
│   ├── auth/              # Kimlik doğrulama
│   ├── users/             # Kullanıcı yönetimi
│   ├── profiles/          # Profil işlemleri
│   ├── charts/            # Doğum haritası
│   ├── forecasts/         # Tahminler
│   ├── ai-assistant/      # AI asistan
│   ├── tarot/             # Tarot falı
│   ├── coffee-reading/    # Kahve falı
│   ├── numerology/        # Numeroloji
│   ├── biorhythm/         # Biyoritim
│   ├── chakras/           # Çakra analizi
│   ├── aura-scan/         # Aura tarama
│   ├── relationship/      # İlişki uyumu
│   ├── soulmate/          # Ruh eşi eşleştirme
│   ├── education/         # Eğitim içeriği
│   ├── journal/           # Günlük
│   ├── calendars/         # Kozmik takvim
│   ├── astro-events/      # Astrolojik olaylar
│   ├── astro-map/         # Astro harita
│   ├── cosmic-climate/    # Kozmik iklim
│   ├── advanced-charts/   # İleri seviye haritalar
│   ├── famous-people/     # Ünlü benzerliği
│   ├── health/            # Sağlık entegrasyonu
│   ├── widgets/           # Widget veri sağlama
│   ├── payments/          # Ödeme işlemleri
│   ├── subscriptions/     # Abonelik yönetimi
│   ├── subscription-plans/# Plan tanımları
│   ├── trials/            # Deneme süreleri
│   ├── actions/           # Premium action takibi
│   ├── live-services/     # Canlı servisler
│   └── mail/              # E-posta servisi
├── services/              # Paylaşılan servisler
│   └── ephemeris.service.ts # Astro hesaplamalar
└── common/                # Ortak bileşenler
    ├── guards/            # Auth guard'lar
    ├── decorators/        # Custom decorator'lar
    ├── filters/           # Exception filter'lar
    ├── interceptors/      # HTTP interceptor'lar
    └── pipes/             # Validation pipe'lar
```

**Temel Modül İşlevleri**:

1. **Auth Module**: JWT tabanlı kimlik doğrulama, token yönetimi
2. **Profiles Module**: Kişi profilleri, doğum bilgileri yönetimi
3. **Charts Module**: Doğum haritası hesaplama ve saklama
4. **Forecasts Module**: Günlük/haftalık/aylık tahmin üretme
5. **AI Assistant Module**: Claude/GPT entegrasyonu, context yönetimi
6. **Subscription Module**: Plan yönetimi, yükseltme/düşürme
7. **Actions Module**: Premium action limitlerini izleme

#### 2.2.3 Veri Erişim Katmanı (Data Access Layer)

**TypeORM Yapılandırması**:
- Connection pooling
- Migration yönetimi
- Entity relationships
- Query optimization
- Transaction yönetimi

**Redis Kullanımı**:
- Session cache
- API response cache
- Rate limiting
- Job queue (Bull MQ)

---

## 3. Teknoloji Stack

### 3.1 Frontend Teknolojileri

#### Mobil Uygulama
| Kategori | Teknoloji | Versiyon | Açıklama |
|----------|-----------|----------|----------|
| Framework | React Native | 0.73.x | Cross-platform mobil uygulama |
| SDK | Expo | 50.x | Yönetilen workflow |
| Dil | TypeScript | 5.x | Tip güvenliği |
| Navigasyon | React Navigation | 6.x | Ekran yönlendirme |
| Stil | NativeWind | 4.x | Tailwind CSS utilities |
| Durum | Zustand | 4.x | Hafif state management |
| API | React Query | 5.x | Server state yönetimi |
| HTTP | Axios | 1.6.x | HTTP istemcisi |
| Animasyon | Reanimated | 4.x | Performanslı animasyonlar |
| Gesture | RN Gesture Handler | 2.x | Dokunma etkileşimleri |
| i18n | react-i18next | 13.x | Çoklu dil |
| Ödeme | Stripe SDK | 0.50.x | Ödeme entegrasyonu |
| Fotoğraf | Expo Image Picker | 17.x | Kamera/galeri erişimi |
| Font | Expo Font | 14.x | Özel fontlar |

#### iOS Native
| Kategori | Teknoloji | Açıklama |
|----------|-----------|----------|
| Dil | Swift 5.x | iOS native kod |
| UI | SwiftUI | Deklaratif UI framework |
| Widgets | WidgetKit | Kilit/ana ekran widget'ları |
| Watch | WatchKit | Apple Watch uygulaması |
| Sync | WatchConnectivity | Watch-Phone veri senkr |
| Data | App Groups | Uygulama arası veri paylaşımı |
| Health | HealthKit | Sağlık verisi entegrasyonu |
| Storage | UserDefaults | Lokal tercihler |
| Cloud | CloudKit | iCloud senkronizasyon |

### 3.2 Backend Teknolojileri

| Kategori | Teknoloji | Versiyon | Açıklama |
|----------|-----------|----------|----------|
| Runtime | Node.js | 18.x LTS | JavaScript runtime |
| Framework | NestJS | 10.x | Enterprise framework |
| Dil | TypeScript | 5.x | Tip güvenliği |
| ORM | TypeORM | 0.3.x | Object-relational mapping |
| Database | PostgreSQL | 15.x | İlişkisel veritabanı |
| Cache | Redis | 7.x | In-memory cache/queue |
| Auth | Passport | 0.7.x | Kimlik doğrulama |
| JWT | @nestjs/jwt | 10.x | Token yönetimi |
| Validation | class-validator | 0.14.x | DTO validasyonu |
| API Docs | Swagger | 7.x | OpenAPI dokümantasyonu |
| Schedule | @nestjs/schedule | 4.x | Cron job'lar |
| Rate Limit | @nestjs/throttler | 5.x | API rate limiting |
| Email | Nodemailer | 7.x | E-posta gönderimi |
| Storage | AWS SDK | 2.x | S3 object storage |
| AI | Anthropic SDK | 0.12.x | Claude AI entegrasyonu |
| AI Alt. | OpenAI SDK | 4.x | GPT entegrasyonu |
| Payment | Stripe SDK | Latest | Ödeme işlemleri |
| Security | Helmet | 8.x | HTTP güvenlik headers |
| Hashing | bcrypt | 5.x | Şifre hashleme |

### 3.3 DevOps ve Altyapı

| Kategori | Teknoloji | Açıklama |
|----------|-----------|----------|
| Build | EAS Build | Expo build servisi |
| CI/CD | GitHub Actions | Otomatik build/test/deploy |
| Testing | Detox | E2E test framework |
| Unit Test | Jest | JavaScript test runner |
| Container | Docker | Konteynerizasyon |
| Orchestration | Docker Compose | Multi-container apps |
| Distribution | TestFlight | Beta testing |
| Store | App Store Connect | iOS uygulama dağıtımı |
| Monitoring | Firebase Analytics | Kullanım metrikleri |
| Crash | Sentry (optional) | Hata izleme |
| Version Control | Git | Kod versiyonlama |
| Repository | GitHub | Kod barındırma |

### 3.4 Dış Servis Entegrasyonları

| Servis | Amaç | API |
|--------|------|-----|
| Stripe | Ödeme işleme | REST API |
| Anthropic Claude | AI asistan | REST API |
| OpenAI GPT | AI alternatif | REST API |
| AWS S3 | Fotoğraf depolama | SDK |
| Firebase | Analytics, push | SDK |
| Apple Push Notification | Bildirimler | APNs |
| CloudKit | iCloud sync | SDK |
| HealthKit | Sağlık verileri | SDK |
| App Store | Uygulama dağıtım | - |

---

## 4. Veri Modeli

### 4.1 Ana Entity'ler ve İlişkiler

```
┌──────────────┐
│     User     │
└──────┬───────┘
       │
       │ 1:1
       ▼
┌──────────────────┐
│  Subscription    │
└──────────────────┘
       │
       │ 1:n
       ▼
┌──────────────────┐       1:n      ┌──────────────────┐
│ PersonProfile    │◄────────────────│   BirthChart     │
└──────────────────┘                 └──────────────────┘
       │
       │ 1:n                          1:n
       ▼                              ▼
┌──────────────────┐         ┌──────────────────┐
│   Forecast       │         │ TarotReading     │
└──────────────────┘         └──────────────────┘
       
       │ 1:n                          1:n
       ▼                              ▼
┌──────────────────┐         ┌──────────────────┐
│ NumerologyProfile│         │ CoffeeReading    │
└──────────────────┘         └──────────────────┘
```

### 4.2 Temel Entity Yapıları

#### User Entity
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;  // bcrypt hash

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ default: 'en' })
  language: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToOne(() => Subscription)
  subscription: Subscription;

  @OneToMany(() => PersonProfile, profile => profile.user)
  profiles: PersonProfile[];

  @OneToMany(() => AIChatThread, thread => thread.user)
  chatThreads: AIChatThread[];

  @OneToMany(() => Journal, entry => entry.user)
  journalEntries: Journal[];
}
```

#### Subscription Entity
```typescript
@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => SubscriptionPlan)
  plan: SubscriptionPlan;

  @Column({ default: 'active' })
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';

  @Column({ type: 'timestamp', nullable: true })
  trialEndsAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  currentPeriodStart: Date;

  @Column({ type: 'timestamp', nullable: true })
  currentPeriodEnd: Date;

  @Column({ nullable: true })
  stripeCustomerId: string;

  @Column({ nullable: true })
  stripeSubscriptionId: string;

  @Column({ type: 'int', default: 0 })
  dailyActionsUsed: number;

  @Column({ type: 'date' })
  lastActionResetDate: Date;
}
```

#### PersonProfile Entity
```typescript
@Entity('person_profiles')
export class PersonProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.profiles)
  user: User;

  @Column()
  name: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ type: 'time' })
  birthTime: string;

  @Column()
  birthPlace: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @Column({ nullable: true })
  timezone: string;

  @Column({ default: false })
  isPrimary: boolean;

  @OneToMany(() => BirthChart, chart => chart.profile)
  charts: BirthChart[];

  @OneToMany(() => Forecast, forecast => forecast.profile)
  forecasts: Forecast[];

  @OneToOne(() => NumerologyProfile)
  numerologyProfile: NumerologyProfile;
}
```

#### BirthChart Entity
```typescript
@Entity('birth_charts')
export class BirthChart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PersonProfile, profile => profile.charts)
  profile: PersonProfile;

  @Column({ type: 'jsonb' })
  planets: {
    sun: { sign: string; degree: number; house: number };
    moon: { sign: string; degree: number; house: number };
    mercury: { sign: string; degree: number; house: number };
    // ... diğer gezegenler
  };

  @Column({ type: 'jsonb' })
  houses: Array<{ sign: string; degree: number }>;

  @Column({ type: 'jsonb' })
  aspects: Array<{
    planet1: string;
    planet2: string;
    type: string;
    orb: number;
  }>;

  @Column({ type: 'jsonb' })
  specialPoints: {
    ascendant: { sign: string; degree: number };
    midheaven: { sign: string; degree: number };
    northNode: { sign: string; degree: number };
    southNode: { sign: string; degree: number };
  };

  @Column({ type: 'text', nullable: true })
  aiInterpretation: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  calculatedAt: Date;
}
```

### 4.3 Diğer Önemli Entity'ler

- **SubscriptionPlan**: Üyelik planı tanımları (Basic, Standard, Premium)
- **TarotReading**: Tarot falı kayıtları ve yorumları
- **CoffeeReading**: Kahve falı görselleri ve AI yorumları
- **NumerologyProfile**: Numeroloji hesaplamaları
- **BiorhythmChart**: Biyoritim grafik verileri
- **ChakraAnalysis**: Çakra dengeleme sonuçları
- **AuraReading**: Aura tarama sonuçları
- **CompatibilityReport**: İlişki uyum raporları
- **Forecast**: Günlük/haftalık/aylık tahminler
- **AIChatThread**: AI asistan sohbet geçmişi
- **AIChatMessage**: AI sohbet mesajları
- **Journal**: Kullanıcı günlük kayıtları
- **AstroEvent**: Kozmik olaylar takvimi
- **EducationContent**: Eğitim içeriği
- **FamousPerson**: Ünlü kişiler veritabanı
- **LiveSession**: Canlı astroloji seansları
- **Payment**: Ödeme kayıtları

### 4.4 Veri İlişkileri

```
User (1) ──── (1) Subscription ──── (n) SubscriptionPlan
  │
  ├── (n) PersonProfile
  │       │
  │       ├── (n) BirthChart
  │       ├── (n) Forecast
  │       ├── (n) TarotReading
  │       ├── (n) CoffeeReading
  │       ├── (1) NumerologyProfile
  │       ├── (n) BiorhythmChart
  │       └── (n) CompatibilityReport
  │
  ├── (n) AIChatThread
  │       └── (n) AIChatMessage
  │
  ├── (n) Journal
  ├── (n) Payment
  └── (n) AuraReading
```

---

## 5. Güvenlik Mimarisi

### 5.1 Kimlik Doğrulama (Authentication)

#### JWT Token Sistemi
- **Access Token**: 15 dakika geçerlilik
- **Refresh Token**: 7 gün geçerlilik
- **Token Yapısı**:
  ```json
  {
    "userId": "uuid",
    "email": "user@example.com",
    "subscriptionPlan": "premium",
    "iat": 1234567890,
    "exp": 1234568790
  }
  ```

#### Şifre Güvenliği
- bcrypt ile şifreleme (cost factor: 10)
- Minimum şifre uzunluğu: 8 karakter
- Şifre gereksinimleri: En az 1 büyük, 1 küçük, 1 rakam

#### OAuth 2.0 Entegrasyonu (İsteğe Bağlı)
- Apple Sign In
- Google Sign In
- Facebook Sign In

### 5.2 Yetkilendirme (Authorization)

#### Role-Based Access Control (RBAC)
- **User**: Standart kullanıcı
- **Premium User**: Premium abonesi
- **Admin**: Sistem yöneticisi
- **Moderator**: İçerik moderatörü

#### Guard Mekanizması
```typescript
@UseGuards(JwtAuthGuard, SubscriptionGuard)
@RequireSubscription('premium')
@Post('advanced-analysis')
async getAdvancedAnalysis() {
  // Sadece premium kullanıcılar erişebilir
}
```

### 5.3 API Güvenliği

#### Rate Limiting
- Genel endpoint'ler: 100 istek/dakika
- AI endpoint'leri: 10 istek/dakika
- Auth endpoint'leri: 5 istek/dakika

#### CORS Yapılandırması
```typescript
app.enableCors({
  origin: ['https://app.astrology.com', 'exp://'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});
```

#### HTTP Güvenlik Headers (Helmet)
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security

### 5.4 Veri Güvenliği

#### Veri Şifreleme
- **At Rest**: PostgreSQL şifreleme
- **In Transit**: TLS 1.3
- **Sensitive Data**: AES-256 şifreleme

#### Kişisel Veri Koruma (GDPR/KVKK)
- Kullanıcı onayı toplama
- Veri silme talebi işleme
- Veri ihracı (export) özelliği
- Anonimleştirme

#### API Key Yönetimi
- Tüm API key'ler environment variable'larda
- Key rotasyonu politikası
- Ayrı key'ler: dev, staging, production

### 5.5 Mobil Güvenlik

#### iOS Güvenliği
- Certificate pinning
- Keychain kullanımı (hassas veriler için)
- App Transport Security (ATS)
- Jailbreak detection (opsiyonel)

#### Güvenli Depolama
- Expo SecureStore ile token saklama
- Biometric authentication desteği
- Session timeout (30 dakika)

---

## 6. Ölçeklenebilirlik

### 6.1 Yatay Ölçeklendirme (Horizontal Scaling)

#### Backend Ölçeklendirmesi
```
        ┌─────────────┐
        │Load Balancer│
        └──────┬──────┘
               │
       ┌───────┼───────┐
       │       │       │
   ┌───▼───┐ ┌▼────┐ ┌▼────┐
   │ API   │ │ API │ │ API │
   │Server1│ │Srv 2│ │Srv 3│
   └───────┘ └─────┘ └─────┘
       │       │       │
       └───────┼───────┘
               │
        ┌──────▼──────┐
        │  Database   │
        │   Cluster   │
        └─────────────┘
```

#### Stateless Servisler
- JWT kullanımı (session yok)
- Redis'te merkezi cache
- Tüm state veritabanında

### 6.2 Veritabanı Ölçeklendirmesi

#### Read Replicas
- Master-Slave replikasyon
- Okuma işlemleri replica'lara
- Yazma işlemleri master'a

#### Partitioning/Sharding
- Kullanıcı ID'sine göre sharding
- Bölge bazlı sharding (opsiyonel)

#### Connection Pooling
- PgBouncer kullanımı
- Max pool size: 20 connection per instance

### 6.3 Caching Stratejileri

#### Redis Cache Katmanları
1. **User Session**: 30 dakika TTL
2. **API Responses**: 5-60 dakika TTL
3. **Static Data**: 24 saat TTL
4. **Astro Calculations**: 1 saat TTL

#### Cache Invalidation
- TTL tabanlı otomatik temizleme
- Event-based invalidation
- Manual purge API

### 6.4 CDN Kullanımı

#### Statik İçerik Dağıtımı
- Resim ve avatar'lar
- Eğitim içeriği görselleri
- App icon ve asset'ler

#### CloudFront/CloudFlare
- Global edge locations
- Otomatik image optimization
- DDoS koruması

### 6.5 Asenkron İşlemler

#### Job Queue (Bull MQ + Redis)
```typescript
// Örnek: Ağır AI hesaplamaları
@Process('ai-analysis')
async processAIAnalysis(job: Job) {
  const { userId, chartData } = job.data;
  
  // Ağır AI işlemi
  const analysis = await this.aiService.generateAnalysis(chartData);
  
  // Sonucu kaydet
  await this.chartsService.saveAnalysis(userId, analysis);
  
  // Bildirim gönder
  await this.notificationService.send(userId, 'Analysis ready!');
}
```

#### Zamanlanmış İşler (Cron Jobs)
- Günlük burç yorumları oluşturma (00:01)
- Ay fazı güncellemeleri (her saat)
- Premium action limiti sıfırlama (00:00)
- Abonelik durumu kontrolü (günlük)
- Bildirim gönderimi (planlı)

### 6.6 Performans Metrikleri

#### Hedef SLA'lar
- **API Response Time**: < 200ms (p95)
- **Database Query Time**: < 50ms (p95)
- **AI Response Time**: < 3s
- **Uptime**: 99.9%
- **Error Rate**: < 0.1%

#### Monitoring
- APM (Application Performance Monitoring)
- Real-time alerting
- Custom metrics dashboard

---

## 7. Entegrasyonlar

### 7.1 Ödeme Entegrasyonu (Stripe)

#### Abonelik Akışı
```
1. User seçim yapar (Standard/Premium)
2. Frontend Stripe Checkout oluşturur
3. User ödeme bilgilerini girer
4. Stripe webhook backend'e bildirir
5. Backend subscription kaydı oluşturur
6. User'a başarı bildirimi gönderilir
```

#### Webhook Olayları
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

#### Stripe Entities
- Customer: Her user için
- Product: Subscription plan'ları
- Price: Monthly/Yearly fiyatlar
- Subscription: Aktif abonelikler

### 7.2 AI Entegrasyonu

#### Anthropic Claude
```typescript
const analysis = await anthropic.messages.create({
  model: 'claude-3-opus-20240229',
  max_tokens: 1024,
  messages: [
    {
      role: 'user',
      content: `Analyze this birth chart: ${chartData}`
    }
  ],
  system: 'You are an expert astrologer...'
});
```

#### OpenAI GPT (Alternatif)
```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: [
    { role: 'system', content: 'You are an expert astrologer' },
    { role: 'user', content: `Analyze: ${chartData}` }
  ]
});
```

#### Vision API (Kahve Falı/Aura)
- GPT-4 Vision
- Claude 3 Vision
- Fotoğraf + prompt → Yorum

### 7.3 Cloud Storage (AWS S3)

#### Bucket Yapısı
```
astrology-app-production/
├── avatars/
│   └── {userId}/avatar.jpg
├── coffee-readings/
│   └── {readingId}/cup-{n}.jpg
├── aura-scans/
│   └── {scanId}/photo.jpg
└── education/
    └── {contentId}/image.jpg
```

#### Upload Akışı
1. Client pre-signed URL talep eder
2. Backend S3'ten pre-signed URL alır
3. Client direkt S3'e upload eder
4. Upload bitince backend'e notify edilir
5. URL database'e kaydedilir

### 7.4 Push Notifications

#### Apple Push Notification Service (APNs)
- Token registration
- Silent notifications (data sync)
- User-facing notifications

#### Bildirim Türleri
- Günlük burç yorumu hazır
- AI analizi tamamlandı
- Ay fazı değişti
- Önemli astrolojik olay
- Abonelik yenilenme hatırlatması
- Sohbet mesajı (social)

### 7.5 Analytics (Firebase)

#### Tracked Events
```typescript
// Örnek event tracking
analytics.logEvent('chart_calculated', {
  chart_type: 'natal',
  user_plan: 'premium',
  calculation_time_ms: 1234
});
```

#### Key Metrics
- DAU/MAU
- Retention rates
- Feature usage
- Conversion funnel
- Premium action usage
- Subscription conversions

### 7.6 HealthKit Entegrasyonu

#### Veri Okuma
- Uyku verileri
- Kalp hızı
- Adım sayısı
- Meditasyon süreleri

#### Biorhythm Korelasyonu
- Fiziksel biyoritim ↔ Aktivite seviyeleri
- Duygusal biyoritim ↔ Stres seviyeleri
- Entellektüel biyoritim ↔ Odaklanma

### 7.7 CloudKit Sync

#### Senkronize Edilen Veriler
- Profil bilgileri
- Favoriler ve ayarlar
- Journal kayıtları
- Offline cache

#### Çakışma Çözümü
- Last-write-wins stratejisi
- Conflict resolution UI
- Automatic merge

---

## 8. DevOps ve CI/CD

### 8.1 Geliştirme Workflow'u

#### Branching Strategy
```
main (production)
  ├── develop (staging)
  │   ├── feature/new-tarot-deck
  │   ├── feature/improved-ai-prompts
  │   └── bugfix/chart-calculation-fix
  └── hotfix/critical-payment-bug
```

#### Commit Convention
```
feat: Add new tarot deck
fix: Correct birth chart calculation
docs: Update API documentation
test: Add E2E tests for AI assistant
chore: Upgrade dependencies
```

### 8.2 CI/CD Pipeline (GitHub Actions)

#### Workflow Aşamaları
```yaml
name: Mobile CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Install dependencies
      - Run ESLint
      - Run TypeScript check
      - Run unit tests
      - Upload coverage
  
  build-ios:
    runs-on: macos-latest
    needs: lint-and-test
    steps:
      - Checkout code
      - Setup EAS
      - Build with EAS
      - Upload artifact
  
  e2e-tests:
    runs-on: macos-latest
    needs: build-ios
    steps:
      - Run Detox framework cache build
      - Run Detox tests
      - Upload test results
  
  deploy-testflight:
    if: github.ref == 'refs/heads/main'
    needs: e2e-tests
    runs-on: ubuntu-latest
    steps:
      - Submit to TestFlight
      - Notify team
```

### 8.3 Environment'lar

#### Development
- Local development
- Mock API'ler
- Debug mode aktif
- Hot reload

#### Staging
- EAS Build
- TestFlight Internal
- Gerçek API (staging)
- Test data

#### Production
- EAS Build (release)
- App Store
- Gerçek API (production)
- Real users

### 8.4 Secrets Management

#### GitHub Secrets
```
EXPO_TOKEN
APPLE_ID
APPLE_APP_SPECIFIC_PASSWORD
STRIPE_SECRET_KEY
ANTHROPIC_API_KEY
OPENAI_API_KEY
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
DATABASE_URL
REDIS_URL
JWT_SECRET
```

#### Environment Variables
```env
# .env.production
API_URL=https://api.astrology.app
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
FIREBASE_CONFIG={"apiKey": "xxx"}
```

### 8.5 Deployment Stratejisi

#### Backend Deployment
```bash
# Docker build
docker build -t astrology-backend:latest .

# Docker Compose deployment
docker-compose up -d

# Health check
curl https://api.astrology.app/health
```

#### Mobil Deployment
```bash
# EAS Build
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios --latest

# Monitor build
eas build:list
```

#### Database Migration
```bash
# Generate migration
npm run migration:generate -- MigrationName

# Run migration
npm run migration:run

# Rollback if needed
npm run migration:revert
```

### 8.6 Monitoring ve Logging

#### Application Monitoring
- Health check endpoints
- Performance metrics
- Error tracking (Sentry)
- User analytics (Firebase)

#### Infrastructure Monitoring
- CPU/Memory usage
- Network traffic
- Database connections
- Redis memory

#### Logging Strategy
```typescript
// Structured logging
logger.info('User login', {
  userId: user.id,
  email: user.email,
  timestamp: new Date(),
  ip: request.ip
});

logger.error('Payment failed', {
  userId: user.id,
  error: error.message,
  stack: error.stack,
  stripeCustomerId: customer.id
});
```

### 8.7 Backup ve Disaster Recovery

#### Database Backup
- Otomatik daily backup
- Point-in-time recovery
- Cross-region replication
- Backup retention: 30 gün

#### Disaster Recovery Plan
1. **RTO** (Recovery Time Objective): 4 saat
2. **RPO** (Recovery Point Objective): 1 saat
3. **Backup restore** procedure documented
4. **Failover** procedure tested quarterly

---

## 9. Test Stratejisi

### 9.1 Test Piramidi

```
            /\
           /  \
          / E2E \ (10%)
         /------\
        /        \
       /Integration\ (30%)
      /------------\
     /              \
    /      Unit      \ (60%)
   /------------------\
```

### 9.2 Backend Testleri

#### Unit Tests (Jest)
```typescript
describe('ChartService', () => {
  it('should calculate natal chart correctly', async () => {
    const profile = {
      birthDate: '1990-01-01',
      birthTime: '12:00',
      latitude: 41.0082,
      longitude: 28.9784
    };
    
    const chart = await chartService.calculate(profile);
    
    expect(chart.planets.sun.sign).toBe('Capricorn');
    expect(chart.planets.sun.house).toBe(10);
  });
});
```

#### Integration Tests
```typescript
describe('Subscription API', () => {
  it('should upgrade user to premium', async () => {
    const response = await request(app)
      .post('/subscriptions/upgrade')
      .set('Authorization', `Bearer ${token}`)
      .send({ plan: 'premium' })
      .expect(200);
    
    expect(response.body.plan).toBe('premium');
  });
});
```

#### E2E Tests
```typescript
describe('Auth Flow', () => {
  it('should register, login, and access protected route', async () => {
    // Register
    await request(app)
      .post('/auth/register')
      .send({ email: 'test@test.com', password: 'Test123!' })
      .expect(201);
    
    // Login
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ email: 'test@test.com', password: 'Test123!' })
      .expect(200);
    
    const token = loginResponse.body.accessToken;
    
    // Access protected route
    await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
```

### 9.3 Mobile Testleri

#### Component Tests (React Native Testing Library)
```typescript
describe('ProfileCard', () => {
  it('should render profile information', () => {
    const profile = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      sign: 'Capricorn'
    };
    
    const { getByText } = render(<ProfileCard profile={profile} />);
    
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Capricorn')).toBeTruthy();
  });
});
```

#### E2E Tests (Detox)
```typescript
describe('Auth Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should login successfully', async () => {
    await element(by.id('email-input')).typeText('test@test.com');
    await element(by.id('password-input')).typeText('Test123!');
    await element(by.id('login-button')).tap();
    
    await expect(element(by.id('home-screen'))).toBeVisible();
  });

  it('should calculate birth chart', async () => {
    await element(by.id('profiles-tab')).tap();
    await element(by.id('add-profile-button')).tap();
    
    await element(by.id('name-input')).typeText('John Doe');
    await element(by.id('birthdate-picker')).tap();
    // ... date selection
    
    await element(by.id('calculate-chart-button')).tap();
    
    await expect(element(by.id('chart-view'))).toBeVisible();
  });
});
```

### 9.4 Test Coverage Hedefleri

- **Backend**: > 80% coverage
- **Frontend**: > 70% coverage
- **E2E**: Kritik user flow'lar (40+ test)

---

## 10. Sonuç ve Özet

### 10.1 Sistem Özellikleri Özeti

**Astrology Super-App** modern bir full-stack mobil uygulama olup şu özelliklere sahiptir:

✅ **Cross-platform**: React Native ile iOS ve Android desteği
✅ **Native entegrasyonlar**: iOS Widgets, Apple Watch, HealthKit
✅ **AI destekli**: Claude/GPT ile akıllı yorumlama
✅ **Ölçeklenebilir**: Modüler mimari, yatay ölçeklendirme
✅ **Güvenli**: JWT auth, şifreleme, GDPR uyumlu
✅ **Test edilmiş**: %80+ coverage, 40+ E2E test
✅ **Profesyonel**: CI/CD, monitoring, logging

### 10.2 Mimari Kararlar

1. **Monolitik Backend** (şu an) → Microservices (gelecek)
2. **PostgreSQL** → İlişkisel veri için ideal
3. **Redis** → Cache ve job queue için
4. **React Native + Expo** → Hızlı development, cross-platform
5. **NestJS** → Enterprise-grade backend framework
6. **TypeScript** → Type safety, maintainability

### 10.3 Gelecek Yol Haritası

#### v1.1 (Q1 2025)
- Android App Store release
- Push notification optimization
- Performance improvements
- Bug fixes

#### v1.2 (Q2 2025)
- Social features expansion
- Live astrologer consultations
- Group horoscopes
- Advanced search

#### v2.0 (Q3 2025)
- Microservices migration
- GraphQL API
- Real-time features (WebSocket)
- Multi-language expansion

#### v3.0 (Q4 2025)
- AI model fine-tuning
- Personalized learning paths
- Community features
- Web app launch

### 10.4 Başarı Metrikleri

**İlk 3 ay hedefleri:**
- 10,000+ indirme
- 1,000+ aktif kullanıcı
- %20 premium conversion
- %40 7-gün retention
- 4.5+ App Store rating

**SLA Hedefleri (Service Level Agreement):**
- 99.9% uptime
- <200ms API response
- <0.1% error rate
- <3s AI response time

---

## 11. Ekler

### 11.1 Faydalı Komutlar

#### Backend
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod

# Tests
npm test
npm run test:e2e
npm run test:cov

# Database
npm run migration:generate -- MigrationName
npm run migration:run
```

#### Mobile
```bash
# Development
npm start
npm run ios
npm run android

# Tests
npm test
npm run detox:build
npm run detox:test

# Build
eas build --platform ios
eas submit --platform ios
```

### 11.2 Önemli URL'ler

**Gerçek URL'ler:**
- **Repository**: https://github.com/kazimincii/Astro-lab

**Örnek URL Formatları (environment'a göre değişir):**
- **API Docs**: https://api.{environment}.astrology.app/docs
- **Admin Panel**: https://admin.{environment}.astrology.app
- **App Store**: https://apps.apple.com/app/{app-id}

### 11.3 İletişim

- **Teknik Sorular**: GitHub Issues
- **Bug Raporları**: GitHub Issues (bug template)
- **Feature İstekleri**: GitHub Discussions
- **Email**: support@astrology.app

---

**Doküman Versiyonu**: 1.0
**Son Güncelleme**: 21 Kasım 2024
**Hazırlayan**: Sistem Tasarımcısı
**Durum**: ✅ Üretim Hazır
