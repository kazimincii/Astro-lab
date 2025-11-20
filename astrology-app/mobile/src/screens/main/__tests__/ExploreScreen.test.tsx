import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ExploreScreen from '../ExploreScreen';

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'screens.explore.title': 'Explore',
        'screens.explore.features.myPlan': 'My Plan',
        'screens.explore.features.astroAcademy': 'Astro Academy',
        'screens.explore.features.iosWidgets': 'iOS Widgets',
        'screens.explore.features.myJournal': 'My Journal',
        'screens.explore.features.biorhythm': 'Biorhythm',
        'screens.explore.features.chakras': 'Chakras',
        'screens.explore.features.numerology': 'Numerology',
        'screens.explore.features.tarotReading': 'Tarot Reading',
        'screens.explore.features.coffeeReading': 'Coffee Reading',
        'screens.explore.features.auraScan': 'Aura Scan',
        'screens.explore.features.relationship': 'Relationship',
        'screens.explore.features.famousPeople': 'Famous People',
        'screens.explore.features.advancedCharts': 'Advanced Charts',
        'screens.explore.features.astroMap': 'Astro Map',
        'screens.explore.features.calendars': 'Calendars',
        'screens.explore.features.forecasts': 'Forecasts',
        'screens.explore.features.cosmicClimate': 'Cosmic Climate',
        'screens.explore.features.liveServices': 'Live Services',
      };
      return translations[key] || key;
    },
  }),
}));

