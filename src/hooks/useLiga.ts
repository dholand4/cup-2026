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

export interface IPendingRequest {
  usuario_id: string;
  apelido:    string;
  liga_id:    string;
  liga_nome:  string;
}

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function useLiga(userId: string | null | undefined) {
  const [ligas,                setLigas]                = useState<ILiga[]>([]);
  const [selectedLiga,         setSelectedLiga]         = useState<ILiga | null>(null);
  const [ranking,              setRanking]              = useState<ILigaMembro[]>([]);
  const [loading,              setLoading]              = useState(false);
  const [pendingSolicitations, setPendingSolicitations] = useState<ILiga[]>([]);
  const [pendingRequests,      setPendingRequests]      = useState<IPendingRequest[]>([]);

  // ── Buscar ranking de uma liga ─────────────────────────────────────────

  const fetchRanking = useCallback(async (ligaId: string) => {
    const { data: membros } = await supabase
      .from('membros_liga')
      .select('usuario_id, pontos')
      .eq('liga_id', ligaId)
      .eq('status', 'ativo')
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

  // ── Buscar pendências para ligas criadas pelo usuário ──────────────────

  const fetchPendingRequests = useCallback(async (ownedLigas: ILiga[]) => {
    if (!userId) return;
    const ownerIds = ownedLigas.filter(l => l.criador_id === userId).map(l => l.id);
    if (ownerIds.length === 0) { setPendingRequests([]); return; }

    const { data: pending } = await supabase
      .from('membros_liga')
      .select('usuario_id, liga_id')
      .in('liga_id', ownerIds)
      .eq('status', 'pendente');

    if (!pending || pending.length === 0) { setPendingRequests([]); return; }

    const uIds = pending.map((p: any) => p.usuario_id);
    const { data: perfis } = await supabase
      .from('perfis')
      .select('id, apelido')
      .in('id', uIds);

    const perfilMap = new Map(perfis?.map((p: any) => [p.id, p.apelido]) ?? []);
    const ligaMap   = new Map(ownedLigas.map(l => [l.id, l.nome]));

    setPendingRequests(pending.map((p: any) => ({
      usuario_id: p.usuario_id,
      liga_id:    p.liga_id,
      apelido:    perfilMap.get(p.usuario_id) ?? 'Anônimo',
      liga_nome:  ligaMap.get(p.liga_id) ?? '',
    })));
  }, [userId]);

  // ── Buscar todas as ligas do usuário ───────────────────────────────────

  const fetchUserLigas = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    const { data } = await supabase
      .from('membros_liga')
      .select('liga_id, status, ligas(id, nome, codigo, criador_id)')
      .eq('usuario_id', userId);

    if (data && data.length > 0) {
      const ativo: ILiga[]    = [];
      const pendente: ILiga[] = [];

      data.forEach((d: any) => {
        if (!d.ligas) return;
        const l: ILiga = { id: d.ligas.id, nome: d.ligas.nome, codigo: d.ligas.codigo, criador_id: d.ligas.criador_id };
        if (d.status === 'pendente') pendente.push(l);
        else ativo.push(l);
      });

      setLigas(ativo);
      setPendingSolicitations(pendente);
      setSelectedLiga(prev => prev ? (ativo.find(l => l.id === prev.id) ?? ativo[0] ?? null) : ativo[0] ?? null);

      await fetchPendingRequests(ativo);
    } else {
      setLigas([]);
      setPendingSolicitations([]);
      setSelectedLiga(null);
      setPendingRequests([]);
    }

    setLoading(false);
  }, [userId, fetchPendingRequests]);

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
      .insert({ liga_id: ligaData.id, usuario_id: userId, pontos: 0, status: 'ativo' });

    if (memErr) return memErr.message;

    await fetchUserLigas();
    setSelectedLiga(ligaData as ILiga);
    return null;
  }, [userId, fetchUserLigas]);

  // ── Entrar na liga (pendente até aprovação) ────────────────────────────

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
      .select('id, status')
      .eq('liga_id', ligaData.id)
      .eq('usuario_id', userId)
      .maybeSingle();

    if (existing) {
      if ((existing as any).status === 'pendente') return 'Sua solicitação já está aguardando aprovação.';
      return 'Você já está nessa liga.';
    }

    const { error: memErr } = await supabase
      .from('membros_liga')
      .insert({ liga_id: ligaData.id, usuario_id: userId, pontos: 0, status: 'pendente' });

    if (memErr) return memErr.message;

    await fetchUserLigas();
    return null;
  }, [userId, fetchUserLigas]);

  // ── Sair da liga ───────────────────────────────────────────────────────

  const leaveLiga = useCallback(async (liga: ILiga): Promise<string | null> => {
    if (!userId) return 'Usuário não autenticado.';

    if (liga.criador_id === userId) {
      // Owner: deletes all members first (RLS allows owner to delete any member)
      const { error: allMemErr } = await supabase
        .from('membros_liga')
        .delete()
        .eq('liga_id', liga.id);
      if (allMemErr) return allMemErr.message;

      const { error: ligaErr } = await supabase
        .from('ligas')
        .delete()
        .eq('id', liga.id);
      if (ligaErr) return ligaErr.message;
    } else {
      const { error: memErr } = await supabase
        .from('membros_liga')
        .delete()
        .eq('liga_id', liga.id)
        .eq('usuario_id', userId);
      if (memErr) return memErr.message;
    }

    setLigas(prev => {
      const novas = prev.filter(l => l.id !== liga.id);
      setSelectedLiga(novas.length > 0 ? novas[0] : null);
      return novas;
    });
    setPendingSolicitations(prev => prev.filter(l => l.id !== liga.id));
    setPendingRequests(prev => prev.filter(p => p.liga_id !== liga.id));
    setRanking([]);
    return null;
  }, [userId]);

  // ── Aprovar solicitação ────────────────────────────────────────────────

  const approveRequest = useCallback(async (ligaId: string, targetUserId: string): Promise<string | null> => {
    const { error } = await supabase
      .from('membros_liga')
      .update({ status: 'ativo' })
      .eq('liga_id', ligaId)
      .eq('usuario_id', targetUserId);
    if (error) return error.message;
    setPendingRequests(prev =>
      prev.filter(p => !(p.liga_id === ligaId && p.usuario_id === targetUserId)),
    );
    return null;
  }, []);

  // ── Rejeitar solicitação ───────────────────────────────────────────────

  const rejectRequest = useCallback(async (ligaId: string, targetUserId: string): Promise<string | null> => {
    const { error } = await supabase
      .from('membros_liga')
      .delete()
      .eq('liga_id', ligaId)
      .eq('usuario_id', targetUserId);
    if (error) return error.message;
    setPendingRequests(prev =>
      prev.filter(p => !(p.liga_id === ligaId && p.usuario_id === targetUserId)),
    );
    return null;
  }, []);

  const refresh = useCallback(async () => {
    await fetchUserLigas();
    if (selectedLiga) await fetchRanking(selectedLiga.id);
  }, [selectedLiga, fetchRanking, fetchUserLigas]);

  return {
    ligas, selectedLiga, ranking, loading,
    pendingSolicitations, pendingRequests,
    selectLiga, createLiga, joinLiga, leaveLiga, refresh,
    approveRequest, rejectRequest,
  };
}
