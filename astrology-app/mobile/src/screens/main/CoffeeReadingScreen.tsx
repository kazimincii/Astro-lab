import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import ActionLimitModal from '../../components/ActionLimitModal';

export default function CoffeeReadingScreen() {
  const { t } = useTranslation();
  const [cupImages, setCupImages] = useState<string[]>([]);
  const [saucerImage, setSaucerImage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState<any>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const pickImage = async (type: 'cup' | 'saucer') => {
    const result = await ImagePicker.launchImagePickerAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      if (type === 'cup') {
        setCupImages([...cupImages, result.assets[0].uri]);
      } else {
        setSaucerImage(result.assets[0].uri);
      }
    }
  };

  const handleGenerateReading = async () => {
    if (cupImages.length === 0) {
      Alert.alert('', t('screens.coffeeReading.errors.noCupImage'));
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      cupImages.forEach((uri, index) => {
        formData.append(`cups`, {
          uri,
          type: 'image/jpeg',
          name: `cup_${index}.jpg`,
        } as any);
      });
      if (saucerImage) {
        formData.append('saucer', {
          uri: saucerImage,
          type: 'image/jpeg',
          name: 'saucer.jpg',
        } as any);
      }

      const response = await axios.post('/coffee-reading', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setReading(response.data);
    } catch (error: any) {
      if (error.response?.status === 429) {
        setShowLimitModal(true);
      } else {
        Alert.alert('', t('screens.coffeeReading.errors.generateFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  const resetReading = () => {
    setCupImages([]);
    setSaucerImage('');
    setReading(null);
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#0f0f1e']} style={styles.header}>
        <Text style={styles.title}>{t('screens.coffeeReading.title')}</Text>
        <Text style={styles.subtitle}>
          {t('screens.coffeeReading.subtitle')}
        </Text>
      </LinearGradient>

      {!reading ? (
        <>
          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>
              {t('screens.coffeeReading.instructions.title')}
            </Text>
            <Text style={styles.instructionText}>
              {t('screens.coffeeReading.instructions.step1')}
            </Text>
            <Text style={styles.instructionText}>
              {t('screens.coffeeReading.instructions.step2')}
            </Text>
            <Text style={styles.instructionText}>
              {t('screens.coffeeReading.instructions.step3')}
            </Text>
          </View>

          {/* Cup Images */}
          <View style={styles.uploadSection}>
            <Text style={styles.sectionTitle}>
              {t('screens.coffeeReading.upload.cupPhotos', { count: cupImages.length })}
            </Text>
            <View style={styles.imageGrid}>
              {cupImages.map((uri, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() =>
                      setCupImages(cupImages.filter((_, i) => i !== index))
                    }
                  >
                    <Text style={styles.removeText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {cupImages.length < 3 && (
                <TouchableOpacity
                  style={styles.addImageButton}
                  onPress={() => pickImage('cup')}
                >
                  <Text style={styles.addImageText}>+</Text>
                  <Text style={styles.addImageLabel}>
                    {t('screens.coffeeReading.upload.addCup')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Saucer Image */}
          <View style={styles.uploadSection}>
            <Text style={styles.sectionTitle}>
              {t('screens.coffeeReading.upload.saucerPhoto')}
            </Text>
            {saucerImage ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: saucerImage }} style={styles.imageLarge} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => setSaucerImage('')}
                >
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addImageButtonLarge}
                onPress={() => pickImage('saucer')}
              >
                <Text style={styles.addImageText}>+</Text>
                <Text style={styles.addImageLabel}>
                  {t('screens.coffeeReading.upload.addSaucer')}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            style={[
              styles.generateButton,
              cupImages.length === 0 && styles.buttonDisabled,
            ]}
            onPress={handleGenerateReading}
            disabled={loading || cupImages.length === 0}
          >
            <LinearGradient
              colors={['#8b5cf6', '#6366f1']}
              style={styles.buttonGradient}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {t('screens.coffeeReading.generateButton')}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Reading Result */}
          <View style={styles.readingContainer}>
            <Text style={styles.readingTitle}>
              {t('screens.coffeeReading.readingTitle')}
            </Text>

            {reading.overallVibe && (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionCardTitle}>
                  {t('screens.coffeeReading.sections.overallVibe')}
                </Text>
                <Text style={styles.sectionCardText}>
                  {reading.overallVibe}
                </Text>
              </View>
            )}

            {reading.love && (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionCardTitle}>
                  {t('screens.coffeeReading.sections.love')}
                </Text>
                <Text style={styles.sectionCardText}>{reading.love}</Text>
              </View>
            )}

            {reading.workAndMoney && (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionCardTitle}>
                  {t('screens.coffeeReading.sections.workAndMoney')}
                </Text>
                <Text style={styles.sectionCardText}>
                  {reading.workAndMoney}
                </Text>
              </View>
            )}

            {reading.predictions && (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionCardTitle}>
                  {t('screens.coffeeReading.sections.predictions')}
                </Text>
                <Text style={styles.sectionCardText}>
                  {reading.predictions}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.newReadingButton}
              onPress={resetReading}
            >
              <Text style={styles.newReadingText}>
                {t('screens.coffeeReading.newReading')}
              </Text>
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
  uploadSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  imageLarge: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6366f1',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButtonLarge: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6366f1',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    fontSize: 32,
    color: '#6366f1',
    marginBottom: 4,
  },
  addImageLabel: {
    fontSize: 14,
    color: '#9ca3af',
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
  buttonDisabled: {
    opacity: 0.5,
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
  sectionCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 12,
  },
  sectionCardText: {
    fontSize: 16,
    color: '#d1d5db',
    lineHeight: 24,
  },
  newReadingButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  newReadingText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
