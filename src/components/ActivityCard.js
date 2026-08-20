import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, shadows } from '../theme';

export default function ActivityCard({ activity, completed = false, onComplete }) {
  const [completing, setCompleting] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const plusOpacity = useRef(new Animated.Value(0)).current;
  const plusY = useRef(new Animated.Value(0)).current;

  const handleStart = async () => {
    if (completed || completing) return;
    setCompleting(true);
    Haptics.selectionAsync();

    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.98, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();

    await new Promise((r) => setTimeout(r, 1500));

    Animated.parallel([
      Animated.timing(plusOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(plusY, { toValue: -28, duration: 600, useNativeDriver: true }),
    ]).start(() => {
      Animated.timing(plusOpacity, { toValue: 0, duration: 300, delay: 150, useNativeDriver: true }).start();
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onComplete?.(activity.id, activity.points);
  };

  return (
    <Animated.View style={[card.wrapper, { transform: [{ scale: scaleAnim }] }]}>
      <View style={[card.container, shadows.sm, completed && card.containerDone]}>
        {/* Left: content */}
        <View style={card.content}>
          <Text style={card.title} numberOfLines={2}>{activity.title}</Text>
          <Text style={card.description} numberOfLines={2}>{activity.description}</Text>
          <Text style={card.meta}>
            {activity.points} points{'  ·  '}Ends {activity.endDate}
          </Text>

          {completed ? (
            <View style={card.completedRow}>
              <Text style={card.completedText}>✓ Completed</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[card.startBtn, completing && card.startBtnLoading]}
              onPress={handleStart}
              activeOpacity={0.85}
              disabled={completing}
            >
              <Text style={card.startBtnText}>{completing ? '...' : 'Start'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Right: thumbnail */}
        <View style={[card.thumbnail, { backgroundColor: activity.bgColor }]}>
          <Text style={card.thumbnailEmoji}>{activity.emoji}</Text>
        </View>
      </View>

      {/* Floating points animation */}
      <Animated.View
        style={[card.floatingPts, { opacity: plusOpacity, transform: [{ translateY: plusY }] }]}
        pointerEvents="none"
      >
        <Text style={card.floatingPtsText}>+{activity.points} pts ⭐</Text>
      </Animated.View>
    </Animated.View>
  );
}

const card = StyleSheet.create({
  wrapper: { marginBottom: spacing.sm, position: 'relative' },
  container: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 140,
  },
  containerDone: {
    borderColor: colors.successLight,
    backgroundColor: '#FAFFFE',
  },
  content: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  title: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.small,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: spacing.sm,
  },
  meta: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  startBtn: {
    backgroundColor: colors.navy,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignSelf: 'flex-start',
  },
  startBtnLoading: { backgroundColor: colors.textMuted },
  startBtnText: { ...typography.smallMed, color: '#FFFFFF' },
  completedRow: { flexDirection: 'row', alignItems: 'center' },
  completedText: { ...typography.smallMed, color: colors.success },
  thumbnail: {
    width: 130,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  thumbnailEmoji: { fontSize: 48 },
  floatingPts: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    backgroundColor: colors.gold,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  floatingPtsText: { ...typography.smallMed, color: '#FFFFFF' },
});
