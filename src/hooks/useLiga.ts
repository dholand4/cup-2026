import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';

export interface ILigaMembro {
  usuario_id: string;
  pontos:     number;
  apelido:    string;
}

export interface ILiga {
  id:         string;
  nome:       string;
  codigo:     string;
  criador_id: string;
}

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function useLiga(userId: string | null | undefined) {
  const [liga,    setLiga]    = useState<ILiga | null>(null);
  const [ranking, setRanking] = useState<ILigaMembro[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRanking = useCallback(async (ligaId: string) => {
    const { data } = await supabase
      .from('membros_liga')
      .select('usuario_id, pontos, perfis(apelido)')
      .eq('liga_id', ligaId)
      .order('pontos', { ascending: false });

    if (data) {
      setRanking(data.map((m: any) => ({
        usuario_id: m.usuario_id,
        pontos:     m.pontos ?? 0,
        apelido:    m.perfis?.apelido ?? 'Anônimo',
      })));
    }
  }, []);

  const fetchUserLiga = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    const { data } = await supabase
      .from('membros_liga')
      .select('liga_id, ligas(id, nome, codigo, criador_id)')
      .eq('usuario_id', userId)
      .maybeSingle();

    if (data?.ligas) {
      const l = data.ligas as any;
      const ligaObj: ILiga = { id: l.id, nome: l.nome, codigo: l.codigo, criador_id: l.criador_id };
      setLiga(ligaObj);
      await fetchRanking(l.id);
    }

    setLoading(false);
  }, [userId, fetchRanking]);

  useEffect(() => { fetchUserLiga(); }, [fetchUserLiga]);

  // ── Criar liga ─────────────────────────────────────────────────────────

  const createLiga = useCallback(async (nome: string): Promise<string | null> => {
    if (!userId) return 'Usuário não autenticado.';

    const codigo = generateCode();

    const { data: ligaData, error: ligaErr } = await supabase
      .from('ligas')
      .insert({ nome: nome.trim(), codigo, criador_id: userId })
      .select()
      .single();

    if (ligaErr || !ligaData) return ligaErr?.message ?? 'Erro ao criar liga.';

    const { error: memErr } = await supabase
      .from('membros_liga')
      .insert({ liga_id: ligaData.id, usuario_id: userId, pontos: 0 });

    if (memErr) return memErr.message;

    setLiga(ligaData as ILiga);
    await fetchRanking(ligaData.id);
    return null;
  }, [userId, fetchRanking]);

  // ── Entrar na liga ─────────────────────────────────────────────────────

  const joinLiga = useCallback(async (codigo: string): Promise<string | null> => {
    if (!userId) return 'Usuário não autenticado.';

    const { data: ligaData } = await supabase
      .from('ligas')
      .select()
      .eq('codigo', codigo.trim().toUpperCase())
      .maybeSingle();

    if (!ligaData) return 'Liga não encontrada. Verifique o código.';

    const { data: existing } = await supabase
      .from('membros_liga')
      .select('id')
      .eq('liga_id', ligaData.id)
      .eq('usuario_id', userId)
      .maybeSingle();

    if (existing) return 'Você já está nessa liga.';

    const { error: memErr } = await supabase
      .from('membros_liga')
      .insert({ liga_id: ligaData.id, usuario_id: userId, pontos: 0 });

    if (memErr) return memErr.message;

    setLiga(ligaData as ILiga);
    await fetchRanking(ligaData.id);
    return null;
  }, [userId, fetchRanking]);

  // ── Sair da liga ───────────────────────────────────────────────────────

  const leaveLiga = useCallback(async (): Promise<void> => {
    if (!userId || !liga) return;

    await supabase
      .from('membros_liga')
      .delete()
      .eq('liga_id', liga.id)
      .eq('usuario_id', userId);

    if (liga.criador_id === userId) {
      await supabase.from('ligas').delete().eq('id', liga.id);
    }

    setLiga(null);
    setRanking([]);
  }, [userId, liga]);

  const refresh = useCallback(async () => {
    if (liga) await fetchRanking(liga.id);
    else await fetchUserLiga();
  }, [liga, fetchRanking, fetchUserLiga]);

  return { liga, ranking, loading, createLiga, joinLiga, leaveLiga, refresh };
}
