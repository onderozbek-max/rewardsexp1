/**
 * Experiment 1 · Tier model, point economy, and roadmap data.
 *
 * Tier model (Experiment 1):
 *   Tier 0 — Member     → earned by joining (no point threshold)
 *   Tier 1 — Explorer   → earned by completing required onboarding surveys
 *   Tier 2 — Contributor→ earned by reaching 200 progression points (MVP target)
 *   Tier 3 — Influencer → threshold TBD — never displayed as a reachable number
 *   Tier 4 — Co-creator → threshold TBD — never displayed as a reachable number
 *
 * Point economy (P-class):
 *   P2 Complex Product Research = 50 pts
 *   P3 Shorter Research         = 30 pts
 *   P4/P5                       = TBD (provisional, not shown to members)
 *   P0/P1 IHUTs                 = 0 progression points (product is the reward)
 *
 * Experiment 1 audience: new members only.
 * Permanent-stage-unlock is Experiment 1 behaviour;
 * long-term model may include point depreciation (see EXPERIMENT_ROADMAP).
 */

// ── Tier definitions ───────────────────────────────────────────────────────────
export const STAGES = [
  {
    id: 0,
    name: 'Member',
    icon: '⭐',
    meaning: 'BELONG',
    qualifier: 'join',          // earned by completing the join flow
    pointsRequired: null,       // not point-gated
    thresholdTBD: false,
    color: '#64748B',
    gradientColors: ['#475569', '#334155'],
    description: 'You\'ve joined the Member\'s Mark Community.',
    unlockMessage: 'You\'ve joined the Member\'s Mark Community.',
    benefits: [
      {
        icon: '👥',
        title: 'Community Membership',
        description: 'You\'re now part of the Member\'s Mark Community.',
      },
      {
        icon: '⭐',
        title: 'Member Status',
        description: 'Your Member status is active and tied to your participation.',
      },
    ],
  },
  {
    id: 1,
    name: 'Explorer',
    icon: '🔭',
    meaning: 'PARTICIPATE',
    qualifier: 'onboarding',    // earned by completing both onboarding surveys
    pointsRequired: null,       // not point-gated — survey-completion gated
    thresholdTBD: false,
    color: '#1E56C8',
    gradientColors: ['#1E56C8', '#1A4FCE'],
    description: 'You\'ve completed onboarding and can fully participate in the Community.',
    unlockMessage: 'You\'ve completed onboarding and unlocked Explorer.',
    benefits: [
      {
        icon: '📋',
        title: 'Product Research Activities',
        description: 'Participate in product research surveys, studies, and feedback sessions.',
      },
      {
        icon: '📣',
        title: 'Community Content & Posts',
        description: 'Access and contribute to Community posts and content.',
      },
      {
        icon: '🔭',
        title: 'Explorer Recognition',
        description: 'Your Explorer status recognises your commitment to the Community.',
      },
    ],
  },
  {
    id: 2,
    name: 'Contributor',
    icon: '✨',
    meaning: 'ACCESS',
    qualifier: 'points',        // earned by reaching 200 progression points
    pointsRequired: 200,        // Experiment 1 target threshold
    thresholdTBD: false,
    color: '#8B5CF6',
    gradientColors: ['#8B5CF6', '#7C3AED'],
    description: 'Your sustained participation has made a real impact.',
    unlockMessage: 'Your participation has earned you Contributor status.',
    benefits: [
      {
        icon: '✨',
        title: 'Contributor Badge & Recognition',
        description: 'Your Contributor status reflects meaningful, repeat participation.',
      },
      {
        icon: '🌟',
        title: 'Additional Community Opportunities',
        description: 'Access to additional Community activities and programs as they launch.',
      },
      {
        icon: '📱',
        title: 'Early Product Updates',
        description: 'Stay-in-the-know experiences with early product insights where applicable.',
      },
    ],
  },
  {
    id: 3,
    name: 'Influencer',
    icon: '🏆',
    meaning: 'INFLUENCE',
    qualifier: 'future',        // planned for a future experiment
    pointsRequired: null,       // threshold under calibration — DO NOT display a number
    thresholdTBD: true,
    color: '#F59E0B',
    gradientColors: ['#F59E0B', '#D97706'],
    description: 'Sustained, meaningful contribution over time.',
    futureDirectionBenefits: [
      'More consequential research opportunities',
      'Greater recognition and visibility in the Community',
      'Deeper insight into how member feedback shapes products',
      'Potentially higher-value Community opportunities',
    ],
  },
  {
    id: 4,
    name: 'Co-creator',
    icon: '🚀',
    meaning: 'CO-CREATE',
    qualifier: 'future',
    pointsRequired: null,       // threshold under calibration — DO NOT display a number
    thresholdTBD: true,
    color: '#10B981',
    gradientColors: ['#10B981', '#059669'],
    description: 'Among the Community\'s most deeply engaged contributors.',
    futureDirectionBenefits: [
      'Deepest co-creation opportunities in the Community',
      'Earlier involvement in Member\'s Mark product development',
      'Opportunities to shape products and experiences directly',
      'Highly differentiated recognition and access',
    ],
  },
];

