import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Category } from '@/types';
import CategoryCard from './CategoryCard';
import StreamerCard from './StreamerCard';
import { ChevronRight } from 'lucide-react-native';

interface CategoryListProps {
  category: Category;
  isFirst: boolean;
  isLast: boolean;
}

export default function CategoryList({ category, isFirst, isLast }: CategoryListProps) {
  const { colors } = useTheme();
  const { streamers } = category;

  return (
    <View style={[
      styles.container,
      isFirst && styles.firstContainer,
      isLast && styles.lastContainer
    ]}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={[styles.categoryTitle, { color: colors.text }]}>
            {category.name}
          </Text>
          <Text style={[styles.viewerCount, { color: colors.textSecondary }]}>
            {category.viewer_count.toLocaleString()} viewers
          </Text>
        </View>
        <Pressable 
          style={styles.viewAllButton}
          onPress={() => router.push(`/category/${category.id}`)}
        >
          <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
          <ChevronRight size={16} color={colors.primary} />
        </Pressable>
      </View>

      <FlatList
        data={streamers.slice(0, 3)} // Show only top 3 streamers
        renderItem={({ item }) => (
          <Pressable 
            style={styles.streamerItem} 
            onPress={() => router.push(`/streamer/${item.id}`)}
          >
            <StreamerCard streamer={item} />
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  firstContainer: {
    paddingTop: 8,
  },
  lastContainer: {
    marginBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  viewerCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginRight: 2,
  },
  streamerItem: {
    marginBottom: 12,
  },
});