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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import api from '../services/api';
import { COLORS } from '../utils/colors';

const OrderTrackingScreen = ({ navigation }) => {
  const { user } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      console.log('Orders fetched:', response.data);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsModalVisible(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return COLORS.orange;
      case 'confirmed':
        return COLORS.blue;
      case 'shipped':
        return COLORS.purple;
      case 'delivered':
        return COLORS.green;
      case 'cancelled':
        return COLORS.red;
      default:
        return COLORS.gray;
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'hourglass';
      case 'confirmed':
        return 'checkmark-circle';
      case 'shipped':
        return 'paper-plane';
      case 'delivered':
        return 'gift';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const getDeliveryTimeline = (order) => {
    const steps = [
      { step: 'Order Placed', date: new Date(order.createdAt || order.placedAt), icon: 'cart' },
      { step: 'Confirmed', date: new Date(order.createdAt), icon: 'checkmark-circle' },
      { step: 'Shipped', date: order.status?.toLowerCase() === 'shipped' ? new Date() : null, icon: 'paper-plane' },
      { step: 'Delivered', date: order.deliveredAt ? new Date(order.deliveredAt) : null, icon: 'gift' },
    ];
    return steps;
  };

  const formatDate = (date) => {
    if (!date) return 'Pending';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
  };

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const OrderCard = ({ order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => handleViewDetails(order)}
      activeOpacity={0.7}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>Order #{order._id?.substring(0, 8)}</Text>
          <Text style={styles.orderDate}>{formatDate(order.createdAt || order.placedAt)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Ionicons name={getStatusIcon(order.status)} size={16} color="#FFF" />
          <Text style={styles.statusText}>{order.status || 'Pending'}</Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Items:</Text>
          <Text style={styles.detailValue}>{order.items?.length || 0}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total:</Text>
          <Text style={styles.detailValue}>₹{order.totalAmount?.toFixed(2)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Payment:</Text>
          <Text style={[styles.detailValue, { color: order.paymentStatus?.toLowerCase() === 'paid' ? COLORS.green : COLORS.orange }]}>
            {order.paymentStatus || 'Pending'}
          </Text>
        </View>
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.viewDetails}>View Details →</Text>
      </View>
    </TouchableOpacity>
  );

  const OrderDetailsModal = () => {
    if (!selectedOrder) return null;

    const timeline = getDeliveryTimeline(selectedOrder);
    let currentStep = 0;
    const status = selectedOrder.status?.toLowerCase();
    if (status === 'confirmed') currentStep = 1;
    if (status === 'shipped') currentStep = 2;
    if (status === 'delivered') currentStep = 3;

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
              <Text style={styles.modalTitle}>Order Details</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Order ID and Status */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Order Information</Text>
                <View style={styles.infoBox}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Order ID:</Text>
                    <Text style={styles.infoValue}>{selectedOrder._id?.substring(0, 16)}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Order Date:</Text>
                    <Text style={styles.infoValue}>
                      {formatDate(selectedOrder.createdAt || selectedOrder.placedAt)}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Status:</Text>
                    <View style={[styles.statusBadgeLarge, { backgroundColor: getStatusColor(selectedOrder.status) }]}>
                      <Ionicons name={getStatusIcon(selectedOrder.status)} size={14} color="#FFF" />
                      <Text style={styles.statusTextLarge}>{selectedOrder.status || 'Pending'}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Delivery Timeline */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Delivery Timeline</Text>
                <View style={styles.timelineContainer}>
                  {timeline.map((item, index) => (
                    <View key={index} style={styles.timelineItem}>
                      <View style={{ alignItems: 'center', width: 60 }}>
                        <View
                          style={[
                            styles.timelineCircle,
                            { backgroundColor: index <= currentStep ? COLORS.green : COLORS.lightGray },
                          ]}
                        >
                          <Ionicons
                            name={item.icon}
                            size={16}
                            color={index <= currentStep ? '#FFF' : COLORS.gray}
                          />
                        </View>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.timelineStep}>{item.step}</Text>
                        {item.date ? (
                          <Text style={styles.timelineDate}>{formatDate(item.date)} {formatTime(item.date)}</Text>
                        ) : (
                          <Text style={styles.timelineDate}>Pending</Text>
                        )}
                      </View>
                      {index < timeline.length - 1 && (
                        <View
                          style={[
                            styles.timelineConnector,
                            { backgroundColor: index < currentStep ? COLORS.green : COLORS.lightGray },
                          ]}
                        />
                      )}
                    </View>
                  ))}
                </View>
              </View>

              {/* Order Items */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Order Items</Text>
                <View style={styles.itemsContainer}>
                  {selectedOrder.items?.map((item, index) => (
                    <View key={index} style={styles.orderItem}>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemCategory}>{item.category}</Text>
                        <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                      </View>
                      <View style={styles.itemPrice}>
                        <Text style={styles.itemPriceAmount}>₹{item.price?.toFixed(2)}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Delivery Address */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Delivery Address</Text>
                <View style={styles.addressBox}>
                  <Ionicons name="location" size={18} color={COLORS.green} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.addressName}>{selectedOrder.address?.name}</Text>
                    <Text style={styles.addressText}>{selectedOrder.address?.street}</Text>
                    <Text style={styles.addressText}>
                      {selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.zip}
                    </Text>
                    <Text style={styles.addressPhone}>{selectedOrder.address?.phone}</Text>
                  </View>
                </View>
              </View>

              {/* Payment Details */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Payment Details</Text>
                <View style={styles.paymentBox}>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Subtotal:</Text>
                    <Text style={styles.paymentValue}>₹{selectedOrder.subtotal?.toFixed(2) || (selectedOrder.totalAmount - 50)?.toFixed(2)}</Text>
                  </View>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Delivery Charges:</Text>
                    <Text style={styles.paymentValue}>₹50.00</Text>
                  </View>
                  <View style={[styles.paymentRow, { borderTopWidth: 1, borderTopColor: COLORS.lightGray, paddingTop: 8, marginTop: 8 }]}>
                    <Text style={styles.paymentLabelTotal}>Total Amount:</Text>
                    <Text style={styles.paymentValueTotal}>₹{selectedOrder.totalAmount?.toFixed(2)}</Text>
                  </View>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Payment Method:</Text>
                    <Text style={styles.paymentValue}>{selectedOrder.paymentMethod || 'COD'}</Text>
                  </View>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Payment Status:</Text>
                    <Text
                      style={[
                        styles.paymentValue,
                        { color: selectedOrder.paymentStatus?.toLowerCase() === 'paid' ? COLORS.green : COLORS.orange },
                      ]}
                    >
                      {selectedOrder.paymentStatus || 'Pending'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Rewards Info */}
              <View style={styles.modalSection}>
                <View style={styles.rewardsBox}>
                  <Ionicons name="star" size={24} color={COLORS.yellow} />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.rewardsTitle}>Reward Points Earned</Text>
                    <Text style={styles.rewardsPoints}>10 points</Text>
                    <Text style={styles.rewardsNote}>Each order earns you reward points!</Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                {selectedOrder.status?.toLowerCase() === 'delivered' ? (
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.green }]}>
                    <Ionicons name="star" size={18} color="#FFF" />
                    <Text style={styles.actionBtnText}>Leave Review</Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.green }]}>
                      <Ionicons name="call" size={18} color="#FFF" />
                      <Text style={styles.actionBtnText}>Contact Support</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.blue }]}>
                      <Ionicons name="refresh" size={18} color="#FFF" />
                      <Text style={styles.actionBtnText}>Track Live</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>
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
          <Text style={styles.headerTitle}>My Orders</Text>
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
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      {orders.length > 0 ? (
        <ScrollView
          style={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.green} />}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.ordersList}>
            <Text style={styles.ordersCount}>
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </Text>
            {orders.map((order, index) => (
              <OrderCard key={order._id || index} order={order} />
            ))}
          </View>
          <View style={{ height: 20 }} />
        </ScrollView>
      ) : (
        <View style={styles.centerContent}>
          <Ionicons name="cart" size={64} color={COLORS.lightGray} />
          <Text style={styles.emptyText}>No orders yet</Text>
          <Text style={styles.emptySubtext}>Start shopping to place your first order!</Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => navigation.navigate('Shop')}
          >
            <Text style={styles.shopBtnText}>Go to Shop</Text>
          </TouchableOpacity>
        </View>
      )}

      <OrderDetailsModal />
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
  ordersList: {
    marginBottom: 8,
  },
  ordersCount: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray,
    marginBottom: 12,
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  orderDate: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    paddingVertical: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS.gray,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  orderFooter: {
    alignItems: 'flex-end',
  },
  viewDetails: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.green,
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  infoBox: {
    backgroundColor: COLORS.light,
    borderRadius: 10,
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.gray,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    maxWidth: '60%',
    textAlign: 'right',
  },
  statusBadgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  statusTextLarge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  timelineContainer: {
    marginLeft: 0,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timelineCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  timelineConnector: {
    position: 'absolute',
    left: 30,
    top: 36,
    width: 2,
    height: 28,
  },
  timelineStep: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  timelineDate: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  itemsContainer: {
    backgroundColor: COLORS.light,
    borderRadius: 10,
    padding: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFF',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  itemCategory: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 2,
  },
  itemQty: {
    fontSize: 12,
    color: COLORS.green,
    marginTop: 4,
    fontWeight: '500',
  },
  itemPrice: {
    marginLeft: 12,
  },
  itemPriceAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  addressBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.light,
    borderRadius: 10,
    padding: 12,
  },
  addressName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  addressText: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  addressPhone: {
    fontSize: 12,
    color: COLORS.green,
    marginTop: 4,
    fontWeight: '500',
  },
  paymentBox: {
    backgroundColor: COLORS.light,
    borderRadius: 10,
    padding: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 13,
    color: COLORS.gray,
  },
  paymentValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  paymentLabelTotal: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  paymentValueTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.green,
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
  rewardsPoints: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.yellow,
    marginTop: 2,
  },
  rewardsNote: {
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
});

export default OrderTrackingScreen;
