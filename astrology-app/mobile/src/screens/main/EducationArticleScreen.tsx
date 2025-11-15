import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EducationContent } from '@/api/education';

export default function EducationArticleScreen({ route, navigation }: any) {
  const { article } = route.params as { article: EducationContent };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '#10b981';
      case 'intermediate':
        return '#f59e0b';
      case 'advanced':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>{article.title}</Text>
        </View>

        {/* Meta Information */}
        <View style={styles.metaSection}>
          <View style={styles.metaRow}>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(article.difficulty) + '20' },
              ]}
            >
              <Text
                style={[
                  styles.difficultyText,
                  { color: getDifficultyColor(article.difficulty) },
                ]}
              >
                {article.difficulty}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color="#9ca3af" />
              <Text style={styles.metaText}>{article.readingTimeMinutes} min read</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="eye-outline" size={16} color="#9ca3af" />
              <Text style={styles.metaText}>{article.viewCount} views</Text>
            </View>
          </View>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <View style={styles.tags}>
              {article.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Summary */}
        {article.summary && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Ionicons name="information-circle" size={20} color="#6366f1" />
              <Text style={styles.summaryTitle}>Summary</Text>
            </View>
            <Text style={styles.summaryText}>{article.summary}</Text>
          </View>
        )}

        {/* Content */}
        <View style={styles.contentCard}>
          <Text style={styles.content}>{article.content}</Text>
        </View>

        {/* Related Topics */}
        {article.relatedTopics && article.relatedTopics.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>Related Topics</Text>
            {article.relatedTopics.map((topic, index) => (
              <TouchableOpacity key={index} style={styles.relatedItem}>
                <Ionicons name="book-outline" size={18} color="#a78bfa" />
                <Text style={styles.relatedText}>{topic}</Text>
                <Ionicons name="chevron-forward" size={18} color="#6b7280" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1b2e',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 36,
  },
  metaSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#2d2e3f',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 12,
    color: '#a78bfa',
  },
  summaryCard: {
    backgroundColor: '#1a1b2e',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#6366f1',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  summaryText: {
    fontSize: 15,
    color: '#d1d5db',
    lineHeight: 22,
  },
  contentCard: {
    backgroundColor: '#1a1b2e',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
  },
  content: {
    fontSize: 16,
    color: '#e5e7eb',
    lineHeight: 26,
  },
  relatedSection: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  relatedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1b2e',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    gap: 10,
  },
  relatedText: {
    flex: 1,
    fontSize: 15,
    color: '#e5e7eb',
  },
});
