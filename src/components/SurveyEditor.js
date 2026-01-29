'use client';

import { useEffect, useRef } from 'react';
import { SurveyCreator, SurveyCreatorComponent } from 'survey-creator-react';
// import 'survey-creator-react/survey-creator-core.css';

/**
 * Composant pour éditer un quiz avec SurveyJS Creator
 * Permet la création et la modification complète du quiz
 */
export default function SurveyEditor({ initialData, onChange, onSave }) {
  const creatorRef = useRef(null);

  useEffect(() => {
    if (!creatorRef.current) return;

    const creator = new SurveyCreator({
      showToolbox: 'right',
      showPropertyGrid: 'right',
      isAutoSave: true
    });

    // Charger les données initiales
    if (initialData) {
      creator.JSON = initialData;
    }

    // Événement pour détecter les changements
    creator.onValueChanging.add(() => {
      if (onChange) {
        onChange(creator.JSON);
      }
    });

    creator.onSaved.add(() => {
      if (onSave) {
        onSave(creator.JSON);
      }
    });

    // Rendre le créateur
    const surveyElement = document.createElement('div');
    creatorRef.current.appendChild(surveyElement);
    new SurveyCreatorComponent({ 
      creator 
    }).render(surveyElement);

    return () => {
      creator.dispose();
      if (surveyElement.parentNode) {
        surveyElement.parentNode.removeChild(surveyElement);
      }
    };
  }, [initialData, onChange, onSave]);

  return (
    <div 
      ref={creatorRef} 
      className="w-full h-full"
      style={{ minHeight: '600px' }}
    />
  );
}
