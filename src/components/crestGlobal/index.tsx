import React, { useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { CrestContainer, CrestLabel } from './style';
import { getTeamColors } from '../../constants/teams';
import { useTooltip } from '../../providers/TooltipProvider';

interface ICrestGlobalProps {
  tla: string | null | undefined;
  size?: number;
  teamName?: string | null;
}

export function CrestGlobal({ tla, size = 40, teamName }: ICrestGlobalProps) {
  const { show } = useTooltip();
  const ref = useRef<View>(null);
  const id = useRef(`crest-${Math.random()}`).current;
  const safeTla = tla ?? '?';
  const colors = getTeamColors(safeTla);
  const fontSize = Math.round(size * 0.38);

  const handlePress = () => {
    if (!teamName) return;
    ref.current?.measureInWindow((x, y, w) => {
      show(id, teamName, x + w / 2, y);
    });
  };

  return (
    <View ref={ref}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <CrestContainer size={size} crestColor={colors.crest} strokeColor={colors.stroke}>
          <CrestLabel crestTextColor={colors.text} fontSize={fontSize}>
            {safeTla.toUpperCase()}
          </CrestLabel>
        </CrestContainer>
      </TouchableOpacity>
    </View>
  );
}
