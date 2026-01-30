"use client";

import { useEffect, useMemo } from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/survey.i18n";
import "survey-core/survey-core.css";
import { customThemeVariables } from "./SurveyCreator/theme_json";

export default function SurveyPreview({
  surveyData,
  responseData,
  onComplete,
}) {
  const survey = useMemo(() => {
    if (!surveyData) return null;

    const model = new Model(surveyData);

    // Appliquer le thème custom avec les variables CSS
    model.applyTheme({
      cssVariables: {

        "--font-size": "20px",
        "--sjs-toc-font-size": "40px",
        "--sjs-general-backcolor": "#ffffff",
        "--sjs-general-forecolor": "#222",
        "--sjs-primary-backcolor": "#155dfcFF",
        "--sjs-primary-forecolor": "#fff",
        "--sjs-border-default": "#ddd",
        "--sjs-border-hover": "#155dfcFF",
      },
    });
    model.mode = "display";
    model.readOnly = true;
    model.showQuestionNumbers = "off";
    model.showCompletedPage = false;
    model.locale = "fr";

    if (responseData) {
      model.data = responseData;
    }

    if (onComplete) {
      model.onComplete.add(() => onComplete(model.data));
    }

    return model;
  }, [surveyData, responseData, onComplete]);

  if (!surveyData) {
    return (
      <div className="p-6 text-center text-zinc-500 dark:text-zinc-400">
        Aucune donnée de quiz disponible
      </div>
    );
  }

  if (!survey) return null;

  return <Survey model={survey} />;
}
