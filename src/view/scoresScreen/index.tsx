import React, { useState } from 'react';
import { ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMatches } from '../../hooks/useMatches';
import { MatchCardGlobal } from '../../components/matchCardGlobal';
import { EmptyStateGlobal } from '../../components/emptyStateGlobal';
import { timeAgo } from '../../utils/dateUtils';
import { theme } from '../../constants/theme';
import {
  Screen,
  Header,
  Wordmark,
  WordmarkCopa,
  WordmarkYear,
  SubTitle,
  RefreshButton,
  SectionHeader,
  SectionTitle,
  SectionRight,
  SectionRightText,
  CardList,
  BottomSpacer,
} from './style';

export function ScoresScreen() {
  const { live, today, upcoming, loading, error, refresh } = useMatches();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const finishedToday = today.filter(m => m.status === 'FINISHED');
  const upcomingToday = today.filter(
    m => m.status === 'SCHEDULED' || m.status === 'TIMED',
  );
  const lastUpdated = live[0]?.lastUpdated ?? today[0]?.lastUpdated;
  const updatedLabel = lastUpdated ? `Atualizado ${timeAgo(lastUpdated)}` : 'Atualizado agora';

  const hasAnything = live.length > 0 || finishedToday.length > 0 || upcomingToday.length > 0;

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
            <WordmarkCopa>COPA</WordmarkCopa>
            <WordmarkYear>26</WordmarkYear>
          </Wordmark>
          <SubTitle>{updatedLabel}</SubTitle>
          <RefreshButton onPress={handleRefresh}>
            <Ionicons name="refresh" size={16} color={theme.colors.accent.green} />
          </RefreshButton>
        </Header>

        {live.length > 0 && (
          <>
            <SectionHeader>
              <SectionTitle>Ao Vivo</SectionTitle>
            </SectionHeader>
            <CardList>
              {live.map(match => (
                <MatchCardGlobal key={match.id} match={match} large />
              ))}
            </CardList>
          </>
        )}

        {upcomingToday.length > 0 && (
          <>
            <SectionHeader>
              <SectionTitle>A Seguir</SectionTitle>
              <SectionRight>
                <SectionRightText>Hoje · BRT</SectionRightText>
              </SectionRight>
            </SectionHeader>
            <CardList>
              {upcomingToday.map(match => (
                <MatchCardGlobal key={match.id} match={match} />
              ))}
            </CardList>
          </>
        )}

        {finishedToday.length > 0 && (
          <>
            <SectionHeader>
              <SectionTitle>Encerrados</SectionTitle>
              <SectionRight>
                <SectionRightText>Hoje</SectionRightText>
              </SectionRight>
            </SectionHeader>
            <CardList>
              {finishedToday.map(match => (
                <MatchCardGlobal key={match.id} match={match} />
              ))}
            </CardList>
          </>
        )}

        {!hasAnything && (
          <EmptyStateGlobal
            message="Nenhum jogo hoje"
            icon="football-outline"
          />
        )}

        <BottomSpacer />
      </ScrollView>
    </SafeAreaView>
  );
}
