import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useTwitch } from '@/hooks/useTwitch';
import { X, Users } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import StreamerCard from '@/components/StreamerCard';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { getCategoryById, getStreamersByCategory } = useTwitch();
  
  const category = getCategoryById(id);
  const streamers = category ? getStreamersByCategory(category.id) : [];
  
  if (!category) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={colors.statusBar} />
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>Category not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.statusBar} />
      
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <X size={24} color={colors.text} />
        </Pressable>
      </View>
      
      <FlatList
        data={streamers}
        renderItem={({ item }) => (
          <Pressable 
            style={styles.streamerItem} 
            onPress={() => router.push(`/streamer/${item.id}`)}
          >
            <StreamerCard streamer={item} />
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.categoryHeader}>
            <Image 
              source={{ uri: category.box_art_url.replace('{width}', '285').replace('{height}', '380') }}
              style={styles.categoryImage}
            />
            
            <View style={styles.categoryInfo}>
              <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
              
              <View style={styles.viewerRow}>
                <Users size={16} color={colors.textSecondary} />
                <Text style={[styles.viewerCount, { color: colors.textSecondary }]}>
                  {category.viewer_count.toLocaleString()} viewers
                </Text>
              </View>
              
              <Text style={[styles.streamerCount, { color: colors.textSecondary }]}>
                {streamers.length} live channels
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: colors.text }]}>
              No live streamers in this category
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 20,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  categoryImage: {
    width: 80,
    height: 106,
    borderRadius: 8,
  },
  categoryInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  categoryName: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    marginBottom: 8,
  },
  viewerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  viewerCount: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 6,
  },
  streamerCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 20,
  },
  streamerItem: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    textAlign: 'center',
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