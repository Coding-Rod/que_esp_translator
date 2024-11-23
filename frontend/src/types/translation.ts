export type TranslationLanguage = 'que' | 'esp';

export interface TranslationRequest {
  text: string;
  target_language: TranslationLanguage;
}

export interface TranslationResponse {
  original_text: string;
  translated_text: string;
}

export interface FileTranslation {
  fileName: string;
  originalText: string;
  translatedText: string;
}

