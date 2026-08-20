import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, typography, spacing, radius, shadows } from '../theme';

const HORIZON_COLORS = {
  H2: '#6B5CE7',
  H3: '#9B59B6',
  H4: '#3498DB',
  H5: '#1ABC9C',
};

export default function FutureConcept({ horizon, title, description, category, style }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 12,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const horizonColor = HORIZON_COLORS[horizon] ?? colors.roadmapAccent;

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* Header row */}
      <View style={styles.header}>
        <View style={styles.telescopeRow}>
          <Text style={styles.telescopeEmoji}>🔭</Text>
          <Text style={styles.futureLabel}>Future Concept</Text>
        </View>
        <View style={[styles.horizonBadge, { backgroundColor: horizonColor + '22' }]}>
          <Text style={[styles.horizonText, { color: horizonColor }]}>{horizon}</Text>
        </View>
      </View>

      {/* Content */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {/* Category chip */}
      <View style={styles.categoryChip}>
        <Text style={styles.categoryText}>{category}</Text>
      </View>

      {/* Dashed border overlay hint */}
      <View style={styles.cornerTag} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.roadmapBg,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.roadmapBorder,
    padding: spacing.md,
    marginVertical: spacing.sm,
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  telescopeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  telescopeEmoji: {
    fontSize: 14,
  },
  futureLabel: {
    ...typography.micro,
    color: colors.roadmapLabel,
  },
  horizonBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  horizonText: {
    ...typography.label,
    fontSize: 10,
  },
  title: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.small,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    backgroundColor: colors.roadmapBorder + '80',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  categoryText: {
    ...typography.caption,
    color: colors.roadmapLabel,
    fontWeight: '600',
  },
  cornerTag: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderTopWidth: 20,
    borderRightWidth: 20,
    borderTopColor: colors.roadmapBorder,
    borderRightColor: 'transparent',
    borderTopRightRadius: radius.lg,
  },
});
