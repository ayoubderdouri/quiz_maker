'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllQuizzes, deleteQuiz, getShareLink, generateShareLink } from '@/lib/quizApiClient';
import CreateQuizModal from '@/components/CreateQuizModal';
import { FileText, Plus, Trash2, Edit, Eye, Share2, Copy, Check } from 'lucide-react';

export default function QuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    setLoading(true);
    const allQuizzes = await getAllQuizzes();
    setQuizzes(allQuizzes);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce quiz ?')) {
      return;
    }

    const result = await deleteQuiz(id);
    if (result.success) {
      loadQuizzes();
    } else {
      alert('Erreur lors de la suppression : ' + result.error);
    }
  };

  const handleCopyShareLink = async (quizId) => {
    try {
      // First try to get existing share link
      let result = await getShareLink(quizId);
      
      // If no link exists, generate one
      if (!result.success || !result.shareUrl) {
        result = await generateShareLink(quizId);
      }
      
      if (result.success && result.shareUrl) {
        navigator.clipboard.writeText(result.shareUrl);
        setCopiedId(quizId);
        setTimeout(() => setCopiedId(null), 2000);
      } else {
        alert('Erreur : ' + (result.error || 'Impossible de générer le lien'));
      }
    } catch (error) {
      alert('Erreur : ' + error.message);
      console.error('Error copying share link:', error);
    }
  };

  const handleCreateSuccess = () => {
    loadQuizzes();
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Mes Quiz
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Gérez et organisez votre collection de quiz
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Créer un Quiz
        </button>
      </div>

      {/* Modal de création simple */}
      <CreateQuizModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {loading ? (
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-12 text-center">
          <p className="text-zinc-600 dark:text-zinc-400">Chargement des quiz...</p>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-12 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-zinc-400" />
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Aucun quiz créé pour le moment
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Créer un Quiz
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition-all flex flex-col h-full"
            >
              {/* Card Header */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white line-clamp-2">
                      {quiz.title}
                    </h3>
                  </div>
                  {quiz.status && (
                    <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-700 rounded text-xs font-medium whitespace-nowrap flex-shrink-0">
                      {quiz.status === 'draft' ? '📝' : '✅'}
                    </span>
                  )}
                </div>

                {quiz.description && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-4">
                    {quiz.description}
                  </p>
                )}

                {/* Stats */}
                <div className="flex gap-4 text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                  <span className="flex items-center gap-1">
                    📋 {quiz.totalQuestions} questions
                  </span>
                </div>
              </div>

              {/* Card Footer - Actions */}
              <div className="flex gap-2 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                <button
                  onClick={() => router.push(`/quizzes/${quiz.id}`)}
                  className="flex-1 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center gap-2"
                  title="Voir"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-xs">Voir</span>
                </button>
                <button
                  onClick={() => router.push(`/quizzes/${quiz.id}/edit`)}
                  className="flex-1 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2"
                  title="Éditer"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-xs">Éditer</span>
                </button>
                <button
                  onClick={() => handleCopyShareLink(quiz.id)}
                  className="flex-1 p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors text-green-600 dark:text-green-400 flex items-center justify-center gap-2"
                  title="Copier le lien"
                >
                  {copiedId === quiz.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="text-xs">Copié</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span className="text-xs">Partage</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(quiz.id)}
                  className="flex-1 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600 dark:text-red-400 flex items-center justify-center gap-2"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-xs">Supp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
