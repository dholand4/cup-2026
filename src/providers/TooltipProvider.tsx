import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import styled from 'styled-components/native';

const SCREEN_W = Dimensions.get('window').width;

interface ITooltip {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface ITooltipContext {
  show: (id: string, name: string, x: number, y: number) => void;
}

const TooltipContext = createContext<ITooltipContext>({ show: () => {} });

export function useTooltip() {
  return useContext(TooltipContext);
}

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  const [tooltips, setTooltips] = useState<ITooltip[]>([]);
  const [rootY, setRootY] = useState(0);
  const rootRef = useRef<View>(null);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const show = useCallback((id: string, name: string, x: number, y: number) => {
    if (timers.current[id]) clearTimeout(timers.current[id]);
    setTooltips(prev => [...prev.filter(t => t.id !== id), { id, name, x, y, w: 0, h: 0 }]);
    timers.current[id] = setTimeout(() => {
      setTooltips(prev => prev.filter(t => t.id !== id));
    }, 2000);
  }, []);

  const setSize = (id: string, w: number, h: number) => {
    setTooltips(prev => prev.map(t => t.id === id ? { ...t, w, h } : t));
  };

  return (
    <TooltipContext.Provider value={{ show }}>
      <View
        ref={rootRef}
        style={{ flex: 1 }}
        onLayout={() => {
          rootRef.current?.measureInWindow((_x, y) => setRootY(y));
        }}
      >
        {children}
        <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
          {tooltips.map(t => {
            const left = Math.max(8, Math.min(SCREEN_W - t.w - 8, t.x - t.w / 2));
            const top = t.y - rootY - t.h - 6;
            return (
              <Bubble
                key={t.id}
                style={{ position: 'absolute', top, left, opacity: t.h > 0 ? 1 : 0 }}
                onLayout={e => setSize(t.id, e.nativeEvent.layout.width, e.nativeEvent.layout.height)}
              >
                <BubbleText>{t.name}</BubbleText>
              </Bubble>
            );
          })}
        </View>
      </View>
    </TooltipContext.Provider>
  );
}

const Bubble = styled.View`
  background-color: #1e2d3d;
  border-radius: 6px;
  padding: 4px 10px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.15);
`;

const BubbleText = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 11px;
  color: #ffffff;
`;
