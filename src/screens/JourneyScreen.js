import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProgressBar from '../components/ProgressBar';
import BenefitItem from '../components/BenefitItem';
import { useJourney } from '../context/JourneyContext';
import { useRoadmap } from '../context/RoadmapContext';
import { STAGES } from '../data/journey';
import { colors, typography, spacing, radius, shadows } from '../theme';

function StageCard({ stage, isCurrentStage, isUnlocked, points }) {
  const progressInStage = (() => {
    if (!isCurrentStage) return isUnlocked ? 1 : 0;
    const nextStageObj = STAGES.find((s) => s.id === stage.id + 1);
    if (!nextStageObj) return 1;
    const start = stage.pointsRequired;
    const end = nextStageObj.pointsRequired;
    return Math.min((points - start) / (end - start), 1);
  })();

  if (isCurrentStage) {
    return (
      <LinearGradient
        colors={stage.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.stageCard, styles.stageCardCurrent, shadows.lg]}
      >
        {/* Current badge */}
        <View style={styles.currentBadgeRow}>
          <View style={styles.currentBadge}>
            <Text style={styles.currentBadgeText}>Current Stage</Text>
          </View>
          <View style={styles.stagePillWhite}>
            <Text style={styles.stagePillWhiteText}>Stage {stage.id} of 5</Text>
          </View>
        </View>

        {/* Stage identity */}
        <View style={styles.stageIdentityRow}>
          <Text style={styles.stageEmojiLg}>{stage.icon}</Text>
          <View>
            <Text style={styles.stageNameLg}>{stage.name}</Text>
            <Text style={styles.stageDescLight}>{stage.description}</Text>
          </View>
        </View>

        {/* Progress within stage */}
        <View style={styles.progressSection}>
          <ProgressBar
            progress={progressInStage}
            height={5}
            trackColor="rgba(255,255,255,0.25)"
            fillColor="#FFFFFF"
          />
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabelLight}>{points} pts earned</Text>
            <Text style={styles.progressPctLight}>
              {Math.round(progressInStage * 100)}%
            </Text>
          </View>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsDivider} />
        <Text style={styles.benefitsTitleLight}>Unlocked Benefits</Text>
        {stage.benefits.map((b, i) => (
          <BenefitItem key={i} icon={b.icon} title={b.title} description={b.description} light />
        ))}
      </LinearGradient>
    );
  }

  if (isUnlocked) {
    return (
      <View style={[styles.stageCard, styles.stageCardUnlocked, shadows.sm]}>
        <View style={styles.unlockedHeader}>
          <View style={[styles.stageIconSmall, { backgroundColor: stage.color + '20' }]}>
            <Text style={styles.stageEmojiSm}>{stage.icon}</Text>
          </View>
          <View style={styles.stageInfo}>
            <Text style={[styles.stageName, { color: stage.color }]}>{stage.name}</Text>
            <Text style={styles.stagePoints}>{stage.pointsRequired}+ pts</Text>
          </View>
          <View style={[styles.unlockedPill, { backgroundColor: stage.color + '15' }]}>
            <Text style={[styles.unlockedPillText, { color: stage.color }]}>✓ Unlocked</Text>
          </View>
        </View>
        <View style={styles.benefitsList}>
          {stage.benefits.map((b, i) => (
            <BenefitItem key={i} icon={b.icon} title={b.title} description={b.description} />
          ))}
        </View>
      </View>
    );
  }

  // Locked
  return (
    <View style={[styles.stageCard, styles.stageCardLocked]}>
      <View style={styles.lockedHeader}>
        <View style={styles.stageIconLocked}>
          <Text style={styles.lockEmoji}>🔒</Text>
        </View>
        <View style={styles.stageInfo}>
          <Text style={styles.stageNameLocked}>{stage.name}</Text>
          <Text style={styles.stagePointsLocked}>{stage.pointsRequired} pts needed</Text>
        </View>
        <View style={styles.lockedPill}>
          <Text style={styles.lockedPillText}>Locked</Text>
        </View>
      </View>
      <View style={styles.benefitsList}>
        {stage.benefits.map((b, i) => (
          <BenefitItem key={i} icon={b.icon} title={b.title} description={b.description} locked />
        ))}
      </View>
    </View>
  );
}