// ── Onboarding surveys ─────────────────────────────────────────────────────────
// Completing BOTH surveys → Explorer unlock (survey-completion gate, not points-gate).
// PROTOTYPE ASSUMPTION: onboarding surveys award 0 progression points toward Contributor.
// Whether pre-Explorer activity points count toward Contributor is UNRESOLVED (see §32).
export const ONBOARDING_SURVEYS = [
  {
    id: 'ob-1',
    title: 'Onboarding Survey 1',
    description: 'Help us understand how you\'d like to participate in the Member\'s Mark Community.',
    estimatedMinutes: 5,
    rewardPoints: 0,            // 0 progression pts — Explorer is survey-gated, not point-gated
    emoji: '📋',
  },
  {
    id: 'ob-2',
    title: 'Onboarding Survey 2',
    description: 'Tell us about your relationship with Member\'s Mark products.',
    estimatedMinutes: 5,
    rewardPoints: 0,
    emoji: '📋',
  },
];

// ── Community activities (post-onboarding) ─────────────────────────────────────
// These earn progression points toward Contributor (200 pt threshold).
// P2 Complex Research = 50 pts  |  P3 Shorter Research = 30 pts
// Demo start: 120 pts (Explorer). Need 80 more to reach Contributor.
// Path A: act-1 (+50) → 170, then act-3 (+30) → 200 ✓
// Path B: act-1 (+50) → 170, then act-2 (+50) → 220 ✓
export const COMMUNITY_ACTIVITIES = [
  {
    id: 'act-1',
    title: 'How do members shape products?',
    description: 'Follow feedback from idea to club shelf — share your perspective.',
    points: 50,                 // P2 — Complex Product Research
    pointClass: 'P2',
    endDate: 'Aug 25',
    bgColor: '#7C6B3E',
    emoji: '🛍️',
    type: 'article',
  },
  {
    id: 'act-2',
    title: 'Holiday Shopping Preview',
    description: 'Help shape our holiday product lineup before it\'s finalised.',
    points: 50,                 // P2 — Complex Product Research
    pointClass: 'P2',
    endDate: 'Sep 10',
    bgColor: '#1C2951',
    emoji: '🎄',
    type: 'survey',
  },
  {
    id: 'act-3',
    title: 'Sam\'s Club App Experience',
    description: 'Rate your recent experience with the Sam\'s Club mobile app.',
    points: 30,                 // P3 — Shorter Research
    pointClass: 'P3',
    endDate: 'Sep 15',
    bgColor: '#2C4A2A',
    emoji: '📱',
    type: 'survey',
  },
  {
    id: 'act-4',
    title: 'Product Packaging Feedback',
    description: 'Help design better packaging for Member\'s Mark products.',
    points: 30,                 // P3 — Shorter Research
    pointClass: 'P3',
    endDate: 'Sep 20',
    bgColor: '#4A2C2A',
    emoji: '📦',
    type: 'survey',
  },
];

// ── Experiment hypothesis ──────────────────────────────────────────────────────
export const EXPERIMENT_HYPOTHESIS =
  'New members who can see a clear, desirable destination — Contributor at 200 points — ' +
  'will participate more consistently than members who see only open activities with no ' +
  'visible progression or reward for sustained engagement.';

