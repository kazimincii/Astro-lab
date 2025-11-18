// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Badge } from '@/components/ui/Badge';

interface CosmicPost {
  id: string;
  date: string;
  moonPhase: string;
  moonSign: string;
  energy: string;
  majorAspects: string[];
  retrogrades: string[];
  themes: string[];
  recommendations: string[];
  reactionCounts: { [key: string]: number };
}

export default function CosmicClimateScreen() {
  const [posts, setPosts] = useState<CosmicPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/cosmic-climate/recent');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching cosmic climate:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReact = async (postId: string, emoji: string) => {
    try {
      await axios.post(`/cosmic-climate/${postId}/react`, { emoji });
      fetchPosts();
    } catch (error) {
      console.error('Error reacting to post:', error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0f0f1e]">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#0f0f1e]">
      <LinearGradient colors={['#1a1a2e', '#0f0f1e']} className="px-6 pt-16 pb-5">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-white">Cosmic Climate</Text>
            <Text className="text-base text-slate-300">Daily global sky weather updates</Text>
          </View>
          <Badge>Live</Badge>
        </View>
      </LinearGradient>

      <View className="space-y-5 p-5">
        {posts.map(post => (
          <Card key={post.id}>
            <Text className="text-sm text-slate-400">
              {new Date(post.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>

            <View className="mt-3 flex-row items-center gap-2">
              <Text className="text-xl font-bold text-white">{post.moonPhase}</Text>
              <Text className="text-base text-[#8b5cf6]">in {post.moonSign}</Text>
            </View>

            <Card className="mt-4 border border-[#24243a] bg-[#0f0f1e]" padded>
              <SectionTitle>Today's Energy</SectionTitle>
              <Text className="mt-2 text-base text-slate-200">{post.energy}</Text>
            </Card>

            {post.majorAspects?.length > 0 && (
              <View className="mt-4">
                <Text className="text-base font-semibold text-white">Major Aspects</Text>
                {post.majorAspects.map((aspect, index) => (
                  <Text key={index} className="mt-1 text-sm text-slate-300">
                    • {aspect}
                  </Text>
                ))}
              </View>
            )}

            {post.retrogrades?.length > 0 && (
              <View className="mt-4">
                <Text className="text-base font-semibold text-white">Retrogrades</Text>
                {post.retrogrades.map((retro, index) => (
                  <Text key={index} className="mt-1 text-sm text-slate-300">
                    • {retro}
                  </Text>
                ))}
              </View>
            )}

            {post.themes?.length > 0 && (
              <View className="mt-4">
                <Text className="text-base font-semibold text-white">Themes</Text>
                <View className="mt-2 flex-row flex-wrap gap-2">
                  {post.themes.map((theme, index) => (
                    <View key={index} className="rounded-full bg-[#6366f1] px-3 py-1.5">
                      <Text className="text-xs text-white">{theme}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {post.recommendations?.length > 0 && (
              <View className="mt-4">
                <Text className="text-base font-semibold text-white">Recommendations</Text>
                {post.recommendations.map((rec, index) => (
                  <Text key={index} className="mt-1 text-sm text-slate-300">
                    • {rec}
                  </Text>
                ))}
              </View>
            )}

            <View className="mt-4 flex-row gap-3 border-t border-[#2a2a4e] pt-3">
              {['✨', '🔥', '❤️'].map(emoji => (
                <TouchableOpacity
                  key={emoji}
                  className="flex-row items-center gap-2 rounded-full border border-[#2a2a4e] bg-[#0f0f1e] px-3 py-2"
                  onPress={() => handleReact(post.id, emoji)}
                >
                  <Text className="text-lg">{emoji}</Text>
                  <Text className="text-xs text-slate-400">{post.reactionCounts?.[emoji] ?? 0}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}
