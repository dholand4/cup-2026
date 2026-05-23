import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  ScrollView, RefreshControl, ActivityIndicator,
  KeyboardAvoidingView, Platform, Modal, FlatList, TouchableOpacity, Alert, Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { IMatch } from '../../@types';
import { useMatchesContext } from '../../providers/MatchesProvider';
import {
  usePalpites, getPalpiteResult, IPalpite,
  BRACKET_ROUNDS, BracketRound, getBracketPoints,
} from '../../hooks/usePalpites';
import { ActualBracket } from '../../hooks/usePalpites';
import { CrestGlobal } from '../../components/crestGlobal';
import { EmptyStateGlobal } from '../../components/emptyStateGlobal';
import { isToday, formatDayShort, formatTime } from '../../utils/dateUtils';
import { ALL_TEAMS, ITeamOption } from '../../utils/allTeams';
import { theme } from '../../constants/theme';
import { useAuth } from '../../providers/AuthProvider';
import { useLiga } from '../../hooks/useLiga';
import { supabase } from '../../services/supabaseClient';
import {
  Screen, Header, WordmarkCopa, WordmarkYear, Wordmark, SubTitle,
  StatsBar, StatChip, StatValue, StatLabel,
  TabSwitcher, TabBtn, TabBtnText,
  PaginationRow, PageArrow, PageInfo, PageTodayHint,
  DateLabel, CardList,
  PalpiteCard, CardHeader, GroupTag, MatchTime, ResultBadge,
  TeamsRow, TeamBlock, TeamTLA, InputArea,
  RealScore, PalpiteLabel, ScoreInputRow, ScoreInput, InputSep,
  LockedRow, LockedText, SaveButton, SaveButtonText,
  BracketSection, RoundTitle, RoundPts, SlotsGrid, SlotChip, SlotText, SlotRemove,
  PickerOverlay, PickerSheet, PickerHeader, PickerTitle,
  PickerClose, PickerCloseText, SearchInput, TeamPickerRow,
  TeamPickerTLA, TeamPickerName, BottomSpacer,
  NoLigaContainer, NoLigaTitle, NoLigaSubtitle,
  LigaActionBtn, LigaActionBtnText,
  LigaModalOverlay, LigaModalSheet, LigaModalTitle,
  LigaInput, LigaInputLabel, LigaModalError,
  LigaCard, LigaCardHeader, LigaName, LigaCodeRow, LigaCodeLabel, LigaCodeValue,
  LigaLeaveBtn, LigaLeaveBtnText,
  RankingRow, RankPosition, RankApelido, RankMeTag, RankPoints,
  GuestBanner, GuestBannerText,
  LigaListContainer, LigaListItem, LigaListItemName, LigaListItemCode,
  LigaActionsRow, LigaActionSmallBtn, LigaActionSmallBtnText,
} from './style';

type ActiveTab = 'jogos' | 'bracket' | 'ranking';

// ── helpers ───────────────────────────────────────────────────────────

function getGroupLabel(match: IMatch): string {
  if (match.group) {
    const l = match.group.replace(/^GROUP_/i, '').replace(/^Group\s*/i, '').trim();
    return `Grupo ${l}`;
  }
  return match.stage?.replace(/_/g, ' ') ?? 'Copa 2026';
}

const RESULT_LABEL: Record<string, string> = {
  exact:  '✅ Placar exato · +3pts',
  winner: '🟡 Vencedor certo · +1pt',
  wrong:  '❌ Errou · +0pts',
};

// ── PalpiteCardItem ────────────────────────────────────────────────────

interface IPalpiteCardProps {
  match: IMatch;
  palpite?: IPalpite;
  onSave: (matchId: number, home: number, away: number) => void;
}

