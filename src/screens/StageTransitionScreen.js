/**
 * StageTransitionScreen — Moment 3 of 3 (Contributor unlock).
 *
 * Triggered from HomeScreen when progression points cross 200 for the first time.
 * Route params: { stageId: number }
 *
 * For Experiment 1, only Contributor (id=2) can fire here.
 * Influencer (id=3) and Co-creator (id=4) have thresholdTBD: true —
 * they are never triggered via point-crossing. They appear as "future direction."
 *
 * isUnlocked = stageId <= maxUnlockableId (phase determines this).
 */
import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView, Platform, Dimensions,
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

// Confetti
const CONFETTI_COLORS = ['#FFFFFF', '#8B5CF6', '#60A5FA', '#F59E0B', '#10B981'];
const NUM_PIECES = 18;

function ConfettiPiece({ index, total, delay }) {
  const angle = (index / total) * 2 * Math.PI;
  const dist = 80 + Math.random() * 65;
  const posAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const size = 6 + Math.random() * 8;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(posAnim, {
          toValue: { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist - 35 },
          tension: 40, friction: 8, useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      ]),
      Animated.timing(opacityAnim, { toValue: 0, duration: 500, delay: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{
      position: 'absolute', width: size, height: size, borderRadius: size / 2,
      backgroundColor: color, opacity: opacityAnim,
      transform: [{ translateX: posAnim.x }, { translateY: posAnim.y }, { scale: scaleAnim }],
    }} />
  );
}

