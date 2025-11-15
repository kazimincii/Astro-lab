import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ExploreScreen from '@/screens/main/ExploreScreen';
import EducationScreen from '@/screens/main/EducationScreen';
import EducationArticleScreen from '@/screens/main/EducationArticleScreen';

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
    </Stack.Navigator>
  );
}