function PalpiteCardItem({ match, palpite, onSave }: IPalpiteCardProps) {
  const { homeTeam, awayTeam, status, score, utcDate } = match;
  const isFinal = status === 'FINISHED';
  const isLive  = status === 'IN_PLAY' || status === 'PAUSED';
  const locked  = isFinal || isLive || !!palpite; // lock once saved

  const result = palpite && (isFinal || isLive)
    ? getPalpiteResult(palpite, score.fullTime.home, score.fullTime.away, status)
    : undefined;

  const [home, setHome] = useState('');
  const [away, setAway] = useState('');

  const canSave = home !== '' && away !== '' && !palpite;

  const handleSave = () => {
    const h = parseInt(home, 10);
    const a = parseInt(away, 10);
    if (isNaN(h) || isNaN(a)) return;
    onSave(match.id, h, a);
  };

  return (
    <PalpiteCard result={result}>
      <CardHeader>
        <GroupTag>{getGroupLabel(match)}</GroupTag>
        {result && result !== 'pending'
          ? <ResultBadge result={result}>{RESULT_LABEL[result]}</ResultBadge>
          : isLive
            ? <MatchTime>● Ao Vivo</MatchTime>
            : <MatchTime>{formatTime(utcDate)} BRT</MatchTime>
        }
      </CardHeader>

      <TeamsRow>
        <TeamBlock>
          <CrestGlobal tla={homeTeam.tla} size={28} teamName={homeTeam.name} />
          <TeamTLA>{homeTeam.tla}</TeamTLA>
        </TeamBlock>

        <InputArea>
          {/* Real score (finished/live) */}
          {(isFinal || isLive) && (
            <RealScore>
              {score.fullTime.home ?? '-'} — {score.fullTime.away ?? '-'}
            </RealScore>
          )}

          {/* Palpite display once locked */}
          {palpite && (
            <PalpiteLabel>
              palpite: {palpite.homeScore} × {palpite.awayScore}
            </PalpiteLabel>
          )}

          {/* Input (only when not locked) */}
          {!locked && (
            <>
              <ScoreInputRow>
                <ScoreInput
                  value={home}
                  onChangeText={v => setHome(v.replace(/[^0-9]/g, '').slice(0, 2))}
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="0"
                  placeholderTextColor={theme.colors.text.muted}
                />
                <InputSep>×</InputSep>
                <ScoreInput
                  value={away}
                  onChangeText={v => setAway(v.replace(/[^0-9]/g, '').slice(0, 2))}
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="0"
                  placeholderTextColor={theme.colors.text.muted}
                />
              </ScoreInputRow>
              <PalpiteLabel>seu palpite</PalpiteLabel>
            </>
          )}

          {/* No palpite + finished */}
          {!palpite && isFinal && (
            <PalpiteLabel>sem palpite</PalpiteLabel>
          )}
        </InputArea>

        <TeamBlock right>
          <CrestGlobal tla={awayTeam.tla} size={28} teamName={awayTeam.name} />
          <TeamTLA>{awayTeam.tla}</TeamTLA>
        </TeamBlock>
      </TeamsRow>

      {/* Save button (only before saving) */}
      {!locked && canSave && (
        <SaveButton onPress={handleSave}>
          <SaveButtonText>Confirmar palpite</SaveButtonText>
        </SaveButton>
      )}

      {/* Locked indicator (saved future match) */}
      {palpite && !isFinal && !isLive && (
        <LockedRow>
          <Ionicons name="lock-closed" size={12} color={theme.colors.text.secondary} />
          <LockedText>Palpite confirmado — não pode ser alterado</LockedText>
        </LockedRow>
      )}
    </PalpiteCard>
  );
}

// ── buildActualBracket ────────────────────────────────────────────────
// Calcula o ActualBracket dinamicamente dos resultados reais dos jogos.
// Quarters = times classificados da fase de grupos (top 2/grupo)
// Semis    = times que disputaram as semifinais
// Final    = times que disputaram a final
// Champion = vencedor da final

