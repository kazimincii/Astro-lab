# Astrology Super-App - Design System

## 🎨 Brand Identity

### App Philosophy
A mystical, cosmic experience that combines ancient wisdom with modern technology. The design should evoke:
- **Mystery & Wonder** - Deep space, cosmic energy
- **Wisdom & Guidance** - Trust, reliability
- **Modern Spirituality** - Clean, accessible, not overly esoteric

---

## 🌈 Color Palette

### Primary Colors
```
Cosmic Purple:   #6366f1  (Primary actions, headers)
Deep Purple:     #8b5cf6  (Secondary highlights)
Cosmic Accent:   #a78bfa  (Accent elements)
```

### Background Colors
```
Deep Space:      #0f0f1e  (Main background)
Card Background: #1a1a2e  (Cards, modals)
Surface:         #2d2e3f  (Elevated surfaces)
```

### Text Colors
```
Primary Text:    #ffffff  (Headings, important)
Secondary Text:  #d1d5db  (Body text)
Tertiary Text:   #9ca3af  (Captions, hints)
```

### Accent Colors
```
Gold/Sun:        #fbbf24  (Planets, special elements)
Moon Silver:     #e5e7eb  (Moon, mystical elements)
Success:         #10b981  (Confirmations)
Warning:         #f59e0b  (Alerts)
Error:           #ef4444  (Errors, retrograde)
```

### Gradient Backgrounds
```swift
// Main Cosmic Gradient
LinearGradient(
  colors: [#0f0f1e, #1a1a2e, #6366f1],
  startPoint: .topLeading,
  endPoint: .bottomTrailing
)

// Card Gradient
LinearGradient(
  colors: [#1a1a2e, #2d2e3f],
  startPoint: .top,
  endPoint: .bottom
)

// Purple Glow
LinearGradient(
  colors: [#6366f1, #8b5cf6, #a78bfa],
  startPoint: .leading,
  endPoint: .trailing
)
```

---

## 📐 Typography

### Font Family
- **Primary**: SF Pro (iOS), Roboto (Android)
- **Display**: SF Pro Display / Roboto Bold
- **Mono**: SF Mono / Roboto Mono (for degrees, coordinates)

### Type Scale
```
Display Large:   36px / Bold    (Main headers)
Display:         32px / Bold    (Screen titles)
Title Large:     24px / Semibold
Title:           20px / Semibold (Section headers)
Headline:        18px / Semibold
Body Large:      16px / Regular  (Main body)
Body:            14px / Regular  (Standard text)
Caption:         12px / Regular  (Small text)
Caption Small:   10px / Regular  (Tiny labels)
```

### Line Height
- Headings: 1.2
- Body text: 1.5
- Captions: 1.4

---

## 🎯 Spacing System

### Base Unit: 4px

```
xs:   4px   (Tiny gaps)
sm:   8px   (Small gaps)
md:   12px  (Medium gaps)
lg:   16px  (Standard padding)
xl:   20px  (Large spacing)
2xl:  24px  (Section spacing)
3xl:  32px  (Major sections)
4xl:  40px  (Screen padding)
```

### Component Spacing
- Card padding: 16px - 20px
- Screen padding: 20px - 24px
- Section gaps: 24px - 32px
- List item height: 56px - 72px

---

## 🔲 Component Library

### 1. Cards

#### Standard Card
```
Background: #1a1a2e
Border Radius: 16px
Padding: 20px
Shadow: 0 4px 12px rgba(0,0,0,0.3)
```

#### Elevated Card (Pro/Premium)
```
Background: Gradient (#1a1a2e → #2d2e3f)
Border: 1px solid #6366f1
Border Radius: 16px
Padding: 20px
Glow: 0 0 20px rgba(99, 102, 241, 0.2)
```

#### Compact Card
```
Background: #1a1a2e
Border Radius: 12px
Padding: 16px
```

### 2. Buttons

#### Primary Button
```
Background: #6366f1
Text: #ffffff
Border Radius: 12px
Padding: 16px 24px
Font: 16px / Semibold
Shadow: 0 2px 8px rgba(99, 102, 241, 0.3)

States:
- Hover: #5558e3
- Active: #4f52d9
- Disabled: opacity 0.5
```

#### Secondary Button
```
Background: transparent
Border: 1px solid #6366f1
Text: #6366f1
Border Radius: 12px
Padding: 16px 24px
```

