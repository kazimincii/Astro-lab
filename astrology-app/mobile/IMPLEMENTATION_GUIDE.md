# i18n Implementation Guide - Astrology App

## Overview
This guide explains how to use the newly implemented internationalization (i18n) system in the Astrology App. The app now supports Turkish (tr) and English (en) languages.

## Project Structure

```
mobile/src/i18n/
├── locales/
│   ├── en/
│   │   ├── auth.json          # Authentication screens
│   │   ├── common.json         # Common UI elements
│   │   ├── plans.json          # Subscription plans & pricing
│   │   ├── screens.json        # Main app screens
│   │   └── index.ts
│   └── tr/
│       ├── auth.json
│       ├── common.json
│       ├── plans.json
│       ├── screens.json
│       └── index.ts
├── config.ts                   # i18n configuration
└── index.ts                    # Exports
```

## Translation Files

### 1. **auth.json** (~120 strings)
- Welcome screen messages
- Onboarding flow (4 steps)
- Login/Register forms
- Password reset
- Permission dialogs (notifications, location)

### 2. **common.json** (~80 strings)
- Buttons (OK, Cancel, Save, etc.)
- Navigation labels
- Loading states
- Error messages
- Empty states
- Success messages
- Time-related text
- Action counters

### 3. **plans.json** (~90 strings)
- Action limit modals
- Plan names and descriptions
- Free/Standard/Premium features
- Upgrade modals
- Pricing information
- Trial information
- Terms & conditions

### 4. **screens.json** (~320 strings)
- Today screen
- Profiles management
- Chakra descriptions (7 chakras with detailed info)
- Meditation guides
- Tarot reading
- Numerology
- Biorhythm
- Journal prompts
- Education categories
- Settings sections

**Total: ~610 translated strings**

## How to Use i18n in Your Code

### 1. Import the Hook
```typescript
import { useTranslation } from 'react-i18next';
```

### 2. Use in Components
```typescript
const MyComponent = () => {
  const { t, i18n } = useTranslation();

  return (
    <View>
      <Text>{t('common.buttons.save')}</Text>
      <Text>{t('auth.login.title')}</Text>
    </View>
  );
};
```

### 3. Translation Key Structure
Keys follow a dot notation pattern:
```
{namespace}.{category}.{key}
```

Examples:
- `auth.login.title` → "Welcome Back" / "Tekrar Hoş Geldiniz"
- `common.buttons.cancel` → "Cancel" / "İptal"
- `plans.premium.name` → "Premium" / "Premium"
- `screens.today.title` → "Today" / "Bugün"

### 4. With Parameters
For dynamic values, use interpolation:
```typescript
<Text>{t('common.actions.remaining', { count: 5 })}</Text>
// Output: "5 remaining" or "5 kaldı"
```

### 5. Change Language
```typescript
import { changeLanguage } from '@/i18n';

// Change to Turkish
await changeLanguage('tr');

// Change to English
await changeLanguage('en');
```

### 6. Get Current Language
```typescript
import { getCurrentLanguage } from '@/i18n';

const currentLang = getCurrentLanguage(); // 'en' or 'tr'
```

### 7. Using the LanguageSelector Component
```typescript
import LanguageSelector from '@/components/LanguageSelector';

const SettingsScreen = () => {
  return (
    <View>
      <Text>Select Language:</Text>
      <LanguageSelector />
    </View>
  );
};
```

## Migration Examples

### Before (Hardcoded):
```typescript
<Text>Welcome Back</Text>
<TouchableOpacity>
  <Text>Login</Text>
</TouchableOpacity>
<Text>Don't have an account? Sign Up</Text>
```

### After (i18n):
```typescript
const { t } = useTranslation();

<Text>{t('auth.login.title')}</Text>
<TouchableOpacity>
  <Text>{t('auth.login.loginButton')}</Text>
</TouchableOpacity>
<Text>{t('auth.login.noAccount')} {t('auth.login.signUp')}</Text>
```

