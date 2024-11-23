import React, { useCallback } from 'react';
import { FileText, Upload } from 'lucide-react';

interface FileTranslationProps {
  onFileSelect: (file: File) => void;
  loading: boolean;
  translatedText: string | null;
}

export const FileTranslation: React.FC<FileTranslationProps> = ({
  onFileSelect,
  loading,
  translatedText,
}) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
          accept=".txt,.doc,.docx,.pdf"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center space-y-2"
        >
          <Upload className="w-8 h-8 text-gray-400" />
          <span className="text-sm text-gray-600">
          Suelte su archivo aquí o haga clic para cargarlo
          </span>
          <span className="text-xs text-gray-400">
            Soporta: PDF
          </span>
        </label>
      </div>

      {loading && (
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          <span className="text-sm text-gray-600">Translating file...</span>
        </div>
      )}

      {translatedText && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium">Translated Content</h3>
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{translatedText}</p>
          </div>
        </div>
      )}
    </div>
  );
};