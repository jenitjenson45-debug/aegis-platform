export type AppPhase =
  | "LOGO_INTRO"
  | "HERO_STILL"
  | "CURSOR_AWAKENING"
  | "ORIGIN_MOVIE"
  | "LANDING_EXPLORE"
  | "LOGIN"
  | "ADMIN_LOGIN"
  | "ADMIN_DASHBOARD"
  | "AUTHENTICATING"
  | "AEGIS_ROOM"
  | "CONFESSION_FLOW"
  | "AEGIS_TAKING_OVER"
  | "RATING_SCREEN"
  | "STANDBY_SCREEN";

export type LanguageCode = "en" | "ml";

export interface ChatMessage {
  id: string;
  sender: "aegis" | "user" | "system";
  text: string;
  language?: LanguageCode;
  timestamp: string;
  isVoice?: boolean;
}

export interface UserSession {
  sessionId: string;
  email: string;
  token: string;
  language: LanguageCode;
  authenticatedAt: string;
  isConfessionComplete: boolean;
}

export interface AdminSession {
  adminToken: string;
  username: string;
  clearance: string;
  authenticatedAt: string;
}

export interface MovieChapter {
  id: number;
  chapterNumber: string;
  title: string;
  subtitle: string;
  narration: string[];
  imageSrc: string;
  mood: string;
  audioTheme: string;
  cameraMovement: "dolly-in" | "dolly-out" | "pan-right" | "pan-left" | "tilt-up" | "orbit";
  focalQuote?: string;
  powers?: Array<{ name: string; desc: string; tag: string }>;
}
