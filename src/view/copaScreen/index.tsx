import React, { useState, useMemo } from 'react';
import {
  ScrollView, RefreshControl, ActivityIndicator, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStandings } from '../../hooks/useStandings';
import { useScorers } from '../../hooks/useScorers';
import { useMatchesContext } from '../../providers/MatchesProvider';
import { IMatch } from '../../@types';
import { GroupTableGlobal } from '../../components/groupTableGlobal';
import { EmptyStateGlobal } from '../../components/emptyStateGlobal';
import { SearchBarGlobal } from '../../components/searchBarGlobal';
import { CrestGlobal } from '../../components/crestGlobal';
import { theme } from '../../constants/theme';
import {
  Screen, Header, Wordmark, WordmarkCopa, WordmarkYear, SubTitle,
  TabSwitcher, TabBtn, TabBtnText,
  FilterScroll, FilterChip, FilterChipText, GroupList,
  ScorerCard, ScorerRank, ScorerInfo, ScorerName, ScorerTeam,
  ScorerStats, ScorerGoals, ScorerAssists,
  BottomSpacer,
  BracketRoundSection, BracketRoundHeader, BracketRoundLabel, BracketRoundCount,
  BracketSidesRow, BracketSide, BracketSideLabel,
  BracketMatchBox, BracketTeamLine, BracketTLA, BracketScoreNum,
  BracketMatchDivider, BracketMatchStatus,
  BracketFinalSection, BracketFinalLabel, BracketFinalCard,
  BracketFinalTeamLine, BracketFinalTLA, BracketFinalScore,
  ChampionBanner, ChampionLabel, ChampionName,
  BracketPendingBox, BracketPendingText,
} from './style';

type ActiveTab = 'grupos' | 'chaveamento' | 'artilheiros';

// ── helpers ────────────────────────────────────────────────────────────

function getGroupLabel(groupCode: string | null, index: number): string {
  if (!groupCode) return `Grupo ${String.fromCharCode(65 + index)}`;
  const letter = groupCode.replace(/^GROUP_/i, '').replace(/^Group\s*/i, '').trim();
  return `Grupo ${letter}`;
}

function getGroupKey(groupCode: string | null, index: number): string {
  return groupCode ?? `group-${index}`;
}

// ── GruposTab ──────────────────────────────────────────────────────────

interface IGruposTabProps {
  groups: ReturnType<typeof useStandings>['groups'];
  refreshing: boolean;
  onRefresh: () => void;
}

function GruposTab({ groups, refreshing, onRefresh }: IGruposTabProps) {
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [search, setSearch] = useState('');

  const filters = ['Todos', ...groups.map((g, i) => getGroupLabel(g.group, i))];

  const visibleGroups = groups
    .filter((g, i) => selectedFilter === 'Todos' || getGroupLabel(g.group, i) === selectedFilter)
    .filter(g => {
      const term = search.toLowerCase().trim();
      if (!term) return true;
      return g.table.some(s =>
        s.team.name?.toLowerCase().includes(term) ||
        s.team.shortName?.toLowerCase().includes(term) ||
        s.team.tla?.toLowerCase().includes(term),
      );
    });

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.accent.green}
          colors={[theme.colors.accent.green]}
        />
      }
    >
      <SearchBarGlobal value={search} onChangeText={setSearch} />
      <FilterScroll
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 6 }}
      >
        {filters.map(f => (
          <FilterChip key={f} active={selectedFilter === f} onPress={() => setSelectedFilter(f)}>
            <FilterChipText active={selectedFilter === f}>{f}</FilterChipText>
          </FilterChip>
        ))}
      </FilterScroll>

      {groups.length === 0 ? (
        <EmptyStateGlobal
          message={'A tabela de grupos estará\ndisponível quando o torneio começar\n\n📅 Copa 2026 · 11 Jun'}
          icon="podium-outline"
        />
      ) : (
        <GroupList>
          {visibleGroups.map((group, index) => (
            <GroupTableGlobal
              key={getGroupKey(group.group, index)}
              group={group}
              index={index}
            />
          ))}
        </GroupList>
      )}
      <BottomSpacer />
    </ScrollView>
  );
}

// ── ArtilheirosTab ─────────────────────────────────────────────────────

function ArtilheirosTab() {
  const { scorers, loading, error, refresh } = useScorers();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (loading && !refreshing) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <ActivityIndicator color={theme.colors.accent.green} />
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={theme.colors.accent.green}
          colors={[theme.colors.accent.green]}
        />
      }
    >
      {error || scorers.length === 0 ? (
        <EmptyStateGlobal
          message={'Artilharia disponível\nquando a Copa começar\n\n📅 Copa 2026 · 11 Jun'}
          icon="football-outline"
        />
      ) : (
        scorers.map((s, i) => (
          <ScorerCard key={i}>
            <ScorerRank>{i + 1}</ScorerRank>
            <CrestGlobal tla={s.team.tla} size={28} teamName={s.team.name} />
            <ScorerInfo>
              <ScorerName numberOfLines={1}>{s.player.name}</ScorerName>
              <ScorerTeam>{s.team.shortName}</ScorerTeam>
            </ScorerInfo>
            <ScorerStats>
              <ScorerGoals>{s.goals} ⚽</ScorerGoals>
              {s.assists != null && s.assists > 0 && (
                <ScorerAssists>{s.assists} assist.</ScorerAssists>
              )}
            </ScorerStats>
          </ScorerCard>
        ))
      )}
      <BottomSpacer />
    </ScrollView>
  );
}

