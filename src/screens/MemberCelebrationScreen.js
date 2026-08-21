/**
 * MemberCelebrationScreen — Moment 1 of 3 distinct celebration milestones.
 *
 * Triggered after: "Get Started" on WelcomeScreen (join flow).
 * Celebrates: joining the Community → Member (Tier 0 · BELONG).
 * Next step: complete onboarding surveys to unlock Explorer.
 *
 * Lightweight compared to Explorer/Contributor celebrations —
 * Member is the entry point, not an earned achievement.
 */
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { STAGES } from '../data/journey';
import { colors, typography, spacing, radius, shadows } from '../theme';

const MEMBER_STAGE = STAGES.find((s) => s.id === 0);

export default function MemberCelebrationScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const badgeAnim = useRef(new Animated.Value(0)).current;
  const badgeScale = useRef(new Animated.Value(0.4)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const ctaAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(badgeScale, { toValue: 1, tension: 55, friction: 9, useNativeDriver: true }),
        Animated.timing(badgeAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
      ]),
      Animated.timing(contentAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(ctaAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  if (!MEMBER_STAGE) return null;

  return (
    <LinearGradient
      colors={['#0B1C3D', '#1A2B4A']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={[styles.inner, { paddingBottom: insets.bottom + spacing.xl }]}>

        {/* Badge */}
        <Animated.View style={[styles.badgeArea, { opacity: badgeAnim, transform: [{ scale: badgeScale }] }]}>
          <LinearGradient colors={MEMBER_STAGE.gradientColors} style={styles.badge}>
            <Text style={styles.badgeEmoji}>{MEMBER_STAGE.icon}</Text>
          </LinearGradient>
          <View style={styles.unlockPill}>
            <Text style={styles.unlockPillText}>✓ Member</Text>
          </View>
        </Animated.View>

        {/* Headline */}
        <Animated.View style={[styles.headlineArea, { opacity: contentAnim }]}>
          <Text style={styles.meaningLabel}>BELONG</Text>
          <Text style={styles.headline}>You're in.</Text>
          <Text style={styles.sub}>
            Welcome to the Member's Mark Community.{'\n'}
            Your voice will help shape what comes next.
          </Text>
        </Animated.View>

        {/* Member benefits */}
        <Animated.View style={[styles.card, { opacity: contentAnim }]}>
          <Text style={styles.cardTitle}>What you've unlocked</Text>
          {MEMBER_STAGE.benefits.map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <View style={styles.benefitIcon}>
                <Text style={{ fontSize: 16 }}>{b.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.benefitTitle}>{b.title}</Text>
                <Text style={styles.benefitDesc}>{b.description}</Text>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* Explorer next teaser */}
        <Animated.View style={[styles.nextCard, { opacity: contentAnim }]}>
          <Text style={styles.nextEyebrow}>NEXT UP</Text>
          <View style={styles.nextRow}>
            <Text style={styles.nextEmoji}>🔭</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.nextName}>Explorer</Text>
              <Text style={styles.nextDesc}>
                Complete both onboarding surveys to become an Explorer and start earning
                progression points toward Contributor.
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* CTA */}
        <Animated.View style={[styles.ctaArea, { opacity: ctaAnim }]}>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => navigation.navigate('Survey')}
            activeOpacity={0.9}
          >
            <Text style={styles.ctaText}>Start Onboarding</Text>
            <Text style={styles.ctaArrow}> →</Text>
          </TouchableOpacity>
        </Animated.View>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeArea: { alignItems: 'center', marginBottom: spacing.xl },
  badge: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.lg,
  },
  badgeEmoji: { fontSize: 38 },
  unlockPill: {
    backgroundColor: 'rgba(255,255,255,0.14)',
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  benefitIcon: {
    width: 34, height: 34, borderRadius: radius.sm,
    backgroundColor: colors.bluePale,
    alignItems: 'center', justifyContent: 'center',
  },
  benefitTitle: { ...typography.smallMed, color: colors.text },
  benefitDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },
  nextCard: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: radius.xl,
    padding: spacing.lg,
    width: '100%',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  nextEyebrow: {
    ...typography.label,
    color: colors.gold,
    fontSize: 10,
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  nextRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  nextEmoji: { fontSize: 28 },
  nextName: { ...typography.h4, color: '#FFFFFF', marginBottom: 4 },
  nextDesc: {
    ...typography.small,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 20,
  },
  ctaArea: { width: '100%' },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue,
    borderRadius: radius.full,
    paddingVertical: spacing.md + 4,
    ...shadows.colored(colors.blue),
  },
  ctaText: { ...typography.h4, color: '#FFFFFF' },
  ctaArrow: { ...typography.h4, color: 'rgba(255,255,255,0.7)' },
});
