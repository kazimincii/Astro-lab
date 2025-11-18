# Manual Testing Execution Guide

## 🧪 Comprehensive Testing Checklist

Bu rehber, Astrology Super App'ın üretim öncesi tamamlanması gereken tüm manual testleri gösterir.

---

## 1️⃣ Authentication & Onboarding

### Test: User Registration

```
SCENARIO: Yeni kullanıcı kayıt olması

STEPS:
1. App'ı aç → "Register" tab tıkla
2. Email gir: test@example.com
3. Şifre gir: StrongPass123
4. Kayıt tamamla
5. Onboarding → Plan seç (Premium)
6. Birth date/time gir
7. Continue tıkla

EXPECTED:
✅ Kayıt başarılı
✅ Profil oluşturulmuş
✅ Home screen görünür
✅ Profile data kaydedilmiş

RESULT: [ ] PASS [ ] FAIL
NOTES: ___________________________
```

### Test: Existing User Login

```
SCENARIO: Mevcut kullanıcı login

STEPS:
1. App'ı aç → "Login" tab
2. Email gir: test@example.com
3. Şifre gir: StrongPass123
4. Login tıkla

EXPECTED:
✅ Login başarılı
✅ Home screen görünür
✅ User data yüklenmiş
✅ Session active

RESULT: [ ] PASS [ ] FAIL
```

### Test: Invalid Credentials

```
SCENARIO: Hatalı şifre ile login

STEPS:
1. Email gir: test@example.com
2. Şifre gir: WrongPass
3. Login tıkla

EXPECTED:
✅ Error message gösterilir
✅ App responsive kalır
✅ Login sayfası açık kalır

RESULT: [ ] PASS [ ] FAIL
```

---

## 2️⃣ Trial & Subscription Management

### Test: Start Free Trial

```
SCENARIO: 7 günlük trial başlatma

STEPS:
1. Home screen'de "Start Trial" tıkla
2. Onay ver
3. MyPlan ekranını aç

EXPECTED:
✅ Trial aktif
✅ Trial countdown gösterilir
✅ Premium features unlock edildi
✅ 7 gün countdown başladı

RESULT: [ ] PASS [ ] FAIL
NOTES: ___________________________
```

### Test: Plan Upgrade

```
SCENARIO: Premium plana upgrade

STEPS:
1. MyPlan ekranını aç
2. "Upgrade to Premium" tıkla
3. PaymentSheet açılır
4. Test card: 4242 4242 4242 4242
5. Future date ve CVC gir
6. Complete payment

EXPECTED:
✅ Payment processed
✅ Premium plan active
✅ Features unlocked
✅ Billing date set

RESULT: [ ] PASS [ ] FAIL
```

---

## 3️⃣ Profile Management

### Test: Create Multiple Profiles

```
SCENARIO: Birden fazla profil oluşturma

STEPS:
1. Profiles tab aç
2. "+" tıkla
3. Name gir: "John"
4. Birth date: 1990-01-15
5. Birth time: 14:30
6. Birth location: New York
7. Save tıkla
8. Yeni profil oluştur: "Jane"

EXPECTED:
✅ Profil 1 oluşturulmuş
✅ Profil 2 oluşturulmuş
✅ List'de ikisi de görünür
✅ Farklı birthdays gösterilir

RESULT: [ ] PASS [ ] FAIL
```

### Test: Switch Profiles

```
SCENARIO: Profiller arası geçiş

STEPS:
1. Profiles'dan "Jane" seç
2. Today ekranına git
3. Horoscope gösterilir
4. Profiles'dan "John" seç
5. Horoscope değişti mi kontrol et

EXPECTED:
✅ Profile switch'i başarılı
✅ Content Jane'e ait (John'a değil)
✅ Hızlı geçiş
✅ Data doğru güncellenmiş

RESULT: [ ] PASS [ ] FAIL
```

---

## 4️⃣ Feature Screen Navigation

### Test: Daily Horoscope

```
SCENARIO: Günlük horoskop görüntüleme

STEPS:
1. Today tab → Horoscope card
2. Swipe yapıp okuma alanını kaydır
3. Lucky numbers kontrol et
4. Moon phase kontrol et

EXPECTED:
✅ Horoscope text görünür
✅ Lucky numbers display
✅ Moon phase emoji gösterilir
✅ Tarih doğru

RESULT: [ ] PASS [ ] FAIL
```