export default function JourneyScreen() {
  const insets = useSafeAreaInsets();
  const { points, currentStage, nextStage, pointsToNextStage, progressPercent } = useJourney();
  const { roadmapMode } = useRoadmap();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + spacing.xxl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero header */}
      <LinearGradient
        colors={[colors.navy, colors.navyMid]}
        style={[styles.hero, { paddingTop: insets.top + spacing.md }]}
      >
        <Text style={styles.eyebrow}>Community Journey</Text>
        <Text style={styles.heroTitle}>Five stages.{'\n'}Real rewards.</Text>
        <Text style={styles.heroSub}>
          Every survey moves you forward. Each stage unlocks benefits designed for dedicated members.
        </Text>

        {/* Overall progress summary */}
        <View style={styles.heroSummary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNum}>⭐ {points}</Text>
            <Text style={styles.summaryLabel}>Points</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNum}>
              {currentStage ? currentStage.id : '—'} / 5
            </Text>
            <Text style={styles.summaryLabel}>Stage</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNum}>
              {nextStage ? `${pointsToNextStage} pts` : 'Max!'}
            </Text>
            <Text style={styles.summaryLabel}>To Next</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Stage cards */}
      <View style={styles.stagesSection}>
        <Text style={styles.stagesSectionTitle}>Your Journey</Text>
        {/* Vertical connector line */}
        <View style={styles.timelineWrapper}>
          {STAGES.map((stage, i) => {
            const isUnlocked = points >= stage.pointsRequired;
            const isCurrent = currentStage?.id === stage.id;
            return (
              <View key={stage.id} style={styles.timelineItem}>
                {/* Connector line */}
                {i < STAGES.length - 1 && (
                  <View
                    style={[
                      styles.connector,
                      isUnlocked ? styles.connectorUnlocked : styles.connectorLocked,
                    ]}
                  />
                )}
                <StageCard
                  stage={stage}
                  isCurrentStage={isCurrent}
                  isUnlocked={isUnlocked}
                  points={points}
                />
              </View>
            );
          })}
        </View>
      </View>

      {/* Roadmap Mode note on Journey screen — directs to Home */}
      {roadmapMode && (
        <View style={styles.roadmapSection}>
          <View style={styles.roadmapNudge}>
            <Text style={styles.roadmapNudgeEmoji}>🔭</Text>
            <Text style={styles.roadmapNudgeText}>
              The full experiment roadmap is on the Home screen.
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {},
  hero: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  eyebrow: {
    ...typography.label,
    color: colors.gold,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    ...typography.h1,
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  heroSub: {
    ...typography.small,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  heroSummary: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.lg,
    padding: spacing.md,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryNum: {
    ...typography.h4,
    color: '#FFFFFF',
  },
  summaryLabel: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  stagesSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
  },
  stagesSectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  timelineWrapper: {
    position: 'relative',
  },
  timelineItem: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  connector: {
    position: 'absolute',
    left: 28,
    bottom: -spacing.sm,
    width: 2,
    height: spacing.sm + 4,
    zIndex: 1,
  },
  connectorUnlocked: {
    backgroundColor: colors.blue,
  },
  connectorLocked: {
    backgroundColor: colors.border,
  },
  // Current stage card
  stageCard: {
    borderRadius: radius.xl,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  stageCardCurrent: {
    padding: spacing.lg,
  },
  stageCardUnlocked: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stageCardLocked: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    opacity: 0.75,
  },
  currentBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  currentBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  currentBadgeText: {
    ...typography.label,
    color: '#FFFFFF',
    fontSize: 10,
  },
  stagePillWhite: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  stagePillWhiteText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.85)',
  },
  stageIdentityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  stageEmojiLg: {
    fontSize: 36,
    marginRight: spacing.md,
    marginTop: 2,
  },
  stageNameLg: {
    ...typography.h2,
    color: '#FFFFFF',
  },
  stageDescLight: {
    ...typography.small,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
    lineHeight: 20,
    maxWidth: 220,
  },
  progressSection: {
    marginBottom: spacing.lg,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  progressLabelLight: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
  },
  progressPctLight: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  benefitsDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: spacing.md,
  },
  benefitsTitleLight: {
    ...typography.label,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: spacing.sm,
    fontSize: 10,
  },
  // Unlocked card
  unlockedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stageIconSmall: {
    width: 42,
    height: 42,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  stageEmojiSm: {
    fontSize: 22,
  },
  stageInfo: {
    flex: 1,
  },
  stageName: {
    ...typography.h4,
  },
  stagePoints: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  unlockedPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  unlockedPillText: {
    ...typography.label,
    fontSize: 10,
  },
  // Locked card
  lockedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stageIconLocked: {
    width: 42,
    height: 42,
    borderRadius: radius.sm,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  lockEmoji: {
    fontSize: 20,
  },
  stageNameLocked: {
    ...typography.h4,
    color: colors.textSecondary,
  },
  stagePointsLocked: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  lockedPill: {
    backgroundColor: colors.borderLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  lockedPillText: {
    ...typography.label,
    fontSize: 10,
    color: colors.textMuted,
  },
  benefitsList: {
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  // Roadmap section
  roadmapSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  roadmapNudge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.roadmapBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.roadmapBorder,
    padding: spacing.md,
    gap: spacing.sm,
  },
  roadmapNudgeEmoji: {
    fontSize: 16,
  },
  roadmapNudgeText: {
    ...typography.small,
    color: colors.roadmapLabel,
    flex: 1,
  },
});
