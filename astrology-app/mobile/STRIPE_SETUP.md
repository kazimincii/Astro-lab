# Stripe Payment Integration Setup Guide

Bu rehber, Astrology App'de Stripe ödeme entegrasyonunu yapılandırmak için gerekli adımları açıklar.

## 📋 İçindekiler

1. [Stripe Hesabı Kurulumu](#stripe-hesabı-kurulumu)
2. [API Anahtarları](#api-anahtarları)
3. [Ürün ve Fiyat Yapılandırması](#ürün-ve-fiyat-yapılandırması)
4. [Webhook Kurulumu](#webhook-kurulumu)
5. [Mobile Konfigürasyon](#mobile-konfigürasyon)
6. [Test Etme](#test-etme)
7. [Production'a Geçiş](#productiona-geçiş)

---

## Stripe Hesabı Kurulumu

### 1. Stripe Hesabı Oluştur

1. [stripe.com](https://stripe.com) adresine git
2. "Start now" butonuna tıkla
3. Email ve şifre ile hesap oluştur
4. Dashboard'a giriş yap

### 2. İşletme Bilgilerini Tamamla

1. Dashboard → Settings → Account details
2. İşletme bilgilerini doldur:
   - Business name: "Astrology App"
   - Business type: Seç (SaaS/Mobile App)
   - Country: Türkiye
3. Banka hesabı bilgilerini ekle (ödemeleri almak için)

---

## API Anahtarları

### Test Anahtarları (Development)

1. Dashboard → Developers → API keys
2. **Publishable key** (pk_test_...) ve **Secret key** (sk_test_...) kopyala
3. Mobile `.env` dosyasına ekle:

```env
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

4. Backend `.env` dosyasına ekle:

```env
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Production Anahtarları (Canlı)

⚠️ **Dikkat**: Production anahtarlarını sadece canlıya geçerken kullan!

1. Dashboard → Toggle "Test mode" to "Live mode"
2. Live keys'i al (pk_live_... ve sk_live_...)
3. Production environment'a ekle

---

## Ürün ve Fiyat Yapılandırması

### 1. Ürünleri Oluştur

Dashboard → Products → Add product:

#### Standard Plan
- **Name**: Standard Plan
- **Description**: "4 daily actions, 10 profiles, advanced charts"
- **Pricing**:
  - Monthly: $10/month (recurring)
  - Yearly: $100/year (recurring)

#### Premium Plan
- **Name**: Premium Plan
- **Description**: "Unlimited actions, 50 profiles, pro features"
- **Pricing**:
  - Monthly: $19/month (recurring)
  - Yearly: $180/year (recurring)

### 2. Price ID'leri Kaydet

Her fiyat için bir Price ID oluşur (price_...). Bu ID'leri şurada kullan:

**Mobile**: `src/config/stripe.ts`

```typescript
export const STRIPE_PLAN_IDS = {
  basic: {
    monthly: 'price_free',
    yearly: 'price_free',
  },
  standard: {
    monthly: 'price_1234567890ABC', // Buraya gerçek Price ID
    yearly: 'price_0987654321XYZ',
  },
  premium: {
    monthly: 'price_ABCDEFGHIJKLM',
    yearly: 'price_NOPQRSTUVWXYZ',
  },
};
```

**Backend**: Environment variables veya config dosyasında sakla

---

## Webhook Kurulumu

Webhook'lar, Stripe'dan gelen ödeme event'lerini işlemek için gereklidir.

### 1. Webhook Endpoint Oluştur (Backend)

Backend'de şu endpoint'i implement et:

```typescript
POST /api/webhooks/stripe

// Event'ler:
- payment_intent.succeeded
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_failed
```

### 2. Stripe Dashboard'da Webhook Ekle

1. Dashboard → Developers → Webhooks
2. "Add endpoint" butonuna tıkla
3. Endpoint URL:
   - **Development**: `https://your-ngrok-url.ngrok.io/api/webhooks/stripe`
   - **Production**: `https://api.astrology.com/api/webhooks/stripe`
4. Event'leri seç:
   - `payment_intent.succeeded`
   - `customer.subscription.*` (all subscription events)
   - `invoice.payment_failed`
5. Webhook secret'ı kopyala (whsec_...)
6. Backend `.env`'e ekle: `STRIPE_WEBHOOK_SECRET=whsec_...`

### 3. Webhook Signature Doğrulama (Backend)

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      // Ödeme başarılı
      await handlePaymentSuccess(event.data.object);
      break;
    case 'customer.subscription.created':
      // Abonelik oluşturuldu
      await handleSubscriptionCreated(event.data.object);
      break;
    // ... diğer event'ler
  }

  res.json({ received: true });
}
```

---

## Mobile Konfigürasyon

### 1. Environment Variables

`.env.development`:
```env
STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key_here
API_BASE_URL=http://localhost:3000/api
```

`.env.production`:
```env
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key_here
API_BASE_URL=https://api.astrology.com/api
```

### 2. Paket Yükleme

```bash
cd mobile
npm install @stripe/stripe-react-native
```

### 3. iOS Konfigürasyonu (Opsiyonel)

Eğer Apple Pay kullanacaksan:

1. `ios/AstrologyApp/Info.plist`:
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>astrology</string>
    </array>
  </dict>
</array>
```

2. Merchant identifier ekle:
   - Apple Developer → Certificates → Merchant IDs
   - `merchant.com.astrology.app` oluştur

---

## Test Etme

### 1. Test Kartları

Stripe test kartlarını kullan:

| Card Number         | Scenario          |
|---------------------|-------------------|
| 4242 4242 4242 4242 | Başarılı ödeme    |
| 4000 0000 0000 0002 | Kart reddedildi   |
| 4000 0000 0000 9995 | Yetersiz bakiye   |

- **CVC**: Herhangi 3 rakam
- **Tarih**: Gelecekteki herhangi bir tarih

### 2. Test Senaryoları

```bash
# 1. Standard Monthly - Başarılı ödeme
- MyPlanScreen'i aç
- "Upgrade to Standard" butonuna tıkla
- Monthly seçeneğini seç
- 4242 4242 4242 4242 kartını gir
- Ödemeyi tamamla
- ✅ Subscription aktif olmalı

# 2. Premium Yearly - Başarılı ödeme
- Premium planı seç
- Yearly seçeneğini seç
- Test kartı ile öde
- ✅ Yearly subscription aktif olmalı

# 3. Kart Reddedildi
- 4000 0000 0000 0002 kartını kullan
- ❌ "Card declined" hatası görmeli

# 4. Webhook Test
- Stripe CLI kullan: stripe listen --forward-to localhost:3000/webhooks/stripe
- Test ödeme yap
- ✅ Webhook event'i backend'e gelmeli
```

### 3. Stripe CLI ile Test

```bash
# Stripe CLI yükle
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Webhook'ları dinle
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe

# Test event gönder
stripe trigger payment_intent.succeeded
stripe trigger customer.subscription.created
```

---

## Production'a Geçiş

### Checklist

- [ ] **Live API Keys**: Production keys'leri environment'a ekle
- [ ] **Webhook URL**: Production webhook URL'ini Stripe'a ekle
- [ ] **Price IDs**: Live Price ID'leri config'e ekle
- [ ] **Business Info**: Stripe hesabını tamamen doğrula
- [ ] **Payout Settings**: Banka hesabını doğrula
- [ ] **Error Monitoring**: Sentry/Crashlytics entegre et
- [ ] **Email Notifications**: Kullanıcılara email gönder (başarılı/başarısız ödeme)
- [ ] **Receipt Generation**: Fatura/makbuz sistemi kur
- [ ] **Tax Compliance**: Vergi hesaplamaları ekle (gerekiyorsa)
- [ ] **Terms & Privacy**: Kullanım koşulları ve gizlilik politikası güncelle

### Güvenlik Best Practices

1. **API Keys'i asla expose etme**:
   - Git'e commitleme
   - Frontend'de secret key kullanma
   - Environment variables kullan

2. **Webhook'ları doğrula**:
   - Her webhook request'ini signature ile doğrula
   - Raw body kullan (parsed body değil)

3. **Idempotency**:
   - Aynı ödeme iki kez işlenmesin
   - Idempotency key kullan

4. **Error Handling**:
   - Tüm Stripe hatalarını yakala
   - Kullanıcıya anlamlı mesajlar göster
   - Hataları logla (Sentry)

---

## Backend Implementation Örneği

### Subscription Oluşturma

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createSubscription(
  userId: string,
  planType: 'standard' | 'premium',
  billingCycle: 'monthly' | 'yearly'
) {
  // Kullanıcıyı bul
  const user = await getUserById(userId);

  // Stripe Customer oluştur (eğer yoksa)
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId },
    });
    customerId = customer.id;
    await updateUser(userId, { stripeCustomerId: customerId });
  }

  // Price ID'yi al
  const priceId = STRIPE_PLAN_IDS[planType][billingCycle];

  // Subscription oluştur
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
  });

  const invoice = subscription.latest_invoice as Stripe.Invoice;
  const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

  return {
    subscriptionId: subscription.id,
    clientSecret: paymentIntent.client_secret,
    status: subscription.status,
  };
}
```

---

## Sorun Giderme

### Webhook çalışmıyor

1. Webhook secret doğru mu kontrol et
2. Endpoint URL'i erişilebilir mi test et
3. Stripe Dashboard → Webhooks → Event log'ları kontrol et
4. Raw body kullanıldığından emin ol

### Ödeme başarısız oluyor

1. Test kartı kullanıyor musun?
2. API key'ler doğru mu?
3. Price ID'ler doğru mu?
4. Network log'ları kontrol et

### Subscription aktif olmuyordev

1. Webhook çalışıyor mu kontrol et
2. Backend subscription state'i güncelliyor mu?
3. Database'de subscription kaydı var mı?

---

## Kaynaklar

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe React Native SDK](https://stripe.com/docs/payments/accept-a-payment?platform=react-native)
- [Subscriptions Guide](https://stripe.com/docs/billing/subscriptions/overview)
- [Webhook Guide](https://stripe.com/docs/webhooks)
- [Testing](https://stripe.com/docs/testing)

---

**Son Güncelleme**: 2024-11-16
**Versiyon**: MVP 1.0
