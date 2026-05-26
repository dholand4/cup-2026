import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
  Banner, BannerContent, BannerIcon, BannerTexts,
  BannerTitle, BannerSubtitle, BannerActions,
  InstallBtn, InstallBtnText, DismissBtn, DismissBtnText,
  IOSStep, IOSStepText,
} from './style';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

// Only runs on web
const isWeb = Platform.OS === 'web';

function isIOS(): boolean {
  if (!isWeb) return false;
  const ua = navigator.userAgent;
  return /iphone|ipad|ipod/i.test(ua);
}

function isAndroid(): boolean {
  if (!isWeb) return false;
  return /android/i.test(navigator.userAgent);
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

    // Android / Chrome: listen for install prompt
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

  // Fecha só na sessão atual — volta a aparecer no próximo refresh
  const handleDismiss = () => {
    setShowAndroid(false);
    setShowIOS(false);
  };

  // ── Android banner ──────────────────────────────────────────────────
  if (showAndroid) {
    return (
      <Banner>
        <BannerContent>
          <BannerIcon>
            <Ionicons name="football-outline" size={28} color={theme.colors.accent.green} />
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
    );
  }

  // ── iOS banner ──────────────────────────────────────────────────────
  if (showIOS) {
    return (
      <Banner>
        <BannerContent>
          <BannerIcon>
            <Ionicons name="football-outline" size={28} color={theme.colors.accent.green} />
          </BannerIcon>
          <BannerTexts>
            <BannerTitle>Instalar Arena Score</BannerTitle>
            <BannerSubtitle>Adicione à tela inicial para acesso rápido:</BannerSubtitle>
          </BannerTexts>
        </BannerContent>
        <IOSStep>
          <Ionicons name="share-outline" size={16} color={theme.colors.text.mid} />
          <IOSStepText>Toque em <BannerTitle>Compartilhar</BannerTitle></IOSStepText>
        </IOSStep>
        <IOSStep>
          <Ionicons name="add-circle-outline" size={16} color={theme.colors.text.mid} />
          <IOSStepText>Depois em <BannerTitle>Adicionar à Tela Inicial</BannerTitle></IOSStepText>
        </IOSStep>
        <BannerActions>
          <DismissBtn onPress={handleDismiss}>
            <DismissBtnText>Entendi</DismissBtnText>
          </DismissBtn>
        </BannerActions>
      </Banner>
    );
  }

  return null;
}
