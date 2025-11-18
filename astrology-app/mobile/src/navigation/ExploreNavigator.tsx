import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ExploreScreen from '@/screens/main/ExploreScreen';
import EducationScreen from '@/screens/main/EducationScreen';
import EducationArticleScreen from '@/screens/main/EducationArticleScreen';
import WidgetsScreen from '@/screens/main/WidgetsScreen';
import JournalScreen from '@/screens/main/JournalScreen';
import BiorhythmScreen from '@/screens/main/BiorhythmScreen';
import ChakrasScreen from '@/screens/main/ChakrasScreen';
import RelationshipSoulmateScreen from '@/screens/main/RelationshipSoulmateScreen';
import AdvancedChartsScreen from '@/screens/main/AdvancedChartsScreen';
import ChartTypeDetailScreen from '@/screens/main/ChartTypeDetailScreen';
// New screens
import TarotScreen from '@/screens/main/TarotScreen';
import CoffeeReadingScreen from '@/screens/main/CoffeeReadingScreen';
import NumerologyScreen from '@/screens/main/NumerologyScreen';
import CalendarsScreen from '@/screens/main/CalendarsScreen';
import FamousPeopleScreen from '@/screens/main/FamousPeopleScreen';
import AstroMapScreen from '@/screens/main/AstroMapScreen';
import LiveServicesScreen from '@/screens/main/LiveServicesScreen';
import CosmicClimateScreen from '@/screens/main/CosmicClimateScreen';
import AuraScanScreen from '@/screens/main/AuraScanScreen';
import ForecastsScreen from '@/screens/main/ForecastsScreen';
import BirthChartDetailScreen from '@/screens/main/BirthChartDetailScreen';
import MyPlanScreen from '@/screens/main/MyPlanScreen';

const Stack = createStackNavigator();

export default function ExploreNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#0f0f1e' },
      }}
    >
      <Stack.Screen name="ExploreHome" component={ExploreScreen} />

      {/* Existing screens - with profileId parameter support */}
      <Stack.Screen 
        name="Education" 
        component={EducationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="EducationArticle" 
        component={EducationArticleScreen}
        options={{ headerShown: true, title: 'Article' }}
      />
      <Stack.Screen 
        name="Widgets" 
        component={WidgetsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Journal" 
        component={JournalScreen}
        options={{ headerShown: true, title: 'Journal' }}
        initialParams={{ profileId: '' }}
      />
      <Stack.Screen 
        name="Biorhythm" 
        component={BiorhythmScreen}
        options={{ headerShown: true, title: 'Biorhythm' }}
        initialParams={{ profileId: '' }}
      />
      <Stack.Screen 
        name="Chakras" 
        component={ChakrasScreen}
        options={{ headerShown: true, title: 'Chakras' }}
        initialParams={{ profileId: '' }}
      />
      <Stack.Screen 
        name="RelationshipSoulmate" 
        component={RelationshipSoulmateScreen}
        options={{ headerShown: true, title: 'Soul Mate Match' }}
        initialParams={{ profileId: '' }}
      />
      <Stack.Screen 
        name="AdvancedCharts" 
        component={AdvancedChartsScreen}
        options={{ headerShown: true, title: 'Advanced Charts' }}
        initialParams={{ profileId: '' }}
      />
      <Stack.Screen 
        name="ChartTypeDetail" 
        component={ChartTypeDetailScreen}
        options={{ headerShown: true, title: 'Chart Type' }}
        initialParams={{ profileId: '', chartType: '' }}
      />

      <Stack.Screen
        name="BirthChartDetail"
        component={BirthChartDetailScreen}
        options={{ headerShown: true, title: 'Birth Chart' }}
        initialParams={{ profileId: '' }}
      />
      <Stack.Screen
        name="Forecasts"
        component={ForecastsScreen}
        options={{ headerShown: true, title: 'Forecasts' }}
        initialParams={{ profileId: '' }}
      />
      <Stack.Screen
        name="Tarot"
        component={TarotScreen}
        options={{ headerShown: true, title: 'Tarot Reading' }}
      />
      <Stack.Screen
        name="CoffeeReading"
        component={CoffeeReadingScreen}
        options={{ headerShown: true, title: 'Coffee Reading' }}
      />
      <Stack.Screen
        name="Numerology"
        component={NumerologyScreen}
        options={{ headerShown: true, title: 'Numerology' }}
        initialParams={{ profileId: '' }}
      />
      <Stack.Screen
        name="Calendars"
        component={CalendarsScreen}
        options={{ headerShown: true, title: 'Astro Calendars' }}
      />
      <Stack.Screen
        name="FamousPeople"
        component={FamousPeopleScreen}
        options={{ headerShown: true, title: 'Famous Matches' }}
        initialParams={{ profileId: '' }}
      />
      <Stack.Screen
        name="AstroMap"
        component={AstroMapScreen}
        options={{ headerShown: true, title: 'Astro Map' }}
        initialParams={{ profileId: '' }}
      />
      <Stack.Screen
        name="LiveServices"
        component={LiveServicesScreen}
        options={{ headerShown: true, title: 'Live Services' }}
      />
      <Stack.Screen
        name="CosmicClimate"
        component={CosmicClimateScreen}
        options={{ headerShown: true, title: 'Cosmic Climate' }}
      />
      <Stack.Screen
        name="AuraScan"
        component={AuraScanScreen}
        options={{ headerShown: true, title: 'Aura Scan' }}
      />
      <Stack.Screen
        name="MyPlan"
        component={MyPlanScreen}
        options={{ headerShown: true, title: 'My Plan' }}
      />
    </Stack.Navigator>
  );
}
