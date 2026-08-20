import React, { createContext, useContext, useState, useCallback } from 'react';
import { STAGES } from '../data/journey';

const JourneyContext = createContext(null);

// Phase configuration.
// 'control' = current experience baseline (no rewards progression shown).
// 1–3 = treatment phases.
const PHASE_CONFIG = {
  control: { maxUnlockableId: 0, demoPoints: 350 }, // Points exist but are meaningless
  1: { maxUnlockableId: 1, demoPoints: 150 },        // Member unlocked, Explorer locked
  2: { maxUnlockableId: 2, demoPoints: 350 },        // Explorer unlocked, Contributor locked
  3: { maxUnlockableId: 3, demoPoints: 650 },        // Contributor unlocked, Advocate locked
};

export function JourneyProvider({ children }) {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [points, setPoints] = useState(0);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [completedSurveyIds, setCompletedSurveyIds] = useState([]);
  // Transition tracking keyed `phase${p}-stage${id}` to isolate across phases.
  const [shownTransitions, setShownTransitions] = useState(new Set());

  const maxUnlockableId = PHASE_CONFIG[currentPhase]?.maxUnlockableId ?? 0;

  // Current stage: highest stage at or below maxUnlockableId with enough points.
  // In control mode (maxUnlockableId = 0): always null — no stages shown.
  const currentStage = STAGES
    .filter((s) => s.id <= maxUnlockableId)
    .reduce((found, s) => (points >= s.pointsRequired ? s : found), null);

  // Next stage: the stage just beyond maxUnlockableId (always "coming soon" this phase).
  // In control mode: null — no next stage to show.
  const nextStage = maxUnlockableId > 0
    ? (STAGES.find((s) => s.id === maxUnlockableId + 1) ?? null)
    : null;

  const pointsToNextStage = nextStage ? Math.max(nextStage.pointsRequired - points, 0) : 0;
  const progressPercent = (() => {
    if (!nextStage) return maxUnlockableId > 0 ? 1 : 0;
    const start = currentStage ? currentStage.pointsRequired : 0;
    const end = nextStage.pointsRequired;
    return Math.min(Math.max((points - start) / (end - start), 0), 1);
  })();

  // True when the member has earned enough points to reach the next stage threshold,
  // but that stage cannot unlock this phase. Used for "requirement reached" messaging.
  const nextRequirementMet = Boolean(
    nextStage && points >= nextStage.pointsRequired && nextStage.id > maxUnlockableId
  );

  // ── Phase switching ──────────────────────────────────────────────────────────
  const switchPhase = useCallback((phase) => {
    const config = PHASE_CONFIG[phase];
    if (!config) return;
    setCurrentPhase(phase);
    setPoints(config.demoPoints);
    setHasOnboarded(true);
    setCompletedSurveyIds([]);

    if (phase === 'control') {
      // Pre-mark ALL thresholds crossed at demo state — prevents any transition screens.
      const preShown = new Set(
        STAGES
          .filter((s) => s.id > 1 && s.pointsRequired <= config.demoPoints)
          .map((s) => `phase${phase}-stage${s.id}`)
      );
      setShownTransitions(preShown);
    } else {
      // Pre-mark stages BELOW the top of this phase.
      // The top stage's transition fires naturally, showing the unlock/coming-soon moment.
      const preShown = new Set(
        STAGES
          .filter((s) => s.id > 1 && s.id < config.maxUnlockableId)
          .map((s) => `phase${phase}-stage${s.id}`)
      );
      setShownTransitions(preShown);
    }
  }, []);

  // ── Transition tracking ──────────────────────────────────────────────────────
  const markTransitionShown = useCallback((stageId) => {
    setShownTransitions((prev) => new Set([...prev, `phase${currentPhase}-stage${stageId}`]));
  }, [currentPhase]);

  const hasTransitionBeenShown = useCallback((stageId) => {
    return shownTransitions.has(`phase${currentPhase}-stage${stageId}`);
  }, [shownTransitions, currentPhase]);

  // ── Standard actions ─────────────────────────────────────────────────────────
  const completeSurvey = useCallback((surveyId, pointsEarned) => {
    setCompletedSurveyIds((prev) => {
      if (prev.includes(surveyId)) return prev;
      return [...prev, surveyId];
    });
    if (pointsEarned > 0) {
      setPoints((prev) => prev + pointsEarned);
    }
  }, []);

  const completeOnboarding = useCallback(() => {
    setHasOnboarded(true);
  }, []);

  const isSurveyCompleted = useCallback(
    (id) => completedSurveyIds.includes(id),
    [completedSurveyIds]
  );

  return (
    <JourneyContext.Provider
      value={{
        currentPhase,
        switchPhase,
        maxUnlockableId,
        points,
        hasOnboarded,
        completedSurveyIds,
        currentStage,           // null in control mode or before Member threshold
        nextStage,              // null in control mode
        pointsToNextStage,
        progressPercent,
        nextRequirementMet,     // true when past next threshold but stage locked this phase
        shownTransitions,
        markTransitionShown,
        hasTransitionBeenShown,
        completeSurvey,
        completeOnboarding,
        isSurveyCompleted,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error('useJourney must be used within JourneyProvider');
  return ctx;
}
