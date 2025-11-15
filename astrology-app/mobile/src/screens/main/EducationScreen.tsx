import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { educationApi, EducationContent, ContentCategory } from '@/api/education';

export default function EducationScreen({ navigation }: any) {
  const [content, setContent] = useState<EducationContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | 'all'>('all');

  const categories = [
    { id: 'all', title: 'All Topics', icon: 'library', color: '#6366f1' },
    { id: ContentCategory.BASICS, title: 'Basics', icon: 'book', color: '#10b981' },
    { id: ContentCategory.PLANETS, title: 'Planets', icon: 'planet', color: '#f59e0b' },
    { id: ContentCategory.HOUSES, title: 'Houses', icon: 'home', color: '#3b82f6' },
    { id: ContentCategory.SIGNS, title: 'Signs', icon: 'star', color: '#ec4899' },
    { id: ContentCategory.ASPECTS, title: 'Aspects', icon: 'git-branch', color: '#8b5cf6' },
    { id: ContentCategory.TRANSITS, title: 'Transits', icon: 'shuffle', color: '#06b6d4' },
    { id: ContentCategory.RETROGRADES, title: 'Retrogrades', icon: 'refresh-circle', color: '#ef4444' },
    { id: ContentCategory.ADVANCED, title: 'Advanced', icon: 'rocket', color: '#a78bfa' },
  ];

  const loadContent = async () => {
    try {
      setLoading(true);
      const data = selectedCategory === 'all'
        ? await educationApi.getAllContent()
        : await educationApi.getContentByCategory(selectedCategory as ContentCategory);
      setContent(data);
    } catch (error) {
      console.error('Failed to load education content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, [selectedCategory]);

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

  const handleArticlePress = (article: EducationContent) => {
    navigation.navigate('EducationArticle', { article });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Astro Academy</Text>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryChip,
              selectedCategory === cat.id && { backgroundColor: cat.color },
            ]}
            onPress={() => setSelectedCategory(cat.id as any)}
          >
            <Ionicons
              name={cat.icon as any}
              size={18}
              color={selectedCategory === cat.id ? '#fff' : cat.color}
            />
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === cat.id && styles.categoryChipTextActive,
              ]}
            >
              {cat.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content List */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <ScrollView style={styles.contentList}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'All Articles' : `${categories.find(c => c.id === selectedCategory)?.title} Articles`}
          </Text>
          {content.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="book-outline" size={48} color="#6b7280" />
              <Text style={styles.emptyText}>No articles available yet</Text>
            </View>
          ) : (
            content.map((article) => (
              <TouchableOpacity
                key={article.id}
                style={styles.articleCard}
                onPress={() => handleArticlePress(article)}
              >
                <View style={styles.articleHeader}>
                  <View style={styles.articleTitleRow}>
                    <Text style={styles.articleTitle} numberOfLines={2}>
                      {article.title}
                    </Text>
                  </View>
                  <View style={styles.articleMeta}>
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
                      <Ionicons name="time-outline" size={14} color="#9ca3af" />
                      <Text style={styles.metaText}>{article.readingTimeMinutes} min</Text>
                    </View>
                  </View>
                </View>
                {article.summary && (
                  <Text style={styles.articleSummary} numberOfLines={2}>
                    {article.summary}
                  </Text>
                )}
                {article.tags && article.tags.length > 0 && (
                  <View style={styles.tags}>
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
                <View style={styles.articleFooter}>
                  <View style={styles.viewCount}>
                    <Ionicons name="eye-outline" size={14} color="#6b7280" />
                    <Text style={styles.viewCountText}>{article.viewCount} views</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                </View>
              </TouchableOpacity>
            ))
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1b2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  categoriesScroll: {
    borderBottomWidth: 1,
    borderBottomColor: '#2d2e3f',
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1a1b2e',
    marginRight: 8,
    gap: 6,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentList: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
  },
  articleCard: {
    backgroundColor: '#1a1b2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  articleHeader: {
    marginBottom: 8,
  },
  articleTitleRow: {
    marginBottom: 8,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 24,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#9ca3af',
  },
  articleSummary: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#2d2e3f',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    color: '#a78bfa',
  },
  articleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#2d2e3f',
  },
  viewCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewCountText: {
    fontSize: 12,
    color: '#6b7280',
  },
});
