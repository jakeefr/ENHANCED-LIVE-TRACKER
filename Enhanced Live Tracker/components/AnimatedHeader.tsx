import React from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScrollY } from '@/hooks/useScrollY';
import { useTheme } from '@/hooks/useTheme';

interface AnimatedHeaderProps {
  title: string;
}

export default function AnimatedHeader({ title }: AnimatedHeaderProps) {
  const insets = useSafeAreaInsets();
  const { scrollY } = useScrollY();
  const { colors } = useTheme();
  
  const headerHeight = 60;
  const paddingTop = insets.top;

  // Calculate opacity based on scroll position
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  // Calculate title opacity based on scroll position
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [0, 0.8, 1],
    extrapolate: 'clamp',
  });

  // Calculate title translation
  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, 90],
    outputRange: [10, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.header,
        {
          height: headerHeight,
          paddingTop,
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
          opacity: headerOpacity,
          zIndex: 10,
        },
      ]}
    >
      <Animated.Text
        style={[
          styles.title,
          {
            color: colors.text,
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }],
          },
        ]}
      >
        {title}
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    borderBottomWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
});