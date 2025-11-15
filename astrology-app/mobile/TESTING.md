# Mobile Testing Guide

Bu dokümantasyon React Native Expo uygulaması için test infrastructure'ını açıklar.

## Test Stack

- **Jest**: JavaScript test framework
- **React Native Testing Library**: React Native component testleri için
- **jest-expo**: Expo için Jest preset
- **React Test Renderer**: Component rendering

## Kurulum

Test dependency'leri zaten yüklü. Eğer yeniden kurulum gerekirse:

```bash
npm install --save-dev --legacy-peer-deps \
  jest \
  @testing-library/react-native \
  jest-expo \
  @types/jest \
  react-test-renderer@18.2.0
```

## Test Çalıştırma

```bash
# Tüm testleri çalıştır
npm test

# Watch mode (otomatik yeniden çalıştırma)
npm run test:watch

# Coverage raporu
npm run test:coverage
```

## Test Yazma

### Basit Component Test Örneği

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';

describe('LoginScreen', () => {
  it('should render correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
  });

  it('should handle user input', () => {
    const { getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('Email');
    fireEvent.changeText(emailInput, 'test@example.com');

    expect(emailInput.props.value).toBe('test@example.com');
  });
});
```

### Async İşlemler Testi

```typescript
import { waitFor } from '@testing-library/react-native';

it('should call API and update state', async () => {
  const { getByText } = render(<MyComponent />);

  fireEvent.press(getByText('Submit'));

  await waitFor(() => {
    expect(getByText('Success')).toBeTruthy();
  });
});
```

### Mock'lama

```typescript
// API mock'lama
jest.mock('@/api/auth', () => ({
  authApi: {
    login: jest.fn(),
  },
}));

// Store mock'lama
jest.mock('@/store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

// Navigation mock'lama
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};
```

## Konfigürasyon

### package.json - Jest Konfigürasyonu

```json
{
  "jest": {
    "preset": "jest-expo",
    "testEnvironment": "node",
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|react-native-svg))"
    ],
    "moduleNameMapper": {
      "^@/(.*)$": "<rootDir>/src/$1"
    },
    "setupFiles": ["<rootDir>/jest.setup.js"]
  }
}
```

### jest.setup.js

Global test kurulumu için kullanılır:
- Expo modüllerinin mock'lanması
- React Native Gesture Handler mock'ları
- Reanimated mock'ları
- AsyncStorage mock'ları

## Test Dosya Organizasyonu

```
src/
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.tsx
│   │   └── __tests__/
│   │       └── LoginScreen.test.tsx
│   └── main/
│       ├── ProfilesScreen.tsx
│       └── __tests__/
│           └── ProfilesScreen.test.tsx
└── components/
    ├── Button.tsx
    └── __tests__/
        └── Button.test.tsx
```

## Best Practices

1. **Test İsimlendirme**: Açıklayıcı ve "should" kullanarak
2. **Arrange-Act-Assert**: Test yapısını net tut
3. **Mock Kullanımı**: External dependency'leri mock'la
4. **Cleanup**: Her test izole olmalı
5. **Coverage**: Kritik akışları test et, %100 coverage hedefleme

## Yaygın Sorunlar ve Çözümler

### "Cannot find module" hatası
- `moduleNameMapper` konfigürasyonunu kontrol et
- Path alias'ların doğru ayarlandığından emin ol

### Babel konfigürasyon hataları
- `transformIgnorePatterns`'ı kontrol et
- Gerekli paketlerin listede olduğundan emin ol

### Async testler timeout oluyor
- `waitFor` timeout'unu artır
- API çağrılarının mock'landığından emin ol

## Örnek Testler

Projede örnek testler mevcut:
- `src/screens/auth/__tests__/LoginScreen.test.tsx`

## Kaynaklar

- [React Native Testing Library Docs](https://callstack.github.io/react-native-testing-library/)
- [Jest Documentation](https://jestjs.io/)
- [Testing React Native Apps](https://reactnative.dev/docs/testing-overview)
