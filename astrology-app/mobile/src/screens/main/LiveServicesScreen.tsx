import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

interface Expert {
  id: string;
  name: string;
  type: string;
  bio: string;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  pricePerSession: number;
}

export default function LiveServicesScreen() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');

  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [bookingData, setBookingData] = useState({
    date: new Date(),
    duration: 30,
    notes: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const serviceTypes = [
    { value: 'all', label: 'All' },
    { value: 'astrology', label: 'Astrology' },
    { value: 'tarot', label: 'Tarot' },
    { value: 'spiritual', label: 'Spiritual' },
    { value: 'numerology', label: 'Numerology' },
  ];

  useEffect(() => {
    fetchExperts();
  }, [selectedType]);

  const fetchExperts = async () => {
    try {
      const params = selectedType !== 'all' ? { type: selectedType } : {};
      const response = await axios.get('/live-services/experts', { params });
      setExperts(response.data);
    } catch (error) {
      console.error('Error fetching experts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSession = (expert: Expert) => {
    setSelectedExpert(expert);
    setBookingModalVisible(true);
  };

  const handleSubmitBooking = async () => {
    if (!selectedExpert) return;

    if (!bookingData.notes.trim()) {
      Alert.alert('Validation', 'Please add notes about what you want to discuss');
      return;
    }

    try {
      setBookingLoading(true);
      await axios.post('/live-services/book-session', {
        expertId: selectedExpert.id,
        date: bookingData.date.toISOString(),
        duration: bookingData.duration,
        notes: bookingData.notes,
      });

      Alert.alert(
        'Booking Confirmed!',
        `Your ${bookingData.duration}-minute session with ${selectedExpert.name} has been scheduled for ${bookingData.date.toLocaleString()}. You'll receive a confirmation email shortly.`,
      );

      setBookingModalVisible(false);
      setBookingData({
        date: new Date(),
        duration: 30,
        notes: '',
      });
    } catch (error) {
      Alert.alert('Booking Failed', 'Unable to book session. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const updatedDate = new Date(bookingData.date);
      updatedDate.setFullYear(selectedDate.getFullYear());
      updatedDate.setMonth(selectedDate.getMonth());
      updatedDate.setDate(selectedDate.getDate());
      setBookingData({ ...bookingData, date: updatedDate });
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const updatedDate = new Date(bookingData.date);
      updatedDate.setHours(selectedTime.getHours());
      updatedDate.setMinutes(selectedTime.getMinutes());
      setBookingData({ ...bookingData, date: updatedDate });
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#0f0f1e']} style={styles.header}>
        <Text style={styles.title}>🔮 Live Services</Text>
        <Text style={styles.subtitle}>
          Connect with expert readers and advisors
        </Text>
      </LinearGradient>

      {/* Type Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {serviceTypes.map((type) => (
          <TouchableOpacity
            key={type.value}
            style={[
              styles.filterButton,
              selectedType === type.value && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedType(type.value)}
          >
            <Text
              style={[
                styles.filterText,
                selectedType === type.value && styles.filterTextActive,
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Experts List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <ScrollView style={styles.expertsContainer}>
          {experts.map((expert) => (
            <View key={expert.id} style={styles.expertCard}>
              <View style={styles.expertHeader}>
                {expert.imageUrl && (
                  <Image
                    source={{ uri: expert.imageUrl }}
                    style={styles.expertImage}
                  />
                )}
                <View style={styles.expertInfo}>
                  <Text style={styles.expertName}>{expert.name}</Text>
                  <Text style={styles.expertType}>{expert.type}</Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.rating}>⭐ {expert.rating.toFixed(1)}</Text>
                    <Text style={styles.reviewCount}>
                      ({expert.reviewCount} reviews)
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.expertBio} numberOfLines={3}>
                {expert.bio}
              </Text>

              <View style={styles.expertFooter}>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>From</Text>
                  <Text style={styles.price}>${expert.pricePerSession}</Text>
                  <Text style={styles.priceLabel}>/ session</Text>
                </View>

                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => handleRequestSession(expert)}
                >
                  <LinearGradient
                    colors={['#6366f1', '#8b5cf6']}
                    style={styles.bookButtonGradient}
                  >
                    <Text style={styles.bookButtonText}>Request Session</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {experts.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                No experts available in this category
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Booking Modal */}
      <Modal
        visible={bookingModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setBookingModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setBookingModalVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Book Session</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedExpert && (
              <>
                {/* Expert Info */}
                <View style={styles.modalExpertInfo}>
                  {selectedExpert.imageUrl && (
                    <Image
                      source={{ uri: selectedExpert.imageUrl }}
                      style={styles.modalExpertImage}
                    />
                  )}
                  <View style={styles.modalExpertDetails}>
                    <Text style={styles.modalExpertName}>{selectedExpert.name}</Text>
                    <Text style={styles.modalExpertType}>{selectedExpert.type}</Text>
                    <Text style={styles.modalExpertPrice}>
                      ${selectedExpert.pricePerSession} / session
                    </Text>
                  </View>
                </View>

                {/* Date Selection */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Preferred Date</Text>
                  <TouchableOpacity
                    style={styles.formInput}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.formInputText}>
                      {bookingData.date.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={bookingData.date}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                      minimumDate={new Date()}
                    />
                  )}
                </View>

                {/* Time Selection */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Preferred Time</Text>
                  <TouchableOpacity
                    style={styles.formInput}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text style={styles.formInputText}>
                      {bookingData.date.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </TouchableOpacity>
                  {showTimePicker && (
                    <DateTimePicker
                      value={bookingData.date}
                      mode="time"
                      display="default"
                      onChange={handleTimeChange}
                    />
                  )}
                </View>

                {/* Duration Selection */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Session Duration</Text>
                  <View style={styles.durationButtons}>
                    {[30, 60, 90].map((duration) => (
                      <TouchableOpacity
                        key={duration}
                        style={[
                          styles.durationButton,
                          bookingData.duration === duration &&
                            styles.durationButtonActive,
                        ]}
                        onPress={() =>
                          setBookingData({ ...bookingData, duration })
                        }
                      >
                        <Text
                          style={[
                            styles.durationButtonText,
                            bookingData.duration === duration &&
                              styles.durationButtonTextActive,
                          ]}
                        >
                          {duration} min
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Notes */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>What would you like to discuss?</Text>
                  <TextInput
                    style={styles.formTextArea}
                    placeholder="Describe what you'd like guidance on..."
                    placeholderTextColor="#6b7280"
                    value={bookingData.notes}
                    onChangeText={(text) =>
                      setBookingData({ ...bookingData, notes: text })
                    }
                    multiline
                    numberOfLines={4}
                    maxLength={500}
                  />
                  <Text style={styles.charCount}>
                    {bookingData.notes.length}/500
                  </Text>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    bookingLoading && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmitBooking}
                  disabled={bookingLoading}
                >
                  <LinearGradient
                    colors={['#6366f1', '#8b5cf6']}
                    style={styles.submitButtonGradient}
                  >
                    {bookingLoading ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text style={styles.submitButtonText}>
                        Confirm Booking
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
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
  filterContainer: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 12,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#0f0f1e',
  },
  filterButtonActive: {
    backgroundColor: '#6366f1',
  },
  filterText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expertsContainer: {
    flex: 1,
    padding: 20,
  },
  expertCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  expertHeader: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  expertImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  expertInfo: {
    flex: 1,
  },
  expertName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  expertType: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '600',
  },
  reviewCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  expertBio: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
    marginBottom: 16,
  },
  expertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  priceLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
  },
  bookButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  bookButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  closeButton: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalExpertInfo: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  modalExpertImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  modalExpertDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  modalExpertName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  modalExpertType: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 4,
  },
  modalExpertPrice: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  formInputText: {
    color: '#ffffff',
    fontSize: 16,
  },
  formTextArea: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
    color: '#ffffff',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
    marginTop: 4,
  },
  durationButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  durationButton: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#374151',
  },
  durationButtonActive: {
    borderColor: '#6366f1',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  durationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
  },
  durationButtonTextActive: {
    color: '#6366f1',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 32,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
