'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
import 'survey-core/survey.i18n';
import 'survey-core/survey-core.css';

/**
 * Page de partage public - Les invités peuvent remplir le quiz
 * /share/:token
 */
export default function SharePage() {
  const params = useParams();
  const { token } = params;

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [token]);

  const loadQuiz = async () => {
    try {
      const response = await fetch(`/api/share/${token}`);
      const result = await response.json();

      if (!result.success) {
        setError(result.error || 'Quiz non trouvé');
      } else {
        setQuiz(result.data);
      }
    } catch (err) {
      setError('Erreur lors du chargement du quiz');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (survey) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: quiz.id,
          responseData: survey.data,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || 'Erreur lors de la sauvegarde');
      }
    } catch (err) {
      setError('Erreur lors de la sauvegarde de votre réponse');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-zinc-600 dark:text-zinc-400">Chargement du quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800">
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-8 max-w-md text-center shadow-lg">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
            Erreur
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800">
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-8 max-w-md text-center shadow-lg">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-2">
            Merci !
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Votre réponse a été enregistrée avec succès.
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Vous pouvez fermer cette page.
          </p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  const survey = new Model(quiz.surveyData || quiz);
  survey.onComplete.add(handleComplete);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-zinc-800 rounded-t-lg shadow-lg p-6 border-b border-zinc-200 dark:border-zinc-700">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {quiz.title}
          </h1>
          {quiz.description && (
            <p className="text-zinc-600 dark:text-zinc-400 mt-2">
              {quiz.description}
            </p>
          )}
        </div>

        {/* Survey */}
        <div className="bg-white dark:bg-zinc-800 rounded-b-lg shadow-lg overflow-hidden">
          <Survey model={survey} />
        </div>

        {submitting && (
          <div className="mt-4 flex items-center justify-center gap-2 text-blue-600 bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-lg">
            <Loader className="w-5 h-5 animate-spin" />
            <span className="font-medium">Envoi en cours...</span>
          </div>
        )}
      </div>
    </div>
  );
}
