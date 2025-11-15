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
      <Stack.Screen name="Education" component={EducationScreen} />
      <Stack.Screen name="EducationArticle" component={EducationArticleScreen} />
      <Stack.Screen name="Widgets" component={WidgetsScreen} />
      <Stack.Screen name="Journal" component={JournalScreen} />
      <Stack.Screen name="Biorhythm" component={BiorhythmScreen} />
      <Stack.Screen name="Chakras" component={ChakrasScreen} />
      <Stack.Screen name="RelationshipSoulmate" component={RelationshipSoulmateScreen} />
      <Stack.Screen name="AdvancedCharts" component={AdvancedChartsScreen} />
      <Stack.Screen name="ChartTypeDetail" component={ChartTypeDetailScreen} />
    </Stack.Navigator>
  );
}
