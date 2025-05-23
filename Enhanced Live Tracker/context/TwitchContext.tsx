import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Streamer, Category } from '@/types';
import { mockCategories, mockStreamers } from '@/data/mockData';

interface TwitchContextType {
  categories: Category[];
  followedStreamers: Streamer[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  refreshFollowing: () => Promise<void>;
  searchStreamers: (query: string) => Promise<Streamer[]>;
  searchCategories: (query: string) => Promise<Category[]>;
  getCategoryById: (id: string) => Category | undefined;
  getStreamerById: (id: string) => Streamer | undefined;
  getStreamersByCategory: (categoryId: string) => Streamer[];
  toggleFollow: (streamerId: string) => void;
  clearCache: () => void;
}

const TwitchContext = createContext<TwitchContextType | undefined>(undefined);

// Simulate real-time viewer count changes
function getRandomViewerChange() {
  return Math.floor(Math.random() * 2000) - 1000; // Random change between -1000 and +1000
}

// Simulate random streamer going live/offline
function getRandomLiveStatus() {
  return Math.random() > 0.7; // 30% chance of changing status
}

export function TwitchProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [streamers, setStreamers] = useState<Streamer[]>([]);
  const [followedStreamers, setFollowedStreamers] = useState<Streamer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Set up real-time updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      updateStreamersData();
      updateCategoriesData();
    }, 10000); // Update every 10 seconds

    return () => clearInterval(updateInterval);
  }, [streamers, categories]);

  const updateStreamersData = () => {
    setStreamers(prevStreamers => 
      prevStreamers.map(streamer => {
        // Update viewer count
        const viewerChange = getRandomViewerChange();
        const newViewerCount = Math.max(0, streamer.viewer_count + viewerChange);

        // Randomly update live status
        const shouldUpdateLiveStatus = getRandomLiveStatus();
        const newLiveStatus = shouldUpdateLiveStatus ? !streamer.is_live : streamer.is_live;

        // Update started_at if going live
        const newStartedAt = (!streamer.is_live && newLiveStatus) 
          ? new Date().toISOString() 
          : streamer.started_at;

        return {
          ...streamer,
          viewer_count: newViewerCount,
          is_live: newLiveStatus,
          started_at: newStartedAt,
        };
      })
    );
  };

  const updateCategoriesData = () => {
    // Recalculate category viewer counts based on streamers
    setCategories(prevCategories => 
      prevCategories.map(category => {
        const categoryStreamers = streamers.filter(
          streamer => streamer.game_id === category.id && streamer.is_live
        );
        
        const totalViewers = categoryStreamers.reduce(
          (sum, streamer) => sum + streamer.viewer_count, 
          0
        );

        return {
          ...category,
          viewer_count: totalViewers,
          streamers: categoryStreamers,
        };
      }).sort((a, b) => b.viewer_count - a.viewer_count) // Sort by viewer count
    );
  };

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const sortedCategories = [...mockCategories].sort((a, b) => b.viewer_count - a.viewer_count);
      
      sortedCategories.forEach(category => {
        category.streamers = mockStreamers
          .filter(streamer => streamer.game_id === category.id)
          .sort((a, b) => b.viewer_count - a.viewer_count);
      });
      
      setCategories(sortedCategories);
      setStreamers(mockStreamers);
      
      const initialFollowed = mockStreamers.filter(s => s.is_followed);
      setFollowedStreamers(initialFollowed);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    await loadInitialData();
  };

  const refreshFollowing = async () => {
    const currentFollowed = streamers.filter(s => s.is_followed);
    setFollowedStreamers(currentFollowed);
  };

  const searchStreamers = async (query: string): Promise<Streamer[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const lowerQuery = query.toLowerCase();
    return streamers.filter(streamer => 
      streamer.display_name.toLowerCase().includes(lowerQuery) ||
      streamer.title.toLowerCase().includes(lowerQuery)
    );
  };

  const searchCategories = async (query: string): Promise<Category[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const lowerQuery = query.toLowerCase();
    return categories.filter(category => 
      category.name.toLowerCase().includes(lowerQuery)
    );
  };

  const getCategoryById = (id: string): Category | undefined => {
    return categories.find(category => category.id === id);
  };

  const getStreamerById = (id: string): Streamer | undefined => {
    return streamers.find(streamer => streamer.id === id);
  };

  const getStreamersByCategory = (categoryId: string): Streamer[] => {
    return streamers
      .filter(streamer => streamer.game_id === categoryId && streamer.is_live)
      .sort((a, b) => b.viewer_count - a.viewer_count);
  };

  const toggleFollow = (streamerId: string) => {
    setStreamers(prevStreamers => 
      prevStreamers.map(streamer => 
        streamer.id === streamerId 
          ? { ...streamer, is_followed: !streamer.is_followed }
          : streamer
      )
    );
    
    const streamer = streamers.find(s => s.id === streamerId);
    if (streamer) {
      if (streamer.is_followed) {
        setFollowedStreamers(prev => prev.filter(s => s.id !== streamerId));
      } else {
        setFollowedStreamers(prev => [...prev, { ...streamer, is_followed: true }]);
      }
    }
  };

  const clearCache = () => {
    loadInitialData();
  };

  return (
    <TwitchContext.Provider value={{
      categories,
      followedStreamers,
      isLoading,
      refresh,
      refreshFollowing,
      searchStreamers,
      searchCategories,
      getCategoryById,
      getStreamerById,
      getStreamersByCategory,
      toggleFollow,
      clearCache,
    }}>
      {children}
    </TwitchContext.Provider>
  );
}

export const useTwitch = () => {
  const context = useContext(TwitchContext);
  if (context === undefined) {
    throw new Error('useTwitch must be used within a TwitchProvider');
  }
  return context;
};