#### Icon Button
```
Size: 44x44px (touch target)
Icon Size: 24px
Border Radius: 22px (circle)
Background: rgba(255, 255, 255, 0.1)
```

### 3. Inputs

#### Text Input
```
Background: rgba(255, 255, 255, 0.1)
Border: 1px solid rgba(255, 255, 255, 0.2)
Border Radius: 12px
Padding: 16px
Font: 16px / Regular
Text: #ffffff

Focus:
  Border: 2px solid #6366f1
  Glow: 0 0 0 4px rgba(99, 102, 241, 0.1)
```

#### Select / Dropdown
```
Same as Text Input
+ Chevron icon on right
```

### 4. Modals

#### Standard Modal
```
Background: #1a1a2e
Border Radius: 24px (top corners)
Max Width: 90% screen width
Padding: 24px
Backdrop: rgba(0, 0, 0, 0.7)
```

#### Premium Action Modal (Limit Reached)
```
Background: Gradient
Border: 2px solid #f59e0b
Border Radius: 20px
Padding: 28px
Icon: Warning or Lock icon
CTA: Upgrade buttons (Standard/Premium)
```

### 5. Navigation

#### Tab Bar
```
Background: #1a1a2e
Height: 64px + safe area
Icon Size: 24px
Active Color: #6366f1
Inactive Color: #9ca3af
Label: 12px / Semibold
```

#### Header
```
Background: transparent or #0f0f1e
Height: 56px + safe area
Title: 20px / Bold
Back Button: 44x44px
Actions: 44x44px icons
```

### 6. Lists

#### List Item
```
Background: #1a1a2e
Height: min 56px
Padding: 16px
Border Radius: 12px
Margin Bottom: 8px

States:
- Pressed: opacity 0.8
- Disabled: opacity 0.5
```

#### Swipeable List Item
```
Same as List Item
+ Swipe actions (Edit, Delete)
+ Swipe indicator
```

### 7. Badges

#### Plan Badge
```
Basic:
  Background: #374151
  Text: #ffffff

Standard:
  Background: #6366f1
  Text: #ffffff

Premium:
  Background: Gradient (#fbbf24 → #f59e0b)
  Text: #000000

Border Radius: 8px
Padding: 4px 12px
Font: 12px / Bold
```

#### Status Badge
```
Active: #10b981
Inactive: #6b7280
Trial: #f59e0b

Size: 8px circle or text badge
```

### 8. Progress Indicators

#### Action Counter
```
Circle progress bar
Size: 48px
Stroke Width: 4px
Color: #6366f1
Background: rgba(99, 102, 241, 0.2)
Text: "2/4" in center
```

#### Loading Spinner
```
Size: 24px - 48px
Color: #6366f1
Animation: Rotation 1s infinite
```

### 9. Charts & Visualizations

#### Birth Chart Wheel
```
Size: Full width - 40px padding
Background: Gradient with overlay
Outer Ring: Zodiac signs (#6366f1)
Middle Ring: Houses (#8b5cf6)
Inner Ring: Planets (#fbbf24)
Aspects: Connecting lines (color-coded)
```

#### Progress Bars
```
Height: 8px
Border Radius: 4px
Background: rgba(255, 255, 255, 0.1)
Fill: Gradient (#6366f1 → #8b5cf6)
```

---

## 🎭 Iconography

### Icon Style
- **Style**: Line icons (2px stroke)
- **Size**: 24px standard, 20px small, 32px large
- **Color**: Inherit from text or custom

### Custom Icons
```
☀️  Sun / Solar
🌙  Moon / Lunar
⭐  Star / Astrology
🔮  Crystal Ball / Divination
☯️  Yin Yang / Balance
♈  Zodiac Signs (Unicode)
```

### System Icons
- Home, Search, Profile
- Settings, Notifications
- Add, Edit, Delete
- Arrow, Chevron, Close

---

## 🌟 Special UI Elements

### 1. Membership Cards

#### Basic (Free)
```
Background: #1a1a2e
Border: 1px solid #374151
Icon: Simple icon
Badge: "Free"
```

#### Standard
```
Background: Linear Gradient
Border: 1px solid #6366f1
Glow: Subtle purple glow
Badge: "Standard"
Highlights: Blue accent
```

