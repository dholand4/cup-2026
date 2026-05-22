import React from 'react';
import { IGroup, IStanding } from '../../@types';
import { CrestGlobal } from '../crestGlobal';
import {
  TableCard,
  TableHeader,
  GroupInfo,
  GroupPrefix,
  GroupLetter,
  LegendRow,
  LegendItem,
  LegendDot,
  LegendText,
  ColHeaders,
  ColHead,
  ColHeadTeam,
  ColHeadCenter,
  StandingRow,
  QualAccent,
  PosText,
  TeamCell,
  TeamNameText,
  StatCell,
  SGCell,
  PtsCell,
} from './style';

interface IGroupTableGlobalProps {
  group: IGroup;
  index?: number;
}

type QualStatus = 'in' | 'maybe' | null;

function getQual(position: number): QualStatus {
  if (position <= 2) return 'in';
  if (position === 3) return 'maybe';
  return null;
}

function StandingRowItem({ standing }: { standing: IStanding }) {
  const qual = getQual(standing.position);
  const sg = standing.goalDifference;

  return (
    <StandingRow qual={qual}>
      {qual && <QualAccent qual={qual} />}
      <PosText qual={qual}>{standing.position}</PosText>
      <TeamCell>
        <CrestGlobal tla={standing.team.tla} size={22} teamName={standing.team.name} />
        <TeamNameText>{standing.team.tla}</TeamNameText>
      </TeamCell>
      <StatCell>{standing.playedGames}</StatCell>
      <StatCell>{standing.won}</StatCell>
      <StatCell>{standing.draw}</StatCell>
      <StatCell>{standing.lost}</StatCell>
      <StatCell>{standing.goalsFor}</StatCell>
      <StatCell>{standing.goalsAgainst}</StatCell>
      <SGCell positive={sg > 0} negative={sg < 0}>
        {sg > 0 ? `+${sg}` : `${sg}`}
      </SGCell>
      <PtsCell>{standing.points}</PtsCell>
    </StandingRow>
  );
}

export function GroupTableGlobal({ group, index = 0 }: IGroupTableGlobalProps) {
  const letter = group.group
    ? (group.group as string).replace(/^GROUP_/i, '').replace(/^Group\s*/i, '').trim()
    : String.fromCharCode(65 + index); // fallback: A, B, C...

  return (
    <TableCard>
      <TableHeader>
        <GroupInfo>
          <GroupPrefix>Grupo</GroupPrefix>
          <GroupLetter>{letter}</GroupLetter>
        </GroupInfo>
        <LegendRow>
          <LegendItem>
            <LegendDot color="#00A550" />
            <LegendText>Classif.</LegendText>
          </LegendItem>
          <LegendItem>
            <LegendDot color="#FFD700" />
            <LegendText>Repesc.</LegendText>
          </LegendItem>
        </LegendRow>
      </TableHeader>

      <ColHeaders>
        <ColHead>#</ColHead>
        <ColHeadTeam>Seleção</ColHeadTeam>
        <ColHeadCenter>J</ColHeadCenter>
        <ColHeadCenter>V</ColHeadCenter>
        <ColHeadCenter>E</ColHeadCenter>
        <ColHeadCenter>D</ColHeadCenter>
        <ColHeadCenter>GP</ColHeadCenter>
        <ColHeadCenter>GC</ColHeadCenter>
        <ColHeadCenter>SG</ColHeadCenter>
        <ColHeadCenter pts>Pts</ColHeadCenter>
      </ColHeaders>

      {group.table.map(standing => (
        <StandingRowItem key={standing.team.id} standing={standing} />
      ))}
    </TableCard>
  );
}
