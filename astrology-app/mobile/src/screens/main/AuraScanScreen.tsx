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
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Aura Scan</Text>
            <Text style={styles.subtitle}>Upload a portrait, get your vibe decoded.</Text>
          </View>
          <Text style={styles.stepBadge}>{reading ? 'Results' : photoUri ? 'Step 2/2' : 'Step 1/2'}</Text>
        </View>
      </LinearGradient>

      {!reading && (
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>How it works</Text>
          <View style={styles.instructionsList}>
            <Text style={styles.instructionText}>• Upload a clear portrait photo</Text>
            <Text style={styles.instructionText}>• AI analyzes aura colors + vibe</Text>
            <Text style={styles.instructionText}>• Get personality & presence insights</Text>
          </View>
          <Text style={styles.disclaimerText}>
            For entertainment purposes only. Not medical or psychological advice.
          </Text>
        </View>
      )}

      <View style={styles.uploadSection}>
        {photoUri ? (
          <View style={styles.photoContainer}>
            <Image source={{ uri: photoUri }} style={styles.photo} />
            <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.uploadIcon}>📷</Text>
            <Text style={styles.uploadText}>Select Photo</Text>
            <Text style={styles.uploadHint}>Good lighting • Face centered • No filters</Text>
          </TouchableOpacity>
        )}
      </View>

      {photoUri && !reading && (
        <TouchableOpacity style={styles.scanButton} onPress={handleScan} disabled={loading}>
          <LinearGradient colors={['#8b5cf6', '#6366f1']} style={styles.buttonGradient}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Scan Aura</Text>}
          </LinearGradient>
        </TouchableOpacity>
      )}

      {reading && (
        <View style={styles.readingContainer}>
          <View style={styles.archetypeCard}>
            <LinearGradient colors={['#1f1b37', '#2d1f52']} style={styles.archetypeGradient}>
              <Text style={styles.archetypeLabel}>Archetype</Text>
              <Text style={styles.archetypeValue}>{reading.archetype}</Text>
            </LinearGradient>
          </View>

          <View style={styles.sectionRow}>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Vibe</Text>
              <Text style={styles.sectionText}>{reading.sections.vibe}</Text>
            </View>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Communication</Text>
              <Text style={styles.sectionText}>{reading.sections.communication}</Text>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Relationships</Text>
            <Text style={styles.sectionText}>{reading.sections.relationship}</Text>
          </View>

          <View style={styles.sectionRow}>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Strengths</Text>
              {reading.sections.strengths.map((item, index) => (
                <View key={index} style={styles.listRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Watch Outs</Text>
              {reading.sections.watchOuts.map((item, index) => (
                <View key={index} style={styles.listRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.newScanButton} onPress={resetScan}>
            <Text style={styles.newScanText}>Start New Scan</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 4,
  },
  stepBadge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#c7d2fe',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    fontWeight: '700',
    fontSize: 12,
  },
  instructionsCard: {
    backgroundColor: '#1a1a2e',
    marginHorizontal: 20,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#24243a',
  },
  instructionsTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  instructionsList: {
    marginBottom: 10,
    gap: 4,
  },
  instructionText: {
    color: '#d1d5db',
    fontSize: 14,
  },
  disclaimerText: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 8,
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
  uploadHint: {
    marginTop: 6,
    color: '#9ca3af',
    fontSize: 12,
    textAlign: 'center',
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
    borderWidth: 1,
    borderColor: '#2f2f44',
  },
  changePhotoText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600',
  },
  scanButton: {
    marginHorizontal: 20,
    marginBottom: 20,
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
  sectionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  sectionCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#24243a',
    flex: 1,
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
