// All four stages used across Phase 1–3 of Experiment 1: Value Clarity.
// Which stages are unlockable at any given time is determined by the current phase
// in JourneyContext — NOT by flags on this data.
export const STAGES = [
  {
    id: 1,
    name: 'Member',
    icon: '🌟',
    pointsRequired: 100,
    color: '#1E56C8',
    gradientColors: ['#1E56C8', '#1A4FCE'],
    description: 'You\'re part of the community. Your voice matters here.',
    unlockMessage: 'You\'re now a Member of the Member\'s Mark Community.',
    comingSoonMessage: null, // Member is always first — no coming-soon state
    benefits: [
      { icon: '👥', title: 'Community Participation', description: 'Share your voice in the Member\'s Mark community' },
      { icon: '📧', title: 'Insider Newsletter', description: 'Monthly community insights and early findings' },
      { icon: '⚡', title: 'Early Survey Access', description: 'First access to new surveys before the general pool' },
    ],
  },
  {
    id: 2,
    name: 'Explorer',
    icon: '🔭',
    pointsRequired: 300,
    color: '#8B5CF6',
    gradientColors: ['#8B5CF6', '#7C3AED'],
    description: 'Deeper involvement and more exclusive access.',
    unlockMessage: 'You\'ve unlocked Explorer and everything that comes with it.',
    comingSoonMessage: 'Explorer is coming soon. Your progress is already counting.',
    benefits: [
      { icon: '🌟', title: 'Exclusive Opportunities', description: 'Access to exclusive community programs and activities' },
      { icon: '🎯', title: 'Priority Activities', description: 'First pick for focus groups and special surveys' },
      { icon: '🔬', title: 'Early Product Access', description: 'Try new Member\'s Mark products before anyone else' },
    ],
  },
  {
    id: 3,
    name: 'Contributor',
    icon: '✨',
    pointsRequired: 600,
    color: '#F59E0B',
    gradientColors: ['#F59E0B', '#D97706'],
    description: 'Your insights are making a real difference.',
    unlockMessage: 'You\'ve unlocked Contributor. Your influence in the community is growing.',
    comingSoonMessage: 'Contributor is coming soon. Keep participating to unlock it.',
    benefits: [
      { icon: '📝', title: 'Product Review Access', description: 'Review new Member\'s Mark products before they launch' },
      { icon: '💰', title: '$5 Member Reward', description: 'Redeemable on your next Sam\'s Club purchase' },
      { icon: '📣', title: 'Priority Invites', description: 'First invited to community events and activities' },
    ],
  },
  {
    id: 4,
    name: 'Advocate',
    icon: '🏆',
    pointsRequired: 1000,
    color: '#10B981',
    gradientColors: ['#10B981', '#059669'],
    description: 'A trusted voice shaping products and the community.',
    unlockMessage: 'You\'ve unlocked Advocate. You\'re among our most trusted members.',
    comingSoonMessage: 'Advocate is coming soon. Continue earning points to unlock it.',
    benefits: [
      { icon: '🎯', title: 'Focus Group Invitations', description: 'Exclusive invites to small-group product sessions' },
      { icon: '💰', title: '$15 Member Reward', description: 'Redeemable on your next Sam\'s Club purchase' },
      { icon: '🔬', title: 'Early Market Research', description: 'Shape products before they\'re finalized' },
    ],
  },
];

// Existing onboarding surveys — these match today's product exactly.
// Two surveys. Do not redesign these. Do not add personalization.
export const ONBOARDING_SURVEYS = [
  {
    id: 'ob-1',
    title: 'Onboarding Survey 1',
    description: 'Help us understand how you\'d like to participate in the Member\'s Mark community.',
    estimatedMinutes: 5,
    rewardPoints: 75,
    emoji: '📋',
  },
  {
    id: 'ob-2',
    title: 'Onboarding Survey 2',
    description: 'Tell us about your relationship with Member\'s Mark products.',
    estimatedMinutes: 5,
    rewardPoints: 75,
    emoji: '📋',
  },
];

