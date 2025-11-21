// @ts-nocheck
import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionTitle } from '@/components/ui/SectionTitle';

type TabKey = 'compatibility' | 'soulmate';

type Message = {
  id: string;
  from: 'you' | 'soulmate';
  text: string;
  timestamp: string;
};

export default function RelationshipSoulmateScreen({ navigation }: any) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>('compatibility');
  const [input, setInput] = useState('');

  const compatibilityHighlights = [
    { title: t('screens.relationship.highlights.soulmateArchetype.title'), desc: t('screens.relationship.highlights.soulmateArchetype.description'), color: '#8b5cf6' },
    { title: t('screens.relationship.highlights.emotionalSync.title'), desc: t('screens.relationship.highlights.emotionalSync.description'), color: '#22c55e' },
    { title: t('screens.relationship.highlights.communication.title'), desc: t('screens.relationship.highlights.communication.description'), color: '#eab308' },
  ];

  const featureItems = [
    { icon: 'sparkles-outline', title: t('screens.relationship.features.birthChart.title'), desc: t('screens.relationship.features.birthChart.description') },
    { icon: 'chatbubbles-outline', title: t('screens.relationship.features.conflictStyle.title'), desc: t('screens.relationship.features.conflictStyle.description') },
    { icon: 'calendar-outline', title: t('screens.relationship.features.bestDays.title'), desc: t('screens.relationship.features.bestDays.description') },
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      from: 'soulmate',
      text: t('screens.relationship.chat.sampleMessages.message1'),
      timestamp: '10:02',
    },
    { id: '2', from: 'you', text: t('screens.relationship.chat.sampleMessages.message2'), timestamp: '10:04' },
    {
      id: '3',
      from: 'soulmate',
      text: t('screens.relationship.chat.sampleMessages.message3'),
      timestamp: '10:06',
    },
  ]);

  const statusBadge = useMemo(() => {
    return activeTab === 'compatibility' ? t('screens.relationship.badges.insights') : t('screens.relationship.badges.liveChat');
  }, [activeTab, t]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const ts = new Date();
    const next: Message = {
      id: `${Date.now()}`,
      from: 'you',
      text: input.trim(),
      timestamp: `${ts.getHours()}:${ts.getMinutes().toString().padStart(2, '0')}`,
    };
    setMessages(prev => [...prev, next]);
    setInput('');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#0f0f1e]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradientHeader navigation={navigation} badge={statusBadge} />

      <View className="px-5 pb-3 pt-4">
        <View className="flex-row gap-3">
          <TabButton label={t('screens.relationship.tabs.compatibility')} icon="heart-circle" active={activeTab === 'compatibility'} onPress={() => setActiveTab('compatibility')} />
          <TabButton label={t('screens.relationship.tabs.soulmate')} icon="chatbubbles" active={activeTab === 'soulmate'} onPress={() => setActiveTab('soulmate')} />
        </View>
      </View>

      {activeTab === 'compatibility' ? (
        <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28 }}>
          <View className="mt-2 space-y-4">
            <Card>
              <SectionTitle>{t('screens.relationship.overview.title')}</SectionTitle>
              <Text className="mt-2 text-base leading-6 text-slate-200">
                {t('screens.relationship.overview.description')}
              </Text>
            </Card>

            <Card>
              <SectionTitle>{t('screens.relationship.highlights.title')}</SectionTitle>
              <View className="mt-3 space-y-3">
                {compatibilityHighlights.map((item, idx) => (
                  <View key={idx} className="flex-row gap-3 rounded-xl border border-[#24243a] bg-[#181a2f] p-3">
                    <View
                      className="h-11 w-11 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${item.color}22` }}
                    >
                      <Ionicons name="sparkles-outline" size={20} color={item.color} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-white">{item.title}</Text>
                      <Text className="mt-1 text-sm leading-5 text-slate-300">{item.desc}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </Card>

            <Card>
              <SectionTitle>{t('screens.relationship.features.title')}</SectionTitle>
              <View className="mt-3 space-y-3">
                {featureItems.map((item, idx) => (
                  <View key={idx} className="flex-row gap-3 rounded-xl border border-[#24243a] bg-[#181a2f] p-3">
                    <View className="h-11 w-11 items-center justify-center rounded-full bg-[rgba(99,102,241,0.15)]">
                      <Ionicons name={item.icon as any} size={20} color="#8b5cf6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-white">{item.title}</Text>
                      <Text className="mt-1 text-sm leading-5 text-slate-300">{item.desc}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </Card>

            <TouchableOpacity className="mt-2 flex-row items-center justify-center rounded-xl bg-[#ec4899] px-4 py-4">
              <Ionicons name="sparkles" size={18} color="#fff" />
              <Text className="ml-2 text-base font-semibold text-white">
                {t('screens.relationship.generateButton')}
              </Text>
            </TouchableOpacity>
            <Text className="text-center text-xs text-slate-500">
              {t('screens.relationship.premiumAction')}
            </Text>
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 px-5 pb-5">
          <Card className="flex-1">
            <SectionTitle>{t('screens.relationship.chat.title')}</SectionTitle>
            <ScrollView className="mt-3 flex-1" contentContainerStyle={{ paddingBottom: 12 }}>
              {messages.map(msg => (
                <View
                  key={msg.id}
                  className={`mb-3 max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.from === 'you' ? 'self-end bg-[#6366f1]' : 'self-start bg-[#1a1b2e]'
                  }`}
                >
                  <Text className="text-sm text-white">{msg.text}</Text>
                  <Text className="mt-1 text-[11px] text-white/60">{msg.timestamp}</Text>
                </View>
              ))}
            </ScrollView>

            <View className="mt-2 flex-row items-center rounded-2xl border border-[#24243a] bg-[#0f0f1e] p-3">
              <TouchableOpacity className="mr-2 h-10 w-10 items-center justify-center rounded-full bg-[#1a1b2e]">
                <Ionicons name="add-outline" size={22} color="#cbd5e1" />
              </TouchableOpacity>
              <TextInput
                className="flex-1 rounded-xl bg-[#14142a] px-4 py-3 text-white"
                placeholder={t('screens.relationship.chat.placeholder')}
                placeholderTextColor="#6b7280"
                value={input}
                onChangeText={setInput}
              />
              <TouchableOpacity
                className="ml-2 h-10 w-10 items-center justify-center rounded-full bg-[#6366f1] disabled:opacity-50"
                onPress={sendMessage}
                disabled={!input.trim()}
              >
                <Ionicons name="send" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

function TabButton({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className={`flex-1 flex-row items-center justify-center rounded-2xl px-4 py-3 ${
        active ? 'bg-[#2d2e3f]' : 'bg-[#1a1b2e]'
      }`}
      onPress={onPress}
    >
      <Ionicons name={icon} size={20} color={active ? '#ec4899' : '#6b7280'} />
      <Text
        className={`ml-2 text-sm font-semibold ${active ? 'text-white' : 'text-slate-400'}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function LinearGradientHeader({ navigation, badge }: { navigation: any; badge: string }) {
  const { t } = useTranslation();
  return (
    <LinearGradient
      colors={['#181a2f', '#0f0f1e']}
      className="border-b border-[#24243a] px-5 pt-16 pb-4"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-[#1a1b2e]"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text className="text-3xl font-bold text-white">{t('screens.relationship.title')}</Text>
            <Text className="text-sm text-slate-400">{t('screens.relationship.subtitle')}</Text>
          </View>
        </View>
        <Badge>{badge}</Badge>
      </View>
    </LinearGradient>
  );
}