function buildActualBracket(allMatches: IMatch[]): ActualBracket {
  const actual: ActualBracket = {};

  // ── Quarters: times que disputaram as quartas de final (Copa real) ───
  // A Copa 2026 tem: ROUND_OF_32 → ROUND_OF_16 → QUARTER_FINALS → SEMI_FINALS → FINAL
  const quarterMatches = allMatches.filter(
    m => m.stage === 'QUARTER_FINALS' && m.homeTeam.tla !== 'TBD',
  );
  quarterMatches.forEach(m => {
    actual[`quarters_${m.homeTeam.tla}`] = true;
    actual[`quarters_${m.awayTeam.tla}`] = true;
  });

  // ── Semis: times que disputaram as semifinais ─────────────────────────
  allMatches
    .filter(m => m.stage === 'SEMI_FINALS' && m.homeTeam.tla !== 'TBD')
    .forEach(m => {
      actual[`semis_${m.homeTeam.tla}`] = true;
      actual[`semis_${m.awayTeam.tla}`] = true;
    });

  // ── Final: times que disputaram a final + campeão ────────────────────
  allMatches
    .filter(m => m.stage === 'FINAL' && m.homeTeam.tla !== 'TBD')
    .forEach(m => {
      actual[`final_${m.homeTeam.tla}`] = true;
      actual[`final_${m.awayTeam.tla}`] = true;
      if (m.status === 'FINISHED') {
        const hg = m.score.fullTime.home;
        const ag = m.score.fullTime.away;
        if (hg !== null && ag !== null) {
          if      (hg > ag) actual[`champion_${m.homeTeam.tla}`] = true;
          else if (ag > hg) actual[`champion_${m.awayTeam.tla}`] = true;
        }
      }
    });

  return actual;
}

// ── BracketTab ─────────────────────────────────────────────────────────

const NON_GROUP_STAGES = ['ROUND_OF_32', 'ROUND_OF_16', 'QUARTER_FINALS', 'SEMI_FINALS', 'FINAL'];

interface IBracketTabProps {
  bracket: Record<string, any>;
  locked: boolean;
  actual: Record<string, boolean>;
  onSave: (round: BracketRound, slot: number, tla: string, name: string) => void;
  onRemove: (round: BracketRound, slot: number) => void;
}

