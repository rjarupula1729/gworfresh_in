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
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import api from '../services/api';
import { COLORS } from '../utils/colors';

const PlantTrackingScreen = ({ navigation }) => {
  const { user } = useContext(AppContext);
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [progressModalVisible, setProgressModalVisible] = useState(false);
  const [progressNote, setProgressNote] = useState('');
  const [progressLoading, setProgressLoading] = useState(false);

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      const response = await api.get('/garden');
      console.log('Plants fetched:', response.data);
      setPlants(response.data);
    } catch (error) {
      console.error('Error fetching plants:', error);
      Alert.alert('Error', 'Failed to load plants');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPlants();
    setRefreshing(false);
  };

  const handleViewDetails = (plant) => {
    setSelectedPlant(plant);
    setDetailsModalVisible(true);
  };

  const handleAddProgress = () => {
    setProgressNote('');
    setProgressModalVisible(true);
  };

  const submitProgress = async () => {
    if (!progressNote.trim()) {
      Alert.alert('Validation', 'Please enter a note about today\'s progress');
      return;
    }

    try {
      setProgressLoading(true);
      const response = await api.post(`/garden/${selectedPlant._id}/progress`, {
        note: progressNote,
        date: new Date(),
      });
      console.log('Progress added:', response.data);
      
      // Update local plant data
      const updatedPlant = response.data;
      setSelectedPlant(updatedPlant);
      
      // Update plants list
      const updatedPlants = plants.map(p => p._id === updatedPlant._id ? updatedPlant : p);
      setPlants(updatedPlants);
      
      Alert.alert('Success', 'Progress logged! You earned 2 reward points 🎉');
      setProgressModalVisible(false);
      setProgressNote('');
    } catch (error) {
      console.error('Error adding progress:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to add progress');
    } finally {
      setProgressLoading(false);
    }
  };

  const getHealthStatus = (plantAge) => {
    const days = Math.floor((new Date() - new Date(plantAge)) / (1000 * 60 * 60 * 24));
    if (days < 7) return { status: 'Seedling', color: COLORS.purple, icon: 'leaf' };
    if (days < 30) return { status: 'Growing', color: COLORS.blue, icon: 'leaf' };
    if (days < 60) return { status: 'Strong', color: COLORS.green, icon: 'checkmark-circle' };
    return { status: 'Mature', color: COLORS.yellow, icon: 'star' };
  };

  const getProgressPercentage = (plantAge) => {
    const days = Math.floor((new Date() - new Date(plantAge)) / (1000 * 60 * 60 * 24));
    return Math.min((days / 90) * 100, 100);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
  };

  const getPlantDaysOld = (plantAge) => {
    return Math.floor((new Date() - new Date(plantAge)) / (1000 * 60 * 60 * 24));
  };

  const PlantCard = ({ plant }) => {
    const health = getHealthStatus(plant.plantedAt);
    const daysOld = getPlantDaysOld(plant.plantedAt);

    return (
      <TouchableOpacity
        style={styles.plantCard}
        onPress={() => handleViewDetails(plant)}
        activeOpacity={0.7}
      >
        <View style={styles.plantCardHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={[styles.plantIcon, { backgroundColor: health.color + '20' }]}>
              <Ionicons name={health.icon} size={24} color={health.color} />
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.plantName}>{plant.productName || 'Plant'}</Text>
              <Text style={styles.plantDate}>Planted {formatDate(plant.plantedAt)}</Text>
            </View>
          </View>
          <View style={[styles.healthBadge, { backgroundColor: health.color }]}>
            <Text style={styles.healthText}>{health.status}</Text>
          </View>
        </View>

        <View style={styles.plantStats}>
          <View style={styles.statItem}>
            <Ionicons name="calendar" size={16} color={COLORS.gray} />
            <Text style={styles.statLabel}>{daysOld} days old</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="document-text" size={16} color={COLORS.gray} />
            <Text style={styles.statLabel}>{plant.progress?.length || 0} logs</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="star" size={16} color={COLORS.yellow} />
            <Text style={styles.statLabel}>10 pts</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${getProgressPercentage(plant.plantedAt)}%`,
                  backgroundColor: health.color,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round(getProgressPercentage(plant.plantedAt))}% complete
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const PlantDetailsModal = () => {
    if (!selectedPlant) return null;

    const health = getHealthStatus(selectedPlant.plantedAt);
    const daysOld = getPlantDaysOld(selectedPlant.plantedAt);
    const recentLogs = selectedPlant.progress?.slice(-5).reverse() || [];

    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={detailsModalVisible}
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Plant Details</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Plant Info */}
              <View style={styles.modalSection}>
                <View style={styles.plantInfoHeader}>
                  <View
                    style={[
                      styles.plantIconLarge,
                      { backgroundColor: health.color + '20' },
                    ]}
                  >
                    <Ionicons name={health.icon} size={40} color={health.color} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 16 }}>
                    <Text style={styles.plantNameLarge}>{selectedPlant.productName}</Text>
                    <View style={[styles.healthBadgeLarge, { backgroundColor: health.color }]}>
                      <Text style={styles.healthTextLarge}>{health.status}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Statistics */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Statistics</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                    <Ionicons name="calendar" size={20} color={COLORS.green} />
                    <Text style={styles.statCardLabel}>Age</Text>
                    <Text style={styles.statCardValue}>{daysOld} days</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Ionicons name="document-text" size={20} color={COLORS.blue} />
                    <Text style={styles.statCardLabel}>Logs</Text>
                    <Text style={styles.statCardValue}>{recentLogs.length}</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Ionicons name="star" size={20} color={COLORS.yellow} />
                    <Text style={styles.statCardLabel}>Rewards</Text>
                    <Text style={styles.statCardValue}>10 pts</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Ionicons name="checkmark-circle" size={20} color={health.color} />
                    <Text style={styles.statCardLabel}>Progress</Text>
                    <Text style={styles.statCardValue}>
                      {Math.round(getProgressPercentage(selectedPlant.plantedAt))}%
                    </Text>
                  </View>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Growth Progress</Text>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${getProgressPercentage(selectedPlant.plantedAt)}%`,
                          backgroundColor: health.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressLabel}>
                    {Math.round(getProgressPercentage(selectedPlant.plantedAt))}% complete
                  </Text>
                </View>
              </View>

              {/* Care Instructions */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Care Instructions</Text>
                <View style={styles.careBox}>
                  <View style={styles.careItem}>
                    <Ionicons name="water" size={18} color={COLORS.blue} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.careTitle}>Watering</Text>
                      <Text style={styles.careText}>Water daily in morning or evening</Text>
                    </View>
                  </View>
                  <View style={styles.careItem}>
                    <Ionicons name="sunny" size={18} color={COLORS.yellow} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.careTitle}>Sunlight</Text>
                      <Text style={styles.careText}>Minimum 6 hours of direct sunlight</Text>
                    </View>
                  </View>
                  <View style={styles.careItem}>
                    <Ionicons name="leaf" size={18} color={COLORS.green} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.careTitle}>Soil</Text>
                      <Text style={styles.careText}>Keep soil moist but not waterlogged</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Recent Logs */}
              <View style={styles.modalSection}>
                <View style={styles.logsHeader}>
                  <Text style={styles.sectionTitle}>Recent Logs</Text>
                  <TouchableOpacity onPress={handleAddProgress}>
                    <Ionicons name="add-circle" size={24} color={COLORS.green} />
                  </TouchableOpacity>
                </View>

                {recentLogs.length > 0 ? (
                  <View style={styles.logsList}>
                    {recentLogs.map((log, index) => (
                      <View key={index} style={styles.logItem}>
                        <View style={styles.logDate}>
                          <Text style={styles.logDateText}>
                            {formatDate(log.date)}
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.logNote}>{log.note}</Text>
                          {log.photo && (
                            <View style={styles.photoPlaceholder}>
                              <Ionicons name="image" size={16} color={COLORS.gray} />
                              <Text style={styles.photoText}>Photo attached</Text>
                            </View>
                          )}
                        </View>
                        <Ionicons name="checkmark-circle" size={20} color={COLORS.green} />
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyLogs}>
                    <Ionicons name="document-text" size={32} color={COLORS.lightGray} />
                    <Text style={styles.emptyLogsText}>No logs yet. Start tracking!</Text>
                  </View>
                )}
              </View>

              {/* Instructor Support */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Need Help?</Text>
                <TouchableOpacity style={styles.instructorBox}>
                  <Ionicons name="person-circle" size={24} color={COLORS.green} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.instructorTitle}>Book Expert Consultation</Text>
                    <Text style={styles.instructorText}>
                      Get guidance from our expert gardeners
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
                </TouchableOpacity>
              </View>

              {/* Rewards Info */}
              <View style={styles.modalSection}>
                <View style={styles.rewardsBox}>
                  <Ionicons name="star" size={24} color={COLORS.yellow} />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.rewardsTitle}>Reward Points</Text>
                    <Text style={styles.rewardsText}>
                      Started plant: +10 pts | Log update: +2 pts each
                    </Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: COLORS.green }]}
                  onPress={handleAddProgress}
                >
                  <Ionicons name="add" size={18} color="#FFF" />
                  <Text style={styles.actionBtnText}>Log Progress</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.red }]}>
                  <Ionicons name="trash" size={18} color="#FFF" />
                  <Text style={styles.actionBtnText}>Remove</Text>
                </TouchableOpacity>
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const ProgressModal = () => {
    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={progressModalVisible}
        onRequestClose={() => setProgressModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.progressModalContent}>
            {/* Header */}
            <View style={styles.progressModalHeader}>
              <TouchableOpacity onPress={() => setProgressModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
              <Text style={styles.progressModalTitle}>Log Progress</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.progressFormSection}>
                <Text style={styles.progressModalSectionTitle}>
                  What's new with your plant today?
                </Text>

                {/* Progress Note Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Today's Progress</Text>
                  <TextInput
                    style={styles.noteInput}
                    placeholder="e.g., New leaves appeared, plant looks healthy..."
                    placeholderTextColor={COLORS.gray}
                    multiline
                    numberOfLines={5}
                    value={progressNote}
                    onChangeText={setProgressNote}
                  />
                  <Text style={styles.charCount}>
                    {progressNote.length}/500 characters
                  </Text>
                </View>

                {/* Photo Upload (placeholder) */}
                <View style={styles.photoUploadContainer}>
                  <TouchableOpacity style={styles.photoUploadBtn}>
                    <Ionicons name="image" size={24} color={COLORS.green} />
                    <Text style={styles.photoUploadText}>Add Photo (Optional)</Text>
                  </TouchableOpacity>
                  <Text style={styles.photoUploadHint}>
                    Upload a photo of your plant to track visual progress
                  </Text>
                </View>

                {/* Progress Tips */}
                <View style={styles.tipsContainer}>
                  <Text style={styles.tipsTitle}>💡 Logging Tips</Text>
                  <Text style={styles.tipItem}>✓ Note new growth and leaf development</Text>
                  <Text style={styles.tipItem}>✓ Mention any issues or pests observed</Text>
                  <Text style={styles.tipItem}>✓ Share maintenance you've done</Text>
                  <Text style={styles.tipItem}>✓ Add photos for visual comparison</Text>
                </View>

                {/* Rewards Info */}
                <View style={styles.progressRewardsBox}>
                  <Ionicons name="star" size={20} color={COLORS.yellow} />
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={styles.progressRewardsText}>
                      You'll earn <Text style={{ fontWeight: '600', color: COLORS.yellow }}>2 reward points</Text> for logging today!
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.progressActionButtons}>
              <TouchableOpacity
                style={[styles.progressActionBtn, { backgroundColor: COLORS.lightGray }]}
                onPress={() => setProgressModalVisible(false)}
                disabled={progressLoading}
              >
                <Text style={[styles.progressActionBtnText, { color: COLORS.gray }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.progressActionBtn, { backgroundColor: COLORS.green }]}
                onPress={submitProgress}
                disabled={progressLoading}
              >
                {progressLoading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={[styles.progressActionBtnText, { color: '#FFF' }]}>
                    Save Progress
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
          <Text style={styles.headerTitle}>My Garden</Text>
          <TouchableOpacity>
            <Ionicons name="add-circle" size={24} color={COLORS.green} />
          </TouchableOpacity>
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
        <Text style={styles.headerTitle}>My Garden</Text>
        <TouchableOpacity>
          <Ionicons name="add-circle" size={24} color={COLORS.green} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {plants.length > 0 ? (
        <ScrollView
          style={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.green} />}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.plantsList}>
            <View style={styles.plantsCount}>
              <Ionicons name="leaf" size={18} color={COLORS.green} />
              <Text style={styles.plantsCountText}>
                {plants.length} {plants.length === 1 ? 'Plant' : 'Plants'} growing
              </Text>
            </View>
            {plants.map((plant, index) => (
              <PlantCard key={plant._id || index} plant={plant} />
            ))}
          </View>
          <View style={{ height: 20 }} />
        </ScrollView>
      ) : (
        <View style={styles.centerContent}>
          <Ionicons name="leaf" size={64} color={COLORS.lightGray} />
          <Text style={styles.emptyText}>Your garden is empty</Text>
          <Text style={styles.emptySubtext}>
            Start by purchasing plants and seeds from the shop!
          </Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => navigation.navigate('Shop')}
          >
            <Text style={styles.shopBtnText}>Go to Shop</Text>
          </TouchableOpacity>
        </View>
      )}

      <PlantDetailsModal />
      <ProgressModal />
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  plantsList: {
    marginBottom: 8,
  },
  plantsCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  plantsCountText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray,
  },
  plantCard: {
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
  plantCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  plantIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  plantDate: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  healthBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  healthText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFF',
  },
  plantStats: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
  progressSection: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: COLORS.gray,
    textAlign: 'right',
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
  shopBtn: {
    marginTop: 20,
    backgroundColor: COLORS.green,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shopBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingTop: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  modalSection: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  plantInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plantIconLarge: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantNameLarge: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  healthBadgeLarge: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  healthTextLarge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statCard: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: COLORS.light,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  statCardLabel: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 6,
  },
  statCardValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  progressBarContainer: {
    backgroundColor: COLORS.light,
    borderRadius: 10,
    padding: 12,
  },
  careBox: {
    backgroundColor: COLORS.light,
    borderRadius: 10,
    padding: 12,
  },
  careItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  careTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  careText: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  logsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logsList: {
    backgroundColor: COLORS.light,
    borderRadius: 10,
    overflow: 'hidden',
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FFF',
  },
  logDate: {
    backgroundColor: COLORS.green + '20',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 12,
  },
  logDateText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.green,
  },
  logNote: {
    fontSize: 12,
    color: COLORS.text,
    flex: 1,
  },
  photoPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  photoText: {
    fontSize: 11,
    color: COLORS.gray,
  },
  emptyLogs: {
    backgroundColor: COLORS.light,
    borderRadius: 10,
    padding: 24,
    alignItems: 'center',
  },
  emptyLogsText: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 8,
  },
  instructorBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.light,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  instructorTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  instructorText: {
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
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  rewardsText: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  // Progress Modal
  progressModalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingTop: 0,
  },
  progressModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  progressModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  progressFormSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  progressModalSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    color: COLORS.text,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 6,
    textAlign: 'right',
  },
  photoUploadContainer: {
    marginBottom: 16,
  },
  photoUploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.green,
    borderRadius: 8,
    paddingVertical: 16,
    gap: 8,
  },
  photoUploadText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.green,
  },
  photoUploadHint: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 8,
    textAlign: 'center',
  },
  tipsContainer: {
    backgroundColor: '#FFF9E6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  tipItem: {
    fontSize: 11,
    color: COLORS.text,
    marginBottom: 6,
  },
  progressRewardsBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFACD',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.yellow,
  },
  progressActionButtons: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  progressActionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressActionBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PlantTrackingScreen;