// ── ChaveamentoTab ─────────────────────────────────────────────────────

const KNOCKOUT_STAGES = [
  { key: 'ROUND_OF_16',    label: 'Oitavas de Final', count: 8 },
  { key: 'QUARTER_FINALS', label: 'Quartas de Final', count: 4 },
  { key: 'SEMI_FINALS',    label: 'Semifinais',       count: 2 },
] as const;

function isTbd(tla: string | undefined): boolean {
  return !tla || tla === 'TBD' || tla === '' || tla === '?';
}

function BracketMatchItem({ match }: { match: IMatch }) {
  const finished = match.status === 'FINISHED';
  const live     = match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const hasScore = match.score.fullTime.home !== null;
  const hScore   = match.score.fullTime.home ?? 0;
  const aScore   = match.score.fullTime.away ?? 0;
  const homeWon  = finished && hScore > aScore;
  const awayWon  = finished && aScore > hScore;
  const homeTbd  = isTbd(match.homeTeam.tla);
  const awayTbd  = isTbd(match.awayTeam.tla);

  return (
    <BracketMatchBox>
      <BracketTeamLine winner={homeWon} tbd={homeTbd}>
        {!homeTbd && (
          <CrestGlobal tla={match.homeTeam.tla} size={14} teamName={match.homeTeam.name} />
        )}
        <BracketTLA winner={homeWon} tbd={homeTbd}>
          {homeTbd ? '?' : match.homeTeam.tla}
        </BracketTLA>
        {hasScore && <BracketScoreNum winner={homeWon}>{hScore}</BracketScoreNum>}
      </BracketTeamLine>

      <BracketMatchDivider />

      <BracketTeamLine winner={awayWon} tbd={awayTbd}>
        {!awayTbd && (
          <CrestGlobal tla={match.awayTeam.tla} size={14} teamName={match.awayTeam.name} />
        )}
        <BracketTLA winner={awayWon} tbd={awayTbd}>
          {awayTbd ? '?' : match.awayTeam.tla}
        </BracketTLA>
        {hasScore && <BracketScoreNum winner={awayWon}>{aScore}</BracketScoreNum>}
      </BracketTeamLine>

      {(finished || live) && (
        <BracketMatchStatus live={live}>
          {live
            ? `● ${match.minute != null ? `${match.minute}'` : 'AO VIVO'}`
            : 'Encerrado'}
        </BracketMatchStatus>
      )}
    </BracketMatchBox>
  );
}

function BracketFinalItem({ match }: { match: IMatch }) {
  const finished = match.status === 'FINISHED';
  const live     = match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const hasScore = match.score.fullTime.home !== null;
  const hScore   = match.score.fullTime.home ?? 0;
  const aScore   = match.score.fullTime.away ?? 0;
  const homeWon  = finished && hScore > aScore;
  const awayWon  = finished && aScore > hScore;
  const homeTbd  = isTbd(match.homeTeam.tla);
  const awayTbd  = isTbd(match.awayTeam.tla);
  const champion = homeWon ? match.homeTeam : awayWon ? match.awayTeam : null;

  return (
    <>
      <BracketFinalCard>
        <BracketFinalTeamLine winner={homeWon} tbd={homeTbd}>
          {!homeTbd && (
            <CrestGlobal tla={match.homeTeam.tla} size={26} teamName={match.homeTeam.name} />
          )}
          <BracketFinalTLA winner={homeWon} tbd={homeTbd}>
            {homeTbd ? 'A definir' : match.homeTeam.tla}
          </BracketFinalTLA>
          {hasScore && <BracketFinalScore winner={homeWon}>{hScore}</BracketFinalScore>}
        </BracketFinalTeamLine>

        <BracketMatchDivider />

        <BracketFinalTeamLine winner={awayWon} tbd={awayTbd}>
          {!awayTbd && (
            <CrestGlobal tla={match.awayTeam.tla} size={26} teamName={match.awayTeam.name} />
          )}
          <BracketFinalTLA winner={awayWon} tbd={awayTbd}>
            {awayTbd ? 'A definir' : match.awayTeam.tla}
          </BracketFinalTLA>
          {hasScore && <BracketFinalScore winner={awayWon}>{aScore}</BracketFinalScore>}
        </BracketFinalTeamLine>

        {(finished || live) && (
          <BracketMatchStatus live={live}>
            {live
              ? `● ${match.minute != null ? `${match.minute}'` : 'AO VIVO'}`
              : 'Encerrado'}
          </BracketMatchStatus>
        )}
      </BracketFinalCard>

      {champion && (
        <ChampionBanner>
          <ChampionLabel>🏆 Campeão Mundial</ChampionLabel>
          <CrestGlobal tla={champion.tla} size={52} teamName={champion.name} />
          <ChampionName>{champion.tla}</ChampionName>
        </ChampionBanner>
      )}
    </>
  );
}

