'use client';

import { useEffect, useRef } from 'react';
import { Survey } from 'survey-react-ui';
import 'survey-core/survey-core.css';

/**
 * Composant pour prévisualiser un quiz (mode read-only)
 * Affiche le quiz complet sans édition possible
 */
export default function SurveyPreview({ surveyData, onComplete }) {
  const surveyRef = useRef(null);

  useEffect(() => {
    if (!surveyData) return;

    // Configuration SurveyJS pour la prévisualisation (read-only)
    const survey = new Survey.Model(surveyData);
    
    // Mode read-only
    survey.mode = 'display';
    survey.showQuestionNumbers = 'off';
    survey.showCompletedPage = false;

    // Événements
    if (onComplete) {
      survey.onComplete.add(() => {
        onComplete(survey.data);
      });
    }

    survey.render(surveyRef.current);

    return () => {
      survey.dispose();
    };
  }, [surveyData, onComplete]);

  if (!surveyData) {
    return (
      <div className="p-6 text-center text-zinc-500 dark:text-zinc-400">
        Aucune donnée de quiz disponible
      </div>
    );
  }

  return <div ref={surveyRef} />;
}