// Community activities shown on the Home screen — existing research surveys and content.
// These represent the normal post-onboarding experience members have today.
// Each earns points. Completing enough crosses progression thresholds.
export const COMMUNITY_ACTIVITIES = [
  {
    id: 'act-1',
    title: 'See how members help shape products',
    description: 'Follow feedback from idea to club.',
    points: 75,
    endDate: 'Aug 25',
    bgColor: '#7C6B3E',
    emoji: '🛍️',
    type: 'article',
  },
  {
    id: 'act-2',
    title: 'Holiday Shopping Preview',
    description: 'Help shape our holiday product lineup.',
    points: 75,
    endDate: 'Sep 10',
    bgColor: '#1C2951',
    emoji: '🎄',
    type: 'survey',
  },
  {
    id: 'act-3',
    title: 'Sam\'s Club App Experience',
    description: 'Rate your recent experience with the mobile app.',
    points: 50,
    endDate: 'Sep 15',
    bgColor: '#2C4A2A',
    emoji: '📱',
    type: 'survey',
  },
  {
    id: 'act-4',
    title: 'Product Packaging Feedback',
    description: 'Help us design better packaging for Member\'s Mark.',
    points: 50,
    endDate: 'Sep 20',
    bgColor: '#4A2C2A',
    emoji: '📦',
    type: 'survey',
  },
];

export const EXPERIMENT_HYPOTHESIS =
  'Members are more likely to continue participating when reward points have a clear purpose through progression and benefits: members understand what they have unlocked, what they are progressing toward, and what they can unlock next.';

// Three-phase experiment roadmap for Experiment 1: Value Clarity.
// All phases validate the same hypothesis — they are not separate experiments.
export const EXPERIMENT_ROADMAP = [
  {
    id: 'phase1',
    type: 'phase',
    icon: '🚀',
    label: 'Phase 1',
    title: 'Establish the First Progression Loop',
    goal: 'Test whether making reward points meaningful through the first stage unlock makes members more likely to continue participating.',
    items: [
      'Existing onboarding surveys remain unchanged',
      'Member unlocks after completing both onboarding surveys',
      'Celebrate Member unlock: communicate stage, points earned, and benefits',
      'Introduce locked Explorer with benefits preview',
      'Compact rewards header added to Community Home: stage + points + progress + next stage',
    ],
  },
  {
    id: 'phase2',
    type: 'phase',
    icon: '⚡',
    label: 'Phase 2',
    title: 'Extend the Progression Loop',
    goal: 'Prove the loop can repeat. Explorer now unlocks through continued participation.',
    items: [
      'Explorer unlocks when the required points threshold is reached',
      'Celebrate Explorer unlock with benefits revealed',
      'Introduce next stage as locked with benefits preview',
      'Community Home rewards header adds current benefits and next-stage preview',
    ],
  },
  {
    id: 'phase3',
    type: 'phase',
    icon: '🏆',
    label: 'Phase 3',
    title: 'Establish Rewards v1',
    goal: 'Demonstrate repeatable progression. The mechanic now works across multiple stages — this is the Rewards v1 skeleton.',
    items: [
      'Next stage (Contributor) unlocks through continued participation',
      'Same progression pattern repeating: earn → unlock → benefit → progress',
      'Following stage introduced as locked with benefits preview',
      'Integrate rewards with winning onboarding experience from the separate onboarding experiment',
    ],
    integrationNote: 'The temporary rewards education in the join flow will be replaced by the validated onboarding experience from the separate onboarding experiment. This integration is planned — not designed — until that experiment concludes.',
  },
];

export const ONBOARDING_SLIDES = [
  {
    id: 1,
    emoji: '⭐',
    title: 'Earn Reward\nPoints',
    body: 'Every survey you complete earns reward points. Points count toward your next stage and unlock real benefits.',
  },
  {
    id: 2,
    emoji: '🌟',
    title: 'Unlock\nMember',
    body: 'Complete your first surveys to unlock Member — your first stage in the community — and start receiving benefits right away.',
    showTwoStages: true,
  },
  {
    id: 3,
    emoji: '🔭',
    title: 'Explorer is\nAhead',
    body: 'After Member, Explorer is your next stage. It\'s coming soon — and your points are already building toward it.',
    isLast: true,
  },
];
