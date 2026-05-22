import React, { useState } from 'react';
import { ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStandings } from '../../hooks/useStandings';
import { GroupTableGlobal } from '../../components/groupTableGlobal';
import { EmptyStateGlobal } from '../../components/emptyStateGlobal';
import { SearchBarGlobal } from '../../components/searchBarGlobal';
import { theme } from '../../constants/theme';
import {
  Screen,
  Header,
  Wordmark,
  WordmarkCopa,
  WordmarkYear,
  SubTitle,
  FilterScroll,
  FilterChip,
  FilterChipText,
  GroupList,
  BottomSpacer,
} from './style';

function getGroupLabel(groupCode: string | null, index: number): string {
  if (!groupCode) return `Grupo ${String.fromCharCode(65 + index)}`;
  // handles both "GROUP_A" and "Group A" formats
  const letter = groupCode.replace(/^GROUP_/i, '').replace(/^Group\s*/i, '').trim();
  return `Grupo ${letter}`;
}

function getGroupKey(groupCode: string | null, index: number): string {
  return groupCode ?? `group-${index}`;
}

export function GroupsScreen() {
  const { groups, loading, error, refresh } = useStandings();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('Todos');
  const [search, setSearch] = useState('');

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

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

  if (loading && !refreshing) {
    return (
      <Screen>
        <ActivityIndicator size="large" color={theme.colors.accent.green} style={{ flex: 1 }} />
      </Screen>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background.primary }} edges={['top']}>
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
        <Header>
          <Wordmark>
            <WordmarkCopa>GRUPO</WordmarkCopa>
          </Wordmark>
          <SubTitle>Fase de grupos · Copa 2026</SubTitle>
        </Header>

        <SearchBarGlobal value={search} onChangeText={setSearch} />
        <FilterScroll
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 6 }}
        >
          {filters.map(f => (
            <FilterChip
              key={f}
              active={selectedFilter === f}
              onPress={() => setSelectedFilter(f)}
            >
              <FilterChipText active={selectedFilter === f}>{f}</FilterChipText>
            </FilterChip>
          ))}
        </FilterScroll>

        {error && visibleGroups.length === 0 && (
          <EmptyStateGlobal
            message={`Não foi possível carregar os grupos.\n${error}`}
            icon="wifi-outline"
          />
        )}

        {!error && groups.length === 0 && (
          <EmptyStateGlobal
            message={'A tabela de grupos estará\ndisponível quando o torneio começar\n\n📅 Copa 2026 · 11 Jun'}
            icon="podium-outline"
          />
        )}

        <GroupList>
          {visibleGroups.map((group, index) => (
            <GroupTableGlobal
              key={getGroupKey(group.group, index)}
              group={group}
              index={index}
            />
          ))}
        </GroupList>

        <BottomSpacer />
      </ScrollView>
    </SafeAreaView>
  );
}