#### Premium
```
Background: Rich Gradient (#fbbf24 → #f59e0b → #6366f1)
Border: 2px solid #fbbf24
Glow: Strong gold glow
Badge: "Premium" with sparkle
Highlights: Gold accent
Animation: Subtle shimmer
```

### 2. Tarot Cards

```
Aspect Ratio: 2:3 (portrait)
Border Radius: 12px
Border: 2px solid #6366f1
Background: Card image or placeholder
Shadow: 0 8px 24px rgba(0,0,0,0.4)
Flip Animation: 3D rotation
States:
  - Face Down: Cosmic pattern
  - Face Up: Card illustration
  - Selected: Glow effect
```

### 3. Planet Indicators

```
Size: 32px - 48px circle
Background: Gradient per planet
Icon: Planet symbol (Unicode or custom)
Border: 2px solid lighter shade
Shadow: Soft glow

Colors by Planet:
  Sun: Gold (#fbbf24)
  Moon: Silver (#e5e7eb)
  Mercury: Yellow-green (#84cc16)
  Venus: Pink (#ec4899)
  Mars: Red (#ef4444)
  Jupiter: Orange (#f97316)
  Saturn: Brown (#92400e)
  Uranus: Cyan (#06b6d4)
  Neptune: Blue (#3b82f6)
  Pluto: Purple (#8b5cf6)
```

### 4. Moon Phase Display

```
Size: 64px - 120px
Background: Radial gradient (dark center)
Moon: SVG or emoji
Phase Label: Below moon
Sign: Zodiac symbol next to label
Illumination: Percentage text
```

### 5. Compatibility Radar Chart

```
Shape: Hexagon or Circle
Axes: Emotional, Physical, Mental, Spiritual, Communication, Values
Colors: Gradient fill (#6366f1 with opacity)
Grid: Concentric circles
Labels: Outside vertices
Score: Centered percentage
```

---

## 📱 Screen Layouts

### 1. Today Screen

```
┌─────────────────────────────┐
│  Today                      │
│                             │
│  ┌─────────────────────┐   │
│  │ Star Message Card   │   │
│  │ ⭐ "Your guidance..." │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ Moon Phase         │   │
│  │ 🌕 Full Moon       │   │
│  │ in Leo ♌           │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ Daily Forecast     │   │
│  │ Love: ★★★★☆        │   │
│  │ Work: ★★★☆☆        │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ Key Transit         │   │
│  │ Venus trine Jupiter │   │
│  └─────────────────────┘   │
└─────────────────────────────┘
```

### 2. Birth Chart Screen

```
┌─────────────────────────────┐
│  [View] [Learn Mode]        │
│                             │
│  ┌─────────────────────┐   │
│  │                     │   │
│  │   Chart Wheel       │   │
│  │     (SVG)           │   │
│  │                     │   │
│  └─────────────────────┘   │
│                             │
│  Sun in Aries ♈            │
│  Moon in Cancer ♋          │
│  Rising in Leo ♌           │
│                             │
│  [Planets List...]          │
│  [Houses Grid...]           │
│  [Aspects List...]          │
└─────────────────────────────┘
```

### 3. My Plan Screen

```
┌─────────────────────────────┐
│  My Plan                    │
│                             │
│  ┌─────────────────────┐   │
│  │ Current Plan: Free  │   │
│  │ Trial: 5 days left  │   │
│  │ Actions: 1/2 used   │   │
│  └─────────────────────┘   │
│                             │
│  Choose Your Plan:          │
│                             │
│  ┌─────────────────────┐   │
│  │ Basic - Free        │   │
│  │ ✓ 2 profiles        │   │
│  │ ✓ 2 actions/day     │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ Standard - $10/mo   │   │
│  │ ✓ 10 profiles       │   │
│  │ ✓ 4 actions/day     │   │
│  │ [Start Trial]       │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ Premium - $19/mo  ✨│   │
│  │ ✓ Unlimited         │   │
│  │ ✓ All features      │   │
│  │ [Start Trial]       │   │
│  └─────────────────────┘   │
└─────────────────────────────┘
```

### 4. Tarot Screen

