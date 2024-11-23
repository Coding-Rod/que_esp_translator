import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { TranslationInput } from './components/TranslationInput';
import { FileTranslation } from './components/FileTranslation';
import { translateText, translateFile } from './services/api';
import { Languages } from 'lucide-react';
import { type TranslationLanguage } from './types/translation';

function App() {
  const [text, setText] = useState('');
  const [sourceLang, setSourceLang] = useState<TranslationLanguage>('esp');
  const [targetLang, setTargetLang] = useState<TranslationLanguage>('que');
  const [fileTranslation, setFileTranslation] = useState<HTMLAnchorElement | null>(null);

  const { data: translation, isLoading: isTranslating } = useQuery({
    queryKey: ['translate', text, targetLang],
    queryFn: () =>
      translateText({
        text,
        target_language: targetLang,
      }),
    enabled: text.length > 0,
  });

  const fileTranslationMutation = useMutation({
    mutationFn: (file: File) => translateFile(file, targetLang),
    onSuccess: (data) => {
      // Get file
      const blob = new Blob([data.blob], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const fileURL = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = data.fileName;
      document.body.appendChild(link);
      link.click();

      // Clean up the URL object
      URL.revokeObjectURL(fileURL);
      link.remove();
      setFileTranslation(link);
    },
    onError: (error) => {
      console.error(error);
    }
  });

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setText(translation?.translated_text || '');
  };

  const handleFileSelect = (file: File) => {
    fileTranslationMutation.mutate(file);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center space-x-3 mb-8">
          <Languages className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-900">App de traducción</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <TranslationInput
              value={text}
              onChange={setText}
              onSwapLanguages={handleSwapLanguages}
              sourceLang={sourceLang}
              loading={isTranslating}
            />
            
            {translation && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-sm font-medium text-gray-700 mb-2">
                  {targetLang === 'que' ? 'Quechua' : 'Español'} Traducción
                </h2>
                <p className="text-gray-900">{translation.translated_text}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Traducir documento
            </h2>
            <FileTranslation
              onFileSelect={handleFileSelect}
              loading={fileTranslationMutation.isPending}
              translatedText={fileTranslation ? fileTranslation.href : null}
            />
          </div>
        </div>
      </div>
    </div>
  ); 
}

export default App;