function BracketTab({ bracket, locked, actual, onSave, onRemove }: IBracketTabProps) {
  const [picker, setPicker] = useState<{ round: BracketRound; slot: number } | null>(null);
  const [search, setSearch] = useState('');

  // Times já escolhidos no round aberto no picker (para evitar duplicatas)
  const usedInRound = useMemo(() => {
    if (!picker) return new Set<string>();
    return new Set(
      Object.values(bracket)
        .filter((s: any) => s.round === picker.round)
        .map((s: any) => s.tla),
    );
  }, [picker, bracket]);

  const filteredTeams = useMemo(() =>
    ALL_TEAMS.filter(t =>
      !usedInRound.has(t.tla) && (
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.tla.toLowerCase().includes(search.toLowerCase())
      ),
    ), [search, usedInRound]);

  const handlePick = (team: ITeamOption) => {
    if (!picker) return;
    onSave(picker.round, picker.slot, team.tla, team.name);
    setPicker(null);
    setSearch('');
  };

  return (
    <>
      <BracketSection>
        {/* Lock banner when group stage ended */}
        {locked && (
          <LockedRow style={{ marginBottom: 12 }}>
            <Ionicons name="lock-closed" size={13} color={theme.colors.text.secondary} />
            <LockedText>Fase de grupos encerrada — palpites da Fase Final bloqueados</LockedText>
          </LockedRow>
        )}

        {!locked && (
          <LockedRow style={{ marginBottom: 12, backgroundColor: 'rgba(0,165,80,0.08)', borderRadius: 8 }}>
            <Ionicons name="information-circle-outline" size={13} color={theme.colors.accent.green} />
            <LockedText style={{ color: theme.colors.accent.green }}>
              Preencha até o fim da fase de grupos
            </LockedText>
          </LockedRow>
        )}

        {BRACKET_ROUNDS.map(round => (
          <React.Fragment key={round.key}>
            <RoundTitle>{round.label}  <RoundPts>+{round.pts}pts por acerto</RoundPts></RoundTitle>
            <SlotsGrid>
              {Array.from({ length: round.slots }).map((_, i) => {
                const key = `${round.key}_${i}`;
                const pick = bracket[key];
                return (
                  <SlotChip
                    key={key}
                    filled={!!pick}
                    onPress={() => { if (!pick && !locked) setPicker({ round: round.key, slot: i }); }}
                    activeOpacity={locked || !!pick ? 1 : 0.7}
                  >
                    {pick ? (() => {
                      const actualKey = `${round.key}_${pick.tla}`;
                      const hasResult = actualKey in actual;
                      const hit = actual[actualKey] === true;
                      return (
                        <>
                          <CrestGlobal tla={pick.tla} size={18} teamName={pick.name} />
                          <SlotText filled>{pick.tla}</SlotText>
                          {hasResult ? (
                            hit
                              ? <Ionicons name="checkmark-circle" size={14} color={theme.colors.accent.green} />
                              : <Ionicons name="radio-button-on" size={14} color={theme.colors.accent.live} />
                          ) : (
                            <Ionicons name="lock-closed" size={11} color={theme.colors.text.secondary} />
                          )}
                        </>
                      );
                    })() : (
                      <>
                        <Ionicons
                          name={locked ? 'lock-closed' : 'add'}
                          size={14}
                          color={locked ? theme.colors.text.secondary : theme.colors.text.muted}
                        />
                        <SlotText>{locked ? 'Bloqueado' : 'Selecionar'}</SlotText>
                      </>
                    )}
                  </SlotChip>
                );
              })}
            </SlotsGrid>
          </React.Fragment>
        ))}
      </BracketSection>

      {/* Team picker modal */}
      <Modal
        visible={!!picker}
        transparent
        animationType="slide"
        onRequestClose={() => setPicker(null)}
      >
        <PickerOverlay>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => { setPicker(null); setSearch(''); }} />
          <PickerSheet>
            <PickerHeader>
              <PickerTitle>Escolher seleção</PickerTitle>
              <PickerClose onPress={() => { setPicker(null); setSearch(''); }}>
                <PickerCloseText>Fechar</PickerCloseText>
              </PickerClose>
            </PickerHeader>
            <SearchInput
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar país..."
              placeholderTextColor={theme.colors.text.muted}
              autoFocus
            />
            <FlatList
              data={filteredTeams}
              keyExtractor={t => t.tla}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TeamPickerRow onPress={() => handlePick(item)}>
                  <CrestGlobal tla={item.tla} size={24} teamName={item.name} />
                  <TeamPickerTLA>{item.tla}</TeamPickerTLA>
                  <TeamPickerName>{item.name}</TeamPickerName>
                </TeamPickerRow>
              )}
            />
          </PickerSheet>
        </PickerOverlay>
      </Modal>
    </>
  );
}

// ── RankingTab ─────────────────────────────────────────────────────────

