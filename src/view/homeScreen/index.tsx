import React, { useState, useMemo } from 'react';
import { ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { IMatch } from '../../@types';
import { useMatchesContext } from '../../providers/MatchesProvider';
import { useMatchNotifications } from '../../hooks/useMatchNotifications';
import { useFavoritesContext } from '../../providers/FavoritesProvider';
import { useNotifSettingsContext } from '../../providers/NotifSettingsProvider';
import { useAuth } from '../../providers/AuthProvider';
import { NotifModalGlobal } from '../../components/notifModalGlobal';
import { MatchRowGlobal } from '../../components/matchRowGlobal';
import { MatchCardGlobal } from '../../components/matchCardGlobal';
import { MatchDetailModalGlobal } from '../../components/matchDetailModalGlobal';
import { EmptyStateGlobal } from '../../components/emptyStateGlobal';
import { SearchBarGlobal } from '../../components/searchBarGlobal';
import { groupByDate, formatDayShort, isToday } from '../../utils/dateUtils';
import { theme } from '../../constants/theme';
import {
  Screen,
  Header,
  Wordmark,
  WordmarkCopa,
  WordmarkYear,
  HeaderRight,
  SubTitle,
  SectionHeader,
  SectionTitle,
  CardList,
  DateLabel,
  ErrorButton,
  ErrorButtonText,
  BottomSpacer,
  PaginationRow,
  PageArrow,
  PageInfo,
  PageTodayHint,
  TodaySection,
  TodayDivider,
  TodayDateBadge,
  FilterTab,
  FilterTabText,
  FilterTabs,
  BellButton,
  FavBadge,
  HeaderIcons,
} from './style';

// ── helpers ────────────────────────────────────────────────────────────

function dedupeAndSort(matches: IMatch[]): IMatch[] {
  const map = new Map<number, IMatch>();
  matches.forEach(m => map.set(m.id, m));
  return [...map.values()].sort(
    (a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime(),
  );
}

function matchTeam(m: IMatch, term: string): boolean {
  return (
    m.homeTeam.name?.toLowerCase().includes(term) ||
    m.homeTeam.shortName?.toLowerCase().includes(term) ||
    m.homeTeam.tla?.toLowerCase().includes(term) ||
    m.awayTeam.name?.toLowerCase().includes(term) ||
    m.awayTeam.shortName?.toLowerCase().includes(term) ||
    m.awayTeam.tla?.toLowerCase().includes(term)
  );
}

function matchFavorite(m: IMatch, favs: string[]): boolean {
  return (
    favs.includes(m.homeTeam.tla ?? '') ||
    favs.includes(m.awayTeam.tla ?? '')
  );
}

function getTodayLabel(): string {
  return new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
}

function formatPageLabel(dateStr: string): string {
  if (isToday(dateStr + 'T00:00:00Z')) return 'Hoje';
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

// ── component ──────────────────────────────────────────────────────────

export function HomeScreen() {
  const { live, today, upcoming, recent, loading, error, refresh } = useMatchesContext();
  const { favorites, isFavorite }     = useFavoritesContext();
  const { notifyFavorites, notifyAll } = useNotifSettingsContext();
  const { user, isGuest, signOut }     = useAuth();

  const [refreshing, setRefreshing]   = useState(false);
  const [search, setSearch]           = useState('');
  const [showFavs, setShowFavs]       = useState(false);
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<IMatch | null>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const allMatches = useMemo(
    () => dedupeAndSort([...recent, ...live, ...today, ...upcoming]),
    [recent, live, today, upcoming],
  );

  // Fire push notifications on status changes
  useMatchNotifications({ matches: allMatches, favorites, notifyFavorites, notifyAll });

  // All unique dates sorted
  const uniqueDates = useMemo(() =>
    [...new Set(allMatches.map(m => m.utcDate.split('T')[0]))].sort(),
  [allMatches]);

  // Pages of 2 dates
  const pages = useMemo(() => {
    const result: string[][] = [];
    for (let i = 0; i < uniqueDates.length; i += 2) result.push(uniqueDates.slice(i, i + 2));
    return result;
  }, [uniqueDates]);

  // Default to page containing today or nearest future date
  const todayStr = new Date().toISOString().split('T')[0];
  const initialPage = useMemo(() => {
    const idx = pages.findIndex(p => p.some(d => d >= todayStr));
    return idx >= 0 ? idx : 0;
  }, [pages, todayStr]);

  const [page, setPage] = useState(0);
  const [pageInitialized, setPageInitialized] = useState(false);
  if (!pageInitialized && pages.length > 0) {
    setPage(initialPage);
    setPageInitialized(true);
  }

  const isSearching = search.trim().length > 0;
  const term = search.toLowerCase().trim();

  // Search mode: all matches matching name
  const searchResults = useMemo(() =>
    allMatches.filter(m => matchTeam(m, term)),
  [allMatches, term]);

  // Pagination mode: only current page's 2 dates
  const currentDates = pages[page] ?? [];
  const pageMatches = useMemo(() =>
    allMatches.filter(m => currentDates.includes(m.utcDate.split('T')[0])),
  [allMatches, currentDates]);

  // Apply tab filter (Todos vs Favoritos), then search/pagination
  const baseMatches = isSearching ? searchResults : pageMatches;
  const displayMatches = showFavs
    ? baseMatches.filter(m => matchFavorite(m, favorites))
    : baseMatches;

  const byDate = groupByDate(displayMatches);

  const hasFavNotif = notifyFavorites || notifyAll;

  const handleProfilePress = () => {
    if (isGuest) {
      Alert.alert(
        'Você é visitante',
        'Crie uma conta para participar de ligas com seus amigos.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sair', style: 'destructive', onPress: () => signOut() },
        ],
      );
    } else {
      Alert.alert(
        user?.email ?? 'Minha conta',
        'O que deseja fazer?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sair', style: 'destructive', onPress: () => signOut() },
        ],
      );
    }
  };

  if (loading && !refreshing) {
    return (
      <Screen>
        <ActivityIndicator size="large" color={theme.colors.accent.green} style={{ flex: 1 }} />
      </Screen>
    );
  }

  if (error && allMatches.length === 0) {
    return (
      <Screen>
        <EmptyStateGlobal
          message={`Não foi possível carregar os jogos.\n${error}`}
          icon="wifi-outline"
        />
        <ErrorButton onPress={refresh}>
          <ErrorButtonText>Tentar novamente</ErrorButtonText>
        </ErrorButton>
      </Screen>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background.primary }} edges={['top']}>
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
        {/* Header */}
        <Header>
          <HeaderRight>
            <Wordmark>
              <WordmarkCopa>COPA</WordmarkCopa>
              <WordmarkYear>26</WordmarkYear>
            </Wordmark>
          </HeaderRight>
          <HeaderIcons>
            <BellButton onPress={handleProfilePress}>
              <Ionicons
                name={isGuest ? 'person-outline' : 'person'}
                size={18}
                color={isGuest ? theme.colors.text.secondary : theme.colors.accent.green}
              />
            </BellButton>
            <BellButton onPress={() => setNotifModalOpen(true)}>
              <Ionicons
                name={hasFavNotif ? 'notifications' : 'notifications-outline'}
                size={20}
                color={hasFavNotif ? theme.colors.accent.gold : theme.colors.text.mid}
              />
              {hasFavNotif && <FavBadge />}
            </BellButton>
          </HeaderIcons>
          <SubTitle>FIFA Copa do Mundo 2026</SubTitle>
        </Header>

        {/* Ao Vivo destaque */}
        {live.length > 0 && (
          <TodaySection>
            <SectionHeader>
              <SectionTitle>Ao Vivo</SectionTitle>
              <TodayDateBadge>{getTodayLabel()}</TodayDateBadge>
            </SectionHeader>
            <CardList>
              {live.map(m => (
                <MatchCardGlobal
                  key={m.id}
                  match={m}
                  large
                  compact
                  showTeamNames
                  onPress={() => setSelectedMatch(m)}
                />
              ))}
            </CardList>
            <TodayDivider />
          </TodaySection>
        )}

        {/* Section header + filtro Todos | Favoritos */}
        <SectionHeader>
          <SectionTitle>Todos os Jogos</SectionTitle>
          <FilterTabs>
            <FilterTab active={!showFavs} onPress={() => setShowFavs(false)}>
              <FilterTabText active={!showFavs}>Todos</FilterTabText>
            </FilterTab>
            <FilterTab active={showFavs} onPress={() => setShowFavs(true)}>
              <Ionicons
                name="star"
                size={10}
                color={showFavs ? theme.colors.background.primary : theme.colors.accent.gold}
                style={{ marginRight: 3 }}
              />
              <FilterTabText active={showFavs}>Favoritos</FilterTabText>
            </FilterTab>
          </FilterTabs>
        </SectionHeader>

        {/* Busca por nome */}
        <SearchBarGlobal value={search} onChangeText={setSearch} />

        {/* Paginação de datas (só quando NÃO está buscando) */}
        {!isSearching && pages.length > 1 && (
          <PaginationRow>
            <PageArrow
              disabled={page === 0}
              onPress={() => setPage(p => Math.max(0, p - 1))}
            >
              <Ionicons
                name="chevron-back"
                size={16}
                color={page === 0 ? theme.colors.background.elevated : theme.colors.text.mid}
              />
            </PageArrow>

            <TouchableOpacity
              onPress={() => setPage(initialPage)}
              activeOpacity={page === initialPage ? 1 : 0.6}
              style={{ alignItems: 'center' }}
            >
              <PageInfo>
                {currentDates.map(formatPageLabel).join(' · ')}
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
                size={16}
                color={page === pages.length - 1 ? theme.colors.background.elevated : theme.colors.text.mid}
              />
            </PageArrow>
          </PaginationRow>
        )}

        {/* Lista de jogos */}
        {displayMatches.length === 0 ? (
          <EmptyStateGlobal
            message={
              showFavs && favorites.length === 0
                ? 'Adicione times favoritos nas notificações ★'
                : showFavs
                ? 'Nenhum jogo de time favorito neste período'
                : isSearching
                ? 'Nenhum time encontrado'
                : 'Nenhum jogo neste período'
            }
            icon={showFavs ? 'star-outline' : 'calendar-outline'}
          />
        ) : (
          Array.from(byDate.entries()).map(([dateKey, matches]) => (
            <React.Fragment key={dateKey}>
              <DateLabel today={isToday(matches[0].utcDate)}>
                {isToday(matches[0].utcDate) ? 'HOJE' : formatDayShort(matches[0].utcDate)}
              </DateLabel>
              <CardList>
                {matches.map(match => (
                  <MatchRowGlobal
                    key={match.id}
                    match={match}
                    homeFav={isFavorite(match.homeTeam.tla ?? '')}
                    awayFav={isFavorite(match.awayTeam.tla ?? '')}
                    onPress={() => setSelectedMatch(match)}
                  />
                ))}
              </CardList>
            </React.Fragment>
          ))
        )}

        <BottomSpacer />
      </ScrollView>

      <NotifModalGlobal
        visible={notifModalOpen}
        onClose={() => setNotifModalOpen(false)}
      />
      <MatchDetailModalGlobal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
      />
    </SafeAreaView>
  );
}
