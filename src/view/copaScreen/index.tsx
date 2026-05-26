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
<<<<<<< HEAD
  { key: 'ROUND_OF_32',    label: '16 Avos de Final' },
  { key: 'ROUND_OF_16',    label: 'Oitavas de Final' },
  { key: 'QUARTER_FINALS', label: 'Quartas de Final' },
  { key: 'SEMI_FINALS',    label: 'Semifinais'       },
=======
  { key: 'ROUND_OF_32',    label: '16avos de Final',  count: 16 },
  { key: 'ROUND_OF_16',    label: 'Oitavas de Final', count: 8 },
  { key: 'QUARTER_FINALS', label: 'Quartas de Final', count: 4 },
  { key: 'SEMI_FINALS',    label: 'Semifinais',       count: 2 },
>>>>>>> c24eb18e45097c9360989fc971b985c26b07314c
] as const;

// Chaveamento oficial Copa 2026 (fonte: FIFA/Wikipedia)
// Fase de grupos: jogos 1-72 (12 grupos × 6 partidas)
// Eliminatórios: 73-88 (16 avos) → 89-96 (oitavas) → 97-100 (quartas) → 101-102 (semi) → 104 (final)
//
// Lógica do árbol (quem alimenta quem):
// R32 Chave A: J73,74,75,77,81,82,83,84 → R16 Chave A: J89,90,93,94 → QF: J97,98 → SF: J101
// R32 Chave B: J76,78,79,80,85,86,87,88 → R16 Chave B: J91,92,95,96 → QF: J99,100 → SF: J102
const STAGE_TEMPLATES: Record<string, Array<{ match: number; home: string; away: string }>> = {
  // 16 Avos (jogos 73-88) — confrontos oficiais da Copa 2026
  // Chave A = coluna esquerda (J73-J80) → oitavas J89-J92 → quartas J97, J99
  // Chave B = coluna direita  (J81-J88) → oitavas J93-J96 → quartas J98, J100
  // Dentro de cada chave, pares adjacentes se encontram na mesma oitava
  ROUND_OF_32: [
    // ── Chave A (J73-J80): pares → J90, J89, J91, J92 ──
    { match: 73, home: '2º Grupo A', away: '2º Grupo B'  }, // par com J75 → J90
    { match: 75, home: '1º Grupo F', away: '2º Grupo C'  }, // par com J73 → J90
    { match: 74, home: '1º Grupo E', away: '3º ABCDF'    }, // par com J77 → J89
    { match: 77, home: '1º Grupo I', away: '3º CDFGH'    }, // par com J74 → J89
    { match: 76, home: '1º Grupo C', away: '2º Grupo F'  }, // par com J78 → J91
    { match: 78, home: '2º Grupo E', away: '2º Grupo I'  }, // par com J76 → J91
    { match: 79, home: '1º Grupo A', away: '3º CEFHI'    }, // par com J80 → J92
    { match: 80, home: '1º Grupo L', away: '3º EHIJK'    }, // par com J79 → J92
    // ── Chave B (J81-J88): pares → J93, J94, J95, J96 ──
    { match: 83, home: '2º Grupo K', away: '2º Grupo L'  }, // par com J84 → J93
    { match: 84, home: '1º Grupo H', away: '2º Grupo J'  }, // par com J83 → J93
    { match: 81, home: '1º Grupo D', away: '3º BEFIJ'    }, // par com J82 → J94
    { match: 82, home: '1º Grupo G', away: '3º AEHIJ'    }, // par com J81 → J94
    { match: 86, home: '1º Grupo J', away: '2º Grupo H'  }, // par com J88 → J95
    { match: 88, home: '2º Grupo D', away: '2º Grupo G'  }, // par com J86 → J95
    { match: 85, home: '1º Grupo B', away: '3º EFGIJ'    }, // par com J87 → J96
    { match: 87, home: '1º Grupo K', away: '3º DEIJL'    }, // par com J85 → J96
  ],
  // Oitavas (jogos 89-96)
  // Chave A = J89-J92 (vencedores da coluna esquerda dos 16-avos)
  // Chave B = J93-J96 (vencedores da coluna direita dos 16-avos)
  ROUND_OF_16: [
    // ── Chave A: pares → J97, J99 ──
    { match: 90, home: 'Vitória 73', away: 'Vitória 75'  }, // par com J89 → J97
    { match: 89, home: 'Vitória 74', away: 'Vitória 77'  }, // par com J90 → J97
    { match: 91, home: 'Vitória 76', away: 'Vitória 78'  }, // par com J92 → J99
    { match: 92, home: 'Vitória 79', away: 'Vitória 80'  }, // par com J91 → J99
    // ── Chave B: pares → J98, J100 ──
    { match: 93, home: 'Vitória 83', away: 'Vitória 84'  }, // par com J94 → J98
    { match: 94, home: 'Vitória 81', away: 'Vitória 82'  }, // par com J93 → J98
    { match: 95, home: 'Vitória 86', away: 'Vitória 88'  }, // par com J96 → J100
    { match: 96, home: 'Vitória 85', away: 'Vitória 87'  }, // par com J95 → J100
  ],
  // Quartas (jogos 97-100)
  // Chave A = J97 + J99 (ambos da Chave A das oitavas)
  // Chave B = J98 + J100 (ambos da Chave B das oitavas)
  QUARTER_FINALS: [
    // ── Chave A ──
    { match: 97,  home: 'Vitória 89', away: 'Vitória 90'  },
    { match: 99,  home: 'Vitória 91', away: 'Vitória 92'  },
    // ── Chave B ──
    { match: 98,  home: 'Vitória 93', away: 'Vitória 94'  },
    { match: 100, home: 'Vitória 95', away: 'Vitória 96'  },
  ],
  // Semifinais (jogos 101-102): cruzamento entre Chave A e Chave B
  SEMI_FINALS: [
    { match: 101, home: 'Vitória 97', away: 'Vitória 98'  },
    { match: 102, home: 'Vitória 99', away: 'Vitória 100' },
  ],
};