function RankingTab({ pointsKey }: { pointsKey: number }) {
  const { user, isGuest, signOut }                                               = useAuth();
  const { ligas, selectedLiga, ranking, loading, selectLiga,
          createLiga, joinLiga, leaveLiga, refresh }                             = useLiga(user?.id);

  // Re-busca o ranking quando os pontos são sincronizados no Supabase
  useEffect(() => {
    if (pointsKey > 0) refresh();
  }, [pointsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const [showCreate,   setShowCreate]   = useState(false);
  const [showJoin,     setShowJoin]     = useState(false);
  const [ligaNome,     setLigaNome]     = useState('');
  const [ligaCodigo,   setLigaCodigo]   = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError,   setModalError]   = useState<string | null>(null);

  const openCreate = useCallback(() => { setModalError(null); setLigaNome('');   setShowCreate(true); }, []);
  const openJoin   = useCallback(() => { setModalError(null); setLigaCodigo(''); setShowJoin(true);   }, []);

  const handleCreate = useCallback(async () => {
    if (!ligaNome.trim()) { setModalError('Digite um nome para a liga.'); return; }
    setModalLoading(true); setModalError(null);
    const err = await createLiga(ligaNome);
    setModalLoading(false);
    if (err) { setModalError(err); return; }
    setShowCreate(false);
  }, [ligaNome, createLiga]);

  const handleJoin = useCallback(async () => {
    if (!ligaCodigo.trim()) { setModalError('Digite o código da liga.'); return; }
    setModalLoading(true); setModalError(null);
    const err = await joinLiga(ligaCodigo);
    setModalLoading(false);
    if (err) { setModalError(err); return; }
    setShowJoin(false);
  }, [ligaCodigo, joinLiga]);

  const handleShare = useCallback(async () => {
    if (!selectedLiga) return;
    await Share.share({ message: `Entre na minha liga Copa 2026!\nCódigo: ${selectedLiga.codigo}` });
  }, [selectedLiga]);

  const handleLeave = useCallback((liga: typeof selectedLiga) => {
    if (!liga) return;
    Alert.alert(
      'Sair da liga',
      liga.criador_id === user?.id
        ? 'Você é o criador. A liga será excluída para todos.'
        : 'Tem certeza que quer sair desta liga?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: async () => {
          const err = await leaveLiga(liga);
          if (err) Alert.alert('Erro', err);
        }},
      ],
    );
  }, [user, leaveLiga]);

  // ── Visitante ──────────────────────────────────────────────────────────
  if (isGuest) {
    return (
      <GuestBanner>
        <GuestBannerText>
          {'Crie uma conta para participar\nde ligas com seus amigos\ne ver o ranking! 🏆'}
        </GuestBannerText>
        <LigaActionBtn onPress={signOut}>
          <LigaActionBtnText>Criar conta ou entrar</LigaActionBtnText>
        </LigaActionBtn>
      </GuestBanner>
    );
  }

  // ── Carregando ─────────────────────────────────────────────────────────
  if (loading) {
    return <NoLigaContainer><ActivityIndicator color={theme.colors.accent.green} /></NoLigaContainer>;
  }

  // ── Modais ─────────────────────────────────────────────────────────────
  const modais = (
    <>
      <Modal visible={showCreate} transparent animationType="slide">
        <LigaModalOverlay>
          <LigaModalSheet>
            <LigaModalTitle>Nova Liga</LigaModalTitle>
            <LigaInputLabel>Nome da liga</LigaInputLabel>
            <LigaInput
              value={ligaNome} onChangeText={setLigaNome}
              placeholder="Ex: Família, Trampo..." placeholderTextColor={theme.colors.text.muted}
              autoFocus maxLength={30}
            />
            {modalError && <LigaModalError>{modalError}</LigaModalError>}
            <LigaActionBtn onPress={handleCreate} disabled={modalLoading}>
              {modalLoading ? <ActivityIndicator color={theme.colors.background.primary} /> : <LigaActionBtnText>Criar</LigaActionBtnText>}
            </LigaActionBtn>
            <LigaActionBtn outline onPress={() => setShowCreate(false)}>
              <LigaActionBtnText outline>Cancelar</LigaActionBtnText>
            </LigaActionBtn>
          </LigaModalSheet>
        </LigaModalOverlay>
      </Modal>

      <Modal visible={showJoin} transparent animationType="slide">
        <LigaModalOverlay>
          <LigaModalSheet>
            <LigaModalTitle>Entrar na Liga</LigaModalTitle>
            <LigaInputLabel>Código da liga</LigaInputLabel>
            <LigaInput
              value={ligaCodigo} onChangeText={t => setLigaCodigo(t.toUpperCase())}
              placeholder="Ex: AB3X7K" placeholderTextColor={theme.colors.text.muted}
              autoCapitalize="characters" autoFocus maxLength={6}
            />
            {modalError && <LigaModalError>{modalError}</LigaModalError>}
            <LigaActionBtn onPress={handleJoin} disabled={modalLoading}>
              {modalLoading ? <ActivityIndicator color={theme.colors.background.primary} /> : <LigaActionBtnText>Entrar</LigaActionBtnText>}
            </LigaActionBtn>
            <LigaActionBtn outline onPress={() => setShowJoin(false)}>
              <LigaActionBtnText outline>Cancelar</LigaActionBtnText>
            </LigaActionBtn>
          </LigaModalSheet>
        </LigaModalOverlay>
      </Modal>
    </>
  );

  // ── Sem ligas ──────────────────────────────────────────────────────────
  if (ligas.length === 0) {
    return (
      <>
        <NoLigaContainer>
          <NoLigaTitle>Nenhuma liga ainda</NoLigaTitle>
          <NoLigaSubtitle>{'Crie uma liga e compartilhe o código\ncom seus amigos para competir!'}</NoLigaSubtitle>
          <LigaActionBtn onPress={openCreate}><LigaActionBtnText>Criar liga</LigaActionBtnText></LigaActionBtn>
          <LigaActionBtn outline onPress={openJoin}><LigaActionBtnText outline>Entrar com código</LigaActionBtnText></LigaActionBtn>
        </NoLigaContainer>
        {modais}
      </>
    );
  }

  // ── Lista de ligas + ranking da selecionada ────────────────────────────
  return (
    <>
      {/* Lista de ligas */}
      <LigaListContainer>
        {ligas.map(l => (
          <LigaListItem key={l.id} active={selectedLiga?.id === l.id} onPress={() => selectLiga(l)}>
            <LigaListItemName active={selectedLiga?.id === l.id}>{l.nome}</LigaListItemName>
            <LigaListItemCode>{l.codigo}</LigaListItemCode>
            <Ionicons
              name="chevron-forward"
              size={14}
              color={selectedLiga?.id === l.id ? theme.colors.accent.green : theme.colors.text.muted}
            />
          </LigaListItem>
        ))}
      </LigaListContainer>

      {/* Botões criar / entrar */}
      <LigaActionsRow>
        <LigaActionSmallBtn onPress={openCreate}>
          <LigaActionSmallBtnText>+ Criar liga</LigaActionSmallBtnText>
        </LigaActionSmallBtn>
        <LigaActionSmallBtn outline onPress={openJoin}>
          <LigaActionSmallBtnText outline>Entrar com código</LigaActionSmallBtnText>
        </LigaActionSmallBtn>
      </LigaActionsRow>

      {/* Ranking da liga selecionada */}
      {selectedLiga && (
        <LigaCard>
          <LigaCardHeader>
            <LigaName>{selectedLiga.nome}</LigaName>
            <LigaLeaveBtn onPress={() => handleLeave(selectedLiga)}>
              <LigaLeaveBtnText>Sair</LigaLeaveBtnText>
            </LigaLeaveBtn>
          </LigaCardHeader>

          <LigaCodeRow onPress={handleShare}>
            <LigaCodeLabel>CÓDIGO</LigaCodeLabel>
            <LigaCodeValue>{selectedLiga.codigo}</LigaCodeValue>
            <Ionicons name="share-outline" size={14} color={theme.colors.accent.green} />
          </LigaCodeRow>

          {ranking.map((m, i) => {
            const isMe = m.usuario_id === user?.id;
            return (
              <RankingRow key={m.usuario_id} isMe={isMe}>
                <RankPosition top={i < 3}>{i + 1}</RankPosition>
                <RankApelido isMe={isMe}>
                  {m.apelido}{isMe && <RankMeTag> (você)</RankMeTag>}
                </RankApelido>
                <RankPoints>{m.pontos} pts</RankPoints>
              </RankingRow>
            );
          })}
        </LigaCard>
      )}

      {modais}
    </>
  );
}

