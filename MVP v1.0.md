# Astrology Super-App – MVP v1.0  
(Cross-Platform Astrology / Numerology / Tarot / Coffee / AI / Social)

## 0. Product One-Liner

A cross-platform astrology super-app combining birth charts, advanced techniques, numerology, tarot & coffee reading, AI assistant, soulmate matching, vibe-from-photo readings, rituals and astro-calendars – with a tiered membership model (Basic / Standard / Premium) and daily AI usage limits.

---

## 1. Vision & Scope

- Bring together:
  - Classical astrology (natal, transits, synastry, composite, returns, etc.)
  - Numerology, biorhythm, chakra / energy analysis
  - Tarot & coffee readings
  - AI-powered personal assistant and “Ask the Stars” Q&A
  - Social features: soulmate matching, secret chat, friend compatibility
  - Fun extras: famous people with similar charts, astro map, cosmic climate feed
  - New-gen feature: “Aura Scan” – photo-based vibe/personality reading
- Platforms:
  - iOS (primary launch)
  - Android (same codebase)
  - Apple Watch (complications + minimal app)

---

## 2. Platforms & Tech Stack

### 2.1 Mobile App

- React Native + Expo (Managed workflow)
- Language: TypeScript
- Navigation: React Navigation
- State: Zustand or Redux Toolkit
- Styling:
  - NativeWind (Tailwind-like utilities)
  - Custom UI kit for cards, modals, buttons, typography
- Modules:
  - Auth & Onboarding
  - Plan & Billing UI
  - People & Charts
  - Today & Calendars
  - AI Assistant & Ask the Stars
  - Tarot / Coffee / Numerology / Biorhythm / Chakras
  - Social & Soulmate
  - Settings & Profile

### 2.2 iOS Native Extensions

- Swift + SwiftUI:
  - Lock Screen & Home widgets:
    - Moon phase + sign
    - “Star Message of the Day”
  - Apple Watch:
    - Complications for moon phase / daily message
    - Minimal app view (today summary)

### 2.3 Backend

- Node.js (NestJS or Fastify)
- TypeScript
- PostgreSQL (primary relational DB)
- Redis (caching + rate limiting, optional in MVP)
- Astro Engine Service:
  - Separate microservice or module (Node or Python)
  - Computes natal charts, transits, returns, astrocartography lines, etc.
- Object Storage:
  - S3-compatible storage for images:
    - Avatars
    - Coffee cup photos
    - Aura Scan face photos

### 2.4 AI Layer

- LLM provider abstraction:
  - `AiClient` interface (OpenAI / Anthropic / etc.)
- Prompt builder & context enricher:
  - Birth chart data (planets, houses, aspects, points)
  - Transits & major events
  - Numerology profiles
  - Biorhythm status
  - User history (journal, previous readings)
- Vision + text pipeline:
  - For coffee readings
  - For Aura Scan (photo-based vibe/personality reading)

---

## 3. Membership, Pricing & Trial

### 3.1 Plans & Prices (Global Defaults)

- **Basic (Free)**
  - Price: 0 USD / month

- **Standard**
  - Monthly: 10 USD / month
  - Yearly: 99 USD / year (approx. 17% discount)

- **Premium**
  - Monthly: 19 USD / month
  - Yearly: 189 USD / year (approx. 17% discount)

> Regional pricing: use App Store / Play Store regional pricing tables; these USD values are the baseline.

### 3.2 7-Day Free Trial

- New users can choose at onboarding:
  - Continue as **Basic (Free)**, or
  - Start **7-day trial of Standard**, or
  - Start **7-day trial of Premium**
- Behavior:
  - During trial, user behaves as that plan:
    - Standard trial → Standard limits (4 actions/day)
    - Premium trial → Premium (unlimited actions)
  - After 7 days:
    - If not cancelled → converts to paid monthly plan
    - If cancelled → falls back to Basic

### 3.3 Premium Actions

“Premium Actions” = heavy compute / AI operations. Each such operation consumes 1 unit, except for Premium plan (unlimited).

Premium Actions include (examples):

