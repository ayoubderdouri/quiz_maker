import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth, createUnauthorizedResponse } from '@/lib/apiAuth';

/**
 * GET /api/quizzes
 * Récupère la liste de tous les quiz
 * Query params: skip (default: 0), take (default: 10)
 */
export async function GET(request) {
  try {
    // Vérifier l'authentification
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return createUnauthorizedResponse(auth.error);
    }

    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip') || '0');
    const take = parseInt(searchParams.get('take') || '10');

    const [quizzes, total] = await Promise.all([
      prisma.quiz.findMany({
        orderBy: { id: 'desc' },
        skip,
        take
      }),
      prisma.quiz.count()
    ]);

    const payload = quizzes.map((quiz) => ({
      id: quiz.id,
      ...(quiz.data || {})
    }));

    return NextResponse.json({ 
      success: true, 
      data: payload,
      pagination: {
        total,
        skip,
        take,
        hasMore: skip + take < total
      }
    });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/quizzes
 * Crée un nouveau quiz
 * Body: { title, description, surveyData?, status? }
 */
export async function POST(request) {
  try {
    // Vérifier l'authentification
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return createUnauthorizedResponse(auth.error);
    }

    const body = await request.json();
    const { title, description, surveyData, status = 'draft' } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'title is required' },
        { status: 400 }
      );
    }

    const quiz = await prisma.quiz.create({
      data: {
        data: {
          title,
          description: description || '',
          surveyData: surveyData || null,
          status,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    });

    return NextResponse.json(
      { 
        success: true, 
        data: { id: quiz.id, ...(quiz.data || {}) } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create quiz' },
      { status: 500 }
    );
  }
}
