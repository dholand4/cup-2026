import React, { useState } from 'react';
import { Modal, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabaseClient';
import { theme } from '../../constants/theme';
import {
  Overlay, Sheet, Handle, Title,
  FieldLabel, Input, SendBtn, SendBtnText,
  ResultText, CloseBtn, CloseBtnText,
} from './style';

const BACKEND = process.env.EXPO_PUBLIC_BACKEND_URL ?? 'https://copa2026-backend.vercel.app';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function AdminNotifModal({ visible, onClose }: Props) {
  const [title, setTitle]   = useState('');
  const [body, setBody]     = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<string | null>(null);

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) { setResult('Não autenticado'); setLoading(false); return; }

      const res = await fetch(`${BACKEND}/api/push/admin-send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: title.trim(), body: body.trim() }),
      });
      const json = await res.json();
      if (res.ok) {
        setResult(`Enviado para ${json.sent} dispositivo(s)`);
        setTitle('');
        setBody('');
      } else {
        setResult(`Erro: ${json.error}`);
      }
    } catch (e) {
      setResult('Erro de conexao');
    }
    setLoading(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Overlay>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
        <Sheet>
          <Handle />
          <Title>Enviar Notificacao</Title>

          <FieldLabel>Titulo</FieldLabel>
          <Input
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: Jogo Comecou!"
            placeholderTextColor={theme.colors.text.muted}
            maxLength={60}
          />

          <FieldLabel>Mensagem</FieldLabel>
          <Input
            value={body}
            onChangeText={setBody}
            placeholder="Ex: Brasil x Argentina comecou agora"
            placeholderTextColor={theme.colors.text.muted}
            maxLength={120}
            multiline
            style={{ minHeight: 72, textAlignVertical: 'top' }}
          />

          {result && <ResultText>{result}</ResultText>}

          <SendBtn onPress={handleSend} disabled={loading || !title.trim() || !body.trim()}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <>
                  <Ionicons name="notifications" size={16} color="#fff" />
                  <SendBtnText>Enviar para todos</SendBtnText>
                </>
            }
          </SendBtn>

          <CloseBtn onPress={onClose}>
            <CloseBtnText>Fechar</CloseBtnText>
          </CloseBtn>
        </Sheet>
      </Overlay>
    </Modal>
  );
}