// ── Experiment roadmap (5-bucket IA) ──────────────────────────────────────────
// Sections: NOW / NEXT / PLATFORM / MAJOR MILESTONES / FUTURE MODEL
// Depreciation is a FUTURE MAINTENANCE MODEL, not a milestone.
// No predetermined FF3/FF4 — iteration is evidence-driven.
export const EXPERIMENT_ROADMAP = [
  {
    id: 'now',
    bucket: 'NOW',
    bucketColor: '#1E56C8',
    label: 'Experiment 1 MVP',
    title: 'Establish the progression loop',
    learningQuestion:
      'Does giving Explorers a visible, desirable Contributor destination (200 pts) make them more likely to continue participating?',
    audience: 'New members only',
    items: [
      'Member unlock moment after joining (new)',
      'Explorer unlock after completing both onboarding surveys (new)',
      'Compact rewards header on Community Home: tier · points · progress toward Contributor',
      'Contributor unlock at 200 progression points (P2 = 50 pts, P3 = 30 pts)',
      'Contributor unlock celebration (benefits revealed)',
      'Influencer and Co-creator visible as future direction — no committed threshold',
    ],
    note: 'No predetermined FF3/FF4. Next iterations are dictated by what the data says.',
  },
  {
    id: 'next-ff1',
    bucket: 'NEXT',
    bucketColor: '#8B5CF6',
    label: 'Fast Follow 1',
    title: 'Make value persistent',
    learningQuestion:
      'Does showing members what they\'ve unlocked (persistent benefit visibility on Home) increase return visits and activity completion?',
    items: [
      'Benefit chips visible on the Home rewards header (Explorer and Contributor benefits)',
      'Expandable benefit accordion — "what you\'ve earned so far"',
      'Contextual next-stage benefit preview alongside progression',
    ],
    note: 'Gated on MVP results validating basic progression engagement.',
  },
  {
    id: 'next-ff2',
    bucket: 'NEXT',
    bucketColor: '#8B5CF6',
    label: 'Fast Follow 2',
    title: 'Reinforce progress',
    learningQuestion:
      'Does richer completion feedback (showing how much each activity moved the needle toward Contributor) increase the number of activities completed per session?',
    items: [
      'Enhanced activity-completion animation: +pts earned toward Contributor threshold',
      'Points summary after each completion (delta shown inline)',
      'Home card updates live after each activity completed',
    ],
    note: 'Gated on FF1 results.',
  },
  {
    id: 'next-evidence',
    bucket: 'NEXT',
    bucketColor: '#8B5CF6',
    label: 'Evidence-Driven Iteration',
    title: 'What comes after FF1 & FF2 is determined by the data',
    learningQuestion: null,
    items: [
      'No predetermined FF3 or FF4',
      'Post-FF2 direction shaped by: participation lift, return-visit rate, Contributor unlock rate',
      'Potential directions: Influencer threshold calibration, depreciation model, point-class expansion',
    ],
    note: 'This section exists to prevent roadmap theatre. Next steps are hypotheses, not commitments.',
  },
  {
    id: 'platform',
    bucket: 'PLATFORM',
    bucketColor: '#F59E0B',
    label: 'Platform Fast Follow',
    title: 'Admin Point Governance (not member-facing)',
    learningQuestion: null,
    items: [
      'Admin portal: map activity class (P2/P3/P4/P5) to point value without a code deploy',
      'Enable Product to calibrate the point economy as evidence accumulates',
      'Prerequisite for scaling Influencer and Co-creator thresholds responsibly',
    ],
    note: 'Internal tooling only. Members never see this. Enables faster iteration cycles.',
  },
  {
    id: 'milestone-1',
    bucket: 'MAJOR MILESTONES',
    bucketColor: '#10B981',
    label: 'Milestone 1',
    title: 'Unified New-Member Experience',
    learningQuestion: null,
    items: [
      'Rewards MVP + validated onboarding experience converge into a single new-member flow',
      'The current onboarding experiment (separate workstream) produces the winning join flow',
      'Rewards hooks integrated naturally into onboarding — no redundant education steps',
    ],
    note: 'Planned — not designed — until the separate onboarding experiment concludes.',
  },
  {
    id: 'milestone-2',
    bucket: 'MAJOR MILESTONES',
    bucketColor: '#10B981',
    label: 'Milestone 2',
    title: 'Existing-Member Expansion',
    learningQuestion: null,
    items: [
      'Experiment 1 validated for new members → assess readiness to expand to existing members',
      'Existing-member starting state (tier, points) determined by prior engagement data',
      'Separate experiment: does the same progression mechanic motivate already-active members?',
    ],
    note: 'Gated entirely on Experiment 1 results and Milestone 1 completion.',
  },
  {
    id: 'future-model',
    bucket: 'FUTURE MODEL',
    bucketColor: '#64748B',
    label: 'Future Direction',
    title: 'Influencer, Co-creator & point maintenance',
    learningQuestion: null,
    items: [
      'Influencer threshold: calibrated from Contributor participation data — TBD',
      'Co-creator threshold: calibrated from Influencer data — TBD',
      'Point depreciation / status maintenance: prevents passive accumulation of tier status',
      'Depreciation params (rate, floor, grace period) TBD — determined by what the data supports',
    ],
    note: 'Depreciation is a MAINTENANCE MODEL, not a milestone. It will be introduced gradually once thresholds are validated. No member-facing depreciation in Experiment 1.',
  },
];