- Ask the Stars question (AI)
- Personal AI Assistant long-form reply
- Detailed advanced chart interpretations:
  - Transit, Progress, Composite, Davison, Solar Return, Lunar Return, Solar Arks
- Personalized daily/weekly/monthly forecasts (per person, per generation)
- Numerology detailed reports (beyond base summary)
- Advanced compatibility & relationship timeline reports
- Tarot spread interpretation (per spread)
- Coffee reading interpretation (3 cups + 1 saucer)
- Deep biorhythm + astro combined report
- Aura Scan (vibe-from-photo personality reading)

### 3.4 Daily Premium Action Limits

- **Basic**  
  - 2 Premium Actions / day (global across all modules)

- **Standard**  
  - 4 Premium Actions / day

- **Premium**  
  - Unlimited Premium Actions (subject to backend fair-use protections)

UI requirement:

- Global indicator:
  - e.g. “2 / 4 actions used today”
- Limit reached → blocking modal:
  - Explains limit
  - Suggests upgrade (Standard/Premium)

### 3.5 Plan-Based Feature Access

#### Basic (Free)

- Max PersonProfiles: 2
- Birth Charts:
  - Full chart wheel visible
  - Short interpretation:
    - Sun / Moon / Rising
    - Basic “who you are” paragraph
- Forecasts:
  - Simple daily & weekly forecast for main profile
  - Monthly/yearly → preview snippets only (locked content)
- Advanced Charts:
  - Transit, Progress, Composite, Davison, Solar/Lunar Return, Solar Arks
    - Chart wheel visible
    - Generating an interpretation uses Premium Actions
- AI:
  - Ask the Stars + AI Assistant:
    - Shared pool, within 2 actions/day
- Tarot:
  - Max 1 tarot spread per day (uses 1 action)
- Coffee Reading:
  - Max 1 reading per week (uses 1 action)
- Numerology:
  - Full initial basic profile once
  - After that: summarized view, detailed report uses action
- Biorhythm:
  - Basic daily graph with minimal text
- Chakras:
  - Chakra map + short status summary
- Calendars:
  - Full Moon calendar view
  - Special calendars (Beauty/Health/Activity/Spiritual/Transit):
    - Preview mode (limited detail)
- Astro Map:
  - Preview only (limited planetary lines, blurred or partial)
- Famous People:
  - Small sample list
- Soulmate & Social:
  - Soulmate archetype card only
  - No live matching or secret chat
- Aura Scan (Face-based Vibe Reading):
  - 1 free Aura Scan (no action)
  - Further scans consume actions (2/day total cap)
- Journaling:
  - Mood + note, last 7 days stored
- Live Services:
  - Promo / teaser, no bookings

#### Standard (10 USD/month, 99 USD/year)

- Max PersonProfiles: 10
- Birth Charts:
  - Full chart wheel + full basic interpretations
  - Tap-to-learn: planets, houses, aspects
- Forecasts:
  - Full daily/week/month/year forecasts per PersonProfile
  - Generating/refreshing forecasts uses actions (4/day pool)
- Advanced Charts:
  - All chart types:
    - Basic Mode interpretations (short texts)
    - Each new interpretation consumes actions
- AI:
  - Ask the Stars + AI Assistant:
    - Shared pool of up to 4 actions/day
- Tarot:
  - Multiple spreads/day, limited by action pool
- Coffee Reading:
  - Multiple readings/month, limited by action pool
- Numerology:
  - Full numerology chart
  - Relationship numerology comparisons (consume actions)
- Biorhythm:
  - Full graph + daily AI commentary
- Chakras:
  - Full chakra status + practical guidance for each chakra
- Calendars:
  - Full access:
    - Moon calendar
    - Special calendars (Beauty/Health/Activity/Spiritual/Transit)
      - Day ratings & tips
    - Planetary Hours calculator
- Astro Map:
  - Lite version:
    - Key planet lines (Sun, Moon, Venus, Jupiter, Saturn)
    - Short interpretations for chosen cities
- Famous People:
  - Full list of notable matches (capped)
