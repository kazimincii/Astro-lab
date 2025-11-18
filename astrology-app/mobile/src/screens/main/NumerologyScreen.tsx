// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { numerologyApi, NumerologyProfile } from '@/api/numerology';
import { useProfile } from '@/contexts/ProfileContext';
import { ProfileSelector } from '@/components/ProfileSelector';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default function NumerologyScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { selectedProfile, isLoading: profileLoading } = useProfile();
  const [profile, setProfile] = useState<NumerologyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedProfile?.id) {
      fetchNumerology();
    } else {
      setLoading(false);
    }
  }, [selectedProfile?.id]);

  const fetchNumerology = async () => {
    if (!selectedProfile?.id) return;

    try {
      setLoading(true);
      const data = await numerologyApi.getNumerologyProfile(selectedProfile.id);
      setProfile(data);
    } catch (error) {
      console.error('Error fetching numerology:', error);
      alert(t('screens.numerology.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (loading || profileLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0f0f1e]">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!selectedProfile?.id) {
    return (
      <ScrollView className="flex-1 bg-[#0f0f1e]" contentContainerStyle={{ paddingBottom: 24 }}>
        <LinearGradient colors={['#1a1a2e', '#0f0f1e']} className="px-6 pt-16 pb-5">
          <TouchableOpacity
            className="mb-4 h-10 w-10 items-center justify-center rounded-full bg-[#1a1b2e]"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-white">{t('screens.numerology.title')}</Text>
          <Text className="mt-2 text-base text-slate-400">{t('screens.numerology.subtitle')}</Text>
        </LinearGradient>
        <View className="px-5 pt-4">
          <ProfileSelector />
        </View>
        <View className="mt-12 items-center px-6">
          <Ionicons name="person-circle-outline" size={64} color="#6b7280" />
          <Text className="mt-4 text-center text-base text-slate-300">
            {t('screens.numerology.noData')}
          </Text>
          <TouchableOpacity
            className="mt-4 rounded-xl bg-[#6366f1] px-5 py-3"
            onPress={() => navigation.navigate('Profiles')}
          >
            <Text className="font-semibold text-white">{t('screens.numerology.selectProfile')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0f0f1e] px-6">
        <Text className="text-center text-base text-slate-300">
          {t('screens.numerology.errors.loadFailed')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#0f0f1e]" contentContainerStyle={{ paddingBottom: 32 }}>
      <LinearGradient colors={['#1a1a2e', '#0f0f1e']} className="px-6 pt-16 pb-5">
        <View className="mb-4 flex-row items-center gap-3">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-[#1a1b2e]"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text className="text-3xl font-bold text-white">{t('screens.numerology.title')}</Text>
            <Text className="mt-1 text-base text-slate-400">{t('screens.numerology.subtitle')}</Text>
          </View>
        </View>
        <ProfileSelector />
      </LinearGradient>

      <View className="flex-row flex-wrap gap-3 px-5 pt-4">
        <View className="w-[48%] items-center rounded-2xl bg-[#1a1a2e] p-5">
          <Text className="text-5xl font-bold text-[#6366f1]">{profile.lifePath}</Text>
          <Text className="mt-1 text-sm text-slate-400">
            {t('screens.numerology.numbers.lifePath')}
          </Text>
        </View>
        <View className="w-[48%] items-center rounded-2xl bg-[#1a1a2e] p-5">
          <Text className="text-5xl font-bold text-[#6366f1]">{profile.destiny}</Text>
          <Text className="mt-1 text-sm text-slate-400">
            {t('screens.numerology.numbers.destiny')}
          </Text>
        </View>
        <View className="w-[48%] items-center rounded-2xl bg-[#1a1a2e] p-5">
          <Text className="text-5xl font-bold text-[#6366f1]">{profile.soulUrge}</Text>
          <Text className="mt-1 text-sm text-slate-400">
            {t('screens.numerology.numbers.soulUrge')}
          </Text>
        </View>
        <View className="w-[48%] items-center rounded-2xl bg-[#1a1a2e] p-5">
          <Text className="text-5xl font-bold text-[#6366f1]">{profile.personality}</Text>
          <Text className="mt-1 text-sm text-slate-400">
            {t('screens.numerology.numbers.personality')}
          </Text>
        </View>
      </View>

      <View className="mx-5 my-6 overflow-hidden rounded-2xl">
        <LinearGradient colors={['#6366f1', '#8b5cf6']} className="items-center px-6 py-6">
          <Text className="text-sm text-white/80">{t('screens.numerology.personalYear.label')}</Text>
          <Text className="mt-2 text-6xl font-bold text-white">{profile.personalYear}</Text>
          <Text className="mt-1 text-base text-white/90">
            {t('screens.numerology.personalYear.theme')}
          </Text>
        </LinearGradient>
      </View>

      <Card className="mx-5 mb-5">
        <SectionTitle>{t('screens.numerology.sections.overview')}</SectionTitle>
        <Text className="mt-2 text-base leading-6 text-slate-200">{profile.description}</Text>
      </Card>

      {profile.strengths && profile.strengths.length > 0 && (
        <Card className="mx-5 mb-4">
          <SectionTitle>{t('screens.numerology.sections.strengths')}</SectionTitle>
          <View className="mt-2 space-y-2">
            {profile.strengths.map((strength, index) => (
              <View key={index} className="flex-row items-start gap-2">
                <Ionicons name="ellipse-outline" size={16} color="#6366f1" />
                <Text className="flex-1 text-base leading-6 text-slate-200">{strength}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      {profile.challenges && profile.challenges.length > 0 && (
        <Card className="mx-5 mb-8">
          <SectionTitle>{t('screens.numerology.sections.challenges')}</SectionTitle>
          <View className="mt-2 space-y-2">
            {profile.challenges.map((challenge, index) => (
              <View key={index} className="flex-row items-start gap-2">
                <Ionicons name="ellipse-outline" size={16} color="#ef4444" />
                <Text className="flex-1 text-base leading-6 text-slate-200">{challenge}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}
    </ScrollView>
  );
}
