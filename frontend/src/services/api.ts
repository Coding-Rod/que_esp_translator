import axios from 'axios';
import { TranslationRequest, TranslationResponse, FileTranslationResponse } from '../types/translation';
import { type TranslationLanguage } from '../types/translation';
const API_URL = 'https://que-esp-translator.onrender.com';

export const translateText = async (request: TranslationRequest): Promise<TranslationResponse> => {
  const response = await axios.post(`${API_URL}/translate-text`, request, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  console.log(response.data);
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