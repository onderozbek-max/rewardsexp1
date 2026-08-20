import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useJourney } from '../context/JourneyContext';
import { STAGES } from '../data/journey';
import { colors, typography, spacing, radius, shadows } from '../theme';

const explorerStage = STAGES[1];

export default function ExplorerMilestoneScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { points } = useJourney();

  const badgeAnim = useRef(new Animated.Value(0)).current;
  const badgeScale = useRef(new Animated.Value(0.4)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.sequence([
      Animated.delay(150),
      Animated.parallel([
        Animated.spring(badgeScale, { toValue: 1, tension: 50, friction: 9, useNativeDriver: true }),
        Animated.timing(badgeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.timing(contentAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleContinue = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={['#0B1C3D', '#1A1040']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Badge */}
        <Animated.View
          style={[
            styles.badgeArea,
            { opacity: badgeAnim, transform: [{ scale: badgeScale }] },
          ]}
        >
          <View style={styles.badgeWrapper}>
            <LinearGradient
              colors={explorerStage.gradientColors}
              style={[styles.badge, styles.badgeLocked]}
            >
              <Text style={styles.badgeEmoji}>{explorerStage.icon}</Text>
            </LinearGradient>
            {/* Lock overlay */}
            <View style={styles.lockOverlay}>
              <Text style={styles.lockEmoji}>🔒</Text>
            </View>
          </View>
          <View style={styles.milestonePill}>
            <Text style={styles.milestonePillText}>⭐ Milestone Reached</Text>
          </View>
        </Animated.View>

        {/* Headline */}
        <Animated.View style={[styles.headlineArea, { opacity: contentAnim }]}>
          <Text style={styles.stageName}>{explorerStage.name}</Text>
          <Text style={styles.headline}>You're making great progress.</Text>
          <Text style={styles.sub}>
            You've earned {points} points — enough to reach Explorer.
          </Text>
        </Animated.View>

        {/* Status card */}
        <Animated.View style={[styles.statusCard, { opacity: contentAnim }]}>
          <Text style={styles.statusCardTitle}>What this means</Text>
          <Text style={styles.statusCardBody}>
            Explorer isn't available yet, but your points are counting. When Explorer launches, you'll
            be among the first to unlock it.
          </Text>
          <View style={styles.statusCardNote}>
            <Text style={styles.statusCardNoteText}>
              Keep participating to stay ready and build even more points.
            </Text>
          </View>
        </Animated.View>

        {/* Explorer benefits preview */}
        <Animated.View style={[styles.benefitsCard, { opacity: contentAnim }]}>
          <View style={styles.benefitsCardHeader}>
            <Text style={styles.benefitsCardTitle}>
              When Explorer launches, you'll unlock
            </Text>
          </View>

          <View style={styles.benefitPills}>
            {explorerStage.benefits.map((b, i) => (
              <View key={i} style={styles.benefitPill}>
                <Text style={styles.benefitPillIcon}>{b.icon}</Text>
                <Text style={styles.benefitPillText} numberOfLines={1}>{b.title}</Text>
              </View>
            ))}
          </View>

          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonBadgeText}>🔒  Benefits available when Explorer launches</Text>
          </View>
        </Animated.View>

        {/* CTA */}
        <Animated.View style={[styles.ctaArea, { opacity: contentAnim }]}>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={handleContinue}
            activeOpacity={0.9}
          >
            <Text style={styles.ctaText}>Keep Participating</Text>
            <Text style={styles.ctaArrow}> →</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    alignItems: 'center',
  },

  // Badge
  badgeArea: { alignItems: 'center', marginBottom: spacing.xl },
  badgeWrapper: { position: 'relative', marginBottom: spacing.md },
  badge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
    ...shadows.lg,
  },
  badgeLocked: {},
  badgeEmoji: { fontSize: 44 },
  lockOverlay: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.navy,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockEmoji: { fontSize: 14 },
  milestonePill: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  milestonePillText: { ...typography.smallMed, color: '#FFFFFF' },

  // Headline
  headlineArea: { alignItems: 'center', marginBottom: spacing.xl },
  stageName: {
    ...typography.h2,
    color: explorerStage.color,
    marginBottom: spacing.xs,
  },
  headline: {
    ...typography.h1,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  sub: {
    ...typography.body,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 26,
  },

  // Status card
  statusCard: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: radius.xl,
    padding: spacing.lg,
    width: '100%',
    marginBottom: spacing.md,
  },
  statusCardTitle: {
    ...typography.h4,
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  statusCardBody: {
    ...typography.body,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 26,
    marginBottom: spacing.md,
  },
  statusCardNote: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: explorerStage.color,
  },
  statusCardNoteText: {
    ...typography.small,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 20,
  },

  // Benefits card
  benefitsCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    width: '100%',
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  benefitsCardHeader: { marginBottom: spacing.md },
  benefitsCardTitle: {
    ...typography.h4,
    color: colors.text,
  },
  benefitPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  benefitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.borderLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.full,
    gap: 4,
    opacity: 0.8,
  },
  benefitPillIcon: { fontSize: 12 },
  benefitPillText: {
    ...typography.captionMed,
    color: colors.textSecondary,
    maxWidth: 130,
  },
  comingSoonBadge: {
    backgroundColor: colors.borderLight,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  comingSoonBadgeText: {
    ...typography.caption,
    color: colors.textMuted,
  },

  // CTA
  ctaArea: { width: '100%', marginBottom: spacing.lg },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: explorerStage.color,
    borderRadius: radius.full,
    paddingVertical: spacing.md + 4,
    ...shadows.colored(explorerStage.color),
  },
  ctaText: { ...typography.h4, color: '#FFFFFF' },
  ctaArrow: { ...typography.h4, color: '#FFFFFF' },
});