- Soulmate & Social:
  - Soulmate matching + secret chat (opt-in)
  - Add friends, view compatibilities
- Aura Scan:
  - Aura Scans consume from the 4 actions/day pool
- Journaling:
  - Unlimited entries + calendar/list view
- Live Services:
  - Browse experts & request sessions (marketplace alpha; payments to be added later)

#### Premium (19 USD/month, 189 USD/year)

- Max PersonProfiles: high cap (e.g. 50 or effectively unlimited)
- Birth Charts:
  - Everything in Standard +
  - Pro Mode:
    - Technical astro data (degrees, tight orbs, extra points)
- Forecasts:
  - Full daily/week/month/year for all profiles
  - Unlimited generation/refresh
- Advanced Charts:
  - Pro Mode:
    - Detailed interpretations, longer text, extra layers
  - Unlimited actions (no daily limit)
- AI:
  - Unlimited Ask the Stars & AI Assistant use
- Tarot:
  - Unlimited spreads
  - Interpretation style presets (positive / direct / soft)
- Coffee Reading:
  - Unlimited readings
- Numerology:
  - Deep numerology, multi-person comparisons, pro views
- Biorhythm:
  - Extended graphs + combined astro-biorhythm insights
- Chakras:
  - Expanded guidance, ready for future audio/ritual integrations
- Calendars:
  - All calendars + fully customizable notifications
- Astro Map:
  - Full astrocartography:
    - More planetary lines
    - Themed views (Life, Love, Career)
- Famous People:
  - Extended lists + filters (profession / area)
- Soulmate & Social:
  - Priority matching and enhanced filters
- Aura Scan:
  - Unlimited Aura Scans (subject to fair-use)
- Journaling:
  - Full history; export/share options (future)
- Live Services:
  - Priority deals & special offers (future)

---

## 4. Core Domain Model (High-Level)

### 4.1 Main Entities

- `User`
- `SubscriptionPlan` (Basic / Standard / Premium, monthlyPrice, yearlyPrice, dailyActionLimit, maxProfiles)
- `Subscription` (userId, planId, startDate, endDate, status)
- `Trial` (userId, planType, startDate, endDate, status)
- `PremiumActionUsage` (userId, date, count)

- `PersonProfile` (userId, name, photoUrl, birthDate, birthTime, birthPlace, gender, notes)
- `BirthChart` (personId, planetPositions, houses, aspects, points)
- `AdvancedChart` (personId or personIds, type, data, interpretation)
- `ForecastBundle` (personId, type: daily/weekly/monthly/yearly/western/chinese, dateRange, contentJSON)
- `NumerologyProfile` (personId, coreNumbers, arrows, cycles)
- `BiorhythmProfile` / computed on the fly
- `TarotSpread` (personId, type, cards, interpretation)
- `CoffeeReading` (personId, imageUrls, interpretation)
- `ChakraProfile` (personId, chakraStates, guidance)
- `SoulmateProfile` (personId, description, meetingScenarios)
- `RelationshipProfile` (personIds, compatibilityScores, summary)
- `AstroEvent` (type, start, end, description)
- `CalendarEntry` (date, tags: beauty/health/activity/spiritual/transit/moon, scores)
- `WidgetConfig` (userId, widgetType, data)
- `AIChatThread` / `AIMessage` (for assistant & Ask the Stars)
- `FaceReading` (Aura Scan) (userId, optional personId, imageUrl, archetype, summary, sections)
- `LiveSession` (userId, expertId, type, status)
- `JournalEntry` / `MoodLog` (personId/userId, date, mood, text)
- `CosmicClimatePost` (global daily sky updates)
- `UserConnection` (friend relationships, soulmate matches)

---

## 5. Feature Breakdown (Functional)

> All modules exist in MVP. Plan defines how much is unlocked.

### 5.1 People & Birth Charts

- Create / edit PersonProfile
- View interactive birth chart:
  - Chart wheel (planets, houses, aspects)
  - Basic interpretation
  - Learn Mode:
    - Tap planet/house/aspect → small explanation

### 5.2 Advanced Astrology Tools

