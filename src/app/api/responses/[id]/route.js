import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * GET /api/responses/:id
 * Get a single response with its quiz data
 */
export async function GET(request, context) {
  try {
    const { params } = context || {};
    const resolvedParams = params ? await params : {};
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'id est requis' },
        { status: 400 }
      );
    }

    const response = await prisma.response.findUnique({
      where: { id },
      include: { quiz: true },
    });

    if (!response) {
      return NextResponse.json(
        { success: false, error: 'Résultat introuvable' },
        { status: 404 }
      );
    }

    const payload = {
      id: response.id,
      quizId: response.quizId,
      data: response.data,
      createdAt: response.createdAt,
      quiz: response.quiz
        ? {
            id: response.quiz.id,
            ...(response.quiz.data || {}),
          }
        : null,
    };

    return NextResponse.json({ success: true, data: payload }, { status: 200 });
  } catch (error) {
    console.error('Error getting response:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
