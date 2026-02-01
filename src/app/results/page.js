'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { FileText, RefreshCw, TrendingUp, Eye } from 'lucide-react';
import { getAllQuizzes, getQuizResponses } from '@/lib/quizApiClient';

function formatDate(value) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleString('fr-FR');
  } catch {
    return String(value);
  }
}

export default function ResultsPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [responses, setResponses] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const [error, setError] = useState('');

  const selectedQuiz = useMemo(
    () => quizzes.find((quiz) => quiz.id === selectedQuizId) || null,
    [quizzes, selectedQuizId]
  );

  const loadQuizzes = async () => {
    setLoadingQuizzes(true);
    setError('');

    const data = await getAllQuizzes(0, 50);
    setQuizzes(data);
    setLoadingQuizzes(false);

    if (data.length > 0 && !selectedQuizId) {
      setSelectedQuizId(data[0].id);
    }
  };

  const loadResponses = async (quizId) => {
    if (!quizId) return;
    setLoadingResponses(true);
    setError('');

    const result = await getQuizResponses(quizId);
    if (result.success) {
      setResponses(result.responses || []);
    } else {
      setResponses([]);
      setError(result.error || 'Impossible de charger les résultats');
    }

    setLoadingResponses(false);
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  useEffect(() => {
    if (selectedQuizId) {
      loadResponses(selectedQuizId);
    }
  }, [selectedQuizId]);

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">
            Résultats
          </h1>
          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mt-1">
            Consultez les réponses collectées par quiz
          </p>
        </div>
        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
          <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-xs md:text-sm">Suivi des performances</span>
        </div>
      </div>

      {loadingQuizzes ? (
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-10 text-center">
          <p className="text-zinc-600 dark:text-zinc-400">Chargement des quiz...</p>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-10 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-zinc-400" />
          <p className="text-zinc-600 dark:text-zinc-400">
            Aucun quiz disponible pour afficher des résultats.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-col gap-2 flex-1">
                <span className="text-xs md:text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Quiz sélectionné
                </span>
                <select
                  value={selectedQuizId}
                  onChange={(event) => setSelectedQuizId(event.target.value)}
                  className="w-full sm:min-w-[260px] rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-800 dark:text-zinc-100"
                >
                  {quizzes.map((quiz) => (
                    <option key={quiz.id} value={quiz.id}>
                      {quiz.title || 'Quiz sans titre'}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => loadResponses(selectedQuizId)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition w-full sm:w-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Rafraîchir
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg p-4 text-sm">
              {error}
            </div>
          )}

          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="flex-1">
                <h2 className="text-lg md:text-xl font-semibold text-zinc-900 dark:text-white">
                  {selectedQuiz?.title || 'Résultats'}
                </h2>
                <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  {selectedQuiz?.description || 'Aucune description disponible'}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400">Total réponses</span>
                <p className="text-xl md:text-2xl font-semibold text-zinc-900 dark:text-white">
                  {responses.length}
                </p>
              </div>
            </div>

            {loadingResponses ? (
              <div className="py-10 text-center text-zinc-600 dark:text-zinc-400">
                Chargement des réponses...
              </div>
            ) : responses.length === 0 ? (
              <div className="py-10 text-center text-zinc-600 dark:text-zinc-400">
                Aucune réponse collectée pour ce quiz.
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {responses.map((response, index) => (
                  <div
                    key={response.id || index}
                    className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-3 md:p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">
                          Réponse #{responses.length - index}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {formatDate(response.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                          ID: {response.id}
                        </span>
                        <Link
                          href={`/results/${response.id}/preview`}
                          className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
                        >
                          <Eye className="w-3 h-3" />
                          Voir
                        </Link>
                      </div>
                    </div>
                    <pre className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-2 md:p-3 text-xs text-zinc-700 dark:text-zinc-200 overflow-auto max-h-60">
                      {JSON.stringify(response.data || {}, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
