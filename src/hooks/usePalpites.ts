import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_PALPITES } from '../utils/mockPalpites';

const PALPITES_KEY = '@copa2026:palpites';
const BRACKET_KEY  = '@copa2026:bracket';

// ── Per-match predictions ─────────────────────────────────────────────

export interface IPalpite {
  matchId: number;
  homeScore: number;
  awayScore: number;
}

type PalpitesMap = Record<number, IPalpite>;

export type PalpiteResult = 'exact' | 'winner' | 'wrong' | 'pending';

export function getPalpiteResult(
  palpite: IPalpite,
  fullTimeHome: number | null,
  fullTimeAway: number | null,
  status: string,
): PalpiteResult {
  if (status !== 'FINISHED' || fullTimeHome === null || fullTimeAway === null) return 'pending';
  if (palpite.homeScore === fullTimeHome && palpite.awayScore === fullTimeAway) return 'exact';
  const predictedWinner =
    palpite.homeScore > palpite.awayScore ? 'home' :
    palpite.awayScore > palpite.homeScore ? 'away' : 'draw';
  const actualWinner =
    fullTimeHome > fullTimeAway ? 'home' :
    fullTimeAway > fullTimeHome ? 'away' : 'draw';
  return predictedWinner === actualWinner ? 'winner' : 'wrong';
}

// ── Bracket predictions ───────────────────────────────────────────────

export type BracketRound = 'quarters' | 'semis' | 'final' | 'champion';

export interface IBracketSlot {
  round: BracketRound;
  slot: number;
  tla: string;
  name: string;
}

export const BRACKET_ROUNDS: { key: BracketRound; label: string; slots: number; pts: number }[] = [
  { key: 'quarters',  label: 'Quartas de Final', slots: 8, pts: 2  },
  { key: 'semis',     label: 'Semifinais',        slots: 4, pts: 3  },
  { key: 'final',     label: 'Final',             slots: 2, pts: 5  },
  { key: 'champion',  label: 'Campeão',           slots: 1, pts: 10 },
];

// Teams that actually advanced (populated from API knockout results)
// key = `${round}_tla`, e.g. "quarters_BRA"
export type ActualBracket = Record<string, boolean>;

export function getBracketPoints(
  bracket: Record<string, IBracketSlot>,
  actual: ActualBracket,
): number {
  let total = 0;
  for (const slot of Object.values(bracket)) {
    const round = BRACKET_ROUNDS.find(r => r.key === slot.round);
    if (!round) continue;
    const key = `${slot.round}_${slot.tla}`;
    if (actual[key]) total += round.pts;
  }
  return total;
}

type BracketMap = Record<string, IBracketSlot>; // key = `${round}_${slot}`

// ── Hook ──────────────────────────────────────────────────────────────

export function usePalpites() {
  const [palpites, setPalpites] = useState<PalpitesMap>({});
  const [bracket, setBracket]   = useState<BracketMap>({});
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(PALPITES_KEY),
      AsyncStorage.getItem(BRACKET_KEY),
    ]).then(([rawP, rawB]) => {
      const stored = rawP ? JSON.parse(rawP) : {};
      setPalpites({ ...MOCK_PALPITES, ...stored });
      if (rawB) setBracket(JSON.parse(rawB));
      setLoading(false);
    });
  }, []);

  const savePalpite = useCallback(async (matchId: number, homeScore: number, awayScore: number) => {
    const updated = { ...palpites, [matchId]: { matchId, homeScore, awayScore } };
    setPalpites(updated);
    await AsyncStorage.setItem(PALPITES_KEY, JSON.stringify(updated));
  }, [palpites]);

  const saveBracket = useCallback(async (round: BracketRound, slot: number, tla: string, name: string) => {
    const key = `${round}_${slot}`;
    const updated = { ...bracket, [key]: { round, slot, tla, name } };
    setBracket(updated);
    await AsyncStorage.setItem(BRACKET_KEY, JSON.stringify(updated));
  }, [bracket]);

  const removeBracket = useCallback(async (round: BracketRound, slot: number) => {
    const key = `${round}_${slot}`;
    const updated = { ...bracket };
    delete updated[key];
    setBracket(updated);
    await AsyncStorage.setItem(BRACKET_KEY, JSON.stringify(updated));
  }, [bracket]);

  return { palpites, bracket, loading, savePalpite, saveBracket, removeBracket };
}
