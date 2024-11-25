import React, { useCallback, useEffect, useState } from 'react';
import debounce from "just-debounce-it";
import { ArrowLeftRight } from 'lucide-react';

interface TranslationInputProps {
  value: string;
  onChange: (value: string) => void;
  onSwapLanguages: () => void;
  sourceLang: 'que' | 'esp';
  loading: boolean;
}

export const TranslationInput: React.FC<TranslationInputProps> = ({
  value,
  onChange,
  onSwapLanguages,
  sourceLang,
  loading,
}) => {
  const [inputValue, setInputValue] = useState(value);

  const debouncedOnChange = useCallback(
    debounce((newValue: string) => {
      onChange(newValue);
    }, 1000),
    []
  );

  useEffect(() => {
    debouncedOnChange(inputValue);
  }, [inputValue, debouncedOnChange]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          {sourceLang === 'que' ? 'Quechua' : 'Español'}
        </span>
        <button
          onClick={onSwapLanguages}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Swap languages"
        >
          <ArrowLeftRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      <textarea
        className="w-full h-40 p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        placeholder={`Escribe en ${sourceLang === 'que' ? 'Quechua' : 'Español'}...`}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      {loading && (
        <div className="absolute bottom-4 right-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};