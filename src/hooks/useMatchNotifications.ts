import { useRef, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { IMatch } from '../@types';

interface Props {
  matches: IMatch[];
  favorites: string[];
  notifyFavorites: boolean;
  notifyAll: boolean;
}

function shouldNotify(
  match: IMatch,
  favorites: string[],
  notifyAll: boolean,
  notifyFavorites: boolean,
): boolean {
  if (notifyAll) return true;
  if (notifyFavorites) {
    const home = match.homeTeam.tla ?? '';
    const away = match.awayTeam.tla ?? '';
    return favorites.includes(home) || favorites.includes(away);
  }
  return false;
}

function matchLabel(match: IMatch): string {
  const home = match.homeTeam.shortName || match.homeTeam.name || match.homeTeam.tla;
  const away = match.awayTeam.shortName || match.awayTeam.name || match.awayTeam.tla;
  return `${home} × ${away}`;
}

async function fire(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: null,
  });
}

export function useMatchNotifications({ matches, favorites, notifyAll, notifyFavorites }: Props) {
  const prevStatuses   = useRef<Record<number, string>>({});
  const prevNotifyAll  = useRef(false);
  const prevNotifyFavs = useRef(false);

  useEffect(() => {
    const notifyJustEnabled =
      (notifyAll && !prevNotifyAll.current) ||
      (notifyFavorites && !prevNotifyFavs.current);

    prevNotifyAll.current  = notifyAll;
    prevNotifyFavs.current = notifyFavorites;

    if (!notifyAll && !notifyFavorites) return;

    matches.forEach(match => {
      const prev = prevStatuses.current[match.id];
      const curr = match.status;

      const label = matchLabel(match);

      // Notifications just enabled — alert about already-live matches
      if (notifyJustEnabled && (curr === 'IN_PLAY' || curr === 'PAUSED')) {
        if (shouldNotify(match, favorites, notifyAll, notifyFavorites)) {
          fire('Ao Vivo Agora! ⚽', label);
        }
        prevStatuses.current[match.id] = curr;
        return;
      }

      // First time seeing this match — record status without firing
      if (!prev) {
        prevStatuses.current[match.id] = curr;
        return;
      }

      // No change
      if (prev === curr) return;

      // Update recorded status
      prevStatuses.current[match.id] = curr;

      if (!shouldNotify(match, favorites, notifyAll, notifyFavorites)) return;

      // SCHEDULED/TIMED → IN_PLAY : jogo começou
      if ((prev === 'SCHEDULED' || prev === 'TIMED') && curr === 'IN_PLAY') {
        fire('Jogo Começou! ⚽', label);
        return;
      }

      // IN_PLAY → PAUSED : intervalo
      if (prev === 'IN_PLAY' && curr === 'PAUSED') {
        fire('Intervalo ⏸', label);
        return;
      }

      // IN_PLAY/PAUSED → FINISHED : encerrado
      if ((prev === 'IN_PLAY' || prev === 'PAUSED') && curr === 'FINISHED') {
        const ht = match.score?.fullTime;
        const home = match.homeTeam.shortName || match.homeTeam.name || match.homeTeam.tla;
        const away = match.awayTeam.shortName || match.awayTeam.name || match.awayTeam.tla;
        const body = ht?.home != null
          ? `${home} ${ht.home} × ${ht.away} ${away}`
          : label;
        fire('Jogo Encerrado! 🏁', body);
      }
    });
  }, [matches, favorites, notifyAll, notifyFavorites]);
}
