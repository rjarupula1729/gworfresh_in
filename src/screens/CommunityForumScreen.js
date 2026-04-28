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
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import api from '../services/api';
import { COLORS } from '../utils/colors';

const CommunityForumScreen = ({ navigation }) => {
  const { user } = useContext(AppContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [newPostModalVisible, setNewPostModalVisible] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [postLoading, setPostLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/community');
      console.log('Posts fetched:', response.data);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const handleViewComments = (post) => {
    setSelectedPost(post);
    setCommentText('');
    setCommentsModalVisible(true);
  };

  const submitNewPost = async () => {
    if (!newPostText.trim()) {
      Alert.alert('Validation', 'Please write something to share');
      return;
    }

    try {
      setPostLoading(true);
      const response = await api.post('/community', {
        content: newPostText,
      });
      console.log('Post created:', response.data);

      // Add new post to the list
      setPosts([response.data, ...posts]);

      Alert.alert('Success', 'Post shared! You earned 5 reward points 🎉');
      setNewPostModalVisible(false);
      setNewPostText('');
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to share post');
    } finally {
      setPostLoading(false);
    }
  };

  const submitComment = async () => {
    if (!commentText.trim()) {
      Alert.alert('Validation', 'Please write a comment');
      return;
    }

    try {
      setCommentLoading(true);
      const response = await api.post(`/community/${selectedPost._id}/comment`, {
        comment: commentText,
      });
      console.log('Comment added:', response.data);

      // Update selected post
      setSelectedPost(response.data);

      // Update posts list
      const updatedPosts = posts.map(p => p._id === response.data._id ? response.data : p);
      setPosts(updatedPosts);

      Alert.alert('Success', 'Comment posted! You earned 1 reward point 🎉');
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to post comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-IN', { day: 'short', month: 'short' });
  };

  const PostCard = ({ post }) => (
    <TouchableOpacity
      style={styles.postCard}
      activeOpacity={0.7}
    >
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {post.userName?.[0]?.toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{post.userName || 'Gardener'}</Text>
            <Text style={styles.postTime}>{formatDate(post.createdAt)}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={18} color={COLORS.gray} />
        </TouchableOpacity>
      </View>

      <View style={styles.postContent}>
        <Text style={styles.postText} numberOfLines={4}>
          {post.content}
        </Text>
        {post.images && post.images.length > 0 && (
          <View style={styles.imagesPlaceholder}>
            <Ionicons name="images" size={24} color={COLORS.gray} />
            <Text style={styles.imagesText}>{post.images.length} images</Text>
          </View>
        )}
      </View>

      <View style={styles.postStats}>
        <View style={styles.statItem}>
          <Ionicons name="heart" size={16} color={COLORS.red} />
          <Text style={styles.statText}>{post.likes || 0}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="chatbubble" size={16} color={COLORS.blue} />
          <Text style={styles.statText}>{post.comments?.length || 0}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="share-social" size={16} color={COLORS.green} />
          <Text style={styles.statText}>Share</Text>
        </View>
      </View>

      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={18} color={COLORS.gray} />
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleViewComments(post)}
        >
          <Ionicons name="chatbubble-outline" size={18} color={COLORS.gray} />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={18} color={COLORS.gray} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const CommentsModal = () => {
    if (!selectedPost) return null;

    const comments = selectedPost.comments || [];

    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={commentsModalVisible}
        onRequestClose={() => setCommentsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.commentsModalContent}>
            {/* Header */}
            <View style={styles.commentsModalHeader}>
              <TouchableOpacity onPress={() => setCommentsModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
              <Text style={styles.commentsModalTitle}>Comments ({comments.length})</Text>
              <View style={{ width: 24 }} />
            </View>

            {/* Original Post */}
            <View style={styles.originalPostSection}>
              <View style={styles.originalPostHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {selectedPost.userName?.[0]?.toUpperCase() || 'U'}
                  </Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.userName}>{selectedPost.userName || 'Gardener'}</Text>
                  <Text style={styles.postTime}>{formatDate(selectedPost.createdAt)}</Text>
                </View>
              </View>
              <Text style={styles.originalPostText}>{selectedPost.content}</Text>
              {selectedPost.images && selectedPost.images.length > 0 && (
                <View style={styles.originalPostImages}>
                  <Ionicons name="images" size={20} color={COLORS.gray} />
                  <Text style={styles.imagesText}>{selectedPost.images.length} images</Text>
                </View>
              )}
            </View>

            {/* Comments List */}
            <ScrollView style={styles.commentsList} showsVerticalScrollIndicator={false}>
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <View key={index} style={styles.commentItem}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {comment.userName?.[0]?.toUpperCase() || 'U'}
                      </Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <View style={styles.commentHeader}>
                        <Text style={styles.userName}>{comment.userName || 'Gardener'}</Text>
                        <Text style={styles.postTime}>{formatDate(comment.createdAt)}</Text>
                      </View>
                      <Text style={styles.commentText}>{comment.comment}</Text>
                    </View>
                    <TouchableOpacity>
                      <Ionicons name="heart-outline" size={16} color={COLORS.gray} />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <View style={styles.noCommentsPlaceholder}>
                  <Ionicons name="chatbubbles" size={40} color={COLORS.lightGray} />
                  <Text style={styles.noCommentsText}>No comments yet. Be the first!</Text>
                </View>
              )}
            </ScrollView>

            {/* Comment Input */}
            <View style={styles.commentInputContainer}>
              <View style={styles.commentInputBox}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || 'M'}</Text>
                </View>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Add a comment..."
                  placeholderTextColor={COLORS.gray}
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                  numberOfLines={2}
                />
                <TouchableOpacity
                  onPress={submitComment}
                  disabled={commentLoading}
                >
                  {commentLoading ? (
                    <ActivityIndicator color={COLORS.green} size="small" />
                  ) : (
                    <Ionicons
                      name="send"
                      size={18}
                      color={commentText.trim() ? COLORS.green : COLORS.gray}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const NewPostModal = () => {
    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={newPostModalVisible}
        onRequestClose={() => setNewPostModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.newPostModalContent}>
            {/* Header */}
            <View style={styles.newPostModalHeader}>
              <TouchableOpacity onPress={() => setNewPostModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
              <Text style={styles.newPostModalTitle}>Create Post</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* User Info */}
              <View style={styles.postCreatorSection}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || 'M'}</Text>
                </View>
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.userName}>{user?.name || 'Gardener'}</Text>
                  <Text style={styles.postPrivacy}>Public</Text>
                </View>
              </View>

              {/* Post Text Input */}
              <View style={styles.postTextInputContainer}>
                <TextInput
                  style={styles.postTextInput}
                  placeholder="What's on your mind? Share your gardening experience!"
                  placeholderTextColor={COLORS.gray}
                  multiline
                  numberOfLines={6}
                  value={newPostText}
                  onChangeText={setNewPostText}
                  textAlignVertical="top"
                />
                <Text style={styles.charCounter}>
                  {newPostText.length}/500 characters
                </Text>
              </View>

              {/* Media Options */}
              <View style={styles.mediaOptions}>
                <TouchableOpacity style={styles.mediaButton}>
                  <Ionicons name="image" size={20} color={COLORS.green} />
                  <Text style={styles.mediaButtonText}>Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.mediaButton}>
                  <Ionicons name="videocam" size={20} color={COLORS.blue} />
                  <Text style={styles.mediaButtonText}>Video</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.mediaButton}>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.yellow} />
                  <Text style={styles.mediaButtonText}>Poll</Text>
                </TouchableOpacity>
              </View>

              {/* Topics */}
              <View style={styles.topicsSection}>
                <Text style={styles.topicsSectionTitle}>Popular Topics</Text>
                <View style={styles.topicsList}>
                  <TouchableOpacity style={styles.topicChip}>
                    <Text style={styles.topicChipText}>#Gardening101</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.topicChip}>
                    <Text style={styles.topicChipText}>#UrbanGarden</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.topicChip}>
                    <Text style={styles.topicChipText}>#MyFirstPlant</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.topicChip}>
                    <Text style={styles.topicChipText}>#GrowFresh</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Tips */}
              <View style={styles.postTipsBox}>
                <Ionicons name="bulb" size={20} color={COLORS.yellow} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.postTipsTitle}>Sharing Tips</Text>
                  <Text style={styles.postTipsText}>
                    Share photos, stories, and tips about your gardening journey
                  </Text>
                </View>
              </View>

              {/* Rewards */}
              <View style={styles.postRewardsBox}>
                <Ionicons name="star" size={20} color={COLORS.yellow} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.postRewardsTitle}>Earn Rewards</Text>
                  <Text style={styles.postRewardsText}>
                    Post: +5 points | Comment: +1 point
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.postActionButtons}>
              <TouchableOpacity
                style={[styles.postActionBtn, { backgroundColor: COLORS.lightGray }]}
                onPress={() => setNewPostModalVisible(false)}
                disabled={postLoading}
              >
                <Text style={[styles.postActionBtnText, { color: COLORS.gray }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.postActionBtn, { backgroundColor: COLORS.green }]}
                onPress={submitNewPost}
                disabled={postLoading || !newPostText.trim()}
              >
                {postLoading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={[styles.postActionBtnText, { color: '#FFF' }]}>
                    Share
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
          <Text style={styles.headerTitle}>Community Forum</Text>
          <TouchableOpacity onPress={() => setNewPostModalVisible(true)}>
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
        <Text style={styles.headerTitle}>Community Forum</Text>
        <TouchableOpacity onPress={() => setNewPostModalVisible(true)}>
          <Ionicons name="add-circle" size={24} color={COLORS.green} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {posts.length > 0 ? (
        <ScrollView
          style={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.green} />}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.postsList}>
            {posts.map((post, index) => (
              <PostCard key={post._id || index} post={post} />
            ))}
          </View>
          <View style={{ height: 20 }} />
        </ScrollView>
      ) : (
        <View style={styles.centerContent}>
          <Ionicons name="chatbubbles" size={64} color={COLORS.lightGray} />
          <Text style={styles.emptyText}>No posts yet</Text>
          <Text style={styles.emptySubtext}>
            Be the first to share your gardening journey!
          </Text>
          <TouchableOpacity
            style={styles.createPostBtn}
            onPress={() => setNewPostModalVisible(true)}
          >
            <Ionicons name="add" size={18} color="#FFF" />
            <Text style={styles.createPostBtnText}>Create Post</Text>
          </TouchableOpacity>
        </View>
      )}

      <CommentsModal />
      <NewPostModal />
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
  },
  postsList: {
    marginBottom: 8,
  },
  postCard: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    paddingVertical: 12,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 10,
  },
  postTime: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 10,
    marginTop: 2,
  },
  postContent: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  postText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  imagesPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: COLORS.light,
    borderRadius: 8,
    paddingVertical: 20,
    justifyContent: 'center',
    gap: 8,
  },
  imagesText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    color: COLORS.gray,
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
  createPostBtn: {
    marginTop: 20,
    backgroundColor: COLORS.green,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  createPostBtnText: {
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
  commentsModalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingTop: 0,
  },
  commentsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  commentsModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  originalPostSection: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  originalPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  originalPostText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
    marginBottom: 8,
  },
  originalPostImages: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    gap: 6,
  },
  commentsList: {
    maxHeight: 300,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  commentText: {
    fontSize: 13,
    color: COLORS.text,
    marginTop: 4,
    lineHeight: 18,
  },
  noCommentsPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noCommentsText: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 8,
  },
  commentInputContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  commentInputBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: COLORS.text,
    maxHeight: 80,
  },
  // New Post Modal
  newPostModalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingTop: 0,
  },
  newPostModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  newPostModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  postCreatorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  postPrivacy: {
    fontSize: 11,
    color: COLORS.gray,
    marginLeft: 10,
    marginTop: 2,
  },
  postTextInputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  postTextInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: COLORS.text,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  charCounter: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 6,
    textAlign: 'right',
  },
  mediaOptions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  mediaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  mediaButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text,
  },
  topicsSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topicsSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  topicsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicChip: {
    backgroundColor: COLORS.green + '20',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  topicChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.green,
  },
  postTipsBox: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#FFF9E6',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.yellow,
  },
  postTipsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  postTipsText: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 2,
  },
  postRewardsBox: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#FFFACD',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.yellow,
    marginBottom: 16,
  },
  postRewardsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  postRewardsText: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 2,
  },
  postActionButtons: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  postActionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postActionBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CommunityForumScreen;
