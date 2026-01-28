import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';

export async function POST(request) {
  try {
    const { prompt, niveau } = await request.json();

    const niveauMap = {
      beginner: 'Débutant',
      intermediate: 'Intermédiaire',
      advanced: 'Avancé',
      expert: 'Expert'
    };

    const userPrompt = `Génère un quiz sur ${prompt} pour niveau ${niveauMap[niveau] || niveau}`;

    const httpsAgent = new https.Agent({
      rejectUnauthorized: false
    });

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Tu es un agent pédagogique intelligent spécialisé dans la génération de quiz structurés.

Objectif :
Générer un quiz pédagogique au format SurveyJS sur le sujet donné

Contraintes :
- Choisis librement le nombre et les types de questions adaptés au sujet et au niveau
- Utilise uniquement des types de questions supportés par SurveyJS (radiogroup, checkbox, text, rating, dropdown, boolean, comment)
- Les questions doivent être pédagogiques, claires et non ambiguës
- Structure les questions en pages logiques
- Ajoute des choix pertinents pour les questions à choix multiples

Sortie :
- Retourne UNIQUEMENT un JSON SurveyJS valide
- JSON minifié (une seule ligne)
- Sans texte explicatif
- Sans markdown
- Sans commentaires
- Sans caractères hors JSON
`
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        httpsAgent,
      }
    );

    const content = response.data.choices[0].message.content.trim();
    
    // Nettoyer le contenu pour s'assurer qu'on a uniquement du JSON
    let jsonContent = content;
    if (content.startsWith('```json')) {
      jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (content.startsWith('```')) {
      jsonContent = content.replace(/```\n?/g, '');
    }

    // Parser le JSON pour valider
    const surveyData = JSON.parse(jsonContent);

    return NextResponse.json({
      success: true,
      surveyData
    });

  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to generate quiz' 
      },
      { status: 500 }
    );
  }
}