function ChaveamentoTab() {
  const { live, today, upcoming, recent } = useMatchesContext();

  const allMatches = useMemo(() => {
    const map = new Map<number, IMatch>();
    [...recent, ...live, ...today, ...upcoming].forEach(m => map.set(m.id, m));
    return [...map.values()].sort(
      (a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime(),
    );
  }, [recent, live, today, upcoming]);

  const byStage = useMemo(() => {
    const result: Record<string, IMatch[]> = {};
    allMatches.forEach(m => {
      if (!m.stage) return;
      const stages = ['ROUND_OF_32', 'ROUND_OF_16', 'QUARTER_FINALS', 'SEMI_FINALS', 'FINAL'];
      if (!stages.includes(m.stage)) return;
      if (!result[m.stage]) result[m.stage] = [];
      result[m.stage].push(m);
    });
    return result;
  }, [allMatches]);

  const finalMatch  = byStage['FINAL']?.[0] ?? null;
  const hasKnockout = Object.keys(byStage).length > 0;

  if (!hasKnockout) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <EmptyStateGlobal
          message={'Chaveamento disponível\napós a fase de grupos\n\n📅 Copa 2026 · Jul 2026'}
          icon="git-branch-outline"
        />
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {KNOCKOUT_STAGES.map(stage => {
        const matches = byStage[stage.key] ?? [];
        const hasPending = matches.length === 0;

        const mid   = Math.ceil(matches.length / 2);
        const left  = matches.slice(0, mid);
        const right = matches.slice(mid);

        return (
          <BracketRoundSection key={stage.key}>
            <BracketRoundHeader>
              <BracketRoundLabel>{stage.label}</BracketRoundLabel>
              {!hasPending && (
                <BracketRoundCount>{matches.length} jogos</BracketRoundCount>
              )}
            </BracketRoundHeader>

            {hasPending ? (
              <BracketPendingBox>
                <Ionicons name="time-outline" size={14} color={theme.colors.text.muted} />
                <BracketPendingText>Aguardando fase anterior</BracketPendingText>
              </BracketPendingBox>
            ) : (
              <BracketSidesRow>
                <BracketSide>
                  <BracketSideLabel>◀ Chave A</BracketSideLabel>
                  {left.map(m => <BracketMatchItem key={m.id} match={m} />)}
                </BracketSide>

                <BracketSide>
                  <BracketSideLabel style={{ textAlign: 'right' }}>Chave B ▶</BracketSideLabel>
                  {right.map(m => <BracketMatchItem key={m.id} match={m} />)}
                </BracketSide>
              </BracketSidesRow>
            )}
          </BracketRoundSection>
        );
      })}

      {finalMatch && (
        <BracketFinalSection>
          <BracketFinalLabel>🏆  FINAL  🏆</BracketFinalLabel>
          <BracketFinalItem match={finalMatch} />
        </BracketFinalSection>
      )}

      <BottomSpacer />
    </ScrollView>
  );
}

// ── CopaScreen ─────────────────────────────────────────────────────────

export function CopaScreen() {
  const { groups, loading, refresh } = useStandings();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('grupos');

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (loading && !refreshing) {
    return (
      <Screen>
        <ActivityIndicator size="large" color={theme.colors.accent.green} style={{ flex: 1 }} />
      </Screen>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background.primary }} edges={['top']}>
      <Header>
        <Wordmark>
          <WordmarkCopa>COPA</WordmarkCopa>
          <WordmarkYear>26</WordmarkYear>
        </Wordmark>
        <SubTitle>FIFA Copa do Mundo 2026</SubTitle>
      </Header>

      <TabSwitcher>
        <TabBtn active={activeTab === 'grupos'} onPress={() => setActiveTab('grupos')}>
          <TabBtnText active={activeTab === 'grupos'}>Grupos</TabBtnText>
        </TabBtn>
        <TabBtn active={activeTab === 'chaveamento'} onPress={() => setActiveTab('chaveamento')}>
          <TabBtnText active={activeTab === 'chaveamento'}>Chaveamento</TabBtnText>
        </TabBtn>
        <TabBtn active={activeTab === 'artilheiros'} onPress={() => setActiveTab('artilheiros')}>
          <TabBtnText active={activeTab === 'artilheiros'}>Artilheiros</TabBtnText>
        </TabBtn>
      </TabSwitcher>

      {activeTab === 'grupos' && (
        <GruposTab groups={groups} refreshing={refreshing} onRefresh={handleRefresh} />
      )}
      {activeTab === 'chaveamento' && <ChaveamentoTab />}
      {activeTab === 'artilheiros' && <ArtilheirosTab />}
    </SafeAreaView>
  );
}
