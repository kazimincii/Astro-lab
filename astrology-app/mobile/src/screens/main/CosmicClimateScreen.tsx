import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

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
      fetchPosts(); // Refresh to show updated counts
    } catch (error) {
      console.error('Error reacting to post:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#0f0f1e']} style={styles.header}>
        <Text style={styles.title}>🌌 Cosmic Climate</Text>
        <Text style={styles.subtitle}>Daily global sky weather updates</Text>
      </LinearGradient>

      <View style={styles.postsContainer}>
        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <Text style={styles.postDate}>
              {new Date(post.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>

            {/* Moon Info */}
            <View style={styles.moonContainer}>
              <Text style={styles.moonPhase}>{post.moonPhase}</Text>
              <Text style={styles.moonSign}>in {post.moonSign}</Text>
            </View>

            {/* Energy */}
            <View style={styles.energyCard}>
              <Text style={styles.energyLabel}>Today's Energy</Text>
              <Text style={styles.energyText}>{post.energy}</Text>
            </View>

            {/* Major Aspects */}
            {post.majorAspects && post.majorAspects.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🌟 Major Aspects</Text>
                {post.majorAspects.map((aspect, index) => (
                  <Text key={index} style={styles.listItem}>
                    • {aspect}
                  </Text>
                ))}
              </View>
            )}

            {/* Retrogrades */}
            {post.retrogrades && post.retrogrades.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>⏪ Retrogrades</Text>
                {post.retrogrades.map((retro, index) => (
                  <Text key={index} style={styles.listItem}>
                    • {retro}
                  </Text>
                ))}
              </View>
            )}

            {/* Themes */}
            {post.themes && post.themes.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>💫 Themes</Text>
                <View style={styles.tagContainer}>
                  {post.themes.map((theme, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{theme}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Recommendations */}
            {post.recommendations && post.recommendations.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>✨ Recommendations</Text>
                {post.recommendations.map((rec, index) => (
                  <Text key={index} style={styles.listItem}>
                    • {rec}
                  </Text>
                ))}
              </View>
            )}

            {/* Reactions */}
            <View style={styles.reactionsContainer}>
              {['✨', '🌙', '⭐', '💫', '🔮'].map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={styles.reactionButton}
                  onPress={() => handleReact(post.id, emoji)}
                >
                  <Text style={styles.reactionEmoji}>{emoji}</Text>
                  {post.reactionCounts?.[emoji] > 0 && (
                    <Text style={styles.reactionCount}>
                      {post.reactionCounts[emoji]}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f1e',
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
  },
  postsContainer: {
    padding: 20,
  },
  postCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  postDate: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 16,
  },
  moonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  moonPhase: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  moonSign: {
    fontSize: 16,
    color: '#8b5cf6',
  },
  energyCard: {
    backgroundColor: '#0f0f1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  energyLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
  },
  energyText: {
    fontSize: 16,
    color: '#d1d5db',
    lineHeight: 24,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  listItem: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 6,
    lineHeight: 20,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: '#ffffff',
    fontSize: 12,
  },
  reactionsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a2a4e',
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0f0f1e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  reactionEmoji: {
    fontSize: 18,
  },
  reactionCount: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
