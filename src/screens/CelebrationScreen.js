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
import BenefitItem from '../components/BenefitItem';
import { useJourney } from '../context/JourneyContext';
import { colors, typography, spacing, radius, shadows } from '../theme';

const { width, height } = Platform.OS === 'web'
  ? { width: 393, height: 852 }
  : Dimensions.get('window');

import { ONBOARDING_SURVEYS } from '../data/journey';
const TOTAL_SURVEYS = ONBOARDING_SURVEYS.length; // 2
const POINTS_EARNED = ONBOARDING_SURVEYS.reduce((s, sv) => s + sv.rewardPoints, 0); // 150

// ─── Confetti ─────────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#1E56C8', '#8B5CF6', '#F59E0B', '#10B981', '#FFFFFF', '#60A5FA'];
const NUM_PIECES = 18;

function ConfettiPiece({ index, total, delay }) {
  const angle = (index / total) * 2 * Math.PI;
  const distance = 90 + Math.random() * 60;
  const targetX = Math.cos(angle) * distance;
  const targetY = Math.sin(angle) * distance - 40;
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const size = 7 + Math.random() * 8;

  const posAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(posAnim, { toValue: { x: targetX, y: targetY }, tension: 40, friction: 8, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      ]),
      Animated.timing(opacityAnim, { toValue: 0, duration: 600, delay: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: color,
        opacity: opacityAnim,
        transform: [{ translateX: posAnim.x }, { translateY: posAnim.y }, { scale: scaleAnim }],
      }}
    />
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function CelebrationScreen() {
  const insets = useSafeAreaInsets();
  const { currentStage, nextStage, points, completeOnboarding } = useJourney();

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

  const stage = currentStage;
  if (!stage) return null;

  return (
    <LinearGradient
      colors={['#0B1C3D', '#162E5C']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      {/* Confetti */}
      <View style={[styles.confettiOrigin, { top: height * 0.25, left: width / 2 }]} pointerEvents="none">
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
          <LinearGradient colors={stage.gradientColors} style={styles.badge}>
            <Text style={styles.badgeEmoji}>{stage.icon}</Text>
          </LinearGradient>
          <View style={styles.unlockPill}>
            <Text style={styles.unlockPillText}>🎉 Member Unlocked</Text>
          </View>
        </Animated.View>

        {/* Headline */}
        <Animated.View style={[styles.headlineArea, { opacity: titleAnim }]}>
          <Text style={styles.stageName}>{stage.name}</Text>
          <Text style={styles.headline}>You're in.</Text>
          <Text style={styles.sub}>
            {TOTAL_SURVEYS} surveys completed · {POINTS_EARNED} points earned.{'\n'}
            Welcome to the Member's Mark community.
          </Text>
        </Animated.View>

        {/* Points summary */}
        <Animated.View style={[styles.statsCard, { opacity: contentAnim }]}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>+{POINTS_EARNED}</Text>
              <Text style={styles.statLabel}>Points Earned</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>{points}</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>
          </View>
        </Animated.View>

        {/* Benefits unlocked */}
        <Animated.View style={[styles.card, { opacity: contentAnim }]}>
          <Text style={styles.cardTitle}>Benefits now available</Text>
          {stage.benefits.map((b, i) => (
            <BenefitItem key={i} icon={b.icon} title={b.title} description={b.description} />
          ))}
        </Animated.View>

        {/* Explorer — coming soon */}
        {nextStage && (
          <Animated.View style={[styles.explorerCard, { opacity: contentAnim }]}>
            <View style={styles.explorerHeader}>
              <Text style={styles.lockEmoji}>🔒</Text>
              <View>
                <Text style={styles.explorerName}>{nextStage.name}</Text>
                <Text style={styles.explorerStatus}>Coming soon</Text>
              </View>
            </View>

            <Text style={styles.explorerNote}>
              {nextStage.comingSoonMessage ?? `${nextStage.name} is coming soon. Your progress is already counting.`}
            </Text>

            <View style={styles.explorerBenefitsLabel}>
              <Text style={styles.explorerBenefitsTitle}>When Explorer arrives, you'll unlock:</Text>
            </View>
            {nextStage.benefits.map((b, i) => (
              <BenefitItem key={i} icon={b.icon} title={b.title} locked />
            ))}
          </Animated.View>
        )}

        {/* CTA */}
        <Animated.View style={[styles.ctaArea, { opacity: contentAnim }]}>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={completeOnboarding}
            activeOpacity={0.9}
          >
            <Text style={styles.ctaText}>Go to Home</Text>
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
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.lg,
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
  stageName: { ...typography.h2, color: colors.gold, marginBottom: spacing.xs },
  headline: { ...typography.hero, color: '#FFFFFF', marginBottom: spacing.sm },
  sub: {
    ...typography.body,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    lineHeight: 26,
  },
  statsCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.xl,
    padding: spacing.lg,
    width: '100%',
    marginBottom: spacing.md,
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  stat: { alignItems: 'center', flex: 1 },
  statNum: { ...typography.h2, color: '#FFFFFF' },
  statLabel: { ...typography.caption, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  statDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.15)' },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    width: '100%',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  cardTitle: { ...typography.h4, color: colors.text, marginBottom: spacing.md },
  explorerCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    width: '100%',
    marginBottom: spacing.xl,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  explorerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  lockEmoji: { fontSize: 24 },
  explorerName: { ...typography.h3, color: colors.text },
  explorerStatus: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 1,
  },
  explorerNote: {
    ...typography.small,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
    fontStyle: 'italic',
  },
  explorerBenefitsLabel: { marginBottom: spacing.sm },
  explorerBenefitsTitle: { ...typography.smallMed, color: colors.textSecondary },
  ctaArea: { width: '100%', marginBottom: spacing.lg },
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
  ctaArrow: { ...typography.h4, color: '#FFFFFF' },
});