### Test: Birth Chart Analysis

```
SCENARIO: Doğum haritası analizi

STEPS:
1. Explore tab → Advanced Charts
2. Birth Chart tıkla
3. Chart visualization açılır
4. Tap ile detailed info göster

EXPECTED:
✅ Chart render edilir
✅ Başlık görünür
✅ Detaylı bilgi açılır
✅ Performance smooth

RESULT: [ ] PASS [ ] FAIL
```

### Test: Tarot Reading

```
SCENARIO: Tarot kartı seçme

STEPS:
1. Explore → Tarot
2. "Draw Cards" tıkla
3. Kartlar shuffle edilir ve açılır
4. İnterpretasyon okunur

EXPECTED:
✅ Kartlar animeli
✅ 3 kart çekiliyor
✅ Anlamlar gösterilir
✅ "Draw Again" çalışıyor

RESULT: [ ] PASS [ ] FAIL
```

### Test: Biorhythm Chart

```
SCENARIO: Biyoritim grafiği

STEPS:
1. Explore → Biorhythm
2. Graph display edilir
3. 3 line görülür (Physical, Emotional, Intellectual)

EXPECTED:
✅ Graph render edilir
✅ Colors doğru
✅ Data current date için
✅ Percentage gösterilir

RESULT: [ ] PASS [ ] FAIL
```

### Test: All Explore Screens

```
SCENARIO: Tüm Explore ekranlarına geçiş

SCREENS TO TEST:
- [ ] Education
- [ ] Widgets
- [ ] Chakras
- [ ] Numerology
- [ ] Aura Scan
- [ ] Journal
- [ ] Relationship
- [ ] Calendars
- [ ] Forecasts
- [ ] Cosmic Climate

EXPECTED:
✅ Tüm ekranlar açılır
✅ No crashes
✅ Back button çalışır
✅ Navigation smooth

RESULT: [ ] PASS [ ] FAIL
```

---

## 5️⃣ Premium Actions & Limits

### Test: Premium Actions Tüketimi

```
SCENARIO: Premium action sayaç

STEPS:
1. Free plan user: 2/2 actions
2. "Generate Birth Chart" tıkla
3. Action consumed: 1/2
4. Tekrar dene: 0/2
5. 3. kez "Limit reached" error görmeli

EXPECTED:
✅ Counter decreases
✅ Visual feedback
✅ Limit enforced
✅ Error message clear

RESULT: [ ] PASS [ ] FAIL
```

### Test: Premium Features Unlock

```
SCENARIO: Premium unlock

STEPS:
1. Basic user olarak login
2. Advanced feature tıkla
3. "Upgrade to unlock" gösterilir
4. Upgrade tıkla → Payment
5. Premium activate
6. Feature accessible

EXPECTED:
✅ Paywall gösterilir
✅ Upgrade option visible
✅ Payment flow çalışır
✅ Feature unlock edilir

RESULT: [ ] PASS [ ] FAIL
```

---

## 6️⃣ iOS Widgets

### Test: Widget Display

```
SCENARIO: Lock screen widget

STEPS:
1. iPhone simulator
2. Lock screen'e git (sağdan swipe)
3. "+" tıkla
4. "AstroWidgets" ara
5. Widget ekle

EXPECTED:
✅ Widget görünür
✅ Horoscope gösterilir
✅ Moon phase emoji
✅ Data synced

RESULT: [ ] PASS [ ] FAIL
```

### Test: Widget Interaction

```
SCENARIO: Widget tap

STEPS:
1. Widget'ta herhangi bir yere tap
2. Main app açılıyor mu?

EXPECTED:
✅ App opens from widget tap
✅ Correct screen gösterilir
✅ No crash

RESULT: [ ] PASS [ ] FAIL
```

### Test: Widget Data Update

```
SCENARIO: Widget data sync

STEPS:
1. App'ta horoscope güncelle
2. Lock screen'e git
3. Widget refresh (swipe down)

EXPECTED:
✅ Widget data updated
✅ Yeni content gösterilir
✅ Timing reasonable

RESULT: [ ] PASS [ ] FAIL
```

---

## 7️⃣ Settings & Preferences

### Test: Language Switch