- Charts:
  - Transit Chart
  - Progressed Chart
  - Synastry Chart
  - Composite Chart
  - Davison Chart
  - Solar Return
  - Lunar Return
  - Solar Arks
- Modes:
  - Basic Mode: short summary (Standard / Premium)
  - Pro Mode: advanced tables, aspects (Premium)

### 5.3 Forecasts & Horoscopes

- Personal forecasts per PersonProfile:
  - Daily, weekly, monthly, yearly
  - Sections: Love, Money, Health, Career, Spiritual
- Western horoscopes:
  - Sun sign daily/weekly/yearly
  - Themed views: Love, Money, Health, Career
- Chinese horoscopes:
  - Daily & yearly
- “Star Message of the Day”:
  - Personal daily 1–2 paragraph message

### 5.4 Events: Retros, Transits, Eclipses

- Global event list:
  - Retrogrades
  - Eclipses
  - Major transits (Saturn, Jupiter, Pluto, etc.)
- For each PersonProfile:
  - “How this event impacts you” article/summary

### 5.5 Calendars & Planetary Hours

- Moon calendar:
  - Monthly view with phase + sign
- Special calendars (per day):
  - Beauty
  - Health
  - Activity
  - Spiritual
  - Transit
  - Moon
- Day detail:
  - Ratings (1–10) and short tips
- Planetary Hours:
  - Location-based planetary hours
  - Option to set notifications (Standard/Premium)

### 5.6 Relationship & Soulmate Features

- Compatibility analysis:
  - Me + X
  - X + Y (third-party analysis)
- Visual radar chart:
  - Emotional, Communication, Values, Physical
- Relationship timeline:
  - Past 6 months themes
  - Next 6 months forecast
- Partner preference estimation:
  - Based on chart (Venus, Mars, 5th, 7th, 8th houses)
- Soulmate Profile:
  - Archetype description
  - Typical meeting scenarios (work, online, travel, spiritual spaces)
- Soulmate secret chat:
  - When two users mutually match (opt-in feature)
  - Anonymous nickname chat with astro-based conversation starters

### 5.7 AI Assistant & Ask the Stars

- Personal AI Assistant:
  - User selects assistant name and tone (soft / direct / playful)
  - Assistant knows:
    - User’s birth chart
    - Key transits
    - Forecasts
    - Journal tags (optionally)
- Ask the Stars:
  - Question categories:
    - Love, Work, Money, Health, Spiritual, General
  - Full context from charts, transits, numerology
  - Uses Premium Actions (depending on plan)

### 5.8 Numerology & Biorhythm

- Numerology Birth Chart:
  - Life Path, Destiny, Soul Urge, Personality
  - Arrows & important patterns
  - Personal year cycle
- Numerology Tools:
  - Name analysis
  - Number analysis (phone, house number, etc.)
  - Relationship numerology (two-person comparison)
- Biorhythm:
  - Daily graph (physical, emotional, intellectual)
  - AI commentary (Standard / Premium)

### 5.9 Tarot

- Spread types:
  - Daily 3-card
  - Work/Job tarot
  - Love tarot
  - Personal tarot
  - Celtic Cross
- Each spread:
  - Cards with upright/reversed
  - General meanings + personalized interpretation using chart context
- Tarot history:
  - List of recent readings

### 5.10 Coffee Reading

- Upload 3 cup photos + 1 saucer photo
- AI-based coffee reading:
  - Overall vibe
  - Love
  - Work & money
  - Short-term predictions
- History of coffee readings

### 5.11 Chakras & Energy

- Chakra profile:
  - 7 chakras with status:
    - Underactive / Balanced / Overactive
- Visual:
  - Human silhouette with colored chakras
- Guidance per chakra:
  - 3–5 practical tips:
    - Simple meditations
    - Breathwork
    - Small habits/actions

### 5.12 Astro Map (Astrocartography)

- World map view:
  - Main planetary lines (Sun, Moon, Venus, Jupiter, Saturn… more in Premium)
- City lookup:
  - Quick summary:
    - Good for life roots?
    - Good for love?
    - Good for career?

