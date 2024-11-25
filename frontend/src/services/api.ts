import axios from 'axios';
import { TranslationRequest, TranslationResponse, FileTranslationResponse } from '../types/translation';
import { type TranslationLanguage } from '../types/translation';
const API_URL = 'https://sadly-top-dove.ngrok-free.app';

export const translateText = async (request: TranslationRequest): Promise<TranslationResponse> => {
  const response = await axios.post(`${API_URL}/translate-text`, request, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  console.log(response.data);

  // If starts with " remove it
  if (response.data.translated_text.startsWith('"')) {
    response.data.translated_text =
      response.data.translated_text.substring(1, response.data.translated_text.length - 1);
  }

  // If ends with " remove it
  if (response.data.translated_text.endsWith('"')) {
    response.data.translated_text =
      response.data.translated_text.substring(0, response.data.translated_text.length - 1);
  }

  return response.data;
};

export const translateFile = async (file: File, targetLang: TranslationLanguage): Promise<FileTranslationResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('target_language', targetLang);

  const response = await axios.post(`${API_URL}/translate-document`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    responseType: 'blob',
  });
  if (response.status !== 200) {
    throw new Error('Failed to translate file');
  }
  // Check if blob is a valid file
  return {
    fileName: `translated_${file.name}`,
    blob: response.data,
  }
};