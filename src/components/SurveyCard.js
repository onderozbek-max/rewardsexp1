import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius, shadows } from '../theme';

export default function SurveyCard({ survey, onComplete, completed = false, disabled = false }) {
  const [completing, setCompleting] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;
  const plusAnim = useRef(new Animated.Value(0)).current;
  const plusOpacity = useRef(new Animated.Value(0)).current;

  const handlePress = async () => {
    if (completed || completing || disabled) return;
    setCompleting(true);

    Haptics.selectionAsync();

    // Pulse animation
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    // Simulate survey completion (1.5s)
    await new Promise((r) => setTimeout(r, 1500));

    // Show "+N pts" float only when survey awards points
    if (survey.rewardPoints > 0) {
      Animated.parallel([
        Animated.timing(plusOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(plusAnim, { toValue: -30, duration: 600, useNativeDriver: true }),
        Animated.timing(checkAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start(() => {
        Animated.timing(plusOpacity, { toValue: 0, duration: 300, delay: 200, useNativeDriver: true }).start();
      });
    } else {
      Animated.timing(checkAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onComplete?.(survey.id, survey.rewardPoints);
  };

  const isLoading = completing && !completed;

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}>
      <View style={[styles.card, completed && styles.cardCompleted, shadows.sm]}>
        {/* Emoji */}
        <View style={[styles.emojiBox, completed && styles.emojiBoxCompleted]}>
          <Text style={styles.emoji}>{completed ? '✅' : survey.emoji}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.title, completed && styles.titleCompleted]}>
            {survey.title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {survey.description}
          </Text>
          <View style={styles.meta}>
            <Text style={styles.metaItem}>⏱ {survey.estimatedMinutes} min</Text>
            {survey.rewardPoints > 0 && (
              <>
                <Text style={styles.metaDot}>·</Text>
                <Text style={[styles.metaItem, styles.pointsText]}>
                  ⭐ +{survey.rewardPoints} pts
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Action */}
        <View style={styles.actionArea}>
          {completed ? (
            <Animated.View
              style={[styles.checkBadge, { opacity: checkAnim, transform: [{ scale: checkAnim }] }]}
            >
              <Text style={styles.checkText}>✓</Text>
            </Animated.View>
          ) : (
            <TouchableOpacity
              style={[styles.startBtn, (isLoading || disabled) && styles.startBtnDisabled]}
              onPress={handlePress}
              activeOpacity={0.8}
              disabled={isLoading || disabled}
            >
              {isLoading ? (
                <Text style={styles.startBtnText}>...</Text>
              ) : (
                <Text style={styles.startBtnText}>Start</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Floating points animation */}
      <Animated.View
        style={[
          styles.floatingPoints,
          {
            opacity: plusOpacity,
            transform: [{ translateY: plusAnim }],
          },
        ]}
        pointerEvents="none"
      >
        <Text style={styles.floatingPointsText}>+{survey.rewardPoints} pts ⭐</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardCompleted: {
    backgroundColor: colors.successLight,
    borderColor: colors.success + '40',
  },
  emojiBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.bluePale,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    flexShrink: 0,
  },
  emojiBoxCompleted: {
    backgroundColor: colors.successLight,
  },
  emoji: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.h4,
    color: colors.text,
    marginBottom: 2,
  },
  titleCompleted: {
    color: colors.successDark,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    ...typography.caption,
    color: colors.textMuted,
  },
  metaDot: {
    ...typography.caption,
    color: colors.textMuted,
    marginHorizontal: spacing.xs,
  },
  pointsText: {
    color: colors.gold,
    fontWeight: '600',
  },
  actionArea: {
    marginLeft: spacing.sm,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startBtn: {
    backgroundColor: colors.blue,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    minWidth: 56,
    alignItems: 'center',
  },
  startBtnDisabled: {
    backgroundColor: colors.textMuted,
  },
  startBtnText: {
    ...typography.smallMed,
    color: '#FFFFFF',
  },
  checkBadge: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  floatingPoints: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: colors.gold,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  floatingPointsText: {
    ...typography.smallMed,
    color: '#FFFFFF',
  },
});
