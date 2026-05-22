import React from 'react';
import { TouchableOpacity } from 'react-native';
import { IMatch } from '../../@types';
import { formatTime } from '../../utils/dateUtils';
import { CrestGlobal } from '../crestGlobal';
import { LiveBadgeGlobal } from '../liveBadgeGlobal';
import {
  Card,
  LiveAccent,
  HeaderRow,
  GroupTag,
  TeamsGrid,
  TeamCol,
  TLA,
  ScoreBlock,
  ScoreRow,
  ScoreNum,
  ScoreSep,
  MinuteText,
  TimeHint,
  FinalLabel,
  BigCard,
  BigTeamName,
  BigScoreRow,
  BigScoreNum,
  BigScoreSep,
  BigMinuteText,
  BigPeriodText,
  ScorersRow,
  ScorerSide,
  ScorerEntry,
  CornerAccent,
  PitchCircle,
  CardTeamName,
} from './style';

interface IMatchCardGlobalProps {
  match: IMatch;
  large?: boolean;
  compact?: boolean;
  showTeamNames?: boolean;
  onPress?: () => void;
}

function getGroupLabel(match: IMatch): string {
  if (match.group) {
    const letter = match.group.replace(/^GROUP_/i, '').replace(/^Group\s*/i, '').trim();
    return `Grupo ${letter}`;
  }
  if (match.stage) return match.stage.replace(/_/g, ' ');
  return 'Copa 2026';
}

export function MatchCardGlobal({ match, large = false, compact = false, showTeamNames = false, onPress }: IMatchCardGlobalProps) {
  const { status, homeTeam, awayTeam, score, utcDate, goals } = match;
  const isLive = status === 'IN_PLAY' || status === 'PAUSED';
  const isFinal = status === 'FINISHED';
  const hasScore = score.fullTime.home !== null;
  const timeLabel = formatTime(utcDate);
  const groupLabel = getGroupLabel(match);

  const homeScore = score.fullTime.home ?? 0;
  const awayScore = score.fullTime.away ?? 0;
  const homeLeads = isLive && homeScore > awayScore;
  const awayLeads = isLive && awayScore > homeScore;

  const crestSizeLarge = compact ? 44 : 64;
  const crestSizeSmall = compact ? 32 : 44;

  if (large && isLive) {
    const homeGoals = (goals ?? []).filter(g => g.team.id === homeTeam.id);
    const awayGoals = (goals ?? []).filter(g => g.team.id === awayTeam.id);
    const hasGoals = homeGoals.length > 0 || awayGoals.length > 0;

    return (
      <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.8 : 1}>
      <BigCard compact={compact}>
        <CornerAccent />
        <PitchCircle />
        <HeaderRow>
          <GroupTag gold>{groupLabel}</GroupTag>
          <LiveBadgeGlobal status={status} />
        </HeaderRow>
        <TeamsGrid>
          <TeamCol>
            <CrestGlobal tla={homeTeam.tla} size={crestSizeLarge} teamName={homeTeam.name} />
            <BigTeamName compact={compact}>{homeTeam.shortName.toUpperCase()}</BigTeamName>
          </TeamCol>
          <ScoreBlock>
            <BigScoreRow>
              <BigScoreNum gold={homeLeads} compact={compact}>{homeScore}</BigScoreNum>
              <BigScoreSep compact={compact}>—</BigScoreSep>
              <BigScoreNum gold={awayLeads} compact={compact}>{awayScore}</BigScoreNum>
            </BigScoreRow>
            <BigMinuteText compact={compact}>
              {match.minute != null ? `${match.minute}'` : 'AO VIVO'}
            </BigMinuteText>
            <BigPeriodText>{status === 'PAUSED' ? 'intervalo' : 'em andamento'}</BigPeriodText>
          </ScoreBlock>
          <TeamCol>
            <CrestGlobal tla={awayTeam.tla} size={crestSizeLarge} teamName={awayTeam.name} />
            <BigTeamName compact={compact}>{awayTeam.shortName.toUpperCase()}</BigTeamName>
          </TeamCol>
        </TeamsGrid>
        {hasGoals && (
          <ScorersRow>
            <ScorerSide>
              {homeGoals.map((g, i) => (
                <ScorerEntry key={i}>{g.scorer.name} {g.minute}'</ScorerEntry>
              ))}
            </ScorerSide>
            <ScorerSide right>
              {awayGoals.map((g, i) => (
                <ScorerEntry key={i}>{g.scorer.name} {g.minute}'</ScorerEntry>
              ))}
            </ScorerSide>
          </ScorersRow>
        )}
      </BigCard>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.8 : 1}>
    <Card highlighted={isLive} compact={compact}>
      {isLive && <LiveAccent />}
      <HeaderRow>
        <GroupTag>{groupLabel}</GroupTag>
        <LiveBadgeGlobal status={status} timeLabel={timeLabel} />
      </HeaderRow>
      <TeamsGrid>
        <TeamCol>
          <CrestGlobal tla={homeTeam.tla} size={crestSizeSmall} teamName={homeTeam.shortName} />
          {showTeamNames && <CardTeamName numberOfLines={1}>{homeTeam.shortName}</CardTeamName>}
        </TeamCol>
        <ScoreBlock>
          {hasScore ? (
            <>
              <ScoreRow>
                <ScoreNum gold={homeLeads} compact={compact}>{homeScore}</ScoreNum>
                <ScoreSep>—</ScoreSep>
                <ScoreNum gold={awayLeads} compact={compact}>{awayScore}</ScoreNum>
              </ScoreRow>
              {isFinal && <FinalLabel>Final</FinalLabel>}
            </>
          ) : (
            <>
              <ScoreRow>
                <ScoreNum muted compact={compact}>VS</ScoreNum>
              </ScoreRow>
              <TimeHint>{timeLabel} BRT</TimeHint>
            </>
          )}
        </ScoreBlock>
        <TeamCol>
          <CrestGlobal tla={awayTeam.tla} size={crestSizeSmall} teamName={awayTeam.shortName} />
          {showTeamNames && <CardTeamName numberOfLines={1}>{awayTeam.shortName}</CardTeamName>}
        </TeamCol>
      </TeamsGrid>
      {isFinal && (() => {
        const homeGoals = (goals ?? []).filter(g => g.team.id === homeTeam.id);
        const awayGoals = (goals ?? []).filter(g => g.team.id === awayTeam.id);
        if (homeGoals.length === 0 && awayGoals.length === 0) return null;
        return (
          <ScorersRow>
            <ScorerSide>
              {homeGoals.map((g, i) => (
                <ScorerEntry key={i}>{g.scorer.name} {g.minute}'</ScorerEntry>
              ))}
            </ScorerSide>
            <ScorerSide right>
              {awayGoals.map((g, i) => (
                <ScorerEntry key={i}>{g.scorer.name} {g.minute}'</ScorerEntry>
              ))}
            </ScorerSide>
          </ScorersRow>
        );
      })()}
    </Card>
    </TouchableOpacity>
  );
}
