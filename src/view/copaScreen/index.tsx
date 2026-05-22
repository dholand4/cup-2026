import React, { useState, useMemo } from 'react';
import {
  ScrollView, RefreshControl, ActivityIndicator,
  Modal, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { IGroup, ITeam } from '../../@types';
import { useStandings } from '../../hooks/useStandings';
import { useScorers } from '../../hooks/useScorers';
import { useTeamDetail } from '../../hooks/useTeamDetail';
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
  TeamCard, TeamCardInfo, TeamCardName, TeamCardGroup,
  ModalOverlay, ModalSheet, ModalHandle, ModalScroll,
  ModalCloseBtn, ModalCloseText,
  TeamProfileHeader, TeamProfileName, TeamProfileDetail,
  SectionLabel, CoachCard, CoachName, CoachNat,
  PlayerItem, PlayerNum, PlayerNameText, PlayerPos,
  BottomSpacer,
} from './style';

type ActiveTab = 'grupos' | 'selecoes' | 'artilheiros';

// ── helpers ────────────────────────────────────────────────────────────

function getGroupLabel(groupCode: string | null, index: number): string {
  if (!groupCode) return `Grupo ${String.fromCharCode(65 + index)}`;
  const letter = groupCode.replace(/^GROUP_/i, '').replace(/^Group\s*/i, '').trim();
  return `Grupo ${letter}`;
}

function getGroupKey(groupCode: string | null, index: number): string {
  return groupCode ?? `group-${index}`;
}

const POSITION_ORDER: Record<string, number> = {
  Goalkeeper: 0, Offence: 1, Defence: 2, Midfield: 3, Forward: 4,
};

// ── TeamProfileModal ───────────────────────────────────────────────────

interface ITeamProfileProps {
  teamId: number | null;
  onClose: () => void;
}

function TeamProfileModal({ teamId, onClose }: ITeamProfileProps) {
  const { team, loading, error } = useTeamDetail(teamId);

  const squadByPosition = useMemo(() => {
    if (!team?.squad) return [];
    const sorted = [...team.squad].sort(
      (a, b) => (POSITION_ORDER[a.position ?? ''] ?? 9) - (POSITION_ORDER[b.position ?? ''] ?? 9),
    );
    return sorted;
  }, [team]);

  return (
    <Modal visible={!!teamId} transparent animationType="slide" onRequestClose={onClose}>
      <ModalOverlay>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
        <ModalSheet>
          <ModalHandle />
          <ModalCloseBtn onPress={onClose}>
            <ModalCloseText>Fechar</ModalCloseText>
          </ModalCloseBtn>

          {loading && (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <ActivityIndicator color={theme.colors.accent.green} />
            </View>
          )}

          {!loading && team && (
            <ModalScroll showsVerticalScrollIndicator={false}>
              {/* Header */}
              <TeamProfileHeader>
                <CrestGlobal tla={team.tla} size={64} teamName={team.name} />
                <TeamProfileName>{team.name}</TeamProfileName>
                {team.venue && (
                  <TeamProfileDetail>🏟 {team.venue}</TeamProfileDetail>
                )}
              </TeamProfileHeader>

              {/* Técnico */}
              {team.coach && (
                <>
                  <SectionLabel>Técnico</SectionLabel>
                  <CoachCard>
                    <Ionicons name="person" size={20} color={theme.colors.accent.green} />
                    <View>
                      <CoachName>{team.coach.name}</CoachName>
                      {team.coach.nationality && (
                        <CoachNat>{team.coach.nationality}</CoachNat>
                      )}
                    </View>
                  </CoachCard>
                </>
              )}

              {/* Convocados */}
              {squadByPosition.length > 0 && (
                <>
                  <SectionLabel>Convocados ({squadByPosition.length})</SectionLabel>
                  {squadByPosition.map((p, i) => (
                    <PlayerItem key={i}>
                      <PlayerNum>{p.shirtNumber ?? '—'}</PlayerNum>
                      <PlayerNameText numberOfLines={1}>{p.name}</PlayerNameText>
                      <PlayerPos>{p.position ?? ''}</PlayerPos>
                    </PlayerItem>
                  ))}
                </>
              )}

              {!team.coach && squadByPosition.length === 0 && (
                <EmptyStateGlobal
                  message="Dados do elenco disponíveis em breve"
                  icon="people-outline"
                />
              )}

              {error && (
                <EmptyStateGlobal message="Não foi possível carregar" icon="wifi-outline" />
              )}

              <BottomSpacer />
            </ModalScroll>
          )}
        </ModalSheet>
      </ModalOverlay>
    </Modal>
  );
}

// ── GruposTab ──────────────────────────────────────────────────────────

interface IGruposTabProps {
  groups: IGroup[];
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

// ── SelecoesTab ────────────────────────────────────────────────────────

interface ISelecoesTabProps {
  groups: IGroup[];
}

function SelecoesTab({ groups }: ISelecoesTabProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  // Extrai todos os times dos grupos com grupo e id
  const allTeams = useMemo(() => {
    const teams: Array<{ team: ITeam; groupLabel: string }> = [];
    groups.forEach((g, i) => {
      const label = getGroupLabel(g.group, i);
      g.table.forEach(row => {
        teams.push({ team: row.team, groupLabel: label });
      });
    });
    return teams;
  }, [groups]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return allTeams;
    return allTeams.filter(
      ({ team }) =>
        team.name?.toLowerCase().includes(term) ||
        team.shortName?.toLowerCase().includes(term) ||
        team.tla?.toLowerCase().includes(term),
    );
  }, [allTeams, search]);

  if (groups.length === 0) {
    return (
      <EmptyStateGlobal
        message={'Seleções disponíveis\nquando a Copa começar\n\n📅 Copa 2026 · 11 Jun'}
        icon="people-outline"
      />
    );
  }

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SearchBarGlobal value={search} onChangeText={setSearch} />
        {filtered.map(({ team, groupLabel }, i) => (
          <TeamCard key={i} onPress={() => setSelectedTeamId(team.id)} activeOpacity={0.7}>
            <CrestGlobal tla={team.tla} size={36} teamName={team.name} />
            <TeamCardInfo>
              <TeamCardName>{team.name}</TeamCardName>
              <TeamCardGroup>{groupLabel}</TeamCardGroup>
            </TeamCardInfo>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.text.muted} />
          </TeamCard>
        ))}
        <BottomSpacer />
      </ScrollView>

      <TeamProfileModal
        teamId={selectedTeamId}
        onClose={() => setSelectedTeamId(null)}
      />
    </>
  );
}

// ── CopaScreen ─────────────────────────────────────────────────────────

export function CopaScreen() {
  const { groups, loading, error, refresh } = useStandings();
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
        <TabBtn active={activeTab === 'selecoes'} onPress={() => setActiveTab('selecoes')}>
          <TabBtnText active={activeTab === 'selecoes'}>Seleções</TabBtnText>
        </TabBtn>
        <TabBtn active={activeTab === 'artilheiros'} onPress={() => setActiveTab('artilheiros')}>
          <TabBtnText active={activeTab === 'artilheiros'}>Artilheiros</TabBtnText>
        </TabBtn>
      </TabSwitcher>

      {activeTab === 'grupos' && (
        <GruposTab groups={groups} refreshing={refreshing} onRefresh={handleRefresh} />
      )}
      {activeTab === 'selecoes' && <SelecoesTab groups={groups} />}
      {activeTab === 'artilheiros' && <ArtilheirosTab />}
    </SafeAreaView>
  );
}
