import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search as SearchIcon, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTwitch } from '@/hooks/useTwitch';
import { router } from 'expo-router';
import { Streamer, Category } from '@/types';
import StreamerCard from '@/components/StreamerCard';
import CategoryCard from '@/components/CategoryCard';
import { StatusBar } from 'expo-status-bar';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { searchStreamers, searchCategories } = useTwitch();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ streamers: Streamer[], categories: Category[] }>({ streamers: [], categories: [] });
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (text: string) => {
    setQuery(text);
    
    if (text.length < 2) {
      setResults({ streamers: [], categories: [] });
      return;
    }
    
    setIsSearching(true);
    
    try {
      const streamers = await searchStreamers(text);
      const categories = await searchCategories(text);
      setResults({ streamers, categories });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults({ streamers: [], categories: [] });
  };

  const renderItem = ({ item, index }: { item: Streamer | Category, index: number }) => {
    if ('game_name' in item) {
      // It's a streamer
      return (
        <Pressable 
          style={styles.resultItem} 
          onPress={() => router.push(`/streamer/${item.id}`)}
        >
          <StreamerCard streamer={item} />
        </Pressable>
      );
    } else {
      // It's a category
      return (
        <Pressable 
          style={styles.resultItem} 
          onPress={() => router.push(`/category/${item.id}`)}
        >
          <CategoryCard category={item} />
        </Pressable>
      );
    }
  };

  const allResults = [...results.streamers, ...results.categories];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <StatusBar style={colors.statusBar} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Search</Text>
      </View>
      
      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <SearchIcon size={20} color={colors.text} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search streamers or categories..."
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={handleSearch}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Pressable onPress={clearSearch} style={styles.clearButton}>
            <X size={20} color={colors.text} />
          </Pressable>
        )}
      </View>

      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          {query.length > 0 && (
            <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
              {allResults.length} results found
            </Text>
          )}
          
          {query.length > 0 && allResults.length === 0 && !isSearching ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
                No results found
              </Text>
              <Text style={[styles.emptyStateSubtitle, { color: colors.textSecondary }]}>
                Try different keywords or check your spelling
              </Text>
            </View>
          ) : (
            <FlatList
              data={allResults}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={query.length < 2 ? (
                <View style={styles.instructionsContainer}>
                  <Text style={[styles.instructionsText, { color: colors.textSecondary }]}>
                    Search for streamers or categories
                  </Text>
                </View>
              ) : null}
            />
          )}
        </>
      )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  resultItem: {
    marginBottom: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  instructionsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  instructionsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
});