### 5.13 Famous People Matching

- For each PersonProfile:
  - List of notable people with similar Sun/Moon/Rising or close pattern
  - Cards: photo (if allowed), name, profession, shared theme summary
- Filters (Premium):
  - Scientist / Leader / Artist / Entrepreneur, etc.

### 5.14 Aura Scan – Face-Based Vibe/Personality Reading

- User uploads a portrait photo (self, partner or another person)
- System generates a “vibe reading”:
  - Archetype label (e.g. Dreamer, Strategist, Protector, etc.)
  - Sectioned interpretation:
    - Vibe & presence
    - Communication style
    - Relationship style (light, non-clinical)
    - Strength themes and gentle watch-outs
- Constraints:
  - Entertainment-only; not psychological or medical advice
  - No inference on:
    - Health / mental health
    - Politics / religion
    - Crime / sexual life
    - Race / ethnicity
  - No face recognition or cross-photo identity matching
- Plan & Limits:
  - Basic:
    - 1 free Aura Scan
    - Additional scans consume Premium Actions (within 2/day)
  - Standard:
    - Aura Scans consume from 4 actions/day pool
  - Premium:
    - Unlimited Aura Scans

### 5.15 Today Screen, Widgets & Watch

- Today Screen:
  - For selected primary PersonProfile:
    - Daily forecast summary
    - Star Message of the Day
    - Moon phase & sign
    - Key transit highlight
    - Special calendar summary (beauty/health/activity/spiritual)
- iOS Widgets:
  - Tiny widget:
    - Moon phase & sign
  - Small widget:
    - Star Message of the Day snippet
- Apple Watch:
  - Complications:
    - Moon phase
    - Short daily text line
  - Minimal app view:
    - Today summary

### 5.16 Journaling & Mood

- Daily journal:
  - Mood slider
  - Free text
  - Optional tags (work/love/health/spiritual)
- Reflection prompts:
  - Based on current transits & forecast of the day
- Views:
  - Calendar view
  - Timeline list view

### 5.17 Live Services (Marketplace Alpha)

- Expert list (astrologers, tarot readers, spiritual advisors)
- Per expert:
  - Profile card: name, type, short bio, rating (later)
- Request session flow:
  - Basic form with preferred time, topic
  - For MVP, payment + scheduling can be stubbed or manual
- Future:
  - In-app chat & call
  - Ratings & reviews

### 5.18 Education & Cosmic Climate

- Astro Academy:
  - Short lessons/articles:
    - Planets basics
    - Houses
    - Aspects
    - Retrogrades
- Cosmic Climate Feed:
  - Daily global “sky weather” post
  - Users can react with emojis (Standard/Premium)

---

## 6. Non-Functional Requirements

- Performance:
  - Birth chart & standard forecast responses within a few seconds
- Security:
  - HTTPS enforced
  - Sensitive personal data (birth data, phone numbers) well protected
- Privacy:
  - Clear disclaimers about guidance vs professional advice
  - Social & soulmate features are opt-in
  - Face photos for Aura Scan handled securely and respectfully
- Localization:
  - English & Turkish from MVP launch
  - All user-facing strings externalized
- Observability:
  - Logging (errors, warnings)
  - Basic usage analytics (screens, feature usage, plan conversions)

---

## 7. Implementation Phases (Inside MVP)

> This is internal dev phasing, not separate public releases.

### Phase A – Core

- Auth & Subscription + Trial logic
- Premium Actions engine
- PersonProfiles & BirthChart engine
- Basic forecasts (daily/weekly) & Today Screen
- AI Assistant & Ask the Stars (minimal)
- Plan-based limits on number of profiles

### Phase B – Tools & Divination

- Advanced Charts (Transit, Progress, Composite, Davison, Returns, Solar Arks)
- Numerology & Biorhythm
- Tarot engine
- Coffee reading pipeline (vision + LLM)
- Chakras module
- Core calendars (Moon & Planetary Hours)

### Phase C – Social, Extras & Extensions