## Common Translation Paths

### Authentication
```typescript
t('auth.welcome.title')
t('auth.onboarding.step1.title')
t('auth.login.email')
t('auth.register.signUpButton')
t('auth.forgotPassword.title')
```

### Common UI
```typescript
t('common.buttons.save')
t('common.loading.default')
t('common.errors.network')
t('common.messages.success')
t('common.navigation.today')
```

### Plans & Pricing
```typescript
t('plans.actionLimit.title')
t('plans.premium.name')
t('plans.upgradeModal.title')
t('plans.comparison.title')
```

### Screens
```typescript
t('screens.today.title')
t('screens.profiles.empty.title')
t('screens.chakras.root.name')
t('screens.meditation.breathwork.beginner.name')
t('screens.settings.account.title')
```

## Features

### ✅ Auto Language Detection
The app automatically detects the device language on first launch:
- If device is set to Turkish → defaults to Turkish
- Otherwise → defaults to English

### ✅ Persistent Language Preference
User's language choice is saved using AsyncStorage and persists across app restarts.

### ✅ Real-time Switching
Language changes are applied immediately without app restart.

### ✅ Fallback System
If a translation key is missing, the app falls back to English.

## Priority Screens to Update

Start migration with these high-traffic screens:

1. **Authentication Flow**
   - LoginScreen.tsx
   - RegisterScreen.tsx
   - OnboardingScreen.tsx

2. **Main Screens**
   - TodayScreen.tsx
   - ProfilesScreen.tsx
   - MyPlanScreen.tsx

3. **Modals**
   - ActionLimitModal.tsx
   - MembershipCard.tsx

4. **Navigation**
   - Update tab labels in navigation config

## Testing Checklist

- [ ] Test language switching in LanguageSelector
- [ ] Verify text updates without app restart
- [ ] Check all screens display correct language
- [ ] Test with empty AsyncStorage (first launch)
- [ ] Verify Turkish text doesn't overflow UI elements
- [ ] Test all error messages in both languages
- [ ] Validate plan pricing displays correctly
- [ ] Check chakra descriptions render properly

## Adding New Translations

### Step 1: Add to JSON files
Add your key to both `locales/en/[file].json` and `locales/tr/[file].json`:

**en/common.json**
```json
{
  "buttons": {
    "newButton": "New Button"
  }
}
```

**tr/common.json**
```json
{
  "buttons": {
    "newButton": "Yeni Buton"
  }
}
```

### Step 2: Use in component
```typescript
<Text>{t('common.buttons.newButton')}</Text>
```

## Best Practices

1. **Always use translation keys** - Never hardcode user-facing text
2. **Keep keys descriptive** - Use clear, hierarchical naming
3. **Add both languages** - Always translate to both EN and TR
4. **Test Turkish text** - Turkish words are typically 10-15% longer
5. **Use parameters** - For dynamic values, use interpolation
6. **Consistent formatting** - Follow existing key structure
7. **Context matters** - Group related translations together

## Troubleshooting

### Translation not showing
- Check if key exists in both language files
- Verify correct key path (auth.login.title not auth.title.login)
- Ensure i18n is initialized in App.tsx

### Language not changing
- Verify changeLanguage is awaited
- Check AsyncStorage permissions
- Clear app data and restart

### TypeScript errors
- Update tsconfig.json if needed
- Ensure JSON files are properly formatted
- Check import paths are correct

## Future Enhancements

- [ ] Add more languages (Arabic, Spanish, etc.)
- [ ] Implement RTL support for Arabic
- [ ] Add language-specific number/date formatting
- [ ] Create translation management dashboard
- [ ] Add missing translation detection
- [ ] Implement translation validation tests

## Resources

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
- [Expo Localization](https://docs.expo.dev/versions/latest/sdk/localization/)

---

**Last Updated:** 2025-11-17
**Version:** 1.0.0
**Languages Supported:** English (en), Turkish (tr)
