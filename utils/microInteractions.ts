/**
 * Micro-interaction system: sounds, haptics, and interaction feedback.
 * Respects user's soundEnabled preference and reduced-motion.
 */

// --- Audio Feedback System ---
const audioCtxRef: { current: AudioContext | null } = { current: null };

function getAudioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtxRef.current) {
    try {
      audioCtxRef.current = new AudioContext();
    } catch {
      return null;
    }
  }
  if (audioCtxRef.current.state === 'suspended') {
    audioCtxRef.current.resume().catch(() => {});
  }
  return audioCtxRef.current;
}

type SoundType = 'click' | 'hover' | 'success' | 'error' | 'send' | 'receive' | 'toggle' | 'navigate';

const SOUND_PROFILES: Record<SoundType, { freq: number; dur: number; type: OscillatorType; vol: number; ramp?: number }> = {
  click:    { freq: 1200, dur: 0.04, type: 'sine',     vol: 0.06 },
  hover:    { freq: 800,  dur: 0.02, type: 'sine',     vol: 0.03 },
  success:  { freq: 880,  dur: 0.12, type: 'sine',     vol: 0.08, ramp: 1320 },
  error:    { freq: 200,  dur: 0.15, type: 'square',   vol: 0.06 },
  send:     { freq: 1400, dur: 0.06, type: 'sine',     vol: 0.05, ramp: 1800 },
  receive:  { freq: 600,  dur: 0.08, type: 'sine',     vol: 0.04, ramp: 900 },
  toggle:   { freq: 1000, dur: 0.03, type: 'sine',     vol: 0.04 },
  navigate: { freq: 700,  dur: 0.05, type: 'triangle', vol: 0.04, ramp: 1100 },
};

export function playSound(type: SoundType, enabled: boolean): void {
  if (!enabled) return;
  const ctx = getAudioCtx();
  if (!ctx) return;

  const profile = SOUND_PROFILES[type];
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = profile.type;
  osc.frequency.setValueAtTime(profile.freq, now);
  if (profile.ramp) {
    osc.frequency.linearRampToValueAtTime(profile.ramp, now + profile.dur);
  }

  gain.gain.setValueAtTime(profile.vol, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + profile.dur);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + profile.dur + 0.01);
}

// --- Haptic Feedback ---
export function haptic(type: 'light' | 'medium' | 'heavy' = 'light'): void {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;
  const patterns: Record<string, number[]> = {
    light: [5],
    medium: [15],
    heavy: [30],
  };
  navigator.vibrate(patterns[type]);
}
