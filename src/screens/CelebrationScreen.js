/**
 * CelebrationScreen — Moment 2 of 3 distinct celebration milestones.
 * Screen name in navigator: 'ExplorerCelebration'
 *
 * Triggered after: both onboarding surveys completed.
 * Celebrates: Explorer (Tier 1 · PARTICIPATE).
 * Next step: earn 200 progression points to unlock Contributor.
 *
 * Confetti + badge pop-in + benefits reveal + Contributor destination preview.
 */
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useJourney } from '../context/JourneyContext';
import { STAGES } from '../data/journey';
import { colors, typography, spacing, radius, shadows } from '../theme';

const { width, height } = Platform.OS === 'web'
  ? { width: 393, height: 852 }
  : Dimensions.get('window');

const EXPLORER_STAGE = STAGES.find((s) => s.id === 1);
const CONTRIBUTOR_STAGE = STAGES.find((s) => s.id === 2);

// ─── Confetti ─────────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#1E56C8', '#60A5FA', '#8B5CF6', '#F59E0B', '#FFFFFF', '#10B981'];
const NUM_PIECES = 18;

function ConfettiPiece({ index, total, delay }) {
  const angle = (index / total) * 2 * Math.PI;
  const distance = 85 + Math.random() * 65;
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const size = 7 + Math.random() * 8;

  const posAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(posAnim, {
          toValue: { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance - 40 },
          tension: 40, friction: 8, useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      ]),
      Animated.timing(opacityAnim, { toValue: 0, duration: 600, delay: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{
      position: 'absolute',
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: color,
      opacity: opacityAnim,
      transform: [{ translateX: posAnim.x }, { translateY: posAnim.y }, { scale: scaleAnim }],
    }} />
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function CelebrationScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useJourney();

  const badgeAnim = useRef(new Animated.Value(0)).current;
  const badgeScale = useRef(new Animated.Value(0.3)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(badgeScale, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
        Animated.timing(badgeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.timing(titleAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(contentAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, []);

  if (!EXPLORER_STAGE) return null;

  return (
    <LinearGradient
      colors={['#0B1C3D', '#162E5C']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      {/* Confetti */}
      <View
        style={[styles.confettiOrigin, { top: height * 0.25, left: width / 2 }]}
        pointerEvents="none"
      >
        {Array.from({ length: NUM_PIECES }, (_, i) => (
          <ConfettiPiece key={i} index={i} total={NUM_PIECES} delay={i * 30} />
        ))}
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Badge */}
        <Animated.View style={[styles.badgeArea, { opacity: badgeAnim, transform: [{ scale: badgeScale }] }]}>
          <LinearGradient colors={EXPLORER_STAGE.gradientColors} style={styles.badge}>
            <Text style={styles.badgeEmoji}>{EXPLORER_STAGE.icon}</Text>
          </LinearGradient>
          <View style={styles.unlockPill}>
            <Text style={styles.unlockPillText}>🎉 Explorer Unlocked</Text>
          </View>
        </Animated.View>

        {/* Headline */}
        <Animated.View style={[styles.headlineArea, { opacity: titleAnim }]}>
          <Text style={styles.meaningLabel}>PARTICIPATE</Text>
          <Text style={styles.stageName}>{EXPLORER_STAGE.name}</Text>
          <Text style={styles.headline}>Onboarding complete.</Text>
          <Text style={styles.sub}>
            You're now an Explorer. Participate in Community activities
            and earn progression points toward Contributor.
          </Text>
        </Animated.View>

        {/* Explorer benefits */}
        <Animated.View style={[styles.card, { opacity: contentAnim }]}>
          <Text style={styles.cardTitle}>Benefits now available</Text>
          {EXPLORER_STAGE.benefits.map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <View style={styles.benefitIcon}><Text style={{ fontSize: 16 }}>{b.icon}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.benefitTitle}>{b.title}</Text>
                <Text style={styles.benefitDesc}>{b.description}</Text>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* Contributor destination */}
        {CONTRIBUTOR_STAGE && (
          <Animated.View style={[styles.contributorCard, { opacity: contentAnim }]}>
            <View style={styles.contributorHeader}>
              <Text style={styles.contributorEyebrow}>YOUR NEXT DESTINATION</Text>
              <View style={[styles.lockedBadge, { backgroundColor: CONTRIBUTOR_STAGE.color + '18' }]}>
                <Text style={[styles.lockedBadgeText, { color: CONTRIBUTOR_STAGE.color }]}>
                  🔒 Locked
                </Text>
              </View>
            </View>
            <View style={styles.contributorRow}>
              <Text style={styles.contributorEmoji}>{CONTRIBUTOR_STAGE.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.contributorName}>{CONTRIBUTOR_STAGE.name}</Text>
                <Text style={styles.contributorThreshold}>
                  200 progression points
                </Text>
              </View>
            </View>
            <Text style={styles.contributorDesc}>
              Earn progression points by completing activities and surveys in the Community.
              P2 activities earn 50 pts · P3 activities earn 30 pts.
            </Text>
            <View style={styles.contributorBenefitPills}>
              {CONTRIBUTOR_STAGE.benefits.slice(0, 2).map((b, i) => (
                <View key={i} style={styles.benefitPill}>
                  <Text style={styles.benefitPillIcon}>{b.icon}</Text>
                  <Text style={styles.benefitPillText} numberOfLines={1}>{b.title}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* CTA */}
        <Animated.View style={[styles.ctaArea, { opacity: contentAnim }]}>
          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: EXPLORER_STAGE.color }]}
            onPress={completeOnboarding}
            activeOpacity={0.9}
          >
            <Text style={styles.ctaText}>Go to Community</Text>
            <Text style={styles.ctaArrow}> →</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  confettiOrigin: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    alignItems: 'center',
  },
  badgeArea: { alignItems: 'center', marginBottom: spacing.xl },
  badge: {
    width: 96, height: 96, borderRadius: 48,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md, ...shadows.lg,
  },
  badgeEmoji: { fontSize: 44 },
  unlockPill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  unlockPillText: { ...typography.smallMed, color: '#FFFFFF' },
  headlineArea: { alignItems: 'center', marginBottom: spacing.xl },
  meaningLabel: {
    ...typography.label,
    color: colors.gold,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  stageName: { ...typography.h2, color: '#FFFFFF', marginBottom: spacing.xs },
  headline: { ...typography.hero, color: '#FFFFFF', marginBottom: spacing.sm },
  sub: {
    ...typography.body,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    lineHeight: 26,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    width: '100%',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  cardTitle: { ...typography.h4, color: colors.text, marginBottom: spacing.md },
  benefitRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: spacing.sm, marginBottom: spacing.sm,
  },
  benefitIcon: {
    width: 34, height: 34, borderRadius: radius.sm,
    backgroundColor: colors.bluePale, alignItems: 'center', justifyContent: 'center',
  },
  benefitTitle: { ...typography.smallMed, color: colors.text },
  benefitDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },
  contributorCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    width: '100%',
    marginBottom: spacing.xl,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
    ...shadows.sm,
  },
  contributorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  contributorEyebrow: {
    ...typography.label,
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 1,
  },
  lockedBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  lockedBadgeText: { ...typography.label, fontSize: 10 },
  contributorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  contributorEmoji: { fontSize: 30 },
  contributorName: { ...typography.h3, color: colors.text },
  contributorThreshold: { ...typography.smallMed, color: colors.blue, marginTop: 2 },
  contributorDesc: {
    ...typography.small,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  contributorBenefitPills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  benefitPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.borderLight,
    paddingHorizontal: spacing.sm, paddingVertical: 5,
    borderRadius: radius.full, gap: 4,
  },
  benefitPillIcon: { fontSize: 12 },
  benefitPillText: { ...typography.captionMed, color: colors.textSecondary, maxWidth: 120 },
  ctaArea: { width: '100%', marginBottom: spacing.lg },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    paddingVertical: spacing.md + 4,
    ...shadows.md,
  },
  ctaText: { ...typography.h4, color: '#FFFFFF' },
  ctaArrow: { ...typography.h4, color: 'rgba(255,255,255,0.7)' },
});
