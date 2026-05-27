import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
  Overlay, Banner, BannerContent, BannerIcon, BannerTexts,
  BannerTitle, BannerSubtitle, BannerActions,
  InstallBtn, InstallBtnText, DismissBtn, DismissBtnText,
  IOSStep, IOSStepText,
} from './style';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

const isWeb = Platform.OS === 'web';

function isIOS(): boolean {
  if (!isWeb) return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isInStandaloneMode(): boolean {
  if (!isWeb) return true;
  return (
    (window.navigator as any).standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches
  );
}

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showAndroid, setShowAndroid]       = useState(false);
  const [showIOS, setShowIOS]               = useState(false);

  useEffect(() => {
    if (!isWeb) return;
    if (isInStandaloneMode()) return;

    if (isIOS()) {
      setShowIOS(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowAndroid(true);
    };
    window.addEventListener('beforeinstallprompt', handler as any);
    return () => window.removeEventListener('beforeinstallprompt', handler as any);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowAndroid(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowAndroid(false);
    setShowIOS(false);
  };

  if (!showAndroid && !showIOS) return null;

  return (
    <Overlay>
      {/* ── Android ── */}
      {showAndroid && (
        <Banner>
          <BannerContent>
            <BannerIcon>
              <Ionicons name="football-outline" size={30} color={theme.colors.accent.green} />
            </BannerIcon>
            <BannerTexts>
              <BannerTitle>Instalar Arena Score</BannerTitle>
              <BannerSubtitle>Acesso rápido na tela inicial, sem abrir o navegador</BannerSubtitle>
            </BannerTexts>
          </BannerContent>
          <BannerActions>
            <InstallBtn onPress={handleInstall}>
              <InstallBtnText>Instalar</InstallBtnText>
            </InstallBtn>
            <DismissBtn onPress={handleDismiss}>
              <DismissBtnText>Agora não</DismissBtnText>
            </DismissBtn>
          </BannerActions>
        </Banner>
      )}

      {/* ── iOS ── */}
      {showIOS && (
        <Banner>
          <BannerContent>
            <BannerIcon>
              <Ionicons name="football-outline" size={30} color={theme.colors.accent.green} />
            </BannerIcon>
            <BannerTexts>
              <BannerTitle>Instalar Arena Score</BannerTitle>
              <BannerSubtitle>Adicione à tela inicial para acesso rápido</BannerSubtitle>
            </BannerTexts>
          </BannerContent>
          <IOSStep>
            <Ionicons name="share-outline" size={18} color={theme.colors.accent.green} />
            <IOSStepText>Toque em <BannerTitle>Compartilhar</BannerTitle></IOSStepText>
          </IOSStep>
          <IOSStep>
            <Ionicons name="add-circle-outline" size={18} color={theme.colors.accent.green} />
            <IOSStepText>Depois em <BannerTitle>Adicionar à Tela Inicial</BannerTitle></IOSStepText>
          </IOSStep>
          <BannerActions>
            <DismissBtn onPress={handleDismiss}>
              <DismissBtnText>Entendi</DismissBtnText>
            </DismissBtn>
          </BannerActions>
        </Banner>
      )}
    </Overlay>
  );
}
