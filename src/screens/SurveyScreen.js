import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import SurveyCard from '../components/SurveyCard';
import { useJourney } from '../context/JourneyContext';
import { ONBOARDING_SURVEYS } from '../data/journey';
import { colors, typography, spacing, radius, shadows } from '../theme';

export default function SurveyScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { points, completeSurvey, isSurveyCompleted } = useJourney();
  const [completedCount, setCompletedCount] = useState(0);
  const [navigating, setNavigating] = useState(false);

  const pointsAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const totalPoints = ONBOARDING_SURVEYS.reduce((s, sv) => s + sv.rewardPoints, 0);

  useEffect(() => {
    Animated.spring(pointsAnim, {
      toValue: points,
      tension: 80,
      friction: 12,
      useNativeDriver: false,
    }).start();

    const pct = Math.min(points / totalPoints, 1);
    Animated.spring(progressAnim, {
      toValue: pct,
      tension: 60,
      friction: 10,
      useNativeDriver: false,
    }).start();
  }, [points]);

  const handleSurveyComplete = (surveyId, rewardPoints) => {
    completeSurvey(surveyId, rewardPoints);
    const newCount = completedCount + 1;
    setCompletedCount(newCount);

    // All surveys done → navigate to celebration after a short delay
    if (newCount === ONBOARDING_SURVEYS.length && !navigating) {
      setNavigating(true);
      setTimeout(() => {
        navigation.navigate('Celebration');
      }, 900);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.navy, colors.navyMid]}
        style={styles.header}
      >
        <Text style={styles.eyebrow}>Getting Started</Text>
        <Text style={styles.title}>Your First Surveys</Text>
        <Text style={styles.subtitle}>
          Complete both onboarding surveys to join the community and start earning.
        </Text>

        {/* Points progress tracker */}
        <View style={styles.pointsTracker}>
          <View style={styles.pointsRow}>
            <Text style={styles.pointsLabel}>Points Earned</Text>
            <Text style={styles.pointsValue}>
              ⭐ {points} / {totalPoints}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <View style={styles.surveyCounts}>
            <Text style={styles.surveyCountText}>
              {ONBOARDING_SURVEYS.filter((sv) => isSurveyCompleted(sv.id)).length} of{' '}
              {ONBOARDING_SURVEYS.length} surveys completed
            </Text>
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

        {/* Unlock preview */}
        <View style={styles.unlockPreview}>
          <View style={styles.unlockIconRow}>
            <Text style={styles.unlockIcon}>🌟</Text>
          </View>
          <Text style={styles.unlockTitle}>Unlock Member</Text>
          <Text style={styles.unlockDesc}>
            Complete both surveys to unlock Member and start receiving community benefits.
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
  pointsTracker: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  pointsLabel: {
    ...typography.smallMed,
    color: 'rgba(255,255,255,0.75)',
  },
  pointsValue: {
    ...typography.smallBold,
    color: colors.gold,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.gold,
    borderRadius: 3,
  },
  surveyCounts: {
    alignItems: 'flex-end',
  },
  surveyCountText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.6)',
  },
  scroll: {
    flex: 1,
  },
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
  unlockIcon: {
    fontSize: 28,
  },
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
