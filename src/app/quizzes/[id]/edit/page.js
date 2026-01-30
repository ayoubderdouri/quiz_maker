'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader } from 'lucide-react';
import QuizCreator from '@/components/QuizCreator';
import { getQuizById, updateQuiz } from '@/lib/quizApiClient';

export default function QuizEditPage() {
  const { id } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    (async () => {
      const data = await getQuizById(id);
      setQuiz(data);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
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
