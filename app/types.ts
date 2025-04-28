export interface Phrase {
  id: number;
  topic: string;
  phrase_native: string;
  phrase_translation: string;
  phonetic?: string;
  is_favorite: boolean;
  audio_path?: string;
  created_at: Date;
}

export interface Topic {
  id: number;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface Language {
  id: number;
  name: string;
  code: string;
} 