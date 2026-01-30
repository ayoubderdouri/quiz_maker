"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Loader, AlertCircle } from "lucide-react";
import { Survey } from "survey-react-ui";
import { Model } from "survey-core";
import "survey-core/survey.i18n";
import "survey-core/survey-core.css";

/**
 * Page de partage public
 * /share/[token]
 * ➜ utilise UNIQUEMENT la page Thank You par défaut de SurveyJS
 */
export default function SharePage() {
  const { token } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  /* ===========================
     Load quiz
     =========================== */
  useEffect(() => {
    if (!token) return;

    const loadQuiz = async () => {
      try {
        const response = await fetch(`/api/share/${token}`);
        const result = await response.json();

        if (!result.success) {
          setError(result.error || "Quiz non trouvé");
        } else {
          setQuiz(result.data);
        }
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement du quiz");
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [token]);

  /* ===========================
     Survey model
     =========================== */
  const survey = useMemo(() => {
    if (!quiz) return null;

    const model = new Model(quiz.surveyData || quiz);

    model.locale = "fr";

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

    // ⚠️ NE PAS désactiver la page de fin
    // model.showCompletedPage = true (par défaut)

    model.onComplete.add(async (sender) => {
      setSubmitting(true);

      try {
        await fetch("/api/responses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizId: quiz.id,
            responseData: sender.data,
          }),
        });
      } catch (err) {
        console.error("Erreur sauvegarde réponse", err);
      } finally {
        setSubmitting(false);
      }
    });

    return model;
  }, [quiz]);

  /* ===========================
     UI STATES
     =========================== */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-zinc-600 dark:text-zinc-400">
            Chargement du quiz...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800">
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-8 max-w-md text-center shadow-lg">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
            Erreur
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!survey) return null;

  /* ===========================
     RENDER
     =========================== */
  return (
    <div>
      <Survey model={survey} />
    </div>
  );
}
