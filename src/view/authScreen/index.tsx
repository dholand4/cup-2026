import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../providers/AuthProvider';
import { theme } from '../../constants/theme';
import {
  Screen, Logo, WordmarkRow, WordmarkCopa, WordmarkYear, Subtitle,
  Card, CardTitle, TabRow, TabBtn, TabBtnText,
  InputLabel, Input, SubmitBtn, SubmitBtnText,
  ErrorText, SuccessText, InfoText,
  Divider, DividerLine, DividerText,
  GuestBtn, GuestBtnText,
  LinkBtn, LinkBtnText, BackBtn, BackBtnText,
} from './style';

type Mode = 'entrar' | 'criar' | 'recovery' | 'newPassword';

export function AuthScreen() {
  const {
    signIn, signUp, enterAsGuest,
    sendPasswordReset, verifyAndUpdatePassword,
    passwordRecoveryPending, clearPasswordRecovery,
  } = useAuth();

  const [mode, setMode]               = useState<Mode>('entrar');
  const [email, setEmail]             = useState('');
  const [apelido, setApelido]         = useState('');
  const [senha, setSenha]             = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [code, setCode]               = useState('');
  const [needsCode, setNeedsCode]     = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [successMsg, setSuccessMsg]   = useState<string | null>(null);
  const [loading, setLoading]         = useState(false);

  // Web: magic link clicked → PASSWORD_RECOVERY event → go straight to new password form
  useEffect(() => {
    if (passwordRecoveryPending) {
      setNeedsCode(false); // session already established, no code needed
      setMode('newPassword');
    }
  }, [passwordRecoveryPending]);

  // ── handlers ──────────────────────────────────────────────────────────

  const clearForm = () => {
    setError(null);
    setSuccessMsg(null);
    setSenha('');
    setConfirmSenha('');
    setCode('');
  };

  const handleModeChange = (m: Mode) => {
    setMode(m);
    clearForm();
    if (m !== 'newPassword') {
      setNeedsCode(true);
      clearPasswordRecovery();
    }
  };

  /** Step 1 – send recovery e-mail */
  const handleSendReset = async () => {
    setError(null);
    if (!email.trim()) {
      setError('Digite seu e-mail.');
      return;
    }
    setLoading(true);
    const err = await sendPasswordReset(email.trim());
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    setNeedsCode(true);
    setMode('newPassword');
    setError(null);
  };

  /** Step 2 – verify code (if needed) + save new password */
  const handleUpdatePassword = async () => {
    setError(null);
    if (needsCode && !code.trim()) {
      setError('Digite o código recebido no e-mail.');
      return;
    }
    if (senha.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmSenha) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    const err = await verifyAndUpdatePassword(email, needsCode ? code : '', senha);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    setSuccessMsg('Senha atualizada! Redirecionando...');
    setTimeout(() => {
      clearForm();
      setMode('entrar');
    }, 2000);
  };

  /** Normal login / create account */
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

  // ── render helpers ─────────────────────────────────────────────────────

  function renderCardContent() {
    // ── Recovery: enter e-mail ──────────────────────────────────────────
    if (mode === 'recovery') {
      return (
        <>
          <BackBtn onPress={() => handleModeChange('entrar')}>
            <BackBtnText>← Voltar</BackBtnText>
          </BackBtn>
          <CardTitle>Recuperar senha</CardTitle>

          <InputLabel>E-mail da conta</InputLabel>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            placeholderTextColor={theme.colors.text.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <InfoText>Vamos enviar um código de recuperação para este e-mail.</InfoText>

          {error && <ErrorText>{error}</ErrorText>}

          <SubmitBtn onPress={handleSendReset} disabled={loading}>
            {loading
              ? <ActivityIndicator color={theme.colors.background.primary} />
              : <SubmitBtnText>Enviar código</SubmitBtnText>
            }
          </SubmitBtn>
        </>
      );
    }

    // ── New password: enter code + new password ─────────────────────────
    if (mode === 'newPassword') {
      return (
        <>
          {!passwordRecoveryPending && (
            <BackBtn onPress={() => handleModeChange('recovery')}>
              <BackBtnText>← Voltar</BackBtnText>
            </BackBtn>
          )}
          <CardTitle>Nova senha</CardTitle>

          {needsCode && (
            <>
              <InputLabel>Código do e-mail</InputLabel>
              <Input
                value={code}
                onChangeText={setCode}
                placeholder="Cole o código aqui"
                placeholderTextColor={theme.colors.text.muted}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={10}
              />
              <InfoText>Verifique sua caixa de entrada e cole o código recebido.</InfoText>
            </>
          )}

          <InputLabel>Nova senha</InputLabel>
          <Input
            value={senha}
            onChangeText={setSenha}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={theme.colors.text.muted}
            secureTextEntry
          />

          <InputLabel>Confirmar nova senha</InputLabel>
          <Input
            value={confirmSenha}
            onChangeText={setConfirmSenha}
            placeholder="Repita a nova senha"
            placeholderTextColor={theme.colors.text.muted}
            secureTextEntry
          />

          {error && <ErrorText>{error}</ErrorText>}
          {successMsg && <SuccessText>{successMsg}</SuccessText>}

          <SubmitBtn onPress={handleUpdatePassword} disabled={loading || !!successMsg}>
            {loading
              ? <ActivityIndicator color={theme.colors.background.primary} />
              : <SubmitBtnText>Salvar nova senha</SubmitBtnText>
            }
          </SubmitBtn>
        </>
      );
    }

    // ── Login / Create account ──────────────────────────────────────────
    return (
      <>
        <TabRow>
          <TabBtn active={mode === 'entrar'} onPress={() => handleModeChange('entrar')}>
            <TabBtnText active={mode === 'entrar'}>Entrar</TabBtnText>
          </TabBtn>
          <TabBtn active={mode === 'criar'} onPress={() => handleModeChange('criar')}>
            <TabBtnText active={mode === 'criar'}>Criar conta</TabBtnText>
          </TabBtn>
        </TabRow>

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

        {mode === 'entrar' && (
          <LinkBtn onPress={() => handleModeChange('recovery')}>
            <LinkBtnText>Esqueci minha senha</LinkBtnText>
          </LinkBtn>
        )}

        {error && <ErrorText>{error}</ErrorText>}

        <SubmitBtn onPress={handleSubmit} disabled={loading}>
          {loading
            ? <ActivityIndicator color={theme.colors.background.primary} />
            : <SubmitBtnText>{mode === 'entrar' ? 'Entrar' : 'Criar conta'}</SubmitBtnText>
          }
        </SubmitBtn>
      </>
    );
  }

  // ── JSX ────────────────────────────────────────────────────────────────

  const isLoginOrRegister = mode === 'entrar' || mode === 'criar';

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
          <Card>{renderCardContent()}</Card>

          {/* Visitante — só aparece na tela de login/criar conta */}
          {isLoginOrRegister && (
            <>
              <Divider>
                <DividerLine />
                <DividerText>ou</DividerText>
                <DividerLine />
              </Divider>

              <GuestBtn onPress={enterAsGuest}>
                <GuestBtnText>Continuar como visitante</GuestBtnText>
              </GuestBtn>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
