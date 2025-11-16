import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import ActionLimitModal from '../../components/ActionLimitModal';

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
  const [photoUri, setPhotoUri] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState<AuraReading | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImagePickerAsync({
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
      alert('Please select a photo first');
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
        alert('Failed to generate aura reading');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setPhotoUri('');
    setReading(null);
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#0f0f1e']} style={styles.header}>
        <Text style={styles.title}>✨ Aura Scan</Text>
        <Text style={styles.subtitle}>
          Discover personality insights from a photo
        </Text>
      </LinearGradient>

      {!reading ? (
        <>
          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>How it works:</Text>
            <Text style={styles.instructionText}>
              📸 Upload a clear portrait photo
            </Text>
            <Text style={styles.instructionText}>
              ✨ Our AI analyzes the vibe and energy
            </Text>
            <Text style={styles.instructionText}>
              🔮 Get personalized insights about personality and presence
            </Text>
            <View style={styles.disclaimer}>
              <Text style={styles.disclaimerText}>
                For entertainment only. Not medical or psychological advice.
              </Text>
            </View>
          </View>

          {/* Photo Upload */}
          <View style={styles.uploadSection}>
            {photoUri ? (
              <View style={styles.photoContainer}>
                <Image source={{ uri: photoUri }} style={styles.photo} />
                <TouchableOpacity
                  style={styles.changePhotoButton}
                  onPress={pickImage}
                >
                  <Text style={styles.changePhotoText}>Change Photo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickImage}
              >
                <Text style={styles.uploadIcon}>📸</Text>
                <Text style={styles.uploadText}>Select Photo</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Scan Button */}
          {photoUri && (
            <TouchableOpacity
              style={styles.scanButton}
              onPress={handleScan}
              disabled={loading}
            >
              <LinearGradient
                colors={['#8b5cf6', '#6366f1']}
                style={styles.buttonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Scan Aura</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <>
          {/* Reading Result */}
          <View style={styles.readingContainer}>
            {/* Archetype */}
            <View style={styles.archetypeCard}>
              <LinearGradient
                colors={['#f59e0b', '#d97706']}
                style={styles.archetypeGradient}
              >
                <Text style={styles.archetypeLabel}>Your Archetype</Text>
                <Text style={styles.archetypeValue}>{reading.archetype}</Text>
              </LinearGradient>
            </View>

            {/* Sections */}
            {reading.sections.vibe && (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>✨ Vibe & Presence</Text>
                <Text style={styles.sectionText}>{reading.sections.vibe}</Text>
              </View>
            )}

            {reading.sections.communication && (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>💬 Communication Style</Text>
                <Text style={styles.sectionText}>
                  {reading.sections.communication}
                </Text>
              </View>
            )}

            {reading.sections.relationship && (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>💕 Relationship Style</Text>
                <Text style={styles.sectionText}>
                  {reading.sections.relationship}
                </Text>
              </View>
            )}

            {/* Strengths */}
            {reading.sections.strengths &&
              reading.sections.strengths.length > 0 && (
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>🌟 Strengths</Text>
                  {reading.sections.strengths.map((strength, index) => (
                    <View key={index} style={styles.listRow}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.listText}>{strength}</Text>
                    </View>
                  ))}
                </View>
              )}

            {/* Watch Outs */}
            {reading.sections.watchOuts &&
              reading.sections.watchOuts.length > 0 && (
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>⚠️ Gentle Watch-Outs</Text>
                  {reading.sections.watchOuts.map((watchOut, index) => (
                    <View key={index} style={styles.listRow}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.listText}>{watchOut}</Text>
                    </View>
                  ))}
                </View>
              )}

            <TouchableOpacity
              style={styles.newScanButton}
              onPress={resetScan}
            >
              <Text style={styles.newScanText}>New Scan</Text>
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
  instructionsContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 8,
    lineHeight: 20,
  },
  disclaimer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a2a4e',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  uploadSection: {
    padding: 20,
    alignItems: 'center',
  },
  uploadButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#6366f1',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
  },
  photoContainer: {
    alignItems: 'center',
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 16,
  },
  changePhotoButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
  },
  changePhotoText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600',
  },
  scanButton: {
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
  archetypeCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  archetypeGradient: {
    padding: 24,
    alignItems: 'center',
  },
  archetypeLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  archetypeValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: '#d1d5db',
    lineHeight: 24,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    color: '#6366f1',
    fontSize: 16,
    marginRight: 8,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
  },
  newScanButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  newScanText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