```
┌─────────────────────────────┐
│  Tarot Reading              │
│                             │
│  Choose a Spread:           │
│  [Daily] [Love] [Work]      │
│  [Personal] [Celtic Cross]  │
│                             │
│  ┌─────────────────────┐   │
│  │                     │   │
│  │  [Tap to reveal]    │   │
│  │   3 cards face down │   │
│  │                     │   │
│  └─────────────────────┘   │
│                             │
│  Actions Used: 1/4          │
│                             │
│  [Draw Cards] 🔮            │
└─────────────────────────────┘
```

---

## ✨ Animations & Transitions

### Screen Transitions
```
Default: Slide from right (300ms ease-out)
Modal: Slide up from bottom (250ms ease-out)
Dismiss: Fade out (200ms ease-in)
```

### Micro-interactions
```
Button Tap: Scale down 0.95 (100ms)
Card Tap: Opacity 0.8 (150ms)
Loading: Fade in spinner (200ms)
Success: Checkmark scale + fade (400ms)
```

### Special Animations
```
Tarot Flip: 3D rotation 180° (600ms ease-in-out)
Chart Render: Fade in + scale (500ms)
Planet Transit: Slow orbit animation (continuous)
Moon Phase: Smooth rotation (1s per cycle)
```

---

## 🎁 Premium Features Visual Treatment

### Standard vs Premium Comparison

| Feature | Free/Basic | Standard | Premium |
|---------|------------|----------|---------|
| Border | 1px gray | 1px blue | 2px gold |
| Glow | None | Subtle | Strong |
| Badge | Gray | Blue | Gold gradient |
| Icons | Mono | Color | Color + sparkle |
| Animations | None | Subtle | Rich |

### Locked Content Indicator
```
Overlay: Semi-transparent dark (#000000 50%)
Icon: 🔒 Lock in center (32px)
Text: "Premium Feature" or "Upgrade to unlock"
Blur: backdrop-filter blur(4px)
```

---

## 🌍 Accessibility

### Contrast Ratios
- Text on background: minimum 4.5:1
- Large text: minimum 3:1
- Interactive elements: minimum 3:1

### Touch Targets
- Minimum: 44x44px
- Recommended: 48x48px
- Spacing: 8px minimum between targets

### Text Scaling
- Support dynamic type (iOS)
- Scale up to 200% without breaking layout
- Maintain readability at all sizes

### Color Blindness
- Don't rely solely on color
- Use icons + text labels
- Test with color blind simulators

---

## 📸 Image Guidelines

### Profile Photos
- Size: 96x96px minimum
- Shape: Circle
- Border: 2px solid #6366f1
- Placeholder: Gradient with initials

### Astro Map
- Full width - padding
- Ratio: 16:9
- Overlay: Semi-transparent UI
- Markers: Colored pins

### Coffee Cup Photos
- Ratio: 1:1 (square)
- Size: 300x300px minimum
- Border Radius: 12px
- Placeholder: Upload icon

---

## 🎨 Dark Mode (Default)

This app is dark-mode first. All colors and components are optimized for dark backgrounds.

### Elevation Hierarchy
```
Level 0: #0f0f1e (Background)
Level 1: #1a1a2e (Cards)
Level 2: #2d2e3f (Modals, Elevated)
Level 3: #3a3b4f (Floating elements)
```

### Shadows for Depth
```
Level 1: 0 2px 8px rgba(0,0,0,0.2)
Level 2: 0 4px 16px rgba(0,0,0,0.3)
Level 3: 0 8px 24px rgba(0,0,0,0.4)
Glow: 0 0 20px rgba(99, 102, 241, 0.2)
```

---

## 📏 Responsive Design

### Breakpoints
```
Small: < 375px (iPhone SE)
Medium: 375-414px (Standard phones)
Large: > 414px (Plus/Max phones)
Tablet: > 768px (iPads)
```

### Adaptive Layouts
- Single column on phones
- Two columns on tablets (landscape)
- Grid layouts adapt column count
- Font sizes scale slightly on larger screens

---

## 🧩 Component Usage Examples

See `/components` directory for React Native implementations:
- `ActionsCounter.tsx` - Premium action display
- `ActionLimitModal.tsx` - Limit reached modal
- `PaymentSheet.tsx` - Subscription purchase
- `ProfileSelector.tsx` - Person profile picker
- `ChartWheel.tsx` - Birth chart visualization

---

**Last Updated**: November 2025
**Version**: MVP 1.0
**Design Lead**: Astrology Super-App Team
