/**
 * JourneyContext — Experiment 1 state machine.
 *
 * Tier unlock logic:
 *   Member (0)      → hasOnboarded = true (set when join flow completes)
 *   Explorer (1)    → both onboarding survey IDs in completedSurveyIds
 *   Contributor (2) → explorerUnlocked AND points >= 200 AND phase permits
 *   Influencer (3)  → NEVER auto-unlocks (thresholdTBD: true — excluded from all math)
 *   Co-creator (4)  → NEVER auto-unlocks (thresholdTBD: true — excluded from all math)
 *
 * Demo phase config:
 *   control → no rewards layer shown (baseline Community experience)
 *   mvp     → full progression: Explorer at 120/200 pts toward Contributor
 *   ff1     → same + persistent benefit visibility on Home
 *   ff2     → same + enhanced activity-completion feedback
 *
 * Onboarding surveys give 0 progression points toward Contributor.
 * PROTOTYPE ASSUMPTION — whether pre-Explorer points count is UNRESOLVED.
 */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { STAGES } from '../data/journey';

const JourneyContext = createContext(null);

// ── Phase configuration ────────────────────────────────────────────────────────
// maxUnlockableId: highest stage ID that can unlock in this phase.
//   -1 = control (no rewards progression shown)
//    2 = Contributor is the ceiling for Experiment 1 MVP/FF1/FF2
// demoPoints: progression points pre-loaded when switchPhase() is called.
//   Represents an Explorer who has been active for a while (120/200 toward Contributor).
// showBenefitsHome: whether the Home rewards card displays earned benefits.
const PHASE_CONFIG = {
  control: { maxUnlockableId: -1, demoPoints: 0,   showBenefitsHome: false, label: 'Control' },
  mvp:     { maxUnlockableId: 2,  demoPoints: 120,  showBenefitsHome: false, label: 'MVP'     },
  ff1:     { maxUnlockableId: 2,  demoPoints: 120,  showBenefitsHome: true,  label: 'FF1'     },
  ff2:     { maxUnlockableId: 2,  demoPoints: 120,  showBenefitsHome: true,  enhancedFeedback: true, label: 'FF2' },
};

