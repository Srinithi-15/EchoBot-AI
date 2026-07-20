export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  isVoiceInput?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: string;
  summary?: string;
}

export interface EchoBotSettings {
  language: string;
  voiceGender: 'male' | 'female';
  volume: number; // 0 to 1
  speechSpeed: number; // 0.5 to 2
  accentColor: 'blue' | 'cyan' | 'purple';
  isMuted: boolean;
}

export interface UserProfile {
  username: string;
  email: string;
  avatarUrl: string;
}