export default function StageTransitionScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { maxUnlockableId, points } = useJourney();
  const { stageId } = route.params ?? {};

  const stage = STAGES.find((s) => s.id === stageId);
  const isUnlocked = stageId <= maxUnlockableId;

  // Next stage for "up next" preview — may be TBD (Influencer)
  const nextPreviewStage = STAGES.find((s) => s.id === stageId + 1) ?? null;
  const nextIsTBD = nextPreviewStage?.thresholdTBD === true;

  const badgeAnim = useRef(new Animated.Value(0)).current;
  const badgeScale = useRef(new Animated.Value(0.35)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!stage) return;
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

  if (!stage) return null;

  return (
    <LinearGradient
      colors={isUnlocked ? ['#0B1C3D', '#162E5C'] : ['#0B1C3D', '#1A1040']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      {/* Confetti — unlock only */}
      {isUnlocked && (
        <View
          style={{ position: 'absolute', top: height * 0.24, left: width / 2, zIndex: 10 }}
          pointerEvents="none"
        >
          {Array.from({ length: NUM_PIECES }, (_, i) => (
            <ConfettiPiece key={i} index={i} total={NUM_PIECES} delay={i * 30} />
          ))}
        </View>
      )}

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Badge */}
        <Animated.View style={[styles.badgeArea, { opacity: badgeAnim, transform: [{ scale: badgeScale }] }]}>
          {isUnlocked ? (
            <LinearGradient colors={stage.gradientColors} style={styles.badge}>
              <Text style={styles.badgeEmoji}>{stage.icon}</Text>
            </LinearGradient>
          ) : (
            <View style={styles.badge}>
              <Text style={styles.badgeEmoji}>{stage.icon}</Text>
              <View style={styles.lockOverlay}><Text style={{ fontSize: 13 }}>🔒</Text></View>
            </View>
          )}
          <View style={styles.pill}>
            <Text style={styles.pillText}>
              {isUnlocked ? '🎉 Contributor Unlocked' : '⭐ Milestone Reached'}
            </Text>
          </View>
        </Animated.View>

        {/* Headline */}
        <Animated.View style={[styles.headlineArea, { opacity: contentAnim }]}>
          {stage.meaning && (
            <Text style={styles.meaningLabel}>{stage.meaning}</Text>
          )}
          <Text style={[styles.stageName, { color: stage.color }]}>{stage.name}</Text>
          <Text style={styles.headline}>
            {isUnlocked ? 'Unlocked.' : 'You\'re making great progress.'}
          </Text>
          <Text style={styles.sub}>
            {isUnlocked
              ? stage.unlockMessage
              : `You've earned enough to reach ${stage.name}. This stage is coming — your progress is already counting.`
            }
          </Text>
        </Animated.View>

        {/* Benefits / status card */}
        <Animated.View style={[styles.card, { opacity: contentAnim }]}>
          {isUnlocked && stage.benefits ? (
            <>
              <Text style={styles.cardTitle}>Benefits now available</Text>
              {stage.benefits.map((b, i) => (
                <View key={i} style={styles.benefitRow}>
                  <View style={styles.benefitIcon}><Text style={{ fontSize: 16 }}>{b.icon}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.benefitTitle}>{b.title}</Text>
                    <Text style={styles.benefitDesc}>{b.description}</Text>
                  </View>
                </View>
              ))}
            </>
          ) : (
            <>
              <Text style={styles.cardTitle}>What this means</Text>
              <Text style={styles.statusBody}>
                {stage.name} isn't available yet, but your points are counting. When it launches, you'll be among the first to unlock it.
              </Text>
              <View style={styles.noteBox}>
                <Text style={styles.noteText}>Keep participating to stay ready.</Text>
              </View>
            </>
          )}
        </Animated.View>

        {/* Next stage preview */}
        {nextPreviewStage && isUnlocked && (
          <Animated.View style={[styles.nextCard, { opacity: contentAnim }]}>
            {nextIsTBD ? (
              // Future direction — Influencer or Co-creator with TBD threshold
              <>
                <View style={styles.nextHeader}>
                  <Text style={styles.nextHeaderLabel}>FUTURE DIRECTION</Text>
                  <View style={styles.tbdBadge}>
                    <Text style={styles.tbdBadgeText}>Threshold TBD</Text>
                  </View>
                </View>
                <Text style={styles.nextName}>
                  {nextPreviewStage.icon} {nextPreviewStage.name}
                </Text>
                <Text style={styles.nextMeaning}>{nextPreviewStage.meaning}</Text>
                {nextPreviewStage.futureDirectionBenefits && (
                  <View style={styles.futureList}>
                    {nextPreviewStage.futureDirectionBenefits.map((item, i) => (
                      <Text key={i} style={styles.futureItem}>· {item}</Text>
                    ))}
                  </View>
                )}
                <View style={styles.tbdNote}>
                  <Text style={styles.tbdNoteText}>
                    Influencer thresholds are under calibration and will be determined from Contributor participation data. No specific target is committed.
                  </Text>
                </View>
              </>
            ) : (
              // Normal next stage with known threshold
              <>
                <View style={styles.nextHeader}>
                  <Text style={styles.nextHeaderLabel}>UP NEXT</Text>
                  <View style={[styles.nextBadge, { backgroundColor: nextPreviewStage.color + '18' }]}>
                    <Text style={[styles.nextBadgeText, { color: nextPreviewStage.color }]}>🔒 Locked</Text>
                  </View>
                </View>
                <Text style={styles.nextName}>{nextPreviewStage.icon} {nextPreviewStage.name}</Text>
                {nextPreviewStage.benefits && (
                  <View style={styles.nextBenefitPills}>
                    {nextPreviewStage.benefits.slice(0, 2).map((b, i) => (
                      <View key={i} style={styles.nextPill}>
                        <Text style={styles.nextPillIcon}>{b.icon}</Text>
                        <Text style={styles.nextPillText} numberOfLines={1}>{b.title}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
          </Animated.View>
        )}

        {/* CTA */}
        <Animated.View style={[styles.ctaArea, { opacity: contentAnim }]}>
          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: isUnlocked ? stage.color : colors.blue }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.9}
          >
            <Text style={styles.ctaText}>
              {isUnlocked ? 'Continue →' : 'Keep Participating →'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, alignItems: 'center' },
  badgeArea: { alignItems: 'center', marginBottom: spacing.xl },
  badge: {
    width: 96, height: 96, borderRadius: 48,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginBottom: spacing.md, ...shadows.lg, position: 'relative',
  },
  badgeEmoji: { fontSize: 44 },
  lockOverlay: {
    position: 'absolute', bottom: -4, right: -4,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: colors.navy,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  pillText: { ...typography.smallMed, color: '#FFFFFF' },
  headlineArea: { alignItems: 'center', marginBottom: spacing.xl },
  meaningLabel: {
    ...typography.label,
    color: colors.gold,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  stageName: { ...typography.h2, marginBottom: spacing.xs },
  headline: { ...typography.h1, color: '#FFFFFF', textAlign: 'center', marginBottom: spacing.sm },
  sub: { ...typography.body, color: 'rgba(255,255,255,0.65)', textAlign: 'center', lineHeight: 26 },
  card: {
    backgroundColor: colors.card, borderRadius: radius.xl,
    padding: spacing.lg, width: '100%', marginBottom: spacing.md, ...shadows.md,
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
  statusBody: { ...typography.body, color: colors.textSecondary, lineHeight: 26, marginBottom: spacing.md },
  noteBox: {
    backgroundColor: colors.bluePale, borderRadius: radius.md,
    padding: spacing.md, borderLeftWidth: 3, borderLeftColor: colors.blue,
  },
  noteText: { ...typography.small, color: colors.text, lineHeight: 20 },
  nextCard: {
    backgroundColor: colors.card, borderRadius: radius.xl,
    padding: spacing.lg, width: '100%', marginBottom: spacing.xl, ...shadows.sm,
  },
  nextHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  nextHeaderLabel: { ...typography.label, color: colors.textMuted, fontSize: 10, letterSpacing: 1 },
  nextBadge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.full },
  nextBadgeText: { ...typography.label, fontSize: 9 },
  tbdBadge: {
    backgroundColor: colors.goldLight,
    paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.full,
  },
  tbdBadgeText: { ...typography.label, fontSize: 9, color: colors.goldDark },
  nextName: { ...typography.h3, color: colors.text, marginBottom: 4 },
  nextMeaning: { ...typography.label, color: colors.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: spacing.sm },
  futureList: { gap: 4, marginBottom: spacing.sm },
  futureItem: { ...typography.small, color: colors.textSecondary, lineHeight: 20 },
  tbdNote: {
    backgroundColor: colors.goldLight, borderRadius: radius.md,
    padding: spacing.md, borderLeftWidth: 3, borderLeftColor: colors.gold,
    marginTop: spacing.xs,
  },
  tbdNoteText: { ...typography.caption, color: colors.goldDark, lineHeight: 18 },
  nextBenefitPills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  nextPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.borderLight, paddingHorizontal: spacing.sm,
    paddingVertical: 5, borderRadius: radius.full, gap: 4,
  },
  nextPillIcon: { fontSize: 12 },
  nextPillText: { ...typography.captionMed, color: colors.textSecondary, maxWidth: 120 },
  ctaArea: { width: '100%', marginBottom: spacing.lg },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.full, paddingVertical: spacing.md + 4,
  },
  ctaText: { ...typography.h4, color: '#FFFFFF' },
});
