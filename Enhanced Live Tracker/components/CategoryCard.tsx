import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Category } from '@/types';
import { Users } from 'lucide-react-native';

interface CategoryCardProps {
  category: Category;
  compact?: boolean;
}

export default function CategoryCard({ category, compact = false }: CategoryCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.card,
        borderColor: colors.border 
      },
      compact && styles.compactContainer
    ]}>
      <Image 
        source={{ uri: category.box_art_url.replace('{width}', '188').replace('{height}', '250') }}
        style={compact ? styles.compactImage : styles.image}
      />
      
      <View style={styles.infoContainer}>
        <Text 
          style={[styles.title, { color: colors.text }]}
          numberOfLines={compact ? 1 : 2}
        >
          {category.name}
        </Text>
        
        <View style={styles.viewerRow}>
          <Users size={compact ? 14 : 16} color={colors.textSecondary} />
          <Text style={[
            styles.viewerCount, 
            { color: colors.textSecondary },
            compact && styles.compactText
          ]}>
            {category.viewer_count.toLocaleString()} viewers
          </Text>
        </View>
        
        <Text style={[
          styles.channelCount, 
          { color: colors.textSecondary },
          compact && styles.compactText
        ]}>
          {category.streamers.length} live channels
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
    padding: 12,
  },
  compactContainer: {
    padding: 8,
  },
  image: {
    width: 60,
    height: 80,
    borderRadius: 6,
  },
  compactImage: {
    width: 45,
    height: 60,
    borderRadius: 4,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 6,
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
  channelCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  compactText: {
    fontSize: 12,
  },
});