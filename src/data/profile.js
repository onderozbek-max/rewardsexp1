// Mock member data
export const MOCK_MEMBER = {
  name: 'Alex Martinez',
  firstName: 'Alex',
  initials: 'AM',
  memberSince: 'January 2024',
  memberNumber: 'MM-2024-00847',
};

// Historical points data — reflects today's experience (no stage context)
// This is intentionally sparse and context-free to contrast with the new experience.
export const POINTS_HISTORY = [
  { id: 1, earnedAt: 'Nov 8, 2024', label: 'Survey Completed', points: 50 },
  { id: 2, earnedAt: 'Oct 22, 2024', label: 'Survey Completed', points: 50 },
  { id: 3, earnedAt: 'Oct 15, 2024', label: 'Survey Completed', points: 50 },
  { id: 4, earnedAt: 'Sep 30, 2024', label: 'Survey Completed', points: 25 },
  { id: 5, earnedAt: 'Sep 14, 2024', label: 'Survey Completed', points: 50 },
  { id: 6, earnedAt: 'Aug 28, 2024', label: 'Survey Completed', points: 50 },
  { id: 7, earnedAt: 'Aug 10, 2024', label: 'Survey Completed', points: 25 },
  { id: 8, earnedAt: 'Jul 25, 2024', label: 'Survey Completed', points: 50 },
  { id: 9, earnedAt: 'Jul 8, 2024', label: 'Survey Completed', points: 50 },
  { id: 10, earnedAt: 'Jun 19, 2024', label: 'Survey Completed', points: 50 },
  { id: 11, earnedAt: 'Jun 3, 2024', label: 'Survey Completed', points: 25 },
  { id: 12, earnedAt: 'May 21, 2024', label: 'Survey Completed', points: 50 },
];

export const LEGACY_TOTAL_POINTS = POINTS_HISTORY.reduce((sum, item) => sum + item.points, 0);