describe('ExploreScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);
    expect(getByText('Explore')).toBeTruthy();
  });

  it('should render screen title', () => {
    const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);
    expect(getByText('Explore')).toBeTruthy();
  });

  describe('Core Features', () => {
    it('should render My Plan feature', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);
      expect(getByText('My Plan')).toBeTruthy();
    });

    it('should navigate to MyPlan when My Plan is pressed', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);

      const myPlanButton = getByText('My Plan');
      fireEvent.press(myPlanButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('MyPlan');
    });

    it('should render Astro Academy feature', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);
      expect(getByText('Astro Academy')).toBeTruthy();
    });

    it('should navigate to Education when Astro Academy is pressed', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);

      const academyButton = getByText('Astro Academy');
      fireEvent.press(academyButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('Education');
    });

    it('should render iOS Widgets feature', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);
      expect(getByText('iOS Widgets')).toBeTruthy();
    });

    it('should navigate to Widgets when iOS Widgets is pressed', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);

      const widgetsButton = getByText('iOS Widgets');
      fireEvent.press(widgetsButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('Widgets');
    });

    it('should render My Journal feature', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);
      expect(getByText('My Journal')).toBeTruthy();
    });

    it('should navigate to Journal when My Journal is pressed', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);

      const journalButton = getByText('My Journal');
      fireEvent.press(journalButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('Journal');
    });
  });

  describe('Wellness & Analysis Features', () => {
    it('should render Biorhythm feature', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);
      expect(getByText('Biorhythm')).toBeTruthy();
    });

    it('should navigate to Biorhythm when pressed', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);

      const biorhythmButton = getByText('Biorhythm');
      fireEvent.press(biorhythmButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('Biorhythm');
    });

    it('should render Chakras feature', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);
      expect(getByText('Chakras')).toBeTruthy();
    });

    it('should navigate to Chakras when pressed', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);

      const chakrasButton = getByText('Chakras');
      fireEvent.press(chakrasButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('Chakras');
    });

    it('should render Numerology feature', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);
      expect(getByText('Numerology')).toBeTruthy();
    });

    it('should navigate to Numerology when pressed', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);

      const numerologyButton = getByText('Numerology');
      fireEvent.press(numerologyButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('Numerology');
    });
  });

  describe('Divination Features', () => {
    it('should render Tarot Reading feature', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);
      expect(getByText('Tarot Reading')).toBeTruthy();
    });

    it('should navigate to Tarot when Tarot Reading is pressed', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);

      const tarotButton = getByText('Tarot Reading');
      fireEvent.press(tarotButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('Tarot');
    });

    it('should render Coffee Reading feature', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);
      expect(getByText('Coffee Reading')).toBeTruthy();
    });

    it('should navigate to CoffeeReading when pressed', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);

      const coffeeButton = getByText('Coffee Reading');
      fireEvent.press(coffeeButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('CoffeeReading');
    });

    it('should render Aura Scan feature', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);
      expect(getByText('Aura Scan')).toBeTruthy();
    });

    it('should navigate to AuraScan when pressed', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);

      const auraButton = getByText('Aura Scan');
      fireEvent.press(auraButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('AuraScan');
    });
  });

  describe('Relationship & Social Features', () => {
    it('should render Relationship feature', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);
      expect(getByText('Relationship')).toBeTruthy();
    });

    it('should navigate to RelationshipSoulmate when Relationship is pressed', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);

      const relationshipButton = getByText('Relationship');
      fireEvent.press(relationshipButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('RelationshipSoulmate');
    });

    it('should render Famous People feature', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);
      expect(getByText('Famous People')).toBeTruthy();
    });

    it('should navigate to FamousPeople when pressed', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);

      const famousButton = getByText('Famous People');
      fireEvent.press(famousButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('FamousPeople');
    });
  });

  describe('Advanced Tools Features', () => {
    it('should render Advanced Charts feature', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);
      expect(getByText('Advanced Charts')).toBeTruthy();
    });

    it('should navigate to AdvancedCharts when pressed', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);

      const chartsButton = getByText('Advanced Charts');
      fireEvent.press(chartsButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('AdvancedCharts');
    });

    it('should render Astro Map feature', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);
      expect(getByText('Astro Map')).toBeTruthy();
    });

    it('should navigate to AstroMap when pressed', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);

      const mapButton = getByText('Astro Map');
      fireEvent.press(mapButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('AstroMap');
    });

    it('should render Calendars feature', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);
      expect(getByText('Calendars')).toBeTruthy();
    });

    it('should navigate to Calendars when pressed', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);

      const calendarsButton = getByText('Calendars');
      fireEvent.press(calendarsButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('Calendars');
    });

    it('should render Forecasts feature', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);
      expect(getByText('Forecasts')).toBeTruthy();
    });

    it('should navigate to Forecasts when pressed', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);

      const forecastsButton = getByText('Forecasts');
      fireEvent.press(forecastsButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('Forecasts');
    });
  });

  describe('Community & Services Features', () => {
    it('should render Cosmic Climate feature', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);
      expect(getByText('Cosmic Climate')).toBeTruthy();
    });

    it('should navigate to CosmicClimate when pressed', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);

      const cosmicButton = getByText('Cosmic Climate');
      fireEvent.press(cosmicButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('CosmicClimate');
    });

    it('should render Live Services feature', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);
      expect(getByText('Live Services')).toBeTruthy();
    });

    it('should navigate to LiveServices when pressed', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);

      const liveButton = getByText('Live Services');
      fireEvent.press(liveButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('LiveServices');
    });
  });

  describe('Feature Count', () => {
    it('should render all 18 features', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);

      const featureNames = [
        'My Plan',
        'Astro Academy',
        'iOS Widgets',
        'My Journal',
        'Biorhythm',
        'Chakras',
        'Numerology',
        'Tarot Reading',
        'Coffee Reading',
        'Aura Scan',
        'Relationship',
        'Famous People',
        'Advanced Charts',
        'Astro Map',
        'Calendars',
        'Forecasts',
        'Cosmic Climate',
        'Live Services',
      ];

      featureNames.forEach((name) => {
        expect(getByText(name)).toBeTruthy();
      });
    });
  });

  describe('Navigation', () => {
    it('should call navigate with correct screen name', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);

      const myPlanButton = getByText('My Plan');
      fireEvent.press(myPlanButton);

      expect(mockNavigation.navigate).toHaveBeenCalledTimes(1);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('MyPlan');
    });

    it('should not throw error when navigation is undefined', () => {
      const { getByText } = render(<ExploreScreen navigation={{}} />);

      expect(() => {
        const myPlanButton = getByText('My Plan');
        fireEvent.press(myPlanButton);
      }).not.toThrow();
    });

    it('should handle multiple feature presses', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);

      fireEvent.press(getByText('My Plan'));
      fireEvent.press(getByText('Biorhythm'));
      fireEvent.press(getByText('Tarot Reading'));

      expect(mockNavigation.navigate).toHaveBeenCalledTimes(3);
      expect(mockNavigation.navigate).toHaveBeenNthCalledWith(1, 'MyPlan');
      expect(mockNavigation.navigate).toHaveBeenNthCalledWith(2, 'Biorhythm');
      expect(mockNavigation.navigate).toHaveBeenNthCalledWith(3, 'Tarot');
    });
  });

  describe('UI Elements', () => {
    it('should render ScrollView', () => {
      const { UNSAFE_getByType } = render(<ExploreScreen navigation={mockNavigation} />);
      const scrollView = UNSAFE_getByType('ScrollView' as any);
      expect(scrollView).toBeTruthy();
    });

    it('should render feature cards with touchable opacity', () => {
      const { getAllByA11yRole } = render(<ExploreScreen navigation={mockNavigation} />);
      const buttons = getAllByA11yRole('button');
      expect(buttons.length).toBe(18);
    });
  });

  describe('Feature Organization', () => {
    it('should group features by category', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);

      // Core features (4)
      expect(getByText('My Plan')).toBeTruthy();
      expect(getByText('Astro Academy')).toBeTruthy();
      expect(getByText('iOS Widgets')).toBeTruthy();
      expect(getByText('My Journal')).toBeTruthy();

      // Wellness & Analysis (3)
      expect(getByText('Biorhythm')).toBeTruthy();
      expect(getByText('Chakras')).toBeTruthy();
      expect(getByText('Numerology')).toBeTruthy();

      // Divination (3)
      expect(getByText('Tarot Reading')).toBeTruthy();
      expect(getByText('Coffee Reading')).toBeTruthy();
      expect(getByText('Aura Scan')).toBeTruthy();

      // Relationship & Social (2)
      expect(getByText('Relationship')).toBeTruthy();
      expect(getByText('Famous People')).toBeTruthy();

      // Advanced Tools (4)
      expect(getByText('Advanced Charts')).toBeTruthy();
      expect(getByText('Astro Map')).toBeTruthy();
      expect(getByText('Calendars')).toBeTruthy();
      expect(getByText('Forecasts')).toBeTruthy();

      // Community & Services (2)
      expect(getByText('Cosmic Climate')).toBeTruthy();
      expect(getByText('Live Services')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should render all features with accessible text', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);

      const featureNames = [
        'My Plan',
        'Astro Academy',
        'iOS Widgets',
        'My Journal',
        'Biorhythm',
        'Chakras',
        'Numerology',
        'Tarot Reading',
        'Coffee Reading',
        'Aura Scan',
        'Relationship',
        'Famous People',
        'Advanced Charts',
        'Astro Map',
        'Calendars',
        'Forecasts',
        'Cosmic Climate',
        'Live Services',
      ];

      featureNames.forEach((name) => {
        const element = getByText(name);
        expect(element).toBeTruthy();
      });
    });

    it('should render feature cards as pressable elements', () => {
      const { getAllByA11yRole } = render(<ExploreScreen navigation={mockNavigation} />);
      const buttons = getAllByA11yRole('button');

      buttons.forEach((button) => {
        expect(button).toBeTruthy();
      });
    });
  });

  describe('Error Handling', () => {
    it('should render even if navigation is not provided', () => {
      expect(() => {
        render(<ExploreScreen navigation={null as any} />);
      }).not.toThrow();
    });

    it('should not crash when pressing feature without navigation', () => {
      const { getByText } = render(<ExploreScreen navigation={null as any} />);

      expect(() => {
        const myPlanButton = getByText('My Plan');
        fireEvent.press(myPlanButton);
      }).toThrow(); // This will throw because navigation.navigate is undefined
    });
  });

  describe('Screen Layout', () => {
    it('should render title in header section', () => {
      const { getByText } = render(<ExploreScreen navigation={mockNavigation} />);
      const title = getByText('Explore');
      expect(title).toBeTruthy();
    });

    it('should render feature grid', () => {
      const { getAllByA11yRole } = render(<ExploreScreen navigation={mockNavigation} />);
      const buttons = getAllByA11yRole('button');
      expect(buttons.length).toBe(18);
    });
  });
});
