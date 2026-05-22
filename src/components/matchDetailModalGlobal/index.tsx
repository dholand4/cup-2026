import React from 'react';
import { Modal, ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IMatch, IMatchGoal, IMatchBooking, IMatchSubstitution } from '../../@types';
import { useMatchDetail } from '../../hooks/useMatchDetail';
import { CrestGlobal } from '../crestGlobal';
import { theme } from '../../constants/theme';
import {
  Overlay, Sheet, Handle, SheetScroll,
  ScoreHeader, TeamsRow, TeamCol, TeamName, ScoreText,
  StatusChip, StatusText, LiveRow, LiveDot, LiveText,
  SectionTitle, SectionBlock,
  EventRow, EventMinute, EventName, EventAssist, EmptyEvent,
  FormationText, LineupGrid, LineupCol, LineupTeamName,
  PlayerRow, PlayerNumber, PlayerName,
  Divider, BottomSpacer, CloseButton, CloseText,
} from './style';

interface IProps {
  match: IMatch | null;
  onClose: () => void;
}

const CARD_EMOJI: Record<string, string> = {
  YELLOW: '🟨',
  RED: '🟥',
  YELLOW_RED: '🟧',
};

const POSITION_ABBR: Record<string, string> = {
  Goalkeeper: 'GK',
  Defender: 'DEF',
  Midfielder: 'MID',
  Forward: 'FWD',
  Offence: 'FWD',
  Defence: 'DEF',
  Midfield: 'MID',
};

function shortName(name: string): string {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length <= 2) return name;
  return `${parts[0][0]}. ${parts.slice(1).join(' ')}`;
}

