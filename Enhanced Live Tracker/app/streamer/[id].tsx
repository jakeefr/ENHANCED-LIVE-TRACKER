import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useTwitch } from '@/hooks/useTwitch';
import { Heart, X, ArrowUpRight, Users } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { formatDistanceToNow } from 'date-fns';

const { width } = Dimensions.get('window');

export default function StreamerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { getStreamerById, toggleFollow } = useTwitch();
  
  const streamer = getStreamerById(id);

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleFollowToggle = () => {
    triggerHaptic();
    if (streamer) {
      toggleFollow(streamer.id);
    }
  };
  
  if (!streamer) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={colors.statusBar} />
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>Streamer not found</Text>
        </View>
      </View>
    );
  }

  const streamStartTime = streamer.started_at ? new Date(streamer.started_at) : null;
  const streamDuration = streamStartTime 
    ? formatDistanceToNow(streamStartTime, { addSuffix: false }) 
    : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      
      <ScrollView>
        <View style={styles.thumbnailContainer}>
          <Image 
            source={{ uri: streamer.thumbnail_url.replace('{width}', '800').replace('{height}', '450') }}
            style={styles.thumbnail}
          />
          <View style={styles.thumbnailOverlay} />
          
          <View style={[styles.header, { paddingTop: insets.top }]}>
            <Pressable onPress={() => router.back()} style={styles.closeButton}>
              <X size={24} color="white" />
            </Pressable>
          </View>
          
          {streamer.is_live && (
            <View style={styles.liveIndicatorContainer}>
              <View style={styles.liveIndicator} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
        </View>
        
        <View style={styles.content}>
          <View style={styles.profileSection}>
            <Image 
              source={{ uri: streamer.profile_image_url }}
              style={styles.profileImage}
            />
            
            <View style={styles.profileInfo}>
              <Text style={[styles.username, { color: colors.text }]}>{streamer.display_name}</Text>
              <Text style={[styles.viewerCount, { color: colors.textSecondary }]}>
                <Users size={14} color={colors.textSecondary} /> {streamer.viewer_count.toLocaleString()} viewers
              </Text>
            </View>
            
            <Pressable 
              style={[
                styles.followButton,
                { backgroundColor: streamer.is_followed ? colors.border : colors.primary }
              ]}
              onPress={handleFollowToggle}
            >
              <Heart 
                size={18} 
                color={streamer.is_followed ? colors.primary : 'white'} 
                fill={streamer.is_followed ? colors.primary : 'transparent'}
              />
              <Text 
                style={[
                  styles.followButtonText, 
                  { color: streamer.is_followed ? colors.primary : 'white' }
                ]}
              >
                {streamer.is_followed ? 'Following' : 'Follow'}
              </Text>
            </Pressable>
          </View>
          
          {streamer.is_live && (
            <View style={[styles.streamInfoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.streamTitle, { color: colors.text }]}>{streamer.title}</Text>
              
              <Pressable 
                style={[styles.categoryTag, { backgroundColor: colors.border }]}
                onPress={() => router.push(`/category/${streamer.game_id}`)}
              >
                <Text style={[styles.categoryText, { color: colors.primary }]}>{streamer.game_name}</Text>
              </Pressable>
              
              {streamDuration && (
                <Text style={[styles.streamDuration, { color: colors.textSecondary }]}>
                  Streaming for {streamDuration}
                </Text>
              )}
            </View>
          )}
          
          <View style={styles.statsSection}>
            <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.text }]}>{streamer.follower_count.toLocaleString()}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Followers</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.text }]}>{streamer.view_count.toLocaleString()}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Views</Text>
            </View>
          </View>
          
          <Pressable 
            style={[styles.watchButton, { backgroundColor: colors.primary }]}
            onPress={() => {}}
          >
            <Text style={styles.watchButtonText}>Watch Stream</Text>
            <ArrowUpRight size={18} color="white" />
          </Pressable>
          
          <View style={styles.aboutSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>About {streamer.display_name}</Text>
            <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
              {streamer.description || `No description available for ${streamer.display_name}.`}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  thumbnailContainer: {
    height: 240,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveIndicatorContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B32',
    marginRight: 6,
  },
  liveText: {
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  content: {
    padding: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  profileInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  username: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: 4,
  },
  viewerCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginLeft: 6,
  },
  streamInfoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  streamTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 12,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  streamDuration: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  statsSection: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 24,
  },
  watchButtonText: {
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginRight: 6,
  },
  aboutSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 8,
  },
  aboutText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    lineHeight: 22,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
});