/**
 * Screen Navigation Parameters
 *
 * This file defines all navigation parameters for screens that require profile data
 * Usage: navigation.navigate('ScreenName', { profileId: 'user-123' })
 */

export interface ExploreNavigationParams {
  BiorhythmScreen: { profileId: string };
  NumerologyScreen: { profileId: string };
  ChakrasScreen: { profileId: string };
  FamousPeopleScreen: { profileId: string };
  AstroMapScreen: { profileId: string };
  AdvancedChartsScreen: { profileId: string };
  BirthChartDetailScreen: { profileId: string; chartId?: string };
  ForecastsScreen: { profileId: string };
  TarotScreen?: { profileId?: string };
  CoffeeReadingScreen?: { profileId?: string };
  CalendarsScreen?: Record<string, never>;
  LiveServicesScreen?: Record<string, never>;
  CosmicClimateScreen?: Record<string, never>;
  AuraScanScreen: { profileId: string };
  JournalScreen: { profileId: string };
  EducationScreen?: Record<string, never>;
  EducationArticleScreen: { articleId: string };
  WidgetsScreen?: Record<string, never>;
  RelationshipSoulmateScreen: { profileId: string };
  ChartTypeDetailScreen: { chartType: string; profileId: string };
  MyPlanScreen?: Record<string, never>;
}

/**
 * Profile-dependent screens
 * These screens REQUIRE a profileId parameter
 */
export const PROFILE_REQUIRED_SCREENS = [
  'BiorhythmScreen',
  'NumerologyScreen',
  'ChakrasScreen',
  'FamousPeopleScreen',
  'AstroMapScreen',
  'AdvancedChartsScreen',
  'BirthChartDetailScreen',
  'ForecastsScreen',
  'AuraScanScreen',
  'JournalScreen',
  'RelationshipSoulmateScreen',
  'ChartTypeDetailScreen',
] as const;

/**
 * Global screens
 * These screens do NOT require profileId
 */
export const GLOBAL_SCREENS = [
  'TarotScreen',
  'CoffeeReadingScreen',
  'CalendarsScreen',
  'LiveServicesScreen',
  'CosmicClimateScreen',
  'EducationScreen',
  'WidgetsScreen',
  'MyPlanScreen',
] as const;

/**
 * Check if screen requires profile
 */
export const screenRequiresProfile = (
  screenName: string
): screenName is typeof PROFILE_REQUIRED_SCREENS[number] => {
  return PROFILE_REQUIRED_SCREENS.includes(
    screenName as typeof PROFILE_REQUIRED_SCREENS[number]
  );
};
