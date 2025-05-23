import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Streamer } from '@/types';
import { Users } from 'lucide-react-native';

interface StreamerCardProps {
  streamer: Streamer;
  showLiveIndicator?: boolean;
}

export default function StreamerCard({ streamer, showLiveIndicator = false }: StreamerCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.leftSection}>
        <View style={styles.thumbnailContainer}>
          <Image 
            source={{ uri: streamer.thumbnail_url.replace('{width}', '440').replace('{height}', '248') }}
            style={styles.thumbnail}
          />
          
          {(showLiveIndicator && streamer.is_live) && (
            <View style={styles.liveTag}>
              <View style={styles.liveIndicator} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <View style={styles.headerRow}>
          <Image source={{ uri: streamer.profile_image_url }} style={styles.avatar} />
          
          <View style={styles.streamerInfo}>
            <Text style={[styles.displayName, { color: colors.text }]}>
              {streamer.display_name}
            </Text>
            
            <View style={styles.viewerRow}>
              <Users size={14} color={colors.textSecondary} />
              <Text style={[styles.viewerCount, { color: colors.textSecondary }]}>
                {streamer.viewer_count.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
        
        <Text 
          style={[styles.streamTitle, { color: colors.text }]}
          numberOfLines={2}
        >
          {streamer.title}
        </Text>
        
        <Text style={[styles.gameName, { color: colors.textSecondary }]}>
          {streamer.game_name}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  leftSection: {
    width: 120,
  },
  thumbnailContainer: {
    position: 'relative',
    height: '100%',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  liveTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B32',
    marginRight: 4,
  },
  liveText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
  rightSection: {
    flex: 1,
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  streamerInfo: {
    marginLeft: 8,
    flex: 1,
  },
  displayName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  viewerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewerCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: 4,
  },
  streamTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 6,
  },
  gameName: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
});