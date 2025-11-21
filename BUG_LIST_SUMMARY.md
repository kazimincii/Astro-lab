# 🔴 HATA VE BUG ÖZETİ (MADDELER)

## KRİTİK HATALAR 🔴 (12)

### 1. @ts-nocheck - 11 DOSYA
- MyPlanScreen.tsx
- TodayScreen.tsx  
- RelationshipSoulmateScreen.tsx
- NumerologyScreen.tsx
- FamousPeopleScreen.tsx
- ForecastsScreen.tsx
- CoffeeReadingScreen.tsx
- CosmicClimateScreen.tsx
- ChakrasScreen.tsx
- AuraScanScreen.tsx

### 2. Numeroloji Modülü - TODO Unimplemented
- `backend/src/modules/numerology/numerology.service.ts:14`

### 3. Tarot Modülü - TODO Unimplemented  
- `backend/src/modules/tarot/tarot.service.ts:14`

### 4. Kahve Falı Modülü - TODO Unimplemented
- `backend/src/modules/coffee-reading/coffee-reading.service.ts:14`

### 5. Charts Modülü - TODO #1 Unimplemented
- `backend/src/modules/charts/charts.service.ts:14` - Swiss Ephemeris calculation

### 6. Charts Modülü - TODO #2 Unimplemented
- `backend/src/modules/charts/charts.service.ts:33` - AI interpretation

### 7. AI Assistant Modülü - TODO Unimplemented
- `backend/src/modules/ai-assistant/ai-assistant.service.ts:25`

### 8. Fallback Logging Test - Placeholder
- `backend/test/ai-assistant.e2e-spec.ts:388` - expect(true).toBe(true)

### 9. Quota Exhaustion Test - Placeholder  
- `backend/test/ai-assistant.e2e-spec.ts:406` - expect(true).toBe(true)

### 10. Staging URLs - Hardcoded
- `backend/test/ai-assistant.e2e-spec.ts:28` - Should use env vars

### 11. Log Verification - TODO
- `backend/test/ai-assistant.e2e-spec.ts:543` - Test not implemented

---

## YÜKSEK ÖNCELİK HATALAR 🟠 (15)

### 12-22. Tutarsız API Çağrıları (1 HATAx11 etkilenen)
- `mobile/src/screens/auth/OnboardingScreen.tsx:65` - Raw axios yerine trialsApi kullanmalı

### 23. Widget Manager Type Casting
- `mobile/src/hooks/useWidgetUpdates.ts:119` - `as any` ile forced casting

### 24. Anthropic Client Initialization
- `mobile/src/services/anthropicClient.ts:207` - Null olabilir, never initialized

### 25. Missing Widget Data Nullish Coalescing
- `mobile/src/hooks/useWidgetUpdates.ts:96-99` - Hatalar maskelenebilir

### 26. Generic Error Messages - Tarot
- `mobile/src/screens/main/TarotScreen.tsx:74-77` - Too generic alerts

---

## ORTA ÖNCELİK HATALAR 🟡 (25)

### 27-76. Excessive `any` Types (50+ örnek)
**Store:**
- `mobile/src/store/authStore.ts:5` - user: any | null

**Hooks:**
- `mobile/src/hooks/useScreenProfile.ts:12` - useRoute<any>()
- `mobile/src/hooks/useProfileNavigation.ts:13` - useNavigation<any>()

**APIs:**
- `mobile/src/api/widgets.ts` - Promise<any> returns (3+)
- `mobile/src/api/journal.ts` - Promise<any> returns (2+)
- `mobile/src/api/numerology.ts` - Promise<any> returns
- `mobile/src/api/soulmate.ts` - findMatches: async (): Promise<any[]>
- `mobile/src/api/relationship.ts` - Multiple any types
- `mobile/src/api/payments.ts` - getPaymentMethods: Promise<any[]>
- `mobile/src/api/subscriptions.ts` - actionsRemaining: null type confusion

### 77-96. Console.error Usage (20+ dosya)
- `mobile/src/screens/main/WidgetsScreen.tsx:58, 89, 108`
- `mobile/src/screens/main/NumerologyScreen.tsx:27`
- `mobile/src/screens/main/MyPlanScreen.tsx:64, 92`
- `mobile/src/screens/main/JournalScreen.tsx:49, 93, 109`
- `mobile/src/screens/main/ChakrasScreen.tsx:38, 63`
- `mobile/src/screens/main/CalendarsScreen.tsx:50`
- `mobile/src/screens/main/BirthChartDetailScreen.tsx:61`
- `mobile/src/screens/main/BiorhythmScreen.tsx:40, 60`
- `mobile/src/screens/main/AstroMapScreen.tsx:43`
- `mobile/src/screens/main/AdvancedChartsScreen.tsx:94`
- `mobile/src/screens/main/LiveServicesScreen.tsx:48`
- `mobile/src/screens/main/ForecastsScreen.tsx:51`
- `mobile/src/screens/main/FamousPeopleScreen.tsx:44`
- `mobile/src/screens/main/EducationScreen.tsx:38`
- `mobile/src/screens/main/CosmicClimateScreen.tsx:36, 47`
- `mobile/src/screens/auth/OnboardingScreen.tsx:72`
- `backend/src/common/utils/ai.guard.ts:20`
- `backend/src/modules/aura-scan/aura-scan.service.ts:102`

---

## DÜŞÜK ÖNCELİK HATALAR 🟢 (28+)

### 97. Health Check - Missing Database Check
- `backend/src/modules/health/health.controller.ts` - Should validate DB connection

### 98. Aura Scan - Generic Error
- `backend/src/modules/aura-scan/aura-scan.service.ts:102` - throw new Error('Failed...')

### 99. Actions Service - Missing Null Check
- `backend/src/modules/actions/actions.service.ts:155` - if (trial) but trial fields might be null

### 100-101. Placeholder Tests
- `backend/test/ai-assistant.e2e-spec.ts:388`
- `backend/test/ai-assistant.e2e-spec.ts:406`

---

## 📊 ÖZET SAYILARI

**Toplam Hatalar:** 101+

| Kategorı | Sayı | Ciddiyeti |
|----------|------|-----------|
| TypeScript Kontrol Kapalı (@ts-nocheck) | 11 | 🔴 Kritik |
| Unimplemented TODOs (Backend) | 6 | 🔴 Kritik |
| Placeholder Tests | 2 | 🔴 Kritik |
| Anthropic Client | 1 | 🟠 Yüksek |
| Widget Type Issues | 2 | 🟠 Yüksek |
| API Inconsistency | 1 | 🟠 Yüksek |
| Excessive `any` | 50+ | 🟡 Orta |
| Console Logging | 20+ | 🟡 Orta |
| Health Check | 1 | 🟢 Düşük |
| Null Check Issues | 2 | 🟢 Düşük |

---

## 🎬 BAŞLANGIC ADIMları

1. **ŞİMDİ:** Tüm @ts-nocheck'leri kaldırın
2. **ŞİMDİ:** OnboardingScreen axios.post'u düzeltin  
3. **BU HAFTA:** 6 backend TODO'yu implement edin
4. **BU HAFTA:** Error handling standardize edin
5. **İLERİDE:** any types düzeltin

---

**Detaylı rapor:** `DETAILED_BUG_LIST.md`
**Karşılaştırma raporu:** `ERROR_ANALYSIS_COMPARISON.md`
