// @ts-nocheck
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { chakrasApi, ChakraProfile, ChakraStatus } from '@/api/chakras';
import { useProfile } from '@/contexts/ProfileContext';
import { ProfileSelector } from '@/components/ProfileSelector';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default function ChakrasScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { selectedProfile, isLoading: profileLoading } = useProfile();
  const [chakraProfile, setChakraProfile] = useState<ChakraProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const chakraColors = {
    root: '#dc2626',
    sacral: '#f97316',
    solarPlexus: '#eab308',
    heart: '#22c55e',
    throat: '#3b82f6',
    thirdEye: '#6366f1',
    crown: '#a855f7',
  };

  const loadChakraProfile = useCallback(async () => {
    if (!selectedProfile?.id) return;

    try {
      setLoading(true);
      const data = await chakrasApi.getChakraProfile(selectedProfile.id);
      setChakraProfile(data);
    } catch (error) {
      console.error('Failed to load chakra profile:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedProfile?.id]);

  useEffect(() => {
    if (selectedProfile?.id) {
      loadChakraProfile();
    } else {
      setLoading(false);
    }
  }, [selectedProfile?.id, loadChakraProfile]);

  const handleGenerate = async () => {
    if (!selectedProfile?.id) {
      Alert.alert(t('screens.chakras.errors.noProfile'), t('screens.chakras.errors.selectProfile'));
      return;
    }

    try {
      setGenerating(true);
      const data = await chakrasApi.generateChakraProfile(selectedProfile.id);
      setChakraProfile(data);
    } catch (error: any) {
      console.error('Failed to generate chakra profile:', error);
      if (error.response?.data?.message) {
        Alert.alert(t('screens.chakras.errors.error'), error.response.data.message);
      } else {
        Alert.alert(t('screens.chakras.errors.error'), t('screens.chakras.errors.generateFailed'));
      }
    } finally {
      setGenerating(false);
    }
  };

  const getStatusColor = (status: ChakraStatus) => {
    switch (status) {
      case ChakraStatus.BALANCED:
        return '#10b981';
      case ChakraStatus.UNDERACTIVE:
        return '#3b82f6';
      case ChakraStatus.OVERACTIVE:
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status: ChakraStatus) => {
    switch (status) {
      case ChakraStatus.BALANCED:
        return t('screens.chakras.status.balanced');
      case ChakraStatus.UNDERACTIVE:
        return t('screens.chakras.status.underactive');
      case ChakraStatus.OVERACTIVE:
        return t('screens.chakras.status.overactive');
      default:
        return t('screens.chakras.status.unknown');
    }
  };

  if (!selectedProfile?.id) {
    return (
      <View className="flex-1 bg-[#0f0f1e]">
        <View className="flex-row items-center px-5 pt-16 pb-4">
          <TouchableOpacity
            className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-[#1a1b2e]"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">{t('screens.chakras.title')}</Text>
        </View>
        <View className="items-center px-5 py-16">
          <Ionicons name="radio-button-on-outline" size={64} color="#6b7280" />
          <Text className="mt-4 text-lg text-white">{t('screens.chakras.noProfile.title')}</Text>
          <TouchableOpacity
            className="mt-4 rounded-xl bg-[#6366f1] px-5 py-3"
            onPress={() => navigation.navigate('Profiles')}
          >
            <Text className="font-semibold text-white">{t('screens.chakras.noProfile.button')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading || profileLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0f0f1e]">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#0f0f1e]">
      <View className="px-5 pt-16 pb-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              className="h-10 w-10 items-center justify-center rounded-full bg-[#1a1b2e]"
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text className="text-2xl font-bold text-white">{t('screens.chakras.title')}</Text>
              <Text className="text-sm text-slate-400">{t('screens.chakras.subtitle')}</Text>
            </View>
          </View>
          <Badge>{t('screens.chakras.badge')}</Badge>
        </View>
        <View className="mt-4">
          <ProfileSelector />
        </View>
      </View>

      {!chakraProfile ? (
        <Card className="mx-4 mb-6">
          <Text className="text-lg font-semibold text-white">{t('screens.chakras.empty.title')}</Text>
          <Text className="mt-1 text-sm text-slate-400">
            {t('screens.chakras.empty.message')}
          </Text>
          <TouchableOpacity
            className="mt-4 rounded-xl bg-[#6366f1] px-4 py-3"
            onPress={handleGenerate}
            disabled={generating}
          >
            <Text className="text-center text-white font-semibold">
              {generating ? t('screens.chakras.empty.generating') : t('screens.chakras.empty.button')}
            </Text>
          </TouchableOpacity>
        </Card>
      ) : (
        <>
          <Card className="mx-4 mb-4">
            <View className="flex-row items-center justify-between">
              <View>
                <SectionTitle>{t('screens.chakras.summary.title')}</SectionTitle>
                <Text className="mt-1 text-xl font-bold text-white">
                  {chakraProfile.summaryTitle || t('screens.chakras.summary.defaultTitle')}
                </Text>
                {chakraProfile.summaryDescription ? (
                  <Text className="mt-1 text-sm text-slate-300">{chakraProfile.summaryDescription}</Text>
                ) : null}
              </View>
              <TouchableOpacity
                className="rounded-full bg-[rgba(99,102,241,0.15)] px-3 py-2"
                onPress={handleGenerate}
                disabled={generating}
              >
                <Text className="text-sm font-semibold text-white">
                  {generating ? t('screens.chakras.summary.updating') : t('screens.chakras.summary.regenerate')}
                </Text>
              </TouchableOpacity>
            </View>
          </Card>

          <Card className="mx-4 mb-4">
            <SectionTitle>{t('screens.chakras.balance.title')}</SectionTitle>
            <View className="mt-3 space-y-3">
              {chakraProfile.chakras.map(chakra => (
                <View
                  key={chakra.id}
                  className="rounded-xl border border-[#24243a] bg-[#181a2f] p-3"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <View
                        className="h-8 w-8 items-center justify-center rounded-full"
                        style={{ backgroundColor: chakraColors[chakra.id as keyof typeof chakraColors] + '33' }}
                      >
                        <Ionicons
                          name="radio-button-on"
                          size={18}
                          color={chakraColors[chakra.id as keyof typeof chakraColors]}
                        />
                      </View>
                      <View>
                        <Text className="text-base font-semibold text-white">{chakra.name}</Text>
                        <Text className="text-xs text-slate-400">
                          {getStatusLabel(chakra.status)}
                        </Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text className="text-lg font-bold text-white">{(chakra.score ?? 0).toFixed(1)}</Text>
                      <Text
                        className="text-xs font-semibold"
                        style={{ color: getStatusColor(chakra.status) }}
                      >
                        {chakra.status}
                      </Text>
                    </View>
                  </View>
                  <View className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#24243a]">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(Math.max((chakra.score ?? 0) * 10, 0), 100)}%`,
                        backgroundColor: chakraColors[chakra.id as keyof typeof chakraColors],
                      }}
                    />
                  </View>
                  <Text className="mt-2 text-sm text-slate-300">{chakra.description}</Text>
                </View>
              ))}
            </View>
          </Card>

          <Card className="mx-4 mb-4">
            <SectionTitle>{t('screens.chakras.sections.tips')}</SectionTitle>
            <View className="mt-2 space-y-2">
              {chakraProfile.tips?.map((tip, idx) => (
                <View key={idx} className="flex-row items-start gap-2">
                  <Text className="text-[#6366f1]">•</Text>
                  <Text className="flex-1 text-sm text-slate-300">{tip}</Text>
                </View>
              ))}
            </View>
          </Card>

          <Card className="mx-4 mb-8">
            <SectionTitle>{t('screens.chakras.sections.meditation')}</SectionTitle>
            <View className="mt-3 space-y-3">
              {chakraProfile.meditation?.steps?.map((step, idx) => (
                <View key={idx} className="rounded-xl border border-[#24243a] bg-[#181a2f] p-3">
                  <Text className="text-sm font-semibold text-white">{step.title}</Text>
                  <Text className="mt-1 text-sm text-slate-300">{step.instructions}</Text>
                </View>
              ))}
            </View>
          </Card>
        </>
      )}
    </ScrollView>
  );
}
