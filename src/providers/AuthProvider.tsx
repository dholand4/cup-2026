import React, {
  createContext, useContext, useEffect, useState, useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';

const GUEST_KEY = '@copa2026:isGuest';

// ── Tradução de erros do Supabase ────────────────────────────────────────
function translateAuthError(msg: string): string {
  const m = msg.toLowerCase();

  if (m.includes('invalid login credentials') || m.includes('invalid email or password'))
    return 'E-mail ou senha incorretos.';
  if (m.includes('email not confirmed'))
    return 'Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.';
  if (m.includes('user already registered') || m.includes('email already in use') || m.includes('already registered'))
    return 'Este e-mail já possui uma conta. Tente entrar.';
  if (m.includes('password should be at least') || m.includes('password must be at least'))
    return 'A senha precisa ter pelo menos 6 caracteres.';
  if (m.includes('new password should be different'))
    return 'A nova senha deve ser diferente da anterior.';
  if (m.includes('token has expired') || m.includes('otp has expired') || m.includes('token is invalid') || m.includes('invalid token'))
    return 'Código inválido ou expirado. Solicite um novo.';
  if (m.includes('email link is invalid') || m.includes('link is invalid'))
    return 'Link inválido ou expirado. Solicite um novo.';
  if (m.includes('user not found') || m.includes('no user found'))
    return 'Nenhuma conta encontrada com este e-mail.';
  if (m.includes('invalid email') || m.includes('unable to validate email') || m.includes('invalid format'))
    return 'Formato de e-mail inválido.';
  if (m.includes('rate limit') || m.includes('too many requests') || m.includes('over_email_send_rate_limit') || m.includes('email rate limit'))
    return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
  if (m.includes('for security purposes') || m.includes('you can only request this after'))
    return 'Aguarde alguns segundos antes de tentar novamente.';
  if (m.includes('signup is disabled') || m.includes('signups not allowed'))
    return 'Cadastro temporariamente desabilitado.';
  if (m.includes('database error') || m.includes('unexpected error'))
    return 'Erro interno. Tente novamente em instantes.';
  if (m.includes('network') || m.includes('fetch') || m.includes('failed to fetch'))
    return 'Sem conexão com a internet. Verifique sua rede.';
  if (m.includes('weak password') || m.includes('password is too weak'))
    return 'Senha muito fraca. Use letras, números ou símbolos.';
  if (m.includes('same password') || m.includes('should be different'))
    return 'A nova senha deve ser diferente da anterior.';

  // Fallback: retorna a mensagem original para não esconder erros desconhecidos
  return msg;
}

interface IAuthContext {
  session:                  Session | null;
  user:                     User | null;
  isGuest:                  boolean;
  loading:                  boolean;
  passwordRecoveryPending:  boolean;
  signIn:                   (email: string, password: string) => Promise<string | null>;
  signUp:                   (email: string, password: string, apelido: string) => Promise<string | null>;
  signOut:                  () => Promise<void>;
  enterAsGuest:             () => Promise<void>;
  sendPasswordReset:        (email: string) => Promise<string | null>;
  verifyAndUpdatePassword:  (email: string, token: string, password: string) => Promise<string | null>;
  clearPasswordRecovery:    () => void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession]                         = useState<Session | null>(null);
  const [isGuest, setIsGuest]                         = useState(false);
  const [loading, setLoading]                         = useState(true);
  const [passwordRecoveryPending, setRecoveryPending] = useState(false);

  useEffect(() => {
    // Restore existing session and guest flag
    Promise.all([
      supabase.auth.getSession(),
      AsyncStorage.getItem(GUEST_KEY),
    ]).then(([{ data }, guest]) => {
      setSession(data.session);
      if (!data.session) setIsGuest(guest === 'true');
      setLoading(false);
    });

    // Listen for auth state changes (includes PASSWORD_RECOVERY for web magic links)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (s) setIsGuest(false);
      if (event === 'PASSWORD_RECOVERY') setRecoveryPending(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return translateAuthError(error.message);
    await AsyncStorage.removeItem(GUEST_KEY);
    return null;
  }, []);

  const signUp = useCallback(async (
    email: string, password: string, apelido: string,
  ): Promise<string | null> => {
    const { data: existing } = await supabase
      .from('perfis')
      .select('apelido')
      .eq('apelido', apelido.trim())
      .maybeSingle();

    if (existing) return 'Esse apelido já está em uso.';

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return translateAuthError(error.message);
    if (!data.user) return 'Erro ao criar usuário.';

    const { error: profileError } = await supabase
      .from('perfis')
      .insert({ id: data.user.id, apelido: apelido.trim() });

    if (profileError) return translateAuthError(profileError.message);
    await AsyncStorage.removeItem(GUEST_KEY);
    return null;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem(GUEST_KEY);
    setIsGuest(false);
  }, []);

  const enterAsGuest = useCallback(async () => {
    await AsyncStorage.setItem(GUEST_KEY, 'true');
    setIsGuest(true);
  }, []);

  // ── Password Recovery ─────────────────────────────────────────────────

  /**
   * Step 1: sends a recovery e-mail.
   * • Mobile: Supabase sends a 6-digit OTP (requires "Email OTP" enabled in
   *   Supabase dashboard → Auth → Email → OTP expiry).
   * • Web: Supabase sends a magic link; clicking it fires PASSWORD_RECOVERY
   *   in onAuthStateChange, which sets passwordRecoveryPending = true.
   */
  const sendPasswordReset = useCallback(async (email: string): Promise<string | null> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    if (error) return translateAuthError(error.message);
    return null;
  }, []);

  /**
   * Step 2: verify OTP (if token provided) then update the password.
   * • Pass a non-empty token for the OTP/code flow (mobile).
   * • Pass an empty token when passwordRecoveryPending is true (web magic link
   *   already established the recovery session — no OTP needed).
   */
  const verifyAndUpdatePassword = useCallback(async (
    email: string,
    token: string,
    password: string,
  ): Promise<string | null> => {
    if (token.trim().length > 0) {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: token.trim(),
        type: 'recovery',
      });
      if (verifyError) return translateAuthError(verifyError.message);
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) return translateAuthError(error.message);

    setRecoveryPending(false);
    return null;
  }, []);

  const clearPasswordRecovery = useCallback(() => {
    setRecoveryPending(false);
  }, []);

  return (
    <AuthContext.Provider value={{
      session,
      user: session?.user ?? null,
      isGuest,
      loading,
      passwordRecoveryPending,
      signIn,
      signUp,
      signOut,
      enterAsGuest,
      sendPasswordReset,
      verifyAndUpdatePassword,
      clearPasswordRecovery,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
