'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader, Share2, Copy, Check } from 'lucide-react';
import QuizCreator from '@/components/QuizCreator';
import { getQuizById, updateQuiz, getShareLink, generateShareLink } from '@/lib/quizApiClient';

export default function QuizEditPage() {
  const { id } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    (async () => {
      const data = await getQuizById(id);
      setQuiz(data);
      
      // Fetch share link if exists
      const shareResult = await getShareLink(id);
      if (shareResult.success && shareResult.shareUrl) {
        setShareUrl(shareResult.shareUrl);
      }
      
      setLoading(false);
    })();
  }, [id]);

  const handleSurveyUpdate = async (surveyData) => {
    setQuiz((prev) => ({ ...prev, surveyData }));
 
    try {
      await updateQuiz(id, {
        title: quiz?.title,
        description: quiz?.description,
        surveyData,
      });
      console.log('Survey data saved automatically');
    } catch (error) {
      console.error('Error saving survey data:', error);
    } 
  };

  const handleGenerateShareLink = async () => {
    const result = await generateShareLink(id);
    if (result.success) {
      setShareUrl(result.shareUrl);
    } else {
      alert('Erreur : ' + result.error);
    }
  };

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Floating Share Button */}
      <button
        onClick={() => setShowShareModal(true)}
        className="fixed top-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg"
      >
        <Share2 className="w-5 h-5" />
        Partager
      </button>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 max-w-md shadow-lg">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
              Partager ce quiz
            </h2>
            
            {!shareUrl ? (
              <>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                  Générez un lien pour permettre aux invités de répondre à ce quiz.
                </p>
                <button
                  onClick={handleGenerateShareLink}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Générer un lien de partage
                </button>
              </>
            ) : (
              <>
                <div className="bg-zinc-100 dark:bg-zinc-700 p-3 rounded-lg mb-4 break-all">
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 font-mono">
                    {shareUrl}
                  </p>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copier le lien
                    </>
                  )}
                </button>
              </>
            )}

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-3 px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors font-medium"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <QuizCreator
          quiz={quiz}
          onSurveyUpdate={handleSurveyUpdate}
        />
      </div>
    </div>
  );
}
