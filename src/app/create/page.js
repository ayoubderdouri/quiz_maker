'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import QuizCreator from '@/components/QuizCreator';
import { createQuizStructure, saveQuiz } from '@/lib/quizService';


export default function CreateQuizPage() {
  const router = useRouter();
  const [quizData, setQuizData] = useState(() => createQuizStructure());
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const result = saveQuiz(quizData);
    
    if (result.success) {
      alert('Quiz saved successfully!');
      router.push('/quizzes');
    } else {
      alert('Error saving quiz: ' + result.error);
    }
    setSaving(false);
  };

  const handleSurveyUpdate = (surveyData) => {
    setQuizData(prev => ({
      ...prev,
      surveyData,
      updatedAt: new Date().toISOString()
    }));
  };



  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <QuizCreator
          quiz={quizData}
          onSurveyUpdate={handleSurveyUpdate}
        />
      </div>
      
     
    </div>
  );
}
