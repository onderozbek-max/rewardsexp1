/**
 * Compact rewards progress header — sits inside Community Home, not replacing it.
 *
 * MVP  (control off): Stage + points + progress bar + "Next: 🔒 Contributor" — NO benefits.
 * FF1+ (showBenefitsHome): Adds earned benefit chips with ⓘ accordion + next-stage preview.
 *
 * Rules:
 * - Returns null in control mode (caller also guards, but safety net here).
 * - No bar shown when nextStage.thresholdTBD (Influencer/Co-creator — TBD threshold).
 * - Influencer/Co-creator shown as "Future direction" with no numeric threshold.
 * - "Spec: compact status/progress component, not an entire rewards dashboard."
 */
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ProgressBar from './ProgressBar';
import { useJourney } from '../context/JourneyContext';
import { colors, typography, spacing, radius, shadows } from '../theme';

const MAX_CHIPS = 2;

export default function JourneyCard() {
  const {
    currentPhase,
    points,
    currentStage,
    nextStage,
    pointsToNextStage,
    progressPercent,
    showBenefitsHome,
    phaseConfig,
    lastDelta,
    clearLastDelta,
  } = useJourney();

  const [showAccordion, setShowAccordion] = useState(false);
  const accordionAnim = useRef(new Animated.Value(0)).current;

  // FF2: animate delta badge when a new delta arrives
  const deltaOpacity = useRef(new Animated.Value(0)).current;
  const deltaSlide = useRef(new Animated.Value(0)).current;
  const enhancedFeedback = phaseConfig?.enhancedFeedback === true;

  useEffect(() => {
    if (!enhancedFeedback || lastDelta <= 0) return;
    // Slide up and fade in, then fade out
    deltaSlide.setValue(0);
    deltaOpacity.setValue(0);
    Animated.sequence([
      Animated.parallel([
        Animated.timing(deltaOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(deltaSlide, { toValue: -8, duration: 280, useNativeDriver: true }),
      ]),
      Animated.delay(1200),
      Animated.timing(deltaOpacity, { toValue: 0, duration: 350, useNativeDriver: true }),
    ]).start(() => clearLastDelta());
  }, [lastDelta, enhancedFeedback]);

  // Safety: never render in control mode or before a stage is established.
  if (currentPhase === 'control' || !currentStage) return null;

  const nextIsTBD = nextStage?.thresholdTBD === true;
  const showBenefitLayer = showBenefitsHome && (currentStage.benefits?.length ?? 0) > 0;
  const visibleBenefits = currentStage.benefits?.slice(0, MAX_CHIPS) ?? [];
  const overflowCount = (currentStage.benefits?.length ?? 0) - MAX_CHIPS;

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
        {/* Row 1: Stage icon + name + optional ⓘ + points */}
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
          <Text style={card.points}>{points} pts</Text>
        </View>

        {/* Benefit chips (FF1+, collapsed row) */}
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
                <Text style={card.chipMoreText}>+{overflowCount} more</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Benefit accordion (FF1+, expanded) */}
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

        {/* Progress bar — hidden when next stage threshold is TBD */}
        {!nextIsTBD && (
          <ProgressBar
            progress={progressPercent}
            height={5}
            trackColor="rgba(255,255,255,0.22)"
            fillColor="#FFFFFF"
            style={card.progressBar}
          />
        )}

        {/* FF2: delta badge — shows "+N pts" inline after activity completion */}
        {enhancedFeedback && lastDelta > 0 && (
          <Animated.View
            style={[card.deltaBadge, { opacity: deltaOpacity, transform: [{ translateY: deltaSlide }] }]}
            pointerEvents="none"
          >
            <Text style={card.deltaText}>
              +{lastDelta} pts · now {points}/{nextStage?.pointsRequired ?? '—'}
            </Text>
          </Animated.View>
        )}

        {/* Progress labels */}
        <View style={card.progressRow}>
          {nextStage ? (
            nextIsTBD ? (
              // Contributor is terminal for Exp 1 — show Influencer as future direction
              <Text style={card.progressPts}>
                {currentStage.name} · {currentStage.meaning}
              </Text>
            ) : (
              // Explorer → Contributor: show numeric progress
              <Text style={card.progressPts}>
                {points} / {nextStage.pointsRequired} pts
              </Text>
            )
          ) : (
            <Text style={card.progressPts}>{points} pts</Text>
          )}

          {nextStage && (
            <Text style={card.nextLabel}>
              {nextIsTBD
                ? `Future: ${nextStage.icon} ${nextStage.name}`
                : `Next: 🔒 ${nextStage.name}`}
            </Text>
          )}
        </View>

        {/* Next-stage benefit preview (FF1+ only, not shown when TBD) */}
        {showBenefitsHome && nextStage && !nextIsTBD && nextStage.benefits && (
          <View style={card.nextPreview}>
            {nextStage.benefits.slice(0, 2).map((b, i) => (
              <Text key={i} style={card.nextPreviewItem} numberOfLines={1}>
                · {b.title}
              </Text>
            ))}
          </View>
        )}

        {/* Future direction note when at Contributor (next = Influencer TBD) */}
        {showBenefitsHome && nextStage && nextIsTBD && (
          <View style={card.futureNote}>
            <Text style={card.futureNoteText}>
              🏆 {nextStage.name} · Future direction — threshold under calibration
            </Text>
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
  deltaBadge: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  deltaText: { ...typography.captionMed, color: '#FFFFFF', fontSize: 11 },
  futureNote: {
    marginTop: spacing.sm, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.12)',
    paddingTop: spacing.xs,
  },
  futureNoteText: { ...typography.caption, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' },
});