// ── PalpitesScreen ─────────────────────────────────────────────────────

export function PalpitesScreen() {
  const { live, today, upcoming, recent, loading, refresh } = useMatchesContext();
  const { palpites, bracket, savePalpite, saveBracket, removeBracket } = usePalpites();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('jogos');

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  // All matches deduplicated and sorted
  const allMatches = useMemo(() => {
    const map = new Map<number, IMatch>();
    [...recent, ...live, ...today, ...upcoming].forEach(m => map.set(m.id, m));
    return [...map.values()].sort(
      (a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime(),
    );
  }, [recent, live, today, upcoming]);

  // Unique dates → pages of 2
  const pages = useMemo(() => {
    const dates = [...new Set(allMatches.map(m => m.utcDate.split('T')[0]))].sort();
    const result: string[][] = [];
    for (let i = 0; i < dates.length; i += 2) result.push(dates.slice(i, i + 2));
    return result;
  }, [allMatches]);

  // Default to page containing today
  const todayStr = new Date().toISOString().split('T')[0];
  const initialPage = Math.max(0, pages.findIndex(p => p.some(d => d >= todayStr)));
  const [page, setPage] = useState(initialPage >= 0 ? initialPage : 0);

  const currentDates = pages[page] ?? [];
  const pageMatches = allMatches.filter(m => currentDates.includes(m.utcDate.split('T')[0]));

  // Stats — per-game
  const finished     = allMatches.filter(m => m.status === 'FINISHED' && palpites[m.id]);
  const exact        = finished.filter(m => getPalpiteResult(palpites[m.id], m.score.fullTime.home, m.score.fullTime.away, m.status) === 'exact').length;
  const winner       = finished.filter(m => getPalpiteResult(palpites[m.id], m.score.fullTime.home, m.score.fullTime.away, m.status) === 'winner').length;
  const wrong        = finished.filter(m => getPalpiteResult(palpites[m.id], m.score.fullTime.home, m.score.fullTime.away, m.status) === 'wrong').length;
  const gamePoints   = exact * 3 + winner * 1;

  // Bracket locks only when a knockout stage match actually starts (not merely scheduled)
  const bracketLocked = useMemo(() =>
    allMatches.some(m =>
      NON_GROUP_STAGES.includes(m.stage ?? '') &&
      ['IN_PLAY', 'PAUSED', 'FINISHED'].includes(m.status),
    ),
  [allMatches]);

  // Stats — bracket calculado dos resultados reais dos matches
  const actualBracket = useMemo(() => buildActualBracket(allMatches), [allMatches]);
  const bracketPoints = getBracketPoints(bracket, actualBracket);
  const points        = gamePoints + bracketPoints;

  // ── Sync points to Supabase (debounced 2s) + sinaliza ranking ────────
  const { user } = useAuth();
  const [rankingRefreshKey, setRankingRefreshKey] = useState(0);
  useEffect(() => {
    if (!user?.id) return;
    const timer = setTimeout(async () => {
      await supabase
        .from('membros_liga')
        .update({ pontos: points })
        .eq('usuario_id', user.id);
      // Avisa RankingTab que os pontos mudaram → ele re-busca do Supabase
      setRankingRefreshKey(k => k + 1);
    }, 2000);
    return () => clearTimeout(timer);
  }, [points, user?.id]);
  // ─────────────────────────────────────────────────────────────────────

  // Group current page matches by date
  const byDate = useMemo(() => {
    const map = new Map<string, IMatch[]>();
    pageMatches.forEach(m => {
      const d = m.utcDate.split('T')[0];
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(m);
    });
    return map;
  }, [pageMatches]);

  if (loading && !refreshing) {
    return (
      <Screen>
        <ActivityIndicator size="large" color={theme.colors.accent.green} style={{ flex: 1 }} />
      </Screen>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background.primary }} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 30}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.accent.green}
              colors={[theme.colors.accent.green]}
            />
          }
        >
          <Header>
            <Wordmark>
              <WordmarkCopa>PALPITES</WordmarkCopa>
            </Wordmark>
            <SubTitle>Faça suas previsões · Copa 2026</SubTitle>
          </Header>

          <StatsBar>
            <StatChip>
              <StatValue color={theme.colors.accent.gold}>{points}</StatValue>
              <StatLabel>Pontos</StatLabel>
            </StatChip>
            <StatChip>
              <StatValue color={theme.colors.accent.green}>{exact}</StatValue>
              <StatLabel>Exatos</StatLabel>
            </StatChip>
            <StatChip>
              <StatValue color={theme.colors.accent.gold}>{winner}</StatValue>
              <StatLabel>Vencedor</StatLabel>
            </StatChip>
            <StatChip>
              <StatValue color={theme.colors.accent.live}>{wrong}</StatValue>
              <StatLabel>Erros</StatLabel>
            </StatChip>
          </StatsBar>

          <TabSwitcher>
            <TabBtn active={activeTab === 'jogos'} onPress={() => setActiveTab('jogos')}>
              <TabBtnText active={activeTab === 'jogos'}>Por Jogo</TabBtnText>
            </TabBtn>
            <TabBtn active={activeTab === 'bracket'} onPress={() => setActiveTab('bracket')}>
              <TabBtnText active={activeTab === 'bracket'}>Fase Final</TabBtnText>
            </TabBtn>
            <TabBtn active={activeTab === 'ranking'} onPress={() => setActiveTab('ranking')}>
              <TabBtnText active={activeTab === 'ranking'}>Liga</TabBtnText>
            </TabBtn>
          </TabSwitcher>

          {activeTab === 'jogos' && (
            <>
              {pages.length > 1 && (
                <PaginationRow>
                  <PageArrow
                    disabled={page === 0}
                    onPress={() => setPage(p => Math.max(0, p - 1))}
                  >
                    <Ionicons
                      name="chevron-back"
                      size={18}
                      color={page === 0 ? theme.colors.background.elevated : theme.colors.text.mid}
                    />
                  </PageArrow>
                  <TouchableOpacity
                    onPress={() => setPage(initialPage >= 0 ? initialPage : 0)}
                    activeOpacity={page === initialPage ? 1 : 0.6}
                    style={{ alignItems: 'center' }}
                  >
                    <PageInfo>
                      {currentDates.map(d => {
                        const dt = new Date(d + 'T12:00:00');
                        return isToday(d + 'T00:00:00Z')
                          ? 'Hoje'
                          : dt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
                      }).join(' · ')}
                    </PageInfo>
                    {page !== initialPage && (
                      <PageTodayHint>↩ voltar para hoje</PageTodayHint>
                    )}
                  </TouchableOpacity>
                  <PageArrow
                    disabled={page === pages.length - 1}
                    onPress={() => setPage(p => Math.min(pages.length - 1, p + 1))}
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={page === pages.length - 1 ? theme.colors.background.elevated : theme.colors.text.mid}
                    />
                  </PageArrow>
                </PaginationRow>
              )}

              {pageMatches.length === 0 ? (
                <EmptyStateGlobal message="Nenhum jogo neste período" icon="calendar-outline" />
              ) : (
                Array.from(byDate.entries()).map(([dateKey, matches]) => (
                  <React.Fragment key={dateKey}>
                    <DateLabel today={isToday(dateKey + 'T00:00:00Z')}>
                      {isToday(dateKey + 'T00:00:00Z')
                        ? 'HOJE'
                        : formatDayShort(dateKey + 'T00:00:00Z')}
                    </DateLabel>
                    <CardList>
                      {matches.map(match => (
                        <PalpiteCardItem
                          key={match.id}
                          match={match}
                          palpite={palpites[match.id]}
                          onSave={savePalpite}
                        />
                      ))}
                    </CardList>
                  </React.Fragment>
                ))
              )}
            </>
          )}

          {activeTab === 'bracket' && (
            <BracketTab
              bracket={bracket}
              locked={bracketLocked}
              actual={actualBracket}
              onSave={saveBracket}
              onRemove={removeBracket}
            />
          )}

          {activeTab === 'ranking' && <RankingTab pointsKey={rankingRefreshKey} />}

          <BottomSpacer />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