export function JourneyProvider({ children }) {
  const [currentPhase, setCurrentPhase] = useState('mvp');
  const [points, setPoints] = useState(0);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [completedSurveyIds, setCompletedSurveyIds] = useState([]);
  // Transition tracking: keyed `phase${p}-stage${id}` — isolated per phase.
  const [shownTransitions, setShownTransitions] = useState(new Set());
  // FF2: tracks the most recent progression-point delta for enhanced completion feedback.
  const [lastDelta, setLastDelta] = useState(0);

  const phaseConfig = PHASE_CONFIG[currentPhase] ?? PHASE_CONFIG.mvp;
  const maxUnlockableId = phaseConfig.maxUnlockableId;
  const showBenefitsHome = phaseConfig.showBenefitsHome;

  // ── Unlock derivations ───────────────────────────────────────────────────────

  // Explorer: both onboarding surveys complete.
  const explorerUnlocked =
    completedSurveyIds.includes('ob-1') && completedSurveyIds.includes('ob-2');

  // Resolve current stage ID.
  // Guards: Influencer/Co-creator (thresholdTBD: true) are never considered here.
  const currentStageId = (() => {
    if (maxUnlockableId < 0) return null;    // Control: no tier shown
    if (!explorerUnlocked) return 0;          // Member (joined, not yet onboarded)
    // Contributor check (id = 2, pointsRequired = 200, only numeric threshold in Exp 1)
    if (maxUnlockableId >= 2) {
      const c = STAGES.find((s) => s.id === 2);
      if (c && typeof c.pointsRequired === 'number' && points >= c.pointsRequired) return 2;
    }
    return 1;                                  // Explorer (default post-onboarding)
  })();

  const currentStage = currentStageId !== null
    ? STAGES.find((s) => s.id === currentStageId) ?? null
    : null;

  // Next stage: what the member is progressing toward.
  // Contributor is terminal for Exp 1 — Influencer shown as future direction (no bar).
  const nextStage = (() => {
    if (maxUnlockableId < 0 || currentStageId === null) return null;
    if (currentStageId === 1 && maxUnlockableId >= 2) {
      return STAGES.find((s) => s.id === 2) ?? null;   // Contributor (has numeric threshold)
    }
    if (currentStageId === 2) {
      return STAGES.find((s) => s.id === 3) ?? null;   // Influencer (TBD — no bar rendered)
    }
    return null;
  })();

  // Progress toward next stage.
  // Returns 0 (no bar) when nextStage is TBD — caller must check nextStage.thresholdTBD.
  const progressPercent = (() => {
    if (!nextStage || nextStage.thresholdTBD) return currentStageId === 2 ? 1 : 0;
    return Math.min(points / nextStage.pointsRequired, 1);
  })();

  const pointsToNextStage = (() => {
    if (!nextStage || nextStage.thresholdTBD) return 0;
    return Math.max(nextStage.pointsRequired - points, 0);
  })();

  // ── Phase switching (demo control) ──────────────────────────────────────────
  const switchPhase = useCallback((phase) => {
    const config = PHASE_CONFIG[phase];
    if (!config) return;
    setCurrentPhase(phase);
    setHasOnboarded(true);
    setPoints(config.demoPoints);
    // Explorer pre-unlocked in all demo states (onboarding already complete in demo).
    setCompletedSurveyIds(['ob-1', 'ob-2']);

    // Pre-mark any point-based stages already crossed at demoPoints — prevents auto-fire.
    // Influencer/Co-creator (thresholdTBD: true) are never marked — they never fire.
    const preShown = new Set(
      STAGES
        .filter(
          (s) =>
            typeof s.pointsRequired === 'number' &&
            !s.thresholdTBD &&
            s.pointsRequired <= config.demoPoints
        )
        .map((s) => `phase${phase}-stage${s.id}`)
    );
    setShownTransitions(preShown);
  }, []);

  // ── Transition tracking ──────────────────────────────────────────────────────
  const markTransitionShown = useCallback((stageId) => {
    setShownTransitions((prev) => new Set([...prev, `phase${currentPhase}-stage${stageId}`]));
  }, [currentPhase]);

  const hasTransitionBeenShown = useCallback(
    (stageId) => shownTransitions.has(`phase${currentPhase}-stage${stageId}`),
    [shownTransitions, currentPhase]
  );

  // ── Standard actions ─────────────────────────────────────────────────────────
  const completeSurvey = useCallback((surveyId, progressionPoints = 0) => {
    setCompletedSurveyIds((prev) => {
      if (prev.includes(surveyId)) return prev;
      return [...prev, surveyId];
    });
    if (progressionPoints > 0) {
      setPoints((prev) => prev + progressionPoints);
      setLastDelta(progressionPoints); // FF2: expose delta for enhanced completion feedback
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
        // Phase
        currentPhase,
        switchPhase,
        phaseConfig,
        maxUnlockableId,
        showBenefitsHome,          // true in ff1/ff2 — gates benefit display on Home
        // State
        points,
        setPoints,
        hasOnboarded,
        completedSurveyIds,
        explorerUnlocked,
        // Derived tier data
        currentStage,              // null in control mode or before joining
        nextStage,                 // null in control; Influencer when at Contributor (TBD, no bar)
        progressPercent,           // 0 when nextStage.thresholdTBD; 1 when at/past Contributor
        pointsToNextStage,
        // Transitions
        shownTransitions,
        markTransitionShown,
        hasTransitionBeenShown,
        // FF2 enhanced feedback
        lastDelta,
        clearLastDelta: () => setLastDelta(0),
        // Actions
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