export function MatchDetailModalGlobal({ match, onClose }: IProps) {
  const { detail, loading, error } = useMatchDetail(match?.id ?? null);

  const isLive    = match?.status === 'IN_PLAY' || match?.status === 'PAUSED';
  const isFinished = match?.status === 'FINISHED';

  const homeGoals = (detail?.goals ?? []).filter(g => g.team.id === match?.homeTeam.id);
  const awayGoals = (detail?.goals ?? []).filter(g => g.team.id === match?.awayTeam.id);
  const homeCards = (detail?.bookings ?? []).filter(b => b.team.id === match?.homeTeam.id);
  const awayCards = (detail?.bookings ?? []).filter(b => b.team.id === match?.awayTeam.id);
  const homeSubs  = (detail?.substitutions ?? []).filter(s => s.team.id === match?.homeTeam.id);
  const awaySubs  = (detail?.substitutions ?? []).filter(s => s.team.id === match?.awayTeam.id);

  const hasLineup = (detail?.homeTeamLineup ?? []).length > 0;

  return (
    <Modal visible={!!match} transparent animationType="slide" onRequestClose={onClose}>
      <Overlay>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
        <Sheet>
          <Handle />
          <CloseButton onPress={onClose}>
            <CloseText>Fechar</CloseText>
          </CloseButton>

          {/* ── Placar ── */}
          {match && (
            <ScoreHeader>
              <TeamsRow>
                <TeamCol>
                  <CrestGlobal tla={match.homeTeam.tla} size={44} teamName={match.homeTeam.name} />
                  <TeamName>{match.homeTeam.shortName}</TeamName>
                </TeamCol>

                <ScoreText>
                  {match.score.fullTime.home ?? '-'} · {match.score.fullTime.away ?? '-'}
                </ScoreText>

                <TeamCol>
                  <CrestGlobal tla={match.awayTeam.tla} size={44} teamName={match.awayTeam.name} />
                  <TeamName>{match.awayTeam.shortName}</TeamName>
                </TeamCol>
              </TeamsRow>

              {isLive ? (
                <LiveRow>
                  <LiveDot />
                  <LiveText>
                    {match.minute != null ? `${match.minute}' EM ANDAMENTO` : 'AO VIVO'}
                  </LiveText>
                </LiveRow>
              ) : (
                <StatusChip>
                  <StatusText>
                    {isFinished ? 'Encerrado' : 'Aguardando início'}
                  </StatusText>
                </StatusChip>
              )}
            </ScoreHeader>
          )}

          {loading && (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <ActivityIndicator color={theme.colors.accent.green} />
            </View>
          )}

          {!loading && !!match && (
            <SheetScroll showsVerticalScrollIndicator={false}>

              {/* ── Gols ── */}
              {(isLive || isFinished) && (
                <SectionBlock>
                  <SectionTitle>⚽ Gols</SectionTitle>
                  {homeGoals.length === 0 && awayGoals.length === 0 ? (
                    <EmptyEvent>Nenhum gol ainda</EmptyEvent>
                  ) : (
                    [...(detail?.goals ?? [])]
                      .sort((a, b) => a.minute - b.minute)
                      .map((g: IMatchGoal, i) => {
                        const isHome = g.team.id === match?.homeTeam.id;
                        return (
                          <EventRow key={i} right={!isHome}>
                            <EventMinute>{g.minute}'</EventMinute>
                            <Ionicons name="football" size={14} color={theme.colors.accent.green} />
                            <View style={{ flex: 1 }}>
                              <EventName>{shortName(g.scorer?.name ?? 'Gol contra')}</EventName>
                              {g.assist && (
                                <EventAssist>Assist: {shortName(g.assist.name)}</EventAssist>
                              )}
                            </View>
                          </EventRow>
                        );
                      })
                  )}
                </SectionBlock>
              )}

              {/* ── Cartões ── */}
              {(isLive || isFinished) && [...homeCards, ...awayCards].length > 0 && (
                <SectionBlock>
                  <SectionTitle>Cartões</SectionTitle>
                  {[...homeCards, ...awayCards]
                    .sort((a, b) => a.minute - b.minute)
                    .map((b: IMatchBooking, i) => {
                      const isHome = b.team.id === match?.homeTeam.id;
                      return (
                        <EventRow key={i} right={!isHome}>
                          <EventMinute>{b.minute}'</EventMinute>
                          <EventName>{CARD_EMOJI[b.card] ?? '🟨'}</EventName>
                          <EventName>{shortName(b.player?.name ?? '')}</EventName>
                        </EventRow>
                      );
                    })}
                </SectionBlock>
              )}

              {/* ── Substituições ── */}
              {(isLive || isFinished) && [...homeSubs, ...awaySubs].length > 0 && (
                <SectionBlock>
                  <SectionTitle>🔄 Substituições</SectionTitle>
                  {[...homeSubs, ...awaySubs]
                    .sort((a: IMatchSubstitution, b: IMatchSubstitution) => a.minute - b.minute)
                    .map((s: IMatchSubstitution, i) => {
                      const isHome = s.team.id === match?.homeTeam.id;
                      return (
                        <EventRow key={i} right={!isHome}>
                          <EventMinute>{s.minute}'</EventMinute>
                          <View style={{ flex: 1 }}>
                            <EventName style={{ color: theme.colors.accent.green }}>
                              ↑ {shortName(s.playerIn?.name ?? '')}
                            </EventName>
                            <EventAssist>↓ {shortName(s.playerOut?.name ?? '')}</EventAssist>
                          </View>
                        </EventRow>
                      );
                    })}
                </SectionBlock>
              )}

              {/* ── Escalação ── */}
              {hasLineup && (
                <SectionBlock>
                  <SectionTitle>Escalação</SectionTitle>
                  {(detail?.homeFormation || detail?.awayFormation) && (
                    <FormationText>
                      {detail?.homeFormation ?? '—'}  ·  {detail?.awayFormation ?? '—'}
                    </FormationText>
                  )}
                  <LineupGrid>
                    <LineupCol>
                      <LineupTeamName>{match?.homeTeam.shortName}</LineupTeamName>
                      {detail?.homeTeamLineup.map((p, i) => (
                        <PlayerRow key={i}>
                          <PlayerNumber>{p.shirtNumber ?? '—'}</PlayerNumber>
                          <PlayerName numberOfLines={1}>{shortName(p.name)}</PlayerName>
                        </PlayerRow>
                      ))}
                    </LineupCol>
                    <Divider style={{ width: 1, height: '100%' }} />
                    <LineupCol>
                      <LineupTeamName>{match?.awayTeam.shortName}</LineupTeamName>
                      {detail?.awayTeamLineup.map((p, i) => (
                        <PlayerRow key={i}>
                          <PlayerNumber>{p.shirtNumber ?? '—'}</PlayerNumber>
                          <PlayerName numberOfLines={1}>{shortName(p.name)}</PlayerName>
                        </PlayerRow>
                      ))}
                    </LineupCol>
                  </LineupGrid>
                </SectionBlock>
              )}

              {!isLive && !isFinished && (
                <EmptyEvent>
                  Detalhes disponíveis quando o jogo começar
                </EmptyEvent>
              )}

              {error && <EmptyEvent>Não foi possível carregar os detalhes</EmptyEvent>}

              <BottomSpacer />
            </SheetScroll>
          )}
        </Sheet>
      </Overlay>
    </Modal>
  );
}
