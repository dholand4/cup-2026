import React, { useState } from 'react';
import {
  ScrollView, RefreshControl, ActivityIndicator, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStandings } from '../../hooks/useStandings';
import { useScorers } from '../../hooks/useScorers';
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
} from './style';

type ActiveTab = 'grupos' | 'artilheiros';

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
        <TabBtn active={activeTab === 'artilheiros'} onPress={() => setActiveTab('artilheiros')}>
          <TabBtnText active={activeTab === 'artilheiros'}>Artilheiros</TabBtnText>
        </TabBtn>
      </TabSwitcher>

      {activeTab === 'grupos' && (
        <GruposTab groups={groups} refreshing={refreshing} onRefresh={handleRefresh} />
      )}
      {activeTab === 'artilheiros' && <ArtilheirosTab />}
    </SafeAreaView>
  );
}
