/**
 * Compact rewards progress header — sits within the Community Home, not replacing it.
 *
 * Phase 1: Stage + points + progress bar + locked next stage. No benefits.
 * Phase 2/3: Adds current benefit chips (ⓘ accordion) + next-stage benefit preview.
 *
 * Spec: "compact status/progress component, not an entire rewards dashboard."
 *       "The existing Open Activities section should remain visible immediately below."
 */
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ProgressBar from './ProgressBar';
import { useJourney } from '../context/JourneyContext';
import { colors, typography, spacing, radius, shadows } from '../theme';
import { STAGES } from '../data/journey';

const MAX_CHIPS = 2;

export default function JourneyCard() {
  const {
    currentPhase,
    points,
    currentStage,
    nextStage,
    pointsToNextStage,
    progressPercent,
    nextRequirementMet,
  } = useJourney();

  // Should never render in control mode — caller is responsible for the guard,
  // but add a safety net here too.
  if (currentPhase === 'control' || !currentStage) return null;

  const next = nextStage;
  const showBenefitLayer = currentPhase >= 2 && (currentStage.benefits?.length ?? 0) > 0;
  const visibleBenefits = currentStage.benefits?.slice(0, MAX_CHIPS) ?? [];
  const overflowCount = (currentStage.benefits?.length ?? 0) - MAX_CHIPS;

  const [showAccordion, setShowAccordion] = useState(false);
  const accordionAnim = useRef(new Animated.Value(0)).current;

  const toggleAccordion = () => {
    if (showAccordion) {
      Animated.timing(accordionAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(
        () => setShowAccordion(false)
      );
    } else {
      setShowAccordion(true);
      Animated.timing(accordionAnim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
    }
  };

  return (
    <View style={[card.wrapper, shadows.md]}>
      <LinearGradient
        colors={currentStage.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={card.body}
      >
        {/* Row 1: Stage + optional ⓘ + points */}
        <View style={card.topRow}>
          <View style={card.stageLeft}>
            <Text style={card.stageIcon}>{currentStage.icon}</Text>
            <Text style={card.stageName}>{currentStage.name}</Text>
            {showBenefitLayer && (
              <TouchableOpacity
                onPress={toggleAccordion}
                style={[card.infoBtn, showAccordion && card.infoBtnOpen]}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                activeOpacity={0.7}
              >
                <Text style={card.infoBtnText}>{showAccordion ? '↑' : 'ⓘ'}</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={card.points}>{points} ⭐</Text>
        </View>

        {/* Benefit chips (Phase 2/3, collapsed row) */}
        {showBenefitLayer && !showAccordion && (
          <View style={card.chipsRow}>
            {visibleBenefits.map((b, i) => (
              <View key={i} style={card.chip}>
                <Text style={card.chipIcon}>{b.icon}</Text>
                <Text style={card.chipText} numberOfLines={1}>{b.title}</Text>
              </View>
            ))}
            {overflowCount > 0 && (
              <TouchableOpacity style={card.chipMore} onPress={toggleAccordion}>
                <Text style={card.chipMoreText}>+{overflowCount}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Benefit accordion (Phase 2/3, expanded) */}
        {showBenefitLayer && showAccordion && (
          <Animated.View style={{ opacity: accordionAnim }}>
            <View style={card.accordionDivider} />
            {currentStage.benefits.map((b, i) => (
              <View key={i} style={card.accordionRow}>
                <View style={card.accordionIcon}><Text style={{ fontSize: 14 }}>{b.icon}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={card.accordionTitle}>{b.title}</Text>
                  <Text style={card.accordionDesc}>{b.description}</Text>
                </View>
              </View>
            ))}
            <View style={card.accordionDivider} />
          </Animated.View>
        )}

        {/* Progress bar */}
        <ProgressBar
          progress={progressPercent}
          height={5}
          trackColor="rgba(255,255,255,0.22)"
          fillColor="#FFFFFF"
          style={card.progressBar}
        />

        {/* Progress labels + next stage */}
        <View style={card.progressRow}>
          {next ? (
            <>
              {nextRequirementMet ? (
                // Spec §8: must not say "0 points until Explorer" when past threshold but locked
                <Text style={card.progressPts}>
                  {points} pts  ·  Explorer requirement reached ✓
                </Text>
              ) : (
                <Text style={card.progressPts}>
                  {points} / {next.pointsRequired} pts
                </Text>
              )}
              <Text style={card.nextLabel}>
                {nextRequirementMet ? 'Unlock coming soon 🔒' : `Next: 🔒 ${next.name}`}
              </Text>
            </>
          ) : (
            <Text style={card.progressPts}>{points} pts</Text>
          )}
        </View>

        {/* Next-stage benefit preview (Phase 2/3 only — compact text) */}
        {currentPhase >= 2 && next && !nextRequirementMet && (
          <View style={card.nextPreview}>
            {next.benefits.slice(0, 2).map((b, i) => (
              <Text key={i} style={card.nextPreviewItem} numberOfLines={1}>
                · {b.title}
              </Text>
            ))}
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const card = StyleSheet.create({
  wrapper: {
    borderRadius: radius.xl,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  body: {
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: spacing.sm,
  },
  stageLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flex: 1 },
  stageIcon: { fontSize: 18 },
  stageName: { ...typography.h4, color: '#FFFFFF' },
  infoBtn: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center', marginLeft: 4,
  },
  infoBtnOpen: { backgroundColor: 'rgba(255,255,255,0.28)' },
  infoBtnText: { fontSize: 11, color: '#FFFFFF' },
  points: { ...typography.bodyMed, color: '#FFFFFF' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.sm },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing.sm, paddingVertical: 3,
    borderRadius: radius.full, gap: 3,
  },
  chipIcon: { fontSize: 10 },
  chipText: { ...typography.captionMed, color: 'rgba(255,255,255,0.9)', maxWidth: 100 },
  chipMore: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.full,
  },
  chipMoreText: { ...typography.captionMed, color: 'rgba(255,255,255,0.65)' },
  accordionDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: spacing.xs },
  accordionRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.xs },
  accordionIcon: {
    width: 26, height: 26, borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center',
  },
  accordionTitle: { ...typography.smallMed, color: '#FFFFFF' },
  accordionDesc: { ...typography.caption, color: 'rgba(255,255,255,0.65)', marginTop: 1 },
  progressBar: { marginBottom: spacing.xs },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressPts: { ...typography.caption, color: 'rgba(255,255,255,0.8)', flex: 1 },
  nextLabel: { ...typography.caption, color: 'rgba(255,255,255,0.75)' },
  nextPreview: {
    marginTop: spacing.sm, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)',
    paddingTop: spacing.xs,
  },
  nextPreviewItem: { ...typography.caption, color: 'rgba(255,255,255,0.6)', marginBottom: 2 },
});
