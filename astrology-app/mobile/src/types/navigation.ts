// Navigation type definitions for the app

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Onboarding: undefined;
};

export type MainTabParamList = {
  Today: undefined;
  Profiles: undefined;
  Explore: undefined;
  AI: undefined;
  Settings: undefined;
};

export type ExploreStackParamList = {
  ExploreHome: undefined;
  Education: undefined;
  EducationArticle: { articleId: string };
  Widgets: undefined;
  Journal: undefined;
  Biorhythm: { profileId: string };
  Chakras: { profileId: string };
  RelationshipSoulmate: { profileId: string };
  AdvancedCharts: { profileId: string };
  ChartTypeDetail: { profileId: string; chartType: string };

  // New MVP screens
  BirthChartDetail: { profileId: string };
  Forecasts: { profileId: string };
  Tarot: undefined;
  CoffeeReading: undefined;
  Numerology: { profileId: string };
  Calendars: undefined;
  FamousPeople: { profileId: string };
  AstroMap: { profileId: string };
  LiveServices: undefined;
  CosmicClimate: undefined;
  AuraScan: undefined;
  MyPlan: undefined;
};

// Navigation prop types for screens
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

// Root navigation prop
export type RootNavigationProp = StackNavigationProp<RootStackParamList>;

// Auth navigation prop
export type AuthNavigationProp = StackNavigationProp<AuthStackParamList>;

// Main tab navigation prop
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

// Explore stack navigation prop
export type ExploreNavigationProp = CompositeNavigationProp<
  StackNavigationProp<ExploreStackParamList>,
  MainTabNavigationProp
>;

// Screen props helper types
export type ScreenProps<
  ParamList extends Record<string, object | undefined>,
  RouteName extends keyof ParamList
> = {
  navigation: StackNavigationProp<ParamList, RouteName>;
  route: RouteProp<ParamList, RouteName>;
};
