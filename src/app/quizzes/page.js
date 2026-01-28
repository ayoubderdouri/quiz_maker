'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllQuizzes, deleteQuiz } from '@/lib/quizService';
import { FileText, Plus, Trash2, Edit, Eye } from 'lucide-react';

export default function QuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    const allQuizzes = await getAllQuizzes();
    setQuizzes(allQuizzes);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      const result = await deleteQuiz(id);
      if (result.success) {
        loadQuizzes();
      } else {
        alert('Error deleting quiz: ' + result.error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'archived':
        return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200';
      default:
        return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200';
    }
  };



  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            All Quizzes
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Manage your quiz collection
          </p>
        </div>
        <button
          onClick={() => router.push('/create')}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Create Quiz
        </button>
      </div>

      {quizzes.length === 0 ? (
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-12 text-center">
          <FileText className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            No quizzes yet
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Create your first quiz to get started
          </p>
          <button
            onClick={() => router.push('/create')}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Quiz
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                    {quiz.description || 'No description'}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(quiz.status)}`}>
                  {quiz.status}
                </span>
              </div>

              <div className="space-y-2 mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex justify-between">
                  <span>Questions:</span>
                  <span className="font-medium">{quiz.metadata?.totalQuestions || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Responses:</span>
                  <span className="font-medium">{quiz.metadata?.totalResponses || 0}</span>
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                  ID: {quiz.id.substring(0, 8)}...
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push(`/quiz/${quiz.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => router.push(`/edit/${quiz.id}`)}
                  className="flex items-center justify-center p-2 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(quiz.id)}
                  className="flex items-center justify-center p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
