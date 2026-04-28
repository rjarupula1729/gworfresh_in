import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import api from '../services/api';
import { COLORS } from '../utils/colors';

const InstructorBookingScreen = ({ navigation }) => {
  const { user } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('available'); // 'available' or 'bookings'
  const [instructors, setInstructors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch available instructors
      const instructorsRes = await api.get('/instructors/instructors/available');
      console.log('Instructors fetched:', instructorsRes.data);
      setInstructors(instructorsRes.data);

      // Fetch user's bookings
      const bookingsRes = await api.get('/instructors');
      console.log('Bookings fetched:', bookingsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleBookInstructor = (instructor) => {
    setSelectedInstructor(instructor);
    setSelectedDate('');
    setSelectedTime('10:00');
    setBookingNotes('');
    setBookingModalVisible(true);
  };

  const submitBooking = async () => {
    if (!selectedDate) {
      Alert.alert('Validation', 'Please select a date');
      return;
    }

    try {
      setBookingLoading(true);
      const response = await api.post('/instructors', {
        instructorId: selectedInstructor._id,
        date: `${selectedDate}T${selectedTime}:00`,
        notes: bookingNotes,
      });
      console.log('Booking created:', response.data);

      // Add to bookings list
      setBookings([response.data, ...bookings]);

      Alert.alert('Success', 'Consultation booked! Expert will review shortly 🎉');
      setBookingModalVisible(false);
      setActiveTab('bookings');
    } catch (error) {
      console.error('Error booking:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to book consultation');
    } finally {
      setBookingLoading(false);
    }
  };

  const getAvailableSlots = () => {
    const slots = [];
    for (let hour = 10; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'short', month: 'short', year: '2-digit' });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'short', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'requested':
        return COLORS.blue;
      case 'confirmed':
        return COLORS.green;
      case 'completed':
        return COLORS.gray;
      case 'cancelled':
        return COLORS.red;
      default:
        return COLORS.gray;
    }
  };

  const InstructorCard = ({ instructor }) => (
    <View style={styles.instructorCard}>
      <View style={styles.instructorHeader}>
        <View style={styles.instructorAvatar}>
          <Text style={styles.avatarText}>{instructor.name?.[0]?.toUpperCase() || 'I'}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.instructorName}>{instructor.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color={COLORS.yellow} />
            <Text style={styles.ratingText}>{instructor.rating || 4.8}</Text>
            <Text style={styles.reviewsText}>({instructor.reviews || 24} reviews)</Text>
          </View>
        </View>
        <View style={styles.availableBadge}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.green} />
          <Text style={styles.availableText}>Available</Text>
        </View>
      </View>

      <View style={styles.instructorDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="leaf" size={14} color={COLORS.green} />
          <Text style={styles.detailText}>{instructor.specialization || 'Vegetable Gardening'}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time" size={14} color={COLORS.blue} />
          <Text style={styles.detailText}>{instructor.experience || 5}+ years experience</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="cash" size={14} color={COLORS.green} />
          <Text style={styles.detailText}>₹{instructor.rate || 500}/session</Text>
        </View>
      </View>

      {instructor.bio && (
        <Text style={styles.instructorBio}>{instructor.bio}</Text>
      )}

      <TouchableOpacity
        style={styles.bookBtn}
        onPress={() => handleBookInstructor(instructor)}
      >
        <Ionicons name="calendar" size={16} color="#FFF" />
        <Text style={styles.bookBtnText}>Book Consultation</Text>
      </TouchableOpacity>
    </View>
  );

  const BookingCard = ({ booking }) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <View style={styles.bookingAvatar}>
          <Text style={styles.avatarText}>{booking.instructorName?.[0]?.toUpperCase() || 'I'}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.bookingInstructorName}>{booking.instructorName || 'Instructor'}</Text>
          <Text style={styles.bookingDate}>{formatDateTime(booking.date)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
          <Text style={styles.statusText}>{booking.status || 'Requested'}</Text>
        </View>
      </View>

      {booking.notes && (
        <View style={styles.bookingNotes}>
          <Text style={styles.notesLabel}>Your Request:</Text>
          <Text style={styles.notesText}>{booking.notes}</Text>
        </View>
      )}

      <View style={styles.bookingActions}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.blue }]}>
          <Ionicons name="call" size={16} color="#FFF" />
          <Text style={styles.actionBtnText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.lightGray }]}>
          <Ionicons name="close" size={16} color={COLORS.red} />
          <Text style={[styles.actionBtnText, { color: COLORS.red }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const BookingModal = () => {
    const slots = getAvailableSlots();
    const minDate = getMinDate();
    const maxDate = getMaxDate();

    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={bookingModalVisible}
        onRequestClose={() => setBookingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bookingModalContent}>
            {/* Header */}
            <View style={styles.bookingModalHeader}>
              <TouchableOpacity onPress={() => setBookingModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
              <Text style={styles.bookingModalTitle}>Book Consultation</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Instructor Summary */}
              <View style={styles.instructorSummary}>
                <View style={styles.instructorAvatar}>
                  <Text style={styles.avatarText}>{selectedInstructor?.name?.[0]?.toUpperCase() || 'I'}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.instructorName}>{selectedInstructor?.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color={COLORS.yellow} />
                    <Text style={styles.ratingText}>{selectedInstructor?.rating || 4.8}</Text>
                  </View>
                </View>
              </View>

              {/* Date Selection */}
              <View style={styles.bookingSection}>
                <Text style={styles.sectionTitle}>Select Date</Text>
                <TextInput
                  style={styles.dateInput}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={COLORS.gray}
                  value={selectedDate}
                  onChangeText={setSelectedDate}
                />
                <Text style={styles.dateHint}>
                  Select between {minDate} and {maxDate}
                </Text>
              </View>

              {/* Time Selection */}
              <View style={styles.bookingSection}>
                <Text style={styles.sectionTitle}>Select Time</Text>
                <View style={styles.timeSlots}>
                  {slots.map((slot, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.timeSlot,
                        selectedTime === slot && { backgroundColor: COLORS.green },
                      ]}
                      onPress={() => setSelectedTime(slot)}
                    >
                      <Text
                        style={[
                          styles.timeSlotText,
                          selectedTime === slot && { color: '#FFF', fontWeight: '600' },
                        ]}
                      >
                        {slot}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Notes */}
              <View style={styles.bookingSection}>
                <Text style={styles.sectionTitle}>What do you want to discuss?</Text>
                <TextInput
                  style={styles.notesInput}
                  placeholder="e.g., Issues with plant growth, pest problems, care tips..."
                  placeholderTextColor={COLORS.gray}
                  multiline
                  numberOfLines={4}
                  value={bookingNotes}
                  onChangeText={setBookingNotes}
                  textAlignVertical="top"
                />
              </View>

              {/* Price Info */}
              <View style={styles.bookingSection}>
                <View style={styles.priceBox}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.priceLabel}>Session Fee</Text>
                    <Text style={styles.priceValue}>
                      ₹{selectedInstructor?.rate || 500}
                    </Text>
                  </View>
                  <View style={styles.priceIcon}>
                    <Ionicons name="information-circle" size={20} color={COLORS.blue} />
                  </View>
                </View>
                <Text style={styles.priceNote}>
                  You can pay after the consultation is confirmed
                </Text>
              </View>

              {/* Cancellation Policy */}
              <View style={styles.bookingSection}>
                <View style={styles.policyBox}>
                  <Ionicons name="alert-circle" size={18} color={COLORS.blue} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.policyTitle}>Cancellation Policy</Text>
                    <Text style={styles.policyText}>
                      Free cancellation up to 24 hours before session
                    </Text>
                  </View>
                </View>
              </View>

              {/* Rewards Info */}
              <View style={styles.bookingSection}>
                <View style={styles.rewardsBox}>
                  <Ionicons name="star" size={20} color={COLORS.yellow} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.rewardsTitle}>Earn Rewards</Text>
                    <Text style={styles.rewardsText}>
                      Complete the session to earn reward points
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.bookingActionButtons}>
              <TouchableOpacity
                style={[styles.bookingActionBtn, { backgroundColor: COLORS.lightGray }]}
                onPress={() => setBookingModalVisible(false)}
                disabled={bookingLoading}
              >
                <Text style={[styles.bookingActionBtnText, { color: COLORS.gray }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.bookingActionBtn, { backgroundColor: COLORS.green }]}
                onPress={submitBooking}
                disabled={bookingLoading || !selectedDate || !selectedTime}
              >
                {bookingLoading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={[styles.bookingActionBtnText, { color: '#FFF' }]}>
                    Request Booking
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Expert Consultants</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={COLORS.green} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expert Consultants</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'available' && styles.activeTab]}
          onPress={() => setActiveTab('available')}
        >
          <Ionicons
            name="person-add"
            size={18}
            color={activeTab === 'available' ? COLORS.green : COLORS.gray}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'available' && styles.activeTabLabel,
            ]}
          >
            Available
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'bookings' && styles.activeTab]}
          onPress={() => setActiveTab('bookings')}
        >
          <Ionicons
            name="calendar"
            size={18}
            color={activeTab === 'bookings' ? COLORS.green : COLORS.gray}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'bookings' && styles.activeTabLabel,
            ]}
          >
            My Bookings ({bookings.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'available' ? (
        instructors.length > 0 ? (
          <ScrollView
            style={styles.content}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.green} />
            }
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.instructorsList}>
              <Text style={styles.sectionHeader}>
                {instructors.length} Expert {instructors.length === 1 ? 'Instructor' : 'Instructors'}
              </Text>
              {instructors.map((instructor, index) => (
                <InstructorCard key={instructor._id || index} instructor={instructor} />
              ))}
            </View>
            <View style={{ height: 20 }} />
          </ScrollView>
        ) : (
          <View style={styles.centerContent}>
            <Ionicons name="people" size={64} color={COLORS.lightGray} />
            <Text style={styles.emptyText}>No instructors available</Text>
            <Text style={styles.emptySubtext}>
              Check back later for expert consultants
            </Text>
          </View>
        )
      ) : bookings.length > 0 ? (
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.green} />
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.bookingsList}>
            {bookings.map((booking, index) => (
              <BookingCard key={booking._id || index} booking={booking} />
            ))}
          </View>
          <View style={{ height: 20 }} />
        </ScrollView>
      ) : (
        <View style={styles.centerContent}>
          <Ionicons name="calendar" size={64} color={COLORS.lightGray} />
          <Text style={styles.emptyText}>No bookings yet</Text>
          <Text style={styles.emptySubtext}>
            Book an expert consultant to get personalized guidance
          </Text>
          <TouchableOpacity
            style={styles.bookNowBtn}
            onPress={() => setActiveTab('available')}
          >
            <Text style={styles.bookNowBtnText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      )}

      <BookingModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.green,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.gray,
  },
  activeTabLabel: {
    color: COLORS.green,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 8,
    textAlign: 'center',
  },
  bookNowBtn: {
    marginTop: 20,
    backgroundColor: COLORS.green,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  bookNowBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  instructorsList: {
    marginBottom: 8,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
    marginBottom: 12,
  },
  instructorCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  instructorName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 12,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  reviewsText: {
    fontSize: 11,
    color: COLORS.gray,
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.green + '20',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  availableText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.green,
  },
  instructorDetails: {
    gap: 8,
    marginBottom: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  instructorBio: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 18,
    marginBottom: 12,
  },
  bookBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.green,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  bookBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  bookingsList: {
    marginBottom: 8,
  },
  bookingCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.green,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingInstructorName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 12,
  },
  bookingDate: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFF',
  },
  bookingNotes: {
    backgroundColor: COLORS.light,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  notesLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text,
  },
  notesText: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
    lineHeight: 16,
  },
  bookingActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bookingModalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingTop: 0,
  },
  bookingModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  bookingModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  instructorSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.light,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 10,
  },
  bookingSection: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 10,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    color: COLORS.text,
  },
  dateHint: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 8,
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    width: '23%',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    alignItems: 'center',
  },
  timeSlotText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.gray,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    color: COLORS.text,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  priceBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.light,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.green,
    marginTop: 2,
  },
  priceIcon: {
    marginLeft: 12,
  },
  priceNote: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 8,
  },
  policyBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.blue,
  },
  policyTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  policyText: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 2,
  },
  rewardsBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFACD',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.yellow,
  },
  rewardsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  rewardsText: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 2,
  },
  bookingActionButtons: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  bookingActionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingActionBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default InstructorBookingScreen;
