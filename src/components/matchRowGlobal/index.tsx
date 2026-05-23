import React, { useState, useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import { IMatch } from '../../@types';
import { formatTime } from '../../utils/dateUtils';
import { CrestGlobal } from '../crestGlobal';
import { useTooltip } from '../../providers/TooltipProvider';
import {
  Row,
  RowMain,
  LiveAccent,
  FinishedAccent,
  GroupLabel,
  TeamInfo,
  TeamName,
  TeamNameWrap,
  ScoreWrap,
  ScoreText,
  VsText,
  StatusLabel,
  GoalsRow,
  GoalsSide,
  GoalEntry,
} from './style';

interface IMatchRowGlobalProps {
  match: IMatch;
  homeFav?: boolean;
  awayFav?: boolean;
  onPress?: () => void;
}

export function MatchRowGlobal({ match, homeFav = false, awayFav = false, onPress }: IMatchRowGlobalProps) {
  const { homeTeam, awayTeam, utcDate, group, stage, status, score, goals } = match;
  const isLive = status === 'IN_PLAY' || status === 'PAUSED';
  const isFinal = status === 'FINISHED';
  const hasScore = score.fullTime.home !== null;

  const groupLabel = group
    ? `GRP ${group.replace(/^GROUP_/i, '').replace(/^Group\s*/i, '').trim()}`
    : (stage ?? '').slice(0, 5) || 'WC26';

  const homeScore = score.fullTime.home ?? 0;
  const awayScore = score.fullTime.away ?? 0;
  const homeLeads = isLive && homeScore > awayScore;
  const awayLeads = isLive && awayScore > homeScore;

  const homeGoals = (goals ?? []).filter(g => g.team.id === homeTeam.id);
  const awayGoals = (goals ?? []).filter(g => g.team.id === awayTeam.id);
  const hasGoals = hasScore && (homeGoals.length > 0 || awayGoals.length > 0);

  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const { show } = useTooltip();
  const homeNameRef = useRef<View>(null);
  const awayNameRef = useRef<View>(null);
  const homeNameId = useRef(`home-name-${match.id}`).current;
  const awayNameId = useRef(`away-name-${match.id}`).current;

  const showTooltip = (ref: React.RefObject<View | null>, id: string, name: string) => {
    ref.current?.measureInWindow((x, y, w) => {
      show(id, name, x + w / 2, y);
    });
  };

  return (
    <Row live={isLive} finished={isFinal} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      {isLive && <LiveAccent />}
      {isFinal && <FinishedAccent />}
      <RowMain>
        <GroupLabel>{groupLabel}</GroupLabel>
        <TeamInfo>
          <CrestGlobal tla={homeTeam.tla} size={22} teamName={homeTeam.name} />
          <TeamNameWrap ref={homeNameRef}>
            <TouchableOpacity onPress={() => showTooltip(homeNameRef, homeNameId, homeTeam.name)} activeOpacity={0.6} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <TeamName>{homeTeam.tla}</TeamName>
              {homeFav && <Ionicons name="star" size={9} color={theme.colors.accent.gold} />}
            </TouchableOpacity>
          </TeamNameWrap>
          <ScoreWrap
            as={hasGoals ? TouchableOpacity : undefined}
            onPress={hasGoals ? () => setExpanded(v => !v) : undefined}
            activeOpacity={0.7}
          >
            {hasScore ? (
              <ScoreText>
                <ScoreText bold lead={homeLeads}>{homeScore}</ScoreText>
                <ScoreText muted> - </ScoreText>
                <ScoreText bold lead={awayLeads}>{awayScore}</ScoreText>
              </ScoreText>
            ) : (
              <VsText>vs</VsText>
            )}
          </ScoreWrap>
          <TeamNameWrap ref={awayNameRef}>
            <TouchableOpacity onPress={() => showTooltip(awayNameRef, awayNameId, awayTeam.name)} activeOpacity={0.6} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              {awayFav && <Ionicons name="star" size={9} color={theme.colors.accent.gold} />}
              <TeamName>{awayTeam.tla}</TeamName>
            </TouchableOpacity>
          </TeamNameWrap>
          <CrestGlobal tla={awayTeam.tla} size={22} teamName={awayTeam.name} />
        </TeamInfo>
        {isFinal && <StatusLabel>Final</StatusLabel>}
        {isLive && <StatusLabel live>{match.minute != null ? `${match.minute}'` : 'Ao Vivo'}</StatusLabel>}
        {!isLive && !isFinal && <StatusLabel>{formatTime(utcDate)}</StatusLabel>}
      </RowMain>
      {expanded && hasGoals && (
        <GoalsRow>
          <GoalsSide>
            {homeGoals.map((g, i) => (
              <GoalEntry key={i}>{g.scorer?.name ?? '?'} {g.minute}'</GoalEntry>
            ))}
          </GoalsSide>
          <GoalsSide right>
            {awayGoals.map((g, i) => (
              <GoalEntry key={i}>{g.scorer?.name ?? '?'} {g.minute}'</GoalEntry>
            ))}
          </GoalsSide>
        </GoalsRow>
      )}
    </Row>
  );
}
