import React, { useState } from 'react';
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
import ActionLimitModal from '../../components/ActionLimitModal';

type SpreadType = 'daily' | 'love' | 'work' | 'personal' | 'celtic_cross';

interface SpreadOption {
  type: SpreadType;
  name: string;
  description: string;
  cardCount: number;
}

const spreadOptions: SpreadOption[] = [
  {
    type: 'daily',
    name: 'Daily 3-Card',
    description: 'Past, Present, Future',
    cardCount: 3,
  },
  {
    type: 'love',
    name: 'Love Tarot',
    description: 'Relationship insights',
    cardCount: 5,
  },
  {
    type: 'work',
    name: 'Work & Career',
    description: 'Professional guidance',
    cardCount: 5,
  },
  {
    type: 'personal',
    name: 'Personal Growth',
    description: 'Self-discovery',
    cardCount: 4,
  },
  {
    type: 'celtic_cross',
    name: 'Celtic Cross',
    description: 'Comprehensive reading',
    cardCount: 10,
  },
];

export default function TarotScreen() {
  const [selectedSpread, setSelectedSpread] = useState<SpreadType>('daily');
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState<any>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [question, setQuestion] = useState('');

  const handleGenerateReading = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/tarot/reading', {
        spreadType: selectedSpread,
        question: question || undefined,
      });
      setReading(response.data);
    } catch (error: any) {
      if (error.response?.status === 429) {
        setShowLimitModal(true);
      } else {
        alert('Failed to generate reading');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#0f0f1e']} style={styles.header}>
        <Text style={styles.title}>🔮 Tarot Reading</Text>
        <Text style={styles.subtitle}>
          Discover insights through the ancient wisdom of tarot
        </Text>
      </LinearGradient>

      {!reading ? (
        <>
          {/* Spread Selection */}
          <View style={styles.spreadsContainer}>
            {spreadOptions.map((spread) => (
              <TouchableOpacity
                key={spread.type}
                style={[
                  styles.spreadCard,
                  selectedSpread === spread.type && styles.spreadCardSelected,
                ]}
                onPress={() => setSelectedSpread(spread.type)}
              >
                <Text style={styles.spreadName}>{spread.name}</Text>
                <Text style={styles.spreadDescription}>
                  {spread.description}
                </Text>
                <Text style={styles.cardCount}>{spread.cardCount} cards</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerateReading}
            disabled={loading}
          >
            <LinearGradient
              colors={['#8b5cf6', '#6366f1']}
              style={styles.buttonGradient}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Draw Cards</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Reading Result */}
          <View style={styles.readingContainer}>
            <Text style={styles.readingTitle}>{reading.spreadName}</Text>
            {reading.cards?.map((card: any, index: number) => (
              <View key={index} style={styles.cardContainer}>
                <Text style={styles.cardName}>
                  {card.name} {card.reversed && '(Reversed)'}
                </Text>
                <Text style={styles.cardPosition}>{card.position}</Text>
                <Text style={styles.cardMeaning}>{card.meaning}</Text>
              </View>
            ))}

            {reading.interpretation && (
              <View style={styles.interpretationContainer}>
                <Text style={styles.interpretationTitle}>
                  Overall Interpretation
                </Text>
                <Text style={styles.interpretationText}>
                  {reading.interpretation}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.newReadingButton}
              onPress={() => setReading(null)}
            >
              <Text style={styles.newReadingText}>New Reading</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <ActionLimitModal
        visible={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        currentPlan="basic"
        actionsUsed={2}
        dailyLimit={2}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  spreadsContainer: {
    padding: 20,
  },
  spreadCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  spreadCardSelected: {
    borderColor: '#8b5cf6',
    backgroundColor: '#1e1e3a',
  },
  spreadName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  spreadDescription: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 8,
  },
  cardCount: {
    fontSize: 12,
    color: '#8b5cf6',
  },
  generateButton: {
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  readingContainer: {
    padding: 20,
  },
  readingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 24,
    textAlign: 'center',
  },
  cardContainer: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 8,
  },
  cardPosition: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 12,
  },
  cardMeaning: {
    fontSize: 16,
    color: '#d1d5db',
    lineHeight: 24,
  },
  interpretationContainer: {
    backgroundColor: '#1e1e3a',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    marginBottom: 24,
  },
  interpretationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  interpretationText: {
    fontSize: 16,
    color: '#d1d5db',
    lineHeight: 24,
  },
  newReadingButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  newReadingText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
