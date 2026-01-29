/**
 * API Client pour la gestion des quiz
 * Utilise l'endpoint REST standard: /api/quizzes
 */

const API_BASE = '/api/quizzes';

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    throw new Error(data?.error || `Request failed with status ${response.status}`);
  }

  return data;
}

/**
 * Compte le nombre de questions dans les données SurveyJS
 */
function countSurveyQuestions(surveyData) {
  if (!surveyData) return 0;

  const countElements = (elements = []) => {
    return elements.reduce((acc, el) => {
      if (Array.isArray(el?.elements)) {
        return acc + countElements(el.elements);
      }
      if (Array.isArray(el?.questions)) {
        return acc + countElements(el.questions);
      }
      return acc + (el?.type ? 1 : 0);
    }, 0);
  };

  if (Array.isArray(surveyData.pages)) {
    return surveyData.pages.reduce(
      (acc, page) => acc + countElements(page?.elements || []),
      0
    );
  }

  return countElements(surveyData.elements || []);
}

/**
 * Normalise les données du quiz pour une utilisation uniforme
 */
function normalizeQuiz(raw) {
  if (!raw) return null;
  
  const surveyData = raw.surveyData || {};
  const totalQuestions = countSurveyQuestions(surveyData);
  
  return {
    ...raw,
    totalQuestions,
    metadata: {
      totalQuestions,
      createdAt: raw.createdAt || new Date().toISOString(),
      updatedAt: raw.updatedAt || new Date().toISOString()
    }
  };
}

/**
 * GET /api/quizzes
 * Récupère la liste de tous les quiz
 */
export async function getAllQuizzes(skip = 0, take = 10) {
  try {
    const response = await request(`${API_BASE}?skip=${skip}&take=${take}`);
    return (response.data || []).map(normalizeQuiz);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return [];
  }
}

/**
 * GET /api/quizzes/:id
 * Récupère un quiz spécifique
 */
export async function getQuizById(id) {
  try {
    const response = await request(`${API_BASE}/${id}`);
    return normalizeQuiz(response.data);
  } catch (error) {
    console.error(`Error fetching quiz ${id}:`, error);
    return null;
  }
}

/**
 * POST /api/quizzes
 * Crée un nouveau quiz
 */
export async function createQuiz(title, description = '', surveyData = null) {
  try {
    const response = await request(API_BASE, {
      method: 'POST',
      body: JSON.stringify({
        title,
        description,
        surveyData,
        status: 'draft'
      })
    });
    return { success: true, data: normalizeQuiz(response.data) };
  } catch (error) {
    console.error('Error creating quiz:', error);
    return { success: false, error: error.message };
  }
}

/**
 * PUT /api/quizzes/:id
 * Met à jour un quiz
 */
export async function updateQuiz(id, updates) {
  try {
    const response = await request(`${API_BASE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return { success: true, data: normalizeQuiz(response.data) };
  } catch (error) {
    console.error(`Error updating quiz ${id}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * DELETE /api/quizzes/:id
 * Supprime un quiz
 */
export async function deleteQuiz(id) {
  try {
    await request(`${API_BASE}/${id}`, {
      method: 'DELETE'
    });
    return { success: true };
  } catch (error) {
    console.error(`Error deleting quiz ${id}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * POST /api/generate-quiz
 * Génère un quiz via IA
 */
export async function generateQuizWithAI(prompt, niveau, files = []) {
  try {
    const response = await request('/api/generate-quiz', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        niveau,
        files
      })
    });
    return { success: true, surveyData: response.surveyData };
  } catch (error) {
    console.error('Error generating quiz:', error);
    return { success: false, error: error.message };
  }
}

/**
 * POST /api/quizzes/:id/share
 * Generate a share link for a quiz
 */
export async function generateShareLink(quizId) {
  try {
    const response = await request(`${API_BASE}/${quizId}/share`, {
      method: 'POST',
    });
    return { success: true, shareUrl: response.shareUrl, shareToken: response.shareToken };
  } catch (error) {
    console.error(`Error generating share link for quiz ${quizId}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * GET /api/quizzes/:id/share
 * Get the share link for a quiz
 */
export async function getShareLink(quizId) {
  try {
    const response = await request(`${API_BASE}/${quizId}/share`, {
      method: 'GET',
    });
    return { success: true, shareUrl: response.shareUrl, shareToken: response.shareToken };
  } catch (error) {
    console.error(`Error getting share link for quiz ${quizId}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * GET /api/responses?quizId=xxx
 * Get all responses for a quiz
 */
export async function getQuizResponses(quizId) {
  try {
    const response = await request(`/api/responses?quizId=${quizId}`, {
      method: 'GET',
    });
    return { success: true, responses: response.data, count: response.count };
  } catch (error) {
    console.error(`Error getting responses for quiz ${quizId}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * POST /api/responses
 * Save a guest response to a quiz
 */
export async function submitQuizResponse(quizId, responseData) {
  try {
    const response = await request('/api/responses', {
      method: 'POST',
      body: JSON.stringify({
        quizId,
        responseData,
      }),
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error submitting response:', error);
    return { success: false, error: error.message };
  }
}

