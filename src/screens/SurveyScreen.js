/**
 * SurveyScreen — Onboarding surveys.
 *
 * Completing both surveys → Explorer unlock (survey-completion gate, NOT points-gated).
 * Onboarding surveys award 0 progression points toward Contributor.
 * PROTOTYPE ASSUMPTION: pre-Explorer activity points not counted — unresolved per §32.
 *
 * Flow:
 *   control phase → completeOnboarding() directly (no celebration)
 *   mvp/ff1/ff2   → navigate to ExplorerCelebration
 */
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import SurveyCard from '../components/SurveyCard';
import { useJourney } from '../context/JourneyContext';
import { ONBOARDING_SURVEYS } from '../data/journey';
import { colors, typography, spacing, radius } from '../theme';

export default function SurveyScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { currentPhase, completeSurvey, isSurveyCompleted, completeOnboarding } = useJourney();
  const [navigating, setNavigating] = useState(false);

  const completedCount = ONBOARDING_SURVEYS.filter((sv) => isSurveyCompleted(sv.id)).length;

  const handleSurveyComplete = (surveyId) => {
    // 0 progression points — Explorer is survey-gated, not point-gated.
    completeSurvey(surveyId, 0);
    const newCount = completedCount + 1;

    if (newCount === ONBOARDING_SURVEYS.length && !navigating) {
      setNavigating(true);
      setTimeout(() => {
        if (currentPhase === 'control') {
          // Control: no celebration — jump directly to Community Home.
          completeOnboarding();
        } else {
          navigation.navigate('ExplorerCelebration');
        }
      }, 900);
    }
  };

  const progressFraction = completedCount / ONBOARDING_SURVEYS.length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.navy, colors.navyMid]}
        style={styles.header}
      >
        <Text style={styles.eyebrow}>Getting Started</Text>
        <Text style={styles.title}>Onboarding Surveys</Text>
        <Text style={styles.subtitle}>
          Complete both surveys to unlock Explorer and begin earning progression points.
        </Text>

        {/* Survey completion progress */}
        <View style={styles.progressTracker}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Surveys completed</Text>
            <Text style={styles.progressValue}>
              {completedCount} / {ONBOARDING_SURVEYS.length}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressFraction * 100}%` }]} />
          </View>
        </View>
      </LinearGradient>

      {/* Survey cards */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>COMPLETE BOTH SURVEYS</Text>
        {ONBOARDING_SURVEYS.map((survey, idx) => {
          const prevCompleted = idx === 0 || isSurveyCompleted(ONBOARDING_SURVEYS[idx - 1].id);
          return (
            <SurveyCard
              key={survey.id}
              survey={survey}
              completed={isSurveyCompleted(survey.id)}
              disabled={!prevCompleted && !isSurveyCompleted(survey.id)}
              onComplete={handleSurveyComplete}
            />
          );
        })}

        {/* Explorer unlock destination */}
        <View style={styles.unlockPreview}>
          <View style={styles.unlockIconRow}>
            <Text style={styles.unlockIcon}>🔭</Text>
          </View>
          <Text style={styles.unlockTitle}>Unlock Explorer</Text>
          <Text style={styles.unlockDesc}>
            Complete both surveys to become an Explorer — then start earning progression
            points toward Contributor (200 pts).
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  eyebrow: {
    ...typography.label,
    color: colors.gold,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  title: {
    ...typography.h1,
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.small,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  progressTracker: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    ...typography.smallMed,
    color: 'rgba(255,255,255,0.75)',
  },
  progressValue: {
    ...typography.smallBold,
    color: '#FFFFFF',
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  },
  unlockPreview: {
    marginTop: spacing.lg,
    backgroundColor: colors.bluePale,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.blue + '30',
    borderStyle: 'dashed',
  },
  unlockIconRow: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.blue + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  unlockIcon: { fontSize: 28 },
  unlockTitle: {
    ...typography.h4,
    color: colors.blue,
    marginBottom: spacing.xs,
  },
  unlockDesc: {
    ...typography.small,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
