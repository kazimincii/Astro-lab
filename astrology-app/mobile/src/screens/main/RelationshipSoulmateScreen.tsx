import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RelationshipSoulmateScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'compatibility' | 'soulmate'>('compatibility');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Relationships</Text>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'compatibility' && styles.tabActive]}
          onPress={() => setActiveTab('compatibility')}
        >
          <Ionicons
            name="heart-circle"
            size={24}
            color={activeTab === 'compatibility' ? '#ec4899' : '#6b7280'}
          />
          <Text style={[styles.tabText, activeTab === 'compatibility' && styles.tabTextActive]}>
            Compatibility
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'soulmate' && styles.tabActive]}
          onPress={() => setActiveTab('soulmate')}
        >
          <Ionicons
            name="sparkles"
            size={24}
            color={activeTab === 'soulmate' ? '#a855f7' : '#6b7280'}
          />
          <Text style={[styles.tabText, activeTab === 'soulmate' && styles.tabTextActive]}>
            Soulmate
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'compatibility' ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Relationship Compatibility</Text>
            <Text style={styles.sectionDesc}>
              Analyze the astrological compatibility between two people
            </Text>

            {/* Info Card */}
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={24} color="#ec4899" />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>How it works</Text>
                <Text style={styles.infoText}>
                  Our compatibility analysis examines planetary positions, aspects, and synastry
                  to provide insights into relationship dynamics.
                </Text>
              </View>
            </View>

            {/* Feature List */}
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#ec489920' }]}>
                  <Ionicons name="heart" size={24} color="#ec4899" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Overall Compatibility</Text>
                  <Text style={styles.featureDesc}>
                    Get an overall score based on multiple astrological factors
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#3b82f620' }]}>
                  <Ionicons name="chatbubbles" size={24} color="#3b82f6" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Communication Style</Text>
                  <Text style={styles.featureDesc}>
                    Understand how you communicate and connect
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#10b98120' }]}>
                  <Ionicons name="trending-up" size={24} color="#10b981" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Relationship Timeline</Text>
                  <Text style={styles.featureDesc}>
                    See past patterns and future potential
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#f59e0b20' }]}>
                  <Ionicons name="bulb" size={24} color="#f59e0b" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Personalized Advice</Text>
                  <Text style={styles.featureDesc}>
                    Get guidance on strengths and challenges
                  </Text>
                </View>
              </View>
            </View>

            {/* CTA */}
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaText}>Analyze Compatibility</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.premiumNote}>Requires Premium Action</Text>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Soulmate Profile</Text>
            <Text style={styles.sectionDesc}>
              Discover your ideal partner based on your astrological blueprint
            </Text>

            {/* Info Card */}
            <View style={[styles.infoCard, { borderLeftColor: '#a855f7' }]}>
              <Ionicons name="information-circle" size={24} color="#a855f7" />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Your Cosmic Match</Text>
                <Text style={styles.infoText}>
                  Based on your birth chart, we'll reveal the characteristics and qualities of
                  your ideal soulmate connection.
                </Text>
              </View>
            </View>

            {/* Feature List */}
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#a855f720' }]}>
                  <Ionicons name="person" size={24} color="#a855f7" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Soulmate Archetype</Text>
                  <Text style={styles.featureDesc}>
                    Discover the energetic blueprint of your perfect match
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#ec489920' }]}>
                  <Ionicons name="compass" size={24} color="#ec4899" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Meeting Scenarios</Text>
                  <Text style={styles.featureDesc}>
                    Likely contexts where you'll meet your soulmate
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#10b98120' }]}>
                  <Ionicons name="star" size={24} color="#10b981" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Ideal Qualities</Text>
                  <Text style={styles.featureDesc}>
                    Key traits and characteristics to look for
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#3b82f620' }]}>
                  <Ionicons name="map" size={24} color="#3b82f6" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Relationship Guidance</Text>
                  <Text style={styles.featureDesc}>
                    Tips for nurturing your soulmate connection
                  </Text>
                </View>
              </View>
            </View>

            {/* CTA */}
            <TouchableOpacity style={[styles.ctaButton, { backgroundColor: '#a855f7' }]}>
              <Text style={styles.ctaText}>Generate Soulmate Profile</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.premiumNote}>Requires Premium Action</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1b2e',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1b2e',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  tabActive: {
    backgroundColor: '#2d2e3f',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  sectionDesc: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 24,
    lineHeight: 22,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1b2e',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#ec4899',
    gap: 12,
    marginBottom: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
  },
  featuresList: {
    gap: 16,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    gap: 16,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ec4899',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  premiumNote: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