- Relationship & soulmate features (matching, secret chat)
- Astro Map & Famous People matching
- Aura Scan module
- Journaling & Cosmic Climate feed
- iOS widgets & Apple Watch
- Live services alpha (experts marketplace)

---

## 8. Phase A – Tech Setup & Task Breakdown (For IDE / Agents)

### 8.1 Repo & Structure

- Single Git repo:
  - `/app` → React Native + Expo project
  - `/backend` → Node.js API
  - `/shared` (optional) → shared types
- Root:
  - `.gitignore`, `.editorconfig`, `README.md`
  - ESLint + Prettier shared config

### 8.2 Backend – Phase A Tasks

**Auth & Plans & Trial**

- Implement:
  - User model
  - Auth endpoints (email/password)
  - JWT-based authentication
- Implement SubscriptionPlan data seeding:
  - Basic / Standard / Premium with:
    - monthlyPrice, yearlyPrice, dailyActionLimit, maxProfiles
- Implement Subscription & Trial models:
  - Subscription: userId, planId, start, end, status
  - Trial: userId, planType, start, end, status
- Implement “effective plan resolver”:
  - Decide plan from subscription/trial/Basic
- Implement Trial logic:
  - Start trial endpoint
  - Daily job to expire trials & convert or downgrade

**Premium Actions Engine**

- `premium_action_usages` schema:
  - userId, date (YYYY-MM-DD), count
- Service:
  - `getDailyLimit(planType)`
  - `getUsage(userId, date)`
  - `checkAndConsume(userId)`
- Integrate into Phase A endpoints:
  - Forecast generation
  - AI Assistant
  - Ask the Stars

**PersonProfiles & BirthChart**

- CRUD endpoints:
  - `POST /person`, `GET /person`, `GET /person/:id`, `PUT`, `DELETE`
  - Plan-based limit on number of profiles
- Astro Engine integration:
  - `GET /person/:id/chart` returns natal chart data
  - Basic caching

**Forecasts & Today**

- `forecast_bundles` schema
- Endpoints:
  - `POST /person/:id/forecast/daily` (generate, consume action)
  - `GET /person/:id/forecast/daily/today`
- AI pipeline for daily/weekly:
  - Prompt builder + AiClient

**AI Assistant & Ask the Stars**

- Models:
  - `ai_chat_threads`, `ai_messages`
- Endpoints:
  - `POST /ai/assistant` (send message, get reply, consume action)
  - `GET /ai/assistant/:threadId`
  - `POST /ai/ask-the-stars` (category + question + personId, consume action)
- Prompt templates & context builder (chart + transits + numerology stub)

### 8.3 Mobile App – Phase A Tasks

**Project Setup**

- Initialize Expo TypeScript project
- Add:
  - React Navigation
  - Zustand/Redux
  - NativeWind
  - Axios or similar
- Env setup:
  - `.env.development`, `.env.production`
  - `API_BASE_URL`

**Auth & Onboarding**

- Screens:
  - Login
  - Register
  - Forgot Password
- Onboarding:
  - Choose:
    - Basic
    - Standard Trial (7 days)
    - Premium Trial (7 days)

**Plans & Limits UI**

- “My Plan” screen:
  - Current plan & pricing
  - Trial status & remaining days
  - Upgrade/downgrade CTAs
- Actions counter:
  - Small indicator with current/limit
- Limit-reached modal with upsell

**People & BirthChart UI**

- People tab:
  - List of PersonProfiles
  - Add/Edit forms
- BirthChart screen:
  - Chart wheel placeholder
  - Sun/Moon/Rising + basic text
  - Tap-to-learn placeholder

**Today Screen & Forecast**

- Today screen:
  - Primary PersonProfile’s daily forecast card
  - Moon phase & sign (from backend or stub)
  - Key transit highlight placeholder
- Weekly screen:
  - Weekly forecast list

**AI Assistant & Ask the Stars (UI)**

- AI Assistant:
  - Chat UI with thread
- Ask the Stars:
  - Category selector
  - Question input
  - Result display
- Show actions counter and “consumed action” feedback

---

_End of MVP v1.0 Spec_
