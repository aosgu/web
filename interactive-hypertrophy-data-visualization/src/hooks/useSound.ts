import { useCallback, useEffect, useRef, useState } from 'react';

export type SoundKind = 'select' | 'hover' | 'replay' | 'open';
export type PlaySound = (kind?: SoundKind) => void;

export function useSound() {
  const [enabled, setEnabled] = useState(false);
  const enabledRef = useRef(false);
  const context = useRef<AudioContext | null>(null);
  const lastHover = useRef(0);

  const play = useCallback<PlaySound>((kind = 'select') => {
    if (!enabledRef.current) return;
    if (kind === 'hover' && performance.now() - lastHover.current < 160) return;
    if (kind === 'hover') lastHover.current = performance.now();

    try {
      const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!context.current || context.current.state === 'closed') context.current = new AudioContextClass();
      const audio = context.current;
      if (audio.state === 'suspended') void audio.resume().catch(() => undefined);

      const now = audio.currentTime;
      const frequencies = kind === 'replay' ? [330, 440, 660] : kind === 'open' ? [440, 587] : [kind === 'hover' ? 660 : 520];
      frequencies.forEach((frequency, index) => {
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        const start = now + index * 0.065;
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, start);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.7, start + 0.12);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(kind === 'hover' ? 0.012 : 0.035, start + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.2);
        oscillator.connect(gain);
        gain.connect(audio.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.22);
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      });
    } catch {
      // Sound is an optional enhancement; unsupported audio must not block exploration.
    }
  }, []);

  const toggle = useCallback(() => {
    const next = !enabledRef.current;
    enabledRef.current = next;
    setEnabled(next);
    if (next) play('open');
  }, [play]);

  useEffect(() => () => {
    if (context.current && context.current.state !== 'closed') void context.current.close().catch(() => undefined);
  }, []);

  return { enabled, toggle, play };
}