import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useTwitch } from '@/hooks/useTwitch';
import { router } from 'expo-router';
import StreamerCard from '@/components/StreamerCard';
import { StatusBar } from 'expo-status-bar';
import { CircleAlert as AlertCircle } from 'lucide-react-native';

export default function FollowingScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { followedStreamers, isLoading, refreshFollowing } = useTwitch();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshFollowing();
    setRefreshing(false);
  };

  const liveStreamers = followedStreamers.filter(streamer => streamer.is_live);
  const offlineStreamers = followedStreamers.filter(streamer => !streamer.is_live);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <StatusBar style={colors.statusBar} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Following</Text>
      </View>

      <FlatList
        data={[...liveStreamers, ...offlineStreamers]}
        renderItem={({ item }) => (
          <Pressable 
            style={styles.streamerItem} 
            onPress={() => router.push(`/streamer/${item.id}`)}
          >
            <StreamerCard 
              streamer={item} 
              showLiveIndicator={true}
            />
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={liveStreamers.length > 0 ? (
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Live Now ({liveStreamers.length})
          </Text>
        ) : null}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {isLoading ? (
              <Text style={[styles.emptyStateText, { color: colors.text }]}>
                Loading followed streamers...
              </Text>
            ) : (
              <>
                <AlertCircle size={40} color={colors.primary} style={{ marginBottom: 16 }} />
                <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
                  No followed streamers
                </Text>
                <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                  Follow streamers to see when they go live
                </Text>
              </>
            )}
          </View>
        }
        stickyHeaderIndices={liveStreamers.length > 0 && offlineStreamers.length > 0 ? [liveStreamers.length + 1] : []}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  streamerItem: {
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
});