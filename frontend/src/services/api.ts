import axios from 'axios';
import { TranslationRequest, TranslationResponse } from '../types/translation';
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

export const translateFile = async (file: File, sourceLang: TranslationLanguage, targetLang: TranslationLanguage): Promise<TranslationResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sourceLang', sourceLang);
  formData.append('targetLang', targetLang);

  const response = await axios.post(`${API_URL}/translate-file`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};