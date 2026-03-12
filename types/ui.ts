
import React from 'react';

// --- Navigation & Views ---

export type ViewState = 'DASHBOARD' | 'LIST' | 'DETAIL' | 'MEDIA' | 'MEDIA_DETAIL' | 'AUTHORS' | 'AUTHOR_DETAIL' | 'CHAT' | 'SATIRE' | 'SETTINGS' | 'HELP' | 'DANGEROUS' | 'VIRALITY' | 'DATABASE' | 'EDITOR' | 'PRIVACY';

export interface NavItem {
  id: ViewState;
  label: string;
  icon: React.ReactNode;
  sub: string;
}

// --- Chat ---

export interface Message {
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
  verdict?: 'TRUE' | 'FALSE' | 'MISLEADING' | 'UNVERIFIED' | null;
  timestamp?: number;
}

// --- Visualization ---

export interface RadarDataPoint {
  subject: string;
  fullSubject: string;
  count: number;
  fullMark: number;
}

export interface ScatterDataPoint {
  id: string;
  title: string;
  x: number;
  y: number;
  z: number;
  category: string;
  danger: string;
}

export interface SimulationParams {
    emotionalPayload: number; // 0-100
    novelty: number; // 0-100
    visualProof: number; // 0-100
    echoChamberDensity: number; // 0-100
}

// --- Satire UI ---

export interface SatireSubject {
    id: string;
    label: string;
    icon: string;
}

export interface SatireArchetype {
    id: string;
    label: string;
    desc: string;
}

// --- PWA ---

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// --- Speech Polyfills ---

export interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      }
    }
  }
}

export interface SpeechRecognitionErrorEvent {
  error: string | object;
  message?: string;
}

export interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

export interface IWindow extends Window {
  SpeechRecognition?: new () => ISpeechRecognition;
  webkitSpeechRecognition?: new () => ISpeechRecognition;
}
