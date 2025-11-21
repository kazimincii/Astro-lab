import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import ActionLimitModal from '../../components/ActionLimitModal';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionTitle } from '@/components/ui/SectionTitle';

interface AuraReading {
  archetype: string;
  sections: {
    vibe: string;
    communication: string;
    relationship: string;
    strengths: string[];
    watchOuts: string[];
  };
}

export default function AuraScanScreen() {
  const { t } = useTranslation();
  const [photoUri, setPhotoUri] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState<AuraReading | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      setReading(null);
    }
  };

  const handleScan = async () => {
    if (!photoUri) {
      Alert.alert('', t('screens.auraScan.errors.selectPhotoFirst'));
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('photo', {
        uri: photoUri,
        type: 'image/jpeg',
        name: 'aura-scan.jpg',
      } as any);

      const response = await axios.post('/aura-scan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setReading(response.data);
    } catch (error: any) {
      if (error.response?.status === 429) {
        setShowLimitModal(true);
      } else {
        Alert.alert('', t('screens.auraScan.errors.failedToGenerate'));
      }
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setPhotoUri('');
    setReading(null);
  };

  const stepBadge = reading
    ? t('screens.auraScan.stepBadge.results')
    : photoUri
      ? t('screens.auraScan.stepBadge.step2')
      : t('screens.auraScan.stepBadge.step1');

  return (
    <ScrollView className="flex-1 bg-[#0f0f1e]" contentContainerStyle={{ paddingBottom: 32 }}>
      <LinearGradient colors={['#1a1a2e', '#0f0f1e']} className="px-6 pt-16 pb-5">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-white">{t('screens.auraScan.title')}</Text>
            <Text className="mt-1 text-base text-slate-400">{t('screens.auraScan.subtitle')}</Text>
          </View>
          <Badge>{stepBadge}</Badge>
        </View>
      </LinearGradient>

      {!reading && (
        <Card className="mx-5 mt-5 space-y-3">
          <Text className="text-lg font-semibold text-white">{t('screens.auraScan.instructions.title')}</Text>
          <View className="space-y-2">
            <Text className="text-sm text-slate-300">{t('screens.auraScan.instructions.step1')}</Text>
            <Text className="text-sm text-slate-300">{t('screens.auraScan.instructions.step2')}</Text>
            <Text className="text-sm text-slate-300">{t('screens.auraScan.instructions.step3')}</Text>
          </View>
          <Text className="text-xs text-slate-500">
            {t('screens.auraScan.instructions.disclaimer')}
          </Text>
        </Card>
      )}

      <View className="px-5 pt-4">
        {photoUri ? (
          <View className="overflow-hidden rounded-2xl border border-[#24243a] bg-[#12132a]">
            <Image source={{ uri: photoUri }} className="h-72 w-full" />
            <TouchableOpacity
              className="border-t border-[#24243a] px-4 py-3"
              onPress={pickImage}
            >
              <Text className="text-center font-semibold text-[#8b5cf6]">
                {t('screens.auraScan.upload.changePhoto')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            className="items-center rounded-2xl border border-dashed border-[#2f2f45] bg-[#14142a] px-6 py-12"
            onPress={pickImage}
          >
            <View className="mb-3 h-14 w-14 items-center justify-center rounded-full border border-[#2f2f45] bg-[#1a1a30]">
              <Ionicons name="camera-outline" size={28} color="#8b5cf6" />
            </View>
            <Text className="text-lg font-semibold text-white">
              {t('screens.auraScan.upload.selectPhoto')}
            </Text>
            <Text className="mt-2 text-center text-sm text-slate-400">
              {t('screens.auraScan.upload.hint')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {photoUri && !reading && (
        <TouchableOpacity
          className="mx-5 mt-4 overflow-hidden rounded-2xl"
          onPress={handleScan}
          disabled={loading}
        >
          <LinearGradient colors={['#8b5cf6', '#6366f1']} className="items-center py-4">
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-base font-semibold text-white">
                {t('screens.auraScan.buttons.scanAura')}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      )}

      {reading && (
        <View className="px-5 pt-5 space-y-4">
          <Card className="border border-[#2a2b44] bg-[#19192f]">
            <LinearGradient colors={['#1f1b37', '#2d1f52']} className="rounded-xl px-5 py-4">
              <Text className="text-xs uppercase tracking-[1px] text-slate-400">
                {t('screens.auraScan.results.archetype')}
              </Text>
              <Text className="mt-2 text-2xl font-bold text-white">{reading.archetype}</Text>
            </LinearGradient>
          </Card>

          <View className="flex-row gap-3">
            <Card className="flex-1">
              <SectionTitle>{t('screens.auraScan.results.vibe')}</SectionTitle>
              <Text className="mt-1 text-sm leading-6 text-slate-200">{reading.sections.vibe}</Text>
            </Card>
            <Card className="flex-1">
              <SectionTitle>{t('screens.auraScan.results.communication')}</SectionTitle>
              <Text className="mt-1 text-sm leading-6 text-slate-200">{reading.sections.communication}</Text>
            </Card>
          </View>

          <Card>
            <SectionTitle>{t('screens.auraScan.results.relationships')}</SectionTitle>
            <Text className="mt-1 text-sm leading-6 text-slate-200">{reading.sections.relationship}</Text>
          </Card>

          <View className="flex-row gap-3">
            <Card className="flex-1">
              <SectionTitle>{t('screens.auraScan.results.strengths')}</SectionTitle>
              <View className="mt-2 space-y-2">
                {reading.sections.strengths.map((item, index) => (
                  <View key={index} className="flex-row items-start gap-2">
                    <Ionicons name="ellipse-outline" size={16} color="#22c55e" />
                    <Text className="flex-1 text-sm leading-6 text-slate-200">{item}</Text>
                  </View>
                ))}
              </View>
            </Card>
            <Card className="flex-1">
              <SectionTitle>{t('screens.auraScan.results.watchOuts')}</SectionTitle>
              <View className="mt-2 space-y-2">
                {reading.sections.watchOuts.map((item, index) => (
                  <View key={index} className="flex-row items-start gap-2">
                    <Ionicons name="ellipse-outline" size={16} color="#f59e0b" />
                    <Text className="flex-1 text-sm leading-6 text-slate-200">{item}</Text>
                  </View>
                ))}
              </View>
            </Card>
          </View>

          <TouchableOpacity
            className="mb-2 mt-2 items-center rounded-xl border border-[#2f2f45] px-4 py-3"
            onPress={resetScan}
          >
            <Text className="font-semibold text-white">{t('screens.auraScan.buttons.startNewScan')}</Text>
          </TouchableOpacity>
        </View>
      )}

      <ActionLimitModal
        visible={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        onUpgrade={() => setShowLimitModal(false)}
      />
    </ScrollView>
  );
}
