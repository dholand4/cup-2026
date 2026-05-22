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
  const [ligas,        setLigas]        = useState<ILiga[]>([]);
  const [selectedLiga, setSelectedLiga] = useState<ILiga | null>(null);
  const [ranking,      setRanking]      = useState<ILigaMembro[]>([]);
  const [loading,      setLoading]      = useState(false);

  // ── Buscar ranking de uma liga ─────────────────────────────────────────

  const fetchRanking = useCallback(async (ligaId: string) => {
    const { data: membros } = await supabase
      .from('membros_liga')
      .select('usuario_id, pontos')
      .eq('liga_id', ligaId)
      .order('pontos', { ascending: false });

    if (!membros || membros.length === 0) { setRanking([]); return; }

    const userIds = membros.map((m: any) => m.usuario_id);
    const { data: perfis } = await supabase
      .from('perfis')
      .select('id, apelido')
      .in('id', userIds);

    const perfilMap = new Map(perfis?.map((p: any) => [p.id, p.apelido]) ?? []);

    setRanking(membros.map((m: any) => ({
      usuario_id: m.usuario_id,
      pontos:     m.pontos ?? 0,
      apelido:    perfilMap.get(m.usuario_id) ?? 'Anônimo',
    })));
  }, []);

  // ── Buscar todas as ligas do usuário ───────────────────────────────────

  const fetchUserLigas = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    const { data } = await supabase
      .from('membros_liga')
      .select('liga_id, ligas(id, nome, codigo, criador_id)')
      .eq('usuario_id', userId);

    if (data && data.length > 0) {
      const lista: ILiga[] = data
        .map((d: any) => d.ligas)
        .filter(Boolean)
        .map((l: any) => ({ id: l.id, nome: l.nome, codigo: l.codigo, criador_id: l.criador_id }));

      setLigas(lista);

      // Seleciona a primeira por padrão se nenhuma estiver selecionada
      setSelectedLiga(prev => prev ? (lista.find(l => l.id === prev.id) ?? lista[0]) : lista[0]);
    } else {
      setLigas([]);
      setSelectedLiga(null);
    }

    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchUserLigas(); }, [fetchUserLigas]);

  // Busca ranking sempre que selectedLiga muda
  useEffect(() => {
    if (selectedLiga) fetchRanking(selectedLiga.id);
    else setRanking([]);
  }, [selectedLiga, fetchRanking]);

  // ── Selecionar liga ────────────────────────────────────────────────────

  const selectLiga = useCallback((liga: ILiga) => {
    setSelectedLiga(liga);
  }, []);

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

    // Recarrega tudo do servidor para garantir sincronia
    await fetchUserLigas();
    setSelectedLiga(ligaData as ILiga);
    return null;
  }, [userId, fetchUserLigas]);

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

    // Recarrega tudo do servidor para garantir sincronia
    await fetchUserLigas();
    setSelectedLiga(ligaData as ILiga);
    return null;
  }, [userId, fetchUserLigas]);

  // ── Sair da liga ───────────────────────────────────────────────────────

  const leaveLiga = useCallback(async (liga: ILiga): Promise<string | null> => {
    if (!userId) return 'Usuário não autenticado.';

    const { error: memErr } = await supabase
      .from('membros_liga')
      .delete()
      .eq('liga_id', liga.id)
      .eq('usuario_id', userId);

    if (memErr) return memErr.message;

    if (liga.criador_id === userId) {
      const { error: ligaErr } = await supabase
        .from('ligas')
        .delete()
        .eq('id', liga.id);
      if (ligaErr) return ligaErr.message;
    }

    setLigas(prev => {
      const novas = prev.filter(l => l.id !== liga.id);
      setSelectedLiga(novas.length > 0 ? novas[0] : null);
      return novas;
    });
    setRanking([]);
    return null;
  }, [userId]);

  const refresh = useCallback(async () => {
    if (selectedLiga) await fetchRanking(selectedLiga.id);
  }, [selectedLiga, fetchRanking]);

  return {
    ligas, selectedLiga, ranking, loading,
    selectLiga, createLiga, joinLiga, leaveLiga, refresh,
  };
}
