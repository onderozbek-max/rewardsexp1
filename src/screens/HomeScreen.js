/**
 * Community Home.
 *
 * Baseline (Control): looks like today's Community — activities, points history in Profile,
 *                     but no progression experience.
 * Phase 1+: adds a compact rewards header between the hero and the activities feed.
 *           The rewards header is a thin layer on top of the existing experience.
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import JourneyCard from '../components/JourneyCard';
import RoadmapPanel from '../components/RoadmapPanel';
import ActivityCard from '../components/ActivityCard';
import { useJourney } from '../context/JourneyContext';
import { useRoadmap } from '../context/RoadmapContext';
import { COMMUNITY_ACTIVITIES, STAGES } from '../data/journey';
import { MOCK_MEMBER } from '../data/profile';
import { colors, typography, spacing, radius, shadows } from '../theme';

// Only watch point-gated stages with a numeric threshold.
// Influencer/Co-creator have thresholdTBD: true — never trigger from point-crossing.
const WATCHABLE = STAGES.filter(
  (s) => typeof s.pointsRequired === 'number' && !s.thresholdTBD && s.id > 1
);

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const {
    currentPhase,
    points,
    currentStage,
    completeSurvey,
    isSurveyCompleted,
    hasTransitionBeenShown,
    markTransitionShown,
  } = useJourney();
  const { roadmapMode } = useRoadmap();

  const transitionGuard = useRef(new Set());
  const prevPhaseRef = useRef(currentPhase);

  // Reset guard when phase changes
  if (prevPhaseRef.current !== currentPhase) {
    prevPhaseRef.current = currentPhase;
    transitionGuard.current = new Set();
  }

  // Detect stage thresholds — never fires in control mode (WATCHABLE threshold ids all
  // pre-marked by switchPhase('control'), so hasTransitionBeenShown returns true).
  useEffect(() => {
    if (currentPhase === 'control') return;
    for (const stage of WATCHABLE) {
      const id = stage.id;
      if (
        points >= stage.pointsRequired &&
        !hasTransitionBeenShown(id) &&
        !transitionGuard.current.has(id)
      ) {
        transitionGuard.current = new Set([...transitionGuard.current, id]);
        markTransitionShown(id);
        const timer = setTimeout(() => {
          navigation.navigate('StageTransition', { stageId: id });
        }, 700);
        return () => clearTimeout(timer);
      }
    }
  }, [points, currentPhase]);

  const handleActivityComplete = (actId, pts) => {
    completeSurvey(actId, pts);
  };

  const completedCount = COMMUNITY_ACTIVITIES.filter((a) => isSurveyCompleted(a.id)).length;
  const openActivities = COMMUNITY_ACTIVITIES.filter((a) => !isSurveyCompleted(a.id));

  const showRewards = currentPhase !== 'control';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Community Hero banner ── */}
      <LinearGradient
        colors={['#4A5A3A', '#3A4A2A', '#2E3D20']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { paddingTop: insets.top + spacing.md }]}
      >
        <View style={styles.heroContent}>
          <View>
            <Text style={styles.heroWelcome}>Welcome,</Text>
            <Text style={styles.heroName}>{MOCK_MEMBER.firstName}</Text>
          </View>
          <View style={styles.mmBrand}>
            <Text style={styles.mmLogo}>M⟩</Text>
            <Text style={styles.mmName}>Member's{'\n'}Mark™</Text>
          </View>
        </View>
      </LinearGradient>

      {/* ── Activities completed banner ── */}
      <TouchableOpacity style={[styles.completedBanner, shadows.sm]} activeOpacity={0.7}>
        <Text style={styles.completedText}>
          <Text style={styles.completedCount}>{completedCount}</Text>
          {' activities completed'}
        </Text>
        <Text style={styles.completedChevron}>›</Text>
      </TouchableOpacity>

      {/* ── Rewards header (Phase 1+ only) ── */}
      {showRewards && currentStage && (
        <View style={styles.rewardsContainer}>
          <JourneyCard />
        </View>
      )}

      {/* ── Roadmap panel ── */}
      {roadmapMode && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Implementation Roadmap</Text>
          <RoadmapPanel />
        </View>
      )}

      {/* ── Open Activities ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Open Activities{openActivities.length > 0 ? ` (${openActivities.length})` : ''}
        </Text>

        {openActivities.length > 0 ? (
          openActivities.map((act) => (
            <ActivityCard
              key={act.id}
              activity={act}
              completed={isSurveyCompleted(act.id)}
              onComplete={handleActivityComplete}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>✅</Text>
            <Text style={styles.emptyTitle}>You're all caught up!</Text>
            <Text style={styles.emptyBody}>
              No open activities right now. Check back soon — new surveys and activities are
              added regularly.
            </Text>
          </View>
        )}
      </View>

      {/* ── What's New ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What's new</Text>
        <View style={[styles.whatsNewCard, shadows.sm]}>
          <View style={[styles.whatsNewThumb, { backgroundColor: '#1C2951' }]}>
            <Text style={{ fontSize: 36 }}>🎁</Text>
          </View>
          <View style={styles.whatsNewContent}>
            <Text style={styles.whatsNewTitle}>New products coming this fall</Text>
            <Text style={styles.whatsNewDesc}>
              Member's Mark is expanding its lineup. Your feedback shapes what we build next.
            </Text>
          </View>
        </View>
        <View style={[styles.whatsNewCard, shadows.sm]}>
          <View style={[styles.whatsNewThumb, { backgroundColor: '#4A2C2A' }]}>
            <Text style={{ fontSize: 36 }}>📣</Text>
          </View>
          <View style={styles.whatsNewContent}>
            <Text style={styles.whatsNewTitle}>Members helped launch this product</Text>
            <Text style={styles.whatsNewDesc}>
              Community members shaped the packaging and flavors for our newest snack line.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  // Hero banner
  hero: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  heroContent: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
  },
  heroWelcome: { ...typography.h3, color: 'rgba(255,255,255,0.8)', fontWeight: '400' },
  heroName: { ...typography.hero, color: '#FFFFFF', marginTop: 2 },
  mmBrand: { alignItems: 'flex-end' },
  mmLogo: { fontSize: 28, color: '#FFFFFF', fontWeight: '800' },
  mmName: { ...typography.caption, color: 'rgba(255,255,255,0.75)', textAlign: 'right', lineHeight: 16, marginTop: 2 },

  // Activities completed
  completedBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.card, marginHorizontal: spacing.md,
    marginTop: -spacing.sm, borderRadius: radius.lg,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2,
    borderWidth: 1, borderColor: colors.border,
  },
  completedText: { ...typography.bodyMed, color: colors.text },
  completedCount: { fontWeight: '700' },
  completedChevron: { ...typography.h3, color: colors.textMuted },

  // Rewards header container
  rewardsContainer: { marginTop: spacing.md },

  // Sections
  section: { paddingHorizontal: spacing.md, marginTop: spacing.lg },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.md },

  // Empty state
  emptyState: {
    backgroundColor: colors.card, borderRadius: radius.xl, padding: spacing.xl,
    alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed',
  },
  emptyEmoji: { fontSize: 32, marginBottom: spacing.sm },
  emptyTitle: { ...typography.h4, color: colors.text, marginBottom: spacing.xs, textAlign: 'center' },
  emptyBody: { ...typography.small, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },

  // What's New cards
  whatsNewCard: {
    flexDirection: 'row', backgroundColor: colors.card, borderRadius: radius.lg,
    overflow: 'hidden', borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm,
    minHeight: 90,
  },
  whatsNewThumb: { width: 90, alignItems: 'center', justifyContent: 'center' },
  whatsNewContent: { flex: 1, padding: spacing.md, justifyContent: 'center' },
  whatsNewTitle: { ...typography.smallMed, color: colors.text, marginBottom: 4 },
  whatsNewDesc: { ...typography.caption, color: colors.textSecondary, lineHeight: 18 },
});
