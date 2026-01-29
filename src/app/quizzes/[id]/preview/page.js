'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getQuizById } from '@/lib/quizApiClient';
import SurveyPreview from '@/components/SurveyPreview';
import { ArrowLeft, Loader } from 'lucide-react';

/**
 * Page de prévisualisation SurveyJS (read-only)
 * GET /quizzes/:id/preview
 */
export default function QuizPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const loadQuiz = async () => {
      const data = await getQuizById(id);
      if (!data) {
        setError('Quiz non trouvé');
      } else {
        setQuiz(data);
      }
      setLoading(false);
    };

    loadQuiz();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-zinc-600 dark:text-zinc-400">Chargement du quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="p-6 space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <p className="text-red-700 dark:text-red-400">{error || 'Erreur lors du chargement du quiz'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Prévisualisation : {quiz.title}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-2">
            Mode lecture seule
          </p>
        </div>
      </div>

      {quiz.surveyData && (
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <SurveyPreview 
            surveyData={quiz.surveyData}
          />
        </div>
      )}
    </div>
  );
}
