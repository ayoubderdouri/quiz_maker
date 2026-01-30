'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, AlertCircle, Loader } from 'lucide-react';
import SurveyPreview from '@/components/SurveyPreview';

export default function ResultPreviewPage() {
  const params = useParams();
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!id) return;
    loadResult();
  }, [id]);

  const loadResult = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/responses/${id}`);
      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Résultat introuvable');
      }

      setResult(data.data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
          <Loader className="w-5 h-5 animate-spin" />
          Chargement du résultat...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Link
          href="/results"
          className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux résultats
        </Link>
        <div className="mt-6 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 text-center">
          <AlertCircle className="w-10 h-10 mx-auto mb-3 text-red-500" />
          <p className="text-zinc-700 dark:text-zinc-200">{error}</p>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/results"
            className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux résultats
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
        {result.quiz?.surveyData ? (
          <SurveyPreview
            surveyData={result.quiz.surveyData}
            responseData={result.data}
          />
        ) : (
          <pre className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 text-xs text-zinc-700 dark:text-zinc-200 overflow-auto">
            {JSON.stringify(result.data || {}, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
