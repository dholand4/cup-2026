import React, { useState, useMemo } from 'react';
import {
  ScrollView, RefreshControl, ActivityIndicator, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStandings } from '../../hooks/useStandings';
import { useScorers } from '../../hooks/useScorers';
import { useMatchesContext } from '../../providers/MatchesProvider';
import { IMatch } from '../../@types';
import { GroupTableGlobal } from '../../components/groupTableGlobal';
import { EmptyStateGlobal } from '../../components/emptyStateGlobal';
import { SearchBarGlobal } from '../../components/searchBarGlobal';
import { CrestGlobal } from '../../components/crestGlobal';
import { theme } from '../../constants/theme';
import { formatDayShort } from '../../utils/dateUtils';
import {
  Screen, Header, Wordmark, WordmarkCopa, WordmarkYear, SubTitle,
  TabSwitcher, TabBtn, TabBtnText,
  FilterScroll, FilterChip, FilterChipText, GroupList,
  ScorerCard, ScorerRank, ScorerInfo, ScorerName, ScorerTeam,
  ScorerStats, ScorerGoals, ScorerAssists,
  BottomSpacer,
  BracketMatchBox, BracketTeamLine, BracketTLA, BracketScoreNum,
  BracketMatchDivider, BracketMatchStatus,
  BracketPhasePill, BracketPhasePillText, BracketColHeader,
  ChampionBanner, ChampionLabel, ChampionName,
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

const MATCH_H  = 68;
const INNER_GAP = 8;
const OUTER_GAP = 20;
const CONN_W    = 20;
const PAIR_H    = MATCH_H * 2 + INNER_GAP;

type PhaseDef = {
  id: string;
  label: string;
  leftStage: string;
  rightStage: string;
  leftFull: string;
  rightFull: string;
};

const BRACKET_PHASES: PhaseDef[] = [
  { id: 'avos',    label: '16 Avos',  leftStage: 'ROUND_OF_32',    rightStage: 'ROUND_OF_16',    leftFull: '16 Avos de Final', rightFull: 'Oitavas de Final' },
  { id: 'oitavas', label: 'Oitavas',  leftStage: 'ROUND_OF_16',    rightStage: 'QUARTER_FINALS', leftFull: 'Oitavas de Final', rightFull: 'Quartas de Final' },
  { id: 'quartas', label: 'Quartas',  leftStage: 'QUARTER_FINALS', rightStage: 'SEMI_FINALS',    leftFull: 'Quartas de Final', rightFull: 'Semifinais'       },
  { id: 'semis',   label: 'Semis',    leftStage: 'SEMI_FINALS',    rightStage: 'FINAL',          leftFull: 'Semifinais',        rightFull: 'Final'            },
];

type TplSlot = { match: number; home: string; away: string };

const PHASE_TEMPLATES: Record<string, { left: TplSlot[]; right: TplSlot[] }> = {
  avos: {
    left: [
      { match: 73, home: '2º Gr. A', away: '2º Gr. B' },
      { match: 75, home: '1º Gr. F', away: '2º Gr. C' },
      { match: 74, home: '1º Gr. E', away: '3º ABCDF' },
      { match: 77, home: '1º Gr. I', away: '3º CDFGH' },
      { match: 76, home: '1º Gr. C', away: '2º Gr. F' },
      { match: 78, home: '2º Gr. E', away: '2º Gr. I' },
      { match: 79, home: '1º Gr. A', away: '3º CEFHI' },
      { match: 80, home: '1º Gr. L', away: '3º EHIJK' },
      { match: 83, home: '2º Gr. K', away: '2º Gr. L' },
      { match: 84, home: '1º Gr. H', away: '2º Gr. J' },
      { match: 81, home: '1º Gr. D', away: '3º BEFIJ' },
      { match: 82, home: '1º Gr. G', away: '3º AEHIJ' },
      { match: 86, home: '1º Gr. J', away: '2º Gr. H' },
      { match: 88, home: '2º Gr. D', away: '2º Gr. G' },
      { match: 85, home: '1º Gr. B', away: '3º EFGIJ' },
      { match: 87, home: '1º Gr. K', away: '3º DEIJL' },
    ],
    right: [
      { match: 90, home: 'Vit. J73', away: 'Vit. J75' },
      { match: 89, home: 'Vit. J74', away: 'Vit. J77' },
      { match: 91, home: 'Vit. J76', away: 'Vit. J78' },
      { match: 92, home: 'Vit. J79', away: 'Vit. J80' },
      { match: 93, home: 'Vit. J83', away: 'Vit. J84' },
      { match: 94, home: 'Vit. J81', away: 'Vit. J82' },
      { match: 95, home: 'Vit. J86', away: 'Vit. J88' },
      { match: 96, home: 'Vit. J85', away: 'Vit. J87' },
    ],
  },
  oitavas: {
    left: [
      { match: 90, home: 'Vit. J73', away: 'Vit. J75' },
      { match: 89, home: 'Vit. J74', away: 'Vit. J77' },
      { match: 91, home: 'Vit. J76', away: 'Vit. J78' },
      { match: 92, home: 'Vit. J79', away: 'Vit. J80' },
      { match: 93, home: 'Vit. J83', away: 'Vit. J84' },
      { match: 94, home: 'Vit. J81', away: 'Vit. J82' },
      { match: 95, home: 'Vit. J86', away: 'Vit. J88' },
      { match: 96, home: 'Vit. J85', away: 'Vit. J87' },
    ],
    right: [
      { match: 97,  home: 'Vit. J90', away: 'Vit. J89' },
      { match: 99,  home: 'Vit. J91', away: 'Vit. J92' },
      { match: 98,  home: 'Vit. J93', away: 'Vit. J94' },
      { match: 100, home: 'Vit. J95', away: 'Vit. J96' },
    ],
  },
  quartas: {
    left: [
      { match: 97,  home: 'Vit. J90', away: 'Vit. J89' },
      { match: 99,  home: 'Vit. J91', away: 'Vit. J92' },
      { match: 98,  home: 'Vit. J93', away: 'Vit. J94' },
      { match: 100, home: 'Vit. J95', away: 'Vit. J96' },
    ],
    right: [
      { match: 101, home: 'Vit. J97', away: 'Vit. J99' },
      { match: 102, home: 'Vit. J98', away: 'Vit. J100' },
    ],
  },
  semis: {
    left: [
      { match: 101, home: 'Vit. J97', away: 'Vit. J99' },
      { match: 102, home: 'Vit. J98', away: 'Vit. J100' },
    ],
    right: [
      { match: 104, home: 'Vit. J101', away: 'Vit. J102' },
    ],
  },
};

function isTbd(tla: string | undefined): boolean {
  return !tla || tla === 'TBD' || tla === '' || tla === '?';
}

// Compact match card — fixed height for bracket alignment
function CompactMatchCard({ match }: { match: IMatch }) {
  const finished = match.status === 'FINISHED';
  const live     = match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const hScore   = match.score.fullTime.home;
  const aScore   = match.score.fullTime.away;
  const homeWon  = finished && hScore !== null && aScore !== null && hScore > aScore;
  const awayWon  = finished && hScore !== null && aScore !== null && aScore > hScore;
  const homeTbd  = isTbd(match.homeTeam.tla);
  const awayTbd  = isTbd(match.awayTeam.tla);

  const statusLabel = live
    ? (match.minute != null ? `● ${match.minute}'` : '● AO VIVO')
    : finished
    ? (match.score.duration === 'PENALTY_SHOOTOUT' ? 'FT (PEN)' : match.score.duration === 'EXTRA_TIME' ? 'FT (PROR)' : 'FT')
    : formatDayShort(match.utcDate);

  return (
    <BracketMatchBox style={{ height: MATCH_H }}>
      <BracketMatchStatus live={live}>{statusLabel}</BracketMatchStatus>
      <BracketTeamLine winner={homeWon} tbd={homeTbd}>
        {!homeTbd && <CrestGlobal tla={match.homeTeam.tla} size={13} teamName={match.homeTeam.name} />}
        <BracketTLA winner={homeWon} tbd={homeTbd} numberOfLines={1}>
          {homeTbd ? '?' : match.homeTeam.tla}
        </BracketTLA>
        {hScore !== null && <BracketScoreNum winner={homeWon}>{hScore}</BracketScoreNum>}
      </BracketTeamLine>
      <BracketMatchDivider />
      <BracketTeamLine winner={awayWon} tbd={awayTbd}>
        {!awayTbd && <CrestGlobal tla={match.awayTeam.tla} size={13} teamName={match.awayTeam.name} />}
        <BracketTLA winner={awayWon} tbd={awayTbd} numberOfLines={1}>
          {awayTbd ? '?' : match.awayTeam.tla}
        </BracketTLA>
        {aScore !== null && <BracketScoreNum winner={awayWon}>{aScore}</BracketScoreNum>}
      </BracketTeamLine>
    </BracketMatchBox>
  );
}

// Template card — shown before real data is available
function CompactTplCard({ slot }: { slot: TplSlot }) {
  return (
    <BracketMatchBox style={{ height: MATCH_H }}>
      <BracketMatchStatus>J{slot.match}</BracketMatchStatus>
      <BracketTeamLine tbd>
        <BracketTLA tbd numberOfLines={1}>{slot.home}</BracketTLA>
      </BracketTeamLine>
      <BracketMatchDivider />
      <BracketTeamLine tbd>
        <BracketTLA tbd numberOfLines={1}>{slot.away}</BracketTLA>
      </BracketTeamLine>
    </BracketMatchBox>
  );
}

// Bracket-shaped connector lines between left-column pair and right-column match
function BracketConnector() {
  const topC = MATCH_H / 2;
  const botC = PAIR_H - MATCH_H / 2;
  const mid  = PAIR_H / 2;
  const VX   = CONN_W - 8; // x of the vertical bar
  const T    = 1.5;
  const C    = theme.colors.accent.gold;
  const OP   = 0.55;

  return (
    <View style={{ width: CONN_W, height: PAIR_H }}>
      {/* Horizontal arm: top match → vertical bar */}
      <View style={{ position: 'absolute', left: 0, top: topC - T / 2, width: VX, height: T, backgroundColor: C, opacity: OP }} />
      {/* Horizontal arm: bottom match → vertical bar */}
      <View style={{ position: 'absolute', left: 0, top: botC - T / 2, width: VX, height: T, backgroundColor: C, opacity: OP }} />
      {/* Vertical bar joining the two arms */}
      <View style={{ position: 'absolute', left: VX - T / 2, top: topC, width: T, height: botC - topC, backgroundColor: C, opacity: OP }} />
      {/* Horizontal arm: vertical bar → right match */}
      <View style={{ position: 'absolute', left: VX, top: mid - T / 2, right: 0, height: T, backgroundColor: C, opacity: OP }} />
    </View>
  );
}

type BracketRowProps = {
  topMatch: IMatch | null;
  bottomMatch: IMatch | null;
  rightMatch: IMatch | null;
  topTpl: TplSlot;
  bottomTpl: TplSlot;
  rightTpl: TplSlot;
};

function BracketRow({ topMatch, bottomMatch, rightMatch, topTpl, bottomTpl, rightTpl }: BracketRowProps) {
  return (
    <View style={{ flexDirection: 'row', marginBottom: OUTER_GAP }}>
      {/* Left column — two matches stacked */}
      <View style={{ flex: 1 }}>
        {topMatch ? <CompactMatchCard match={topMatch} /> : <CompactTplCard slot={topTpl} />}
        <View style={{ height: INNER_GAP }} />
        {bottomMatch ? <CompactMatchCard match={bottomMatch} /> : <CompactTplCard slot={bottomTpl} />}
      </View>

      <BracketConnector />

      {/* Right column — single match, vertically centred inside PAIR_H */}
      <View style={{ flex: 1, height: PAIR_H, justifyContent: 'center' }}>
        {rightMatch ? <CompactMatchCard match={rightMatch} /> : <CompactTplCard slot={rightTpl} />}
      </View>
    </View>
  );
}

function ChaveamentoTab() {
  const { knockout } = useMatchesContext();
  const [activePhase, setActivePhase] = useState('avos');

  const byStage = useMemo(() => {
    const result: Record<string, IMatch[]> = {};
    knockout.forEach(m => {
      if (!m.stage) return;
      if (!result[m.stage]) result[m.stage] = [];
      result[m.stage].push(m);
    });
    Object.keys(result).forEach(k => {
      result[k].sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());
    });
    return result;
  }, [knockout]);

  const phase    = BRACKET_PHASES.find(p => p.id === activePhase)!;
  const tpl      = PHASE_TEMPLATES[activePhase];
  const leftMs   = byStage[phase.leftStage]  ?? [];
  const rightMs  = byStage[phase.rightStage] ?? [];
  const pairCount = tpl.right.length;

  const isSemisPhase = phase.rightStage === 'FINAL';
  const finalMatch   = isSemisPhase ? (rightMs[0] ?? null) : null;
  const champion = (() => {
    if (!finalMatch || finalMatch.status !== 'FINISHED') return null;
    const h = finalMatch.score.fullTime.home ?? 0;
    const a = finalMatch.score.fullTime.away ?? 0;
    return h > a ? finalMatch.homeTeam : finalMatch.awayTeam;
  })();

  return (
    <View style={{ flex: 1 }}>
      {/* Phase selector pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 12 }}
      >
        {BRACKET_PHASES.map(p => (
          <BracketPhasePill key={p.id} active={p.id === activePhase} onPress={() => setActivePhase(p.id)}>
            <BracketPhasePillText active={p.id === activePhase}>{p.label.toUpperCase()}</BracketPhasePillText>
          </BracketPhasePill>
        ))}
      </ScrollView>

      {/* Column headers */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 12, marginBottom: 10, alignItems: 'center' }}>
        <BracketColHeader style={{ flex: 1 }}>{phase.leftFull}</BracketColHeader>
        <View style={{ width: CONN_W }} />
        <BracketColHeader style={{ flex: 1 }}>{phase.rightFull}</BracketColHeader>
      </View>

      {/* Bracket rows */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 20 }}>
        {Array.from({ length: pairCount }).map((_, i) => (
          <BracketRow
            key={i}
            topMatch={leftMs[i * 2] ?? null}
            bottomMatch={leftMs[i * 2 + 1] ?? null}
            rightMatch={rightMs[i] ?? null}
            topTpl={tpl.left[i * 2]}
            bottomTpl={tpl.left[i * 2 + 1]}
            rightTpl={tpl.right[i]}
          />
        ))}

        {champion && (
          <ChampionBanner style={{ marginTop: 4 }}>
            <ChampionLabel>🏆 Campeão Mundial</ChampionLabel>
            <CrestGlobal tla={champion.tla} size={52} teamName={champion.name} />
            <ChampionName>{champion.tla}</ChampionName>
          </ChampionBanner>
        )}

        <BottomSpacer />
      </ScrollView>
    </View>
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
