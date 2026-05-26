import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

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

export type BracketRound = 'oitavas' | 'quarters' | 'semis' | 'final' | 'champion';

export interface IBracketSlot {
  round: BracketRound;
  slot: number;
  tla: string;
  name: string;
}

export const BRACKET_ROUNDS: { key: BracketRound; label: string; slots: number; pts: number }[] = [
  { key: 'oitavas',  label: 'Oitavas de Final', slots: 16, pts: 5  },
  { key: 'quarters', label: 'Quartas de Final',  slots: 8,  pts: 10 },
  { key: 'semis',    label: 'Semifinais',         slots: 4,  pts: 15 },
  { key: 'final',    label: 'Final',              slots: 2,  pts: 20 },
  { key: 'champion', label: 'Campeão',            slots: 1,  pts: 50 },
];

export type ActualBracket = Record<string, boolean>;

export function getBracketPoints(
  bracket: Record<string, IBracketSlot>,
  actual: ActualBracket,
): number {
  let total = 0;
  for (const slot of Object.values(bracket)) {
    const round = BRACKET_ROUNDS.find(r => r.key === slot.round);
    if (!round) continue;
    if (actual[`${slot.round}_${slot.tla}`]) total += round.pts;
  }
  return total;
}

type BracketMap = Record<string, IBracketSlot>;

// ── Hook ──────────────────────────────────────────────────────────────

export function usePalpites(userId: string | null) {
  const [palpites, setPalpites] = useState<PalpitesMap>({});
  const [bracket, setBracket]   = useState<BracketMap>({});
  const [loading, setLoading]   = useState(true);

  // Carrega dados do Supabase sempre que o usuário muda
  useEffect(() => {
    if (!userId) {
      setPalpites({});
      setBracket({});
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      supabase.from('palpites_jogos').select('*').eq('usuario_id', userId),
      supabase.from('palpites_bracket').select('*').eq('usuario_id', userId),
    ]).then(([{ data: p }, { data: b }]) => {
      // Palpites por jogo
      const pMap: PalpitesMap = {};
      (p ?? []).forEach((r: { match_id: number; home_score: number; away_score: number }) => {
        pMap[r.match_id] = { matchId: r.match_id, homeScore: r.home_score, awayScore: r.away_score };
      });
      setPalpites(pMap);

      // Bracket
      const bMap: BracketMap = {};
      (b ?? []).forEach((r: { round: BracketRound; slot: number; tla: string; name: string }) => {
        bMap[`${r.round}_${r.slot}`] = { round: r.round, slot: r.slot, tla: r.tla, name: r.name };
      });
      setBracket(bMap);
      setLoading(false);
    });
  }, [userId]);

  const savePalpite = useCallback(async (matchId: number, homeScore: number, awayScore: number) => {
    if (!userId) return;
    const { error } = await supabase
      .from('palpites_jogos')
      .upsert({ usuario_id: userId, match_id: matchId, home_score: homeScore, away_score: awayScore });
    if (!error) {
      setPalpites(prev => ({ ...prev, [matchId]: { matchId, homeScore, awayScore } }));
    }
  }, [userId]);

  const saveBracket = useCallback(async (round: BracketRound, slot: number, tla: string, name: string) => {
    if (!userId) return;
    const key = `${round}_${slot}`;
    const { error } = await supabase
      .from('palpites_bracket')
      .upsert({ usuario_id: userId, round, slot, tla, name });
    if (!error) {
      setBracket(prev => ({ ...prev, [key]: { round, slot, tla, name } }));
    }
  }, [userId]);

  const removeBracket = useCallback(async (round: BracketRound, slot: number) => {
    if (!userId) return;
    const key = `${round}_${slot}`;
    const { error } = await supabase
      .from('palpites_bracket')
      .delete()
      .eq('usuario_id', userId)
      .eq('round', String(round))
      .eq('slot', slot);
    if (!error) {
      setBracket(prev => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }
  }, [userId]);

  return { palpites, bracket, loading, savePalpite, saveBracket, removeBracket };
}
