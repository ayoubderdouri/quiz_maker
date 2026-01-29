'use client';

import { useState } from 'react';
import { X, Plus, Loader } from 'lucide-react';
import { createQuiz } from '@/lib/quizApiClient';

/**
 * Modal simple de création de quiz
 * Permet de créer un quiz vide avec titre et description
 */
export default function CreateQuizModal({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Le titre est requis');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Créer un quiz vide avec structure SurveyJS minimale
      const surveyData = {
        title: title.trim(),
        pages: [
          {
            name: 'page1',
            elements: [
              {
                type: 'text',
                name: 'question1',
                title: 'Question 1',
                isRequired: true,
              },
            ],
          },
        ],
      };

      const result = await createQuiz(
        title.trim(),
        description.trim() || 'Quiz sans description',
        surveyData
      );

      if (result.success) {
        // Réinitialiser le formulaire
        setTitle('');
        setDescription('');
        onClose();

        // Callback pour recharger la liste
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(result.error || 'Erreur lors de la création du quiz');
      }
    } catch (err) {
      setError('Erreur : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-700">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Créer un nouveau quiz
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Titre du quiz *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Quiz sur les fondamentaux JavaScript"
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Description (optionnel)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez le quiz..."
              rows="3"
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors font-medium disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Créer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
