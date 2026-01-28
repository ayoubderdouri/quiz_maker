"use client";

import { useEffect, useState } from "react";
import "survey-core/survey.i18n";
import "survey-creator-core/survey-creator-core.i18n";
import { getLocaleStrings } from "survey-creator-core";
import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import SurveyCreatorTheme from "survey-creator-core/themes";
import { registerCreatorTheme } from "survey-creator-core";
import "survey-core/survey-core.css";
import "survey-creator-core/survey-creator-core.css";
import { customThemeVariables } from "./SurveyCreator/theme_json";
import { Sparkles } from 'lucide-react';
import AIGeneratorModal from './AIGeneratorModal';

registerCreatorTheme(SurveyCreatorTheme);

const customTheme = {
  themeName: "customTheme",
  cssVariables: { ...customThemeVariables },
};

const enLocale = getLocaleStrings("en");
function addCustomTheme(theme, userFriendlyThemeName) {
  // Step 2: Specify a localized user-friendly theme name
  enLocale.creatortheme.names[theme.themeName] = userFriendlyThemeName;
  // Step 3: Register the custom theme
  registerCreatorTheme(theme);
}

addCustomTheme(customTheme, "Custom Theme");
export default function QuizCreator({ quiz, onSurveyUpdate }) {
  const [creator, setCreator] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);

  useEffect(() => {
    const options = {
      showLogicTab: true,
      isAutoSave: true,
    };

    const newCreator = new SurveyCreator(options);

    newCreator.applyCreatorTheme(customTheme);

    // Charger les données du quiz
    if (quiz && quiz.surveyData) {
      newCreator.JSON = quiz.surveyData;
    }

    // Sauvegarder automatiquement les modifications
    newCreator.saveSurveyFunc = (saveNo, callback) => {
      if (onSurveyUpdate) {
        onSurveyUpdate(newCreator.JSON);
      }
      callback(saveNo, true);
    };

    setCreator(newCreator);

    return () => {
      if (newCreator) {
        newCreator.dispose();
      }
    };
  }, [quiz?.id]);

  const handleAIGenerate = () => {
    setShowAIModal(true);
  };

  const handleGenerateQuiz = async (data) => {
    try {
      // Afficher un message de chargement
      if (!creator) return;
      
      // Appeler l'API pour générer le quiz
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: data.prompt,
          niveau: data.niveau,
          // Les fichiers PDF seront gérés plus tard si nécessaire
        }),
      });

      const result = await response.json();

      if (result.success && result.surveyData) {
        // Mettre à jour le creator avec les nouvelles données du quiz
        creator.JSON = result.surveyData;
        
        // Notifier le parent du changement
        if (onSurveyUpdate) {
          onSurveyUpdate(result.surveyData);
        }

        alert('Quiz généré avec succès !');
      } else {
        alert('Erreur lors de la génération : ' + (result.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Erreur lors de la génération du quiz : ' + error.message);
    }
  };

  if (!creator) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-12 text-center">
        <p className="text-zinc-600 dark:text-zinc-400">Loading creator...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <SurveyCreatorComponent creator={creator} />

      {/* Floating AI Button */}
      <button
        onClick={handleAIGenerate}
        className="fixed bottom-8 right-[50%] w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl z-50"
        style={{ backgroundColor: "#155dfc" }}
        title="Generate with AI"
      >
        <Sparkles className="w-6 h-6 text-white" />
      </button>

      {/* AI Generator Modal */}
      <AIGeneratorModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerate={handleGenerateQuiz}
      />
    </div>
  );
}
