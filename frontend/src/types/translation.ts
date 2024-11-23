export type TranslationLanguage = 'que' | 'esp';

export interface TranslationRequest {
  text: string;
  sourceLang: TranslationLanguage;
  targetLang: TranslationLanguage;
}

export interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: string;
}

export interface FileTranslation {
  fileName: string;
  originalText: string;
  translatedText: string;
}

