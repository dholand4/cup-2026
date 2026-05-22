import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../providers/AuthProvider';
import { theme } from '../../constants/theme';
import {
  Screen, Logo, WordmarkRow, WordmarkCopa, WordmarkYear, Subtitle,
  Card, TabRow, TabBtn, TabBtnText,
  InputLabel, Input, SubmitBtn, SubmitBtnText,
  ErrorText, Divider, DividerLine, DividerText,
  GuestBtn, GuestBtnText,
} from './style';

type Mode = 'entrar' | 'criar';

export function AuthScreen() {
  const { signIn, signUp, enterAsGuest } = useAuth();

  const [mode, setMode]         = useState<Mode>('entrar');
  const [email, setEmail]       = useState('');
  const [apelido, setApelido]   = useState('');
  const [senha, setSenha]       = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async () => {
    setError(null);

    if (!email.trim() || !senha.trim()) {
      setError('Preencha todos os campos.');
      return;
    }
    if (mode === 'criar' && !apelido.trim()) {
      setError('Escolha um apelido.');
      return;
    }
    if (senha.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    const err = mode === 'entrar'
      ? await signIn(email.trim(), senha)
      : await signUp(email.trim(), senha, apelido.trim());
    setLoading(false);

    if (err) setError(err);
  };

  const handleModeChange = (m: Mode) => {
    setMode(m);
    setError(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background.primary }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <Logo>
            <WordmarkRow>
              <WordmarkCopa>COPA</WordmarkCopa>
              <WordmarkYear>26</WordmarkYear>
            </WordmarkRow>
            <Subtitle>FIFA Copa do Mundo 2026</Subtitle>
          </Logo>

          {/* Card */}
          <Card>
            {/* Toggle Entrar / Criar conta */}
            <TabRow>
              <TabBtn active={mode === 'entrar'} onPress={() => handleModeChange('entrar')}>
                <TabBtnText active={mode === 'entrar'}>Entrar</TabBtnText>
              </TabBtn>
              <TabBtn active={mode === 'criar'} onPress={() => handleModeChange('criar')}>
                <TabBtnText active={mode === 'criar'}>Criar conta</TabBtnText>
              </TabBtn>
            </TabRow>

            {/* Campos */}
            <InputLabel>E-mail</InputLabel>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              placeholderTextColor={theme.colors.text.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {mode === 'criar' && (
              <>
                <InputLabel>Apelido</InputLabel>
                <Input
                  value={apelido}
                  onChangeText={setApelido}
                  placeholder="Como quer ser chamado?"
                  placeholderTextColor={theme.colors.text.muted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={20}
                />
              </>
            )}

            <InputLabel>Senha</InputLabel>
            <Input
              value={senha}
              onChangeText={setSenha}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={theme.colors.text.muted}
              secureTextEntry
            />

            {error && <ErrorText>{error}</ErrorText>}

            <SubmitBtn onPress={handleSubmit} disabled={loading}>
              {loading
                ? <ActivityIndicator color={theme.colors.background.primary} />
                : <SubmitBtnText>{mode === 'entrar' ? 'Entrar' : 'Criar conta'}</SubmitBtnText>
              }
            </SubmitBtn>
          </Card>

          {/* Visitante */}
          <Divider>
            <DividerLine />
            <DividerText>ou</DividerText>
            <DividerLine />
          </Divider>

          <GuestBtn onPress={enterAsGuest}>
            <GuestBtnText>Continuar como visitante</GuestBtnText>
          </GuestBtn>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
