/**
 * Deterministic Demo Leaderboard Data
 * 
 * Used ONLY as a graceful fallback when Supabase network requests fail
 * or when the platform has insufficient real student profiles.
 * 
 * REAL DATA RULE:
 * Production code always prefers real Supabase user records from get_quantum_leaderboard.
 * These deterministic records are strictly isolated here.
 */

import { calculateLevel, getQuantumRankTitle } from '../utils/progression';

export const DEMO_LEADERBOARD_PLAYERS = [
  {
    id: 'demo-p1',
    display_name: 'Aanya Sharma',
    xp: 3920,
    role: 'student',
    created_at: '2026-08-07T12:00:00Z',
    is_demo: true
  },
  {
    id: 'demo-p2',
    display_name: 'Rohan Verma',
    xp: 3650,
    role: 'student',
    created_at: '2026-07-28T12:00:00Z',
    is_demo: true
  },
  {
    id: 'demo-p3',
    display_name: 'Dev Patel',
    xp: 3120,
    role: 'student',
    created_at: '2026-08-02T12:00:00Z',
    is_demo: true
  },
  {
    id: 'demo-p4',
    display_name: 'Priya Nair',
    xp: 1980,
    role: 'student',
    created_at: '2026-08-07T12:00:00Z',
    is_demo: true
  },
  {
    id: 'demo-p5',
    display_name: 'Marcus Vance',
    xp: 1750,
    role: 'student',
    created_at: '2026-08-09T12:00:00Z',
    is_demo: true
  },
  {
    id: 'demo-p6',
    display_name: 'Elena Rostova',
    xp: 1420,
    role: 'student',
    created_at: '2026-08-12T12:00:00Z',
    is_demo: true
  },
  {
    id: 'demo-p7',
    display_name: 'Kenji Sato',
    xp: 1150,
    role: 'student',
    created_at: '2026-08-15T12:00:00Z',
    is_demo: true
  },
  {
    id: 'demo-p8',
    display_name: 'Sofia Chen',
    xp: 980,
    role: 'student',
    created_at: '2026-08-17T12:00:00Z',
    is_demo: true
  },
  {
    id: 'demo-p9',
    display_name: 'Lucas Dubois',
    xp: 850,
    role: 'student',
    created_at: '2026-08-19T12:00:00Z',
    is_demo: true
  },
  {
    id: 'demo-p10',
    display_name: 'Maya Lin',
    xp: 720,
    role: 'student',
    created_at: '2026-08-22T12:00:00Z',
    is_demo: true
  },
  {
    id: 'demo-p11',
    display_name: 'Tariq Al-Mansoor',
    xp: 600,
    role: 'student',
    created_at: '2026-08-25T12:00:00Z',
    is_demo: true
  },
  {
    id: 'demo-p12',
    display_name: 'Zara Khan',
    xp: 480,
    role: 'student',
    created_at: '2026-08-27T12:00:00Z',
    is_demo: true
  }
];

/**
 * Merge deterministic demo players with the real current user data
 * and calculate deterministic ranking based on XP (tie-breaking by created_at).
 * 
 * Returns: { leaderboard: Array, currentUserRank: Object, totalCount: number }
 */
export function buildFallbackLeaderboard(currentUser = null, currentXP = 450) {
  const userXP = Number(currentXP) || 0;
  const currentUserId = currentUser?.id || 'current-user-fallback';
  const currentUserName = currentUser?.user_metadata?.full_name || 
                          currentUser?.display_name || 
                          currentUser?.email?.split('@')[0] || 
                          'Cadet Explorer';

  const realUserEntry = {
    id: currentUserId,
    display_name: currentUserName,
    xp: userXP,
    role: 'student',
    created_at: currentUser?.created_at || '2026-09-05T11:18:00Z',
    is_current_user: true
  };

  // Combine real user with demo players
  const combined = [
    realUserEntry,
    ...DEMO_LEADERBOARD_PLAYERS.map(p => ({ ...p, is_current_user: false }))
  ];

  // Sort deterministically: XP DESC, then created_at ASC
  combined.sort((a, b) => {
    if (b.xp !== a.xp) return b.xp - a.xp;
    return new Date(a.created_at) - new Date(b.created_at);
  });

  // Assign ranks
  const ranked = combined.map((player, index) => ({
    rank: index + 1,
    user_id: player.id,
    display_name: player.display_name,
    xp: player.xp,
    level: calculateLevel(player.xp),
    rank_title: getQuantumRankTitle(player.xp),
    is_current_user: !!player.is_current_user,
    created_at: player.created_at,
    is_demo: !!player.is_demo
  }));

  const currentUserRank = ranked.find(p => p.is_current_user) || ranked[0];

  // Top 10 + user position if outside top 10
  const top10 = ranked.slice(0, 10);
  let displayList = [...top10];
  if (currentUserRank.rank > 10) {
    displayList.push(currentUserRank);
  }

  return {
    leaderboard: displayList,
    allRanked: ranked,
    currentUserRank,
    totalCount: ranked.length
  };
}
