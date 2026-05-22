import React, { useState } from 'react';
import { Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import { useFavoritesContext } from '../../providers/FavoritesProvider';
import { useNotifSettingsContext } from '../../providers/NotifSettingsProvider';
import { ALL_TEAMS } from '../../utils/allTeams';
import {
  Overlay,
  Sheet,
  SheetHeader,
  SheetTitle,
  CloseBtn,
  CloseBtnText,
  ToggleRow,
  ToggleLeft,
  ToggleLabel,
  ToggleDesc,
  ToggleTrack,
  ToggleThumb,
  Divider,
  SectionLabel,
  FavList,
  FavChip,
  FavChipText,
  FavChipRemove,
  FavChipRemoveText,
  AddTeamBtn,
  AddTeamBtnText,
  EmptyFavText,
  PickerHeader,
  PickerTitle,
  SearchInput,
  TeamRow,
  TeamRowLeft,
  TeamTLA,
  TeamName,
} from './style';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function NotifModalGlobal({ visible, onClose }: Props) {
  const theme = useTheme();
  const { favorites, isFavorite, toggleFavorite } = useFavoritesContext();
  const { notifyFavorites, notifyAll, toggleNotifyFavorites, toggleNotifyAll } =
    useNotifSettingsContext();

  const [showPicker, setShowPicker] = useState(false);
  const [search, setSearch] = useState('');

  const filteredTeams = ALL_TEAMS.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.tla.toLowerCase().includes(search.toLowerCase()),
  );

  if (showPicker) {
    return (
      <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setShowPicker(false)}>
        <Overlay>
          <Sheet>
            <PickerHeader>
              <PickerTitle>Escolher time</PickerTitle>
              <CloseBtn onPress={() => { setSearch(''); setShowPicker(false); }}>
                <CloseBtnText>Voltar</CloseBtnText>
              </CloseBtn>
            </PickerHeader>
            <SearchInput
              placeholder="Buscar time..."
              placeholderTextColor={theme.colors.text.secondary}
              value={search}
              onChangeText={setSearch}
              autoFocus
            />
            <ScrollView keyboardShouldPersistTaps="handled">
              {filteredTeams.map(team => (
                <TeamRow
                  key={team.tla}
                  favorited={isFavorite(team.tla)}
                  onPress={() => toggleFavorite(team.tla)}
                >
                  <TeamRowLeft>
                    <TeamTLA>{team.tla}</TeamTLA>
                    <TeamName>{team.name}</TeamName>
                  </TeamRowLeft>
                  <Ionicons
                    name={isFavorite(team.tla) ? 'star' : 'star-outline'}
                    size={18}
                    color={isFavorite(team.tla) ? theme.colors.accent.gold : theme.colors.text.secondary}
                  />
                </TeamRow>
              ))}
            </ScrollView>
          </Sheet>
        </Overlay>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Overlay>
        <Sheet>
          <SheetHeader>
            <SheetTitle>Notificações</SheetTitle>
            <CloseBtn onPress={onClose}>
              <CloseBtnText>Fechar</CloseBtnText>
            </CloseBtn>
          </SheetHeader>

          <ScrollView>
            {/* ── Toggles ─────────────────────────────────── */}
            <ToggleRow>
              <ToggleLeft>
                <ToggleLabel>Notificar favoritos</ToggleLabel>
                <ToggleDesc>Avisa quando um time favorito jogar</ToggleDesc>
              </ToggleLeft>
              <ToggleTrack active={notifyFavorites} onPress={toggleNotifyFavorites}>
                <ToggleThumb />
              </ToggleTrack>
            </ToggleRow>

            <ToggleRow>
              <ToggleLeft>
                <ToggleLabel>Notificar todos os jogos</ToggleLabel>
                <ToggleDesc>Avisa em todos os jogos da Copa 2026</ToggleDesc>
              </ToggleLeft>
              <ToggleTrack active={notifyAll} onPress={toggleNotifyAll}>
                <ToggleThumb />
              </ToggleTrack>
            </ToggleRow>

            <Divider />

            {/* ── Times favoritos ──────────────────────────── */}
            <SectionLabel>Times favoritos</SectionLabel>

            {favorites.length === 0 ? (
              <EmptyFavText>Nenhum time adicionado ainda.</EmptyFavText>
            ) : (
              <FavList>
                {favorites.map(tla => {
                  const team = ALL_TEAMS.find(t => t.tla === tla);
                  return (
                    <FavChip key={tla}>
                      <Ionicons name="star" size={12} color={theme.colors.accent.gold} />
                      <FavChipText>{team?.name ?? tla}</FavChipText>
                      <FavChipRemove onPress={() => toggleFavorite(tla)}>
                        <FavChipRemoveText>✕</FavChipRemoveText>
                      </FavChipRemove>
                    </FavChip>
                  );
                })}
              </FavList>
            )}

            <AddTeamBtn onPress={() => setShowPicker(true)} style={{ margin: 16, alignSelf: 'flex-start' }}>
              <Ionicons name="add" size={14} color={theme.colors.text.mid} />
              <AddTeamBtnText>Adicionar time</AddTeamBtnText>
            </AddTeamBtn>
          </ScrollView>
        </Sheet>
      </Overlay>
    </Modal>
  );
}