```
SCENARIO: İngilizce → Türkçe

STEPS:
1. Settings → Language
2. "Türkçe" seç
3. App reload edilir
4. Başlıklar Türkçe mi?

EXPECTED:
✅ Language switch çalışır
✅ Tüm UI Türkçe
✅ Persistent (app restart sonra)
✅ No text overflow

RESULT: [ ] PASS [ ] FAIL
```

### Test: Dark Mode

```
SCENARIO: Dark/Light mode toggle

STEPS:
1. Settings → Theme
2. Dark mode enable
3. Colors değişti mi?
4. Light mode switch
5. Back to default

EXPECTED:
✅ Theme toggles
✅ Colors correct
✅ Readable text
✅ Persistent

RESULT: [ ] PASS [ ] FAIL
```

### Test: Account Settings

```
SCENARIO: Hesap detayları

STEPS:
1. Settings → Account
2. Email görünür mü?
3. Current plan gösterilir mi?
4. Logout tıkla

EXPECTED:
✅ User info displayed
✅ Plan status correct
✅ Logout works
✅ Login screen açılır

RESULT: [ ] PASS [ ] FAIL
```

---

## 8️⃣ AI Assistant

### Test: Chat Interface

```
SCENARIO: AI'ya mesaj gönderme

STEPS:
1. AI tab aç
2. Message input'a tıkla
3. "What's my horoscope?" gir
4. Send tıkla
5. AI response bekle

EXPECTED:
✅ Message sent
✅ Visible in chat
✅ Response arrives
✅ Interpretation quality

RESULT: [ ] PASS [ ] FAIL
```

---

## 9️⃣ Error Handling

### Test: Network Error

```
SCENARIO: Network unavailable

STEPS:
1. Airplane mode ON
2. Feature screen aç
3. Error message gösterilir
4. Retry button visible
5. Airplane mode OFF
6. Retry tıkla

EXPECTED:
✅ Error handled
✅ Clear message
✅ Retry works
✅ Data loads

RESULT: [ ] PASS [ ] FAIL
```

### Test: Session Expiration

```
SCENARIO: Expired session

STEPS:
1. Long time geçmesi simulate et
2. Feature request yap
3. Session expired error
4. Logout suggest edilir
5. Re-login gerekli

EXPECTED:
✅ Error detected
✅ Clear message
✅ Login screen açılır
✅ Can re-login

RESULT: [ ] PASS [ ] FAIL
```

---

## 🔟 Performance & Stability

### Test: App Launch Time

```
SCENARIO: Cold start performance

STEPS:
1. App completely close
2. Reopen
3. Stopwatch measure (cold start)
4. Warm start test (resume)

EXPECTED:
✅ Cold start < 3 seconds
✅ Warm start < 1 second
✅ Smooth animations
✅ No jank

LAUNCH TIME: _____ seconds
RESULT: [ ] PASS [ ] FAIL
```

### Test: Memory Usage

```
SCENARIO: Memory leaks

STEPS:
1. Open multiple screens
2. Back navigation 10x
3. Monitor memory usage
4. Significant leak?

EXPECTED:
✅ Memory stable
✅ No crashes
✅ Smooth performance
✅ Responsive UI

RESULT: [ ] PASS [ ] FAIL
```

### Test: Crash Stability

```
SCENARIO: No crashes under normal use

STEPS:
1. Use app normally for 10 minutes
2. Navigate between all screens
3. Try all interactions

EXPECTED:
✅ Zero crashes
✅ No ANR (App Not Responding)
✅ All features work
✅ Smooth transitions

RESULT: [ ] PASS [ ] FAIL
CRASH COUNT: _____
```

---

## 📊 Summary

```
Total Tests: 45+
Passed: ___
Failed: ___
Blocked: ___

Critical Issues: ___
Major Issues: ___
Minor Issues: ___

READY FOR PRODUCTION: [ ] YES [ ] NO
```

---

## ✅ Sign-Off

```
Tested By: ___________________
Date: ___________________
Device: iPhone 15 Pro / iOS 17.x
Build: ___________________

All critical tests passed: [ ] YES [ ] NO
Approved for App Store: [ ] YES [ ] NO

QA Lead: ___________________
Product Manager: ___________________
```

---

**Estimated Time:** 6-8 hours (thorough testing)
**Device Required:** Real iPhone or simulator
**Status:** Ready for execution
