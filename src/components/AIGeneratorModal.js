'use client';

import { useState } from 'react';
import { X, Upload, Sparkles, Loader } from 'lucide-react';
import { generateQuizWithAI } from '@/lib/quizApiClient';

/**
 * Modal de génération de quiz via IA
 * Met à jour le quiz ouvert dans l'éditeur au lieu de créer un nouveau
 */
export default function AIGeneratorModal({ isOpen, onClose, onGenerate, onSuccess }) {
  const [prompt, setPrompt] = useState('');
  const [niveau, setNiveau] = useState('intermediate');
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    );
    
    setFiles([...files, ...droppedFiles]);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(
      file => file.type === 'application/pdf'
    );
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError('Veuillez entrer une description pour le quiz');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Appel à l'API IA pour générer le surveyData
      const generateResult = await generateQuizWithAI(prompt, niveau, files);
      
      if (!generateResult.success) {
        setError(generateResult.error || 'Erreur lors de la génération');
        setLoading(false);
        return;
      }

      // Mettre à jour le quiz existant via le callback onGenerate
      const surveyData = generateResult.surveyData;
      if (onGenerate) {
        onGenerate({ surveyData });
      }

      // Succès : réinitialiser et fermer
      setPrompt('');
      setNiveau('intermediate');
      setFiles([]);
      onClose();
      
      // Callback optionnel
      if (onSuccess) {
        onSuccess();
      }

    } catch (err) {
      setError(err.message || 'Erreur lors du traitement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#155dfc' }}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Générateur AI de Quiz
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Créez un quiz automatiquement avec l'IA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
          {/* Prompt Input */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
              Description du Quiz *
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Décrivez le sujet du quiz, les thèmes à couvrir, le type de questions..."
              className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white resize-none"
              style={{ focusRingColor: '#155dfc' }}
              rows={4}
            />
          </div>

          {/* Niveau Selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
              Niveau du Quiz *
            </label>
            <select
              value={niveau}
              onChange={(e) => setNiveau(e.target.value)}
              className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
              style={{ focusRingColor: '#155dfc' }}
            >
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="advanced">Avancé</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          {/* File Upload Zone */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
              Documents PDF (Optionnel)
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? 'border-[#155dfc] bg-blue-50 dark:bg-blue-950'
                  : 'border-zinc-300 dark:border-zinc-700'
              }`}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-zinc-400" />
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                Glissez-déposez vos fichiers PDF ici
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-4">
                ou
              </p>
              <label className="inline-block px-4 py-2 text-white rounded-lg cursor-pointer transition-colors" style={{ backgroundColor: '#155dfc' }}>
                Parcourir les fichiers
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-red-600 dark:text-red-300">PDF</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">
                          {file.name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-medium disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 text-white rounded-lg transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: '#155dfc' }}
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Générer le Quiz
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
