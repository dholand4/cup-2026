import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { MatchStatus } from '../../@types';
import {
  BadgeContainer,
  BadgeText,
  LiveDot,
  UpcomingBadge,
  UpcomingText,
  FinalBadge,
  FinalText,
} from './style';

interface ILiveBadgeGlobalProps {
  status: MatchStatus;
  timeLabel?: string;
}

function LiveBadge() {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.2,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <BadgeContainer>
      <Animated.View style={{ opacity }}>
        <LiveDot />
      </Animated.View>
      <BadgeText>Ao Vivo</BadgeText>
    </BadgeContainer>
  );
}

export function LiveBadgeGlobal({ status, timeLabel }: ILiveBadgeGlobalProps) {
  if (status === 'IN_PLAY' || status === 'PAUSED') {
    return <LiveBadge />;
  }

  if (status === 'FINISHED') {
    return (
      <FinalBadge>
        <FinalText>Encerrado</FinalText>
      </FinalBadge>
    );
  }

  return (
    <UpcomingBadge>
      <UpcomingText>{timeLabel ?? '--:--'}</UpcomingText>
    </UpcomingBadge>
  );
}
