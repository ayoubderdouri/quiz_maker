'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, FileText, TrendingUp, BarChart3 } from 'lucide-react';
import { getAllQuizzes, getQuizResponses } from '@/lib/quizApiClient';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalResponses: 0,
    avgResponsesPerQuiz: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const quizzes = await getAllQuizzes(0, 100);
      setStats((prev) => ({
        ...prev,
        totalQuizzes: quizzes.length,
      }));

      let totalResponses = 0;
      for (const quiz of quizzes) {
        const result = await getQuizResponses(quiz.id);
        if (result.success) {
          totalResponses += result.count || 0;
        }
      }

      setStats((prev) => ({
        ...prev,
        totalResponses,
        avgResponsesPerQuiz:
          quizzes.length > 0 ? (totalResponses / quizzes.length).toFixed(1) : 0,
      }));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Bienvenue sur Quiz Maker - Voici un aperçu de vos activités
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Quizzes */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Quiz créés</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {loading ? '-' : stats.totalQuizzes}
                </p>
              </div>
            </div>
          </div>
          <Link
            href="/quizzes"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Voir tous les quiz →
          </Link>
        </div>

        {/* Total Responses */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Réponses collectées</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {loading ? '-' : stats.totalResponses}
                </p>
              </div>
            </div>
          </div>
          <Link
            href="/results"
            className="text-sm text-green-600 dark:text-green-400 hover:underline"
          >
            Consulter les résultats →
          </Link>
        </div>

        {/* Avg Responses */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Moy. par quiz</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {loading ? '-' : stats.avgResponsesPerQuiz}
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            Moyenne de réponses par quiz
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-800 rounded-lg p-8 text-white">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold mb-2">Commencer</h2>
          <p className="text-blue-100 mb-6">
            Créez un nouveau quiz, gérez vos quiz existants ou consultez vos résultats.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/quizzes"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Mes Quiz
            </Link>
            <Link
              href="/results"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              Résultats
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Fonctionnalités
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
              📝 Créer des Quiz
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Créez des quiz interactifs avec une interface intuitive.
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
              🤖 Génération IA
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Générez automatiquement des quiz avec l'intelligence artificielle.
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
              🔗 Partage facile
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Générez des liens de partage pour vos quiz.
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
              📊 Analyse des résultats
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Consultez et analysez les réponses collectées.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