function isTbd(tla: string | undefined): boolean {
  return !tla || tla === 'TBD' || tla === '' || tla === '?';
}

function stageHasRealTeams(matches: IMatch[]): boolean {
  return matches.some(m => !isTbd(m.homeTeam.tla) || !isTbd(m.awayTeam.tla));
}

function BracketTemplateItem({ match, home, away }: { match: number; home: string; away: string }) {
  return (
    <BracketMatchBox>
      <BracketMatchStatus>Jogo {match}</BracketMatchStatus>
      <BracketMatchDivider />
      <BracketTeamLine tbd={true}>
        <BracketTLA tbd={true}>{home}</BracketTLA>
      </BracketTeamLine>
      <BracketMatchDivider />
      <BracketTeamLine tbd={true}>
        <BracketTLA tbd={true}>{away}</BracketTLA>
      </BracketTeamLine>
    </BracketMatchBox>
  );
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
  const { knockout } = useMatchesContext();

  const allMatches = useMemo(() => {
    return [...knockout].sort(
      (a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime(),
    );
  }, [knockout]);

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

  const finalMatch = byStage['FINAL']?.[0] ?? null;
  const finalHasRealTeams = finalMatch ? stageHasRealTeams([finalMatch]) : false;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {KNOCKOUT_STAGES.map(stage => {
        const matches  = byStage[stage.key] ?? [];
        const hasReal  = matches.length > 0 && stageHasRealTeams(matches);
        const template = STAGE_TEMPLATES[stage.key] ?? [];
        const half     = Math.ceil(template.length / 2);

        const mid   = Math.ceil(matches.length / 2);
        const left  = matches.slice(0, mid);
        const right = matches.slice(mid);

        return (
          <BracketRoundSection key={stage.key}>
            <BracketRoundHeader>
              <BracketRoundLabel>{stage.label}</BracketRoundLabel>
              {hasReal ? (
                <BracketRoundCount>{matches.length} jogos</BracketRoundCount>
              ) : (
                <BracketRoundCount>Projeção</BracketRoundCount>
              )}
            </BracketRoundHeader>

            {hasReal ? (
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
            ) : (
              <BracketSidesRow>
                <BracketSide>
                  <BracketSideLabel>◀ Chave A</BracketSideLabel>
                  {template.slice(0, half).map(slot => (
                    <BracketTemplateItem key={slot.match} match={slot.match} home={slot.home} away={slot.away} />
                  ))}
                </BracketSide>
                <BracketSide>
                  <BracketSideLabel style={{ textAlign: 'right' }}>Chave B ▶</BracketSideLabel>
                  {template.slice(half).map(slot => (
                    <BracketTemplateItem key={slot.match} match={slot.match} home={slot.home} away={slot.away} />
                  ))}
                </BracketSide>
              </BracketSidesRow>
            )}
          </BracketRoundSection>
        );
      })}

      <BracketFinalSection>
        <BracketFinalLabel>🏆  FINAL  🏆</BracketFinalLabel>
        {finalMatch && finalHasRealTeams ? (
          <BracketFinalItem match={finalMatch} />
        ) : (
          <BracketFinalCard>
            <BracketMatchStatus>Jogo 104</BracketMatchStatus>
            <BracketMatchDivider />
            <BracketFinalTeamLine tbd={true}>
              <BracketFinalTLA tbd={true}>Vitória 101</BracketFinalTLA>
            </BracketFinalTeamLine>
            <BracketMatchDivider />
            <BracketFinalTeamLine tbd={true}>
              <BracketFinalTLA tbd={true}>Vitória 102</BracketFinalTLA>
            </BracketFinalTeamLine>
          </BracketFinalCard>
        )}
      </BracketFinalSection>

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
