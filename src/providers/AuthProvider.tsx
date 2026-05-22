import React, {
  createContext, useContext, useEffect, useState, useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';

const GUEST_KEY = '@copa2026:isGuest';

interface IAuthContext {
  session:       Session | null;
  user:          User | null;
  isGuest:       boolean;
  loading:       boolean;
  signIn:        (email: string, password: string) => Promise<string | null>;
  signUp:        (email: string, password: string, apelido: string) => Promise<string | null>;
  signOut:       () => Promise<void>;
  enterAsGuest:  () => Promise<void>;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica sessão existente e modo visitante
    Promise.all([
      supabase.auth.getSession(),
      AsyncStorage.getItem(GUEST_KEY),
    ]).then(([{ data }, guest]) => {
      setSession(data.session);
      if (!data.session) setIsGuest(guest === 'true');
      setLoading(false);
    });

    // Escuta mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s) setIsGuest(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    await AsyncStorage.removeItem(GUEST_KEY);
    return null;
  }, []);

  const signUp = useCallback(async (
    email: string, password: string, apelido: string,
  ): Promise<string | null> => {
    // Verifica se apelido já existe
    const { data: existing } = await supabase
      .from('perfis')
      .select('apelido')
      .eq('apelido', apelido.trim())
      .maybeSingle();

    if (existing) return 'Esse apelido já está em uso.';

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return error.message;
    if (!data.user) return 'Erro ao criar usuário.';

    const { error: profileError } = await supabase
      .from('perfis')
      .insert({ id: data.user.id, apelido: apelido.trim() });

    if (profileError) return profileError.message;
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

  return (
    <AuthContext.Provider value={{
      session,
      user: session?.user ?? null,
      isGuest,
      loading,
      signIn,
      signUp,
      signOut,
      enterAsGuest,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
