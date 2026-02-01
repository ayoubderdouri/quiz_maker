import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth, createUnauthorizedResponse } from '@/lib/apiAuth';

/**
 * GET /api/quizzes/:id
 * Récupère un quiz spécifique
 */
export async function GET(request, { params }) {
  try {
    // Vérifier l'authentification
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return createUnauthorizedResponse(auth.error);
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Quiz id is required' },
        { status: 400 }
      );
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id }
    });

    if (!quiz) {
      return NextResponse.json(
        { success: false, error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est propriétaire du quiz
    if (quiz.userId !== auth.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: quiz.id, ...(quiz.data || {}) }
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/quizzes/:id
 * Met à jour un quiz
 * Body: { title?, description?, surveyData?, status? }
 */
export async function PUT(request, { params }) {
  try {
    // Vérifier l'authentification
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return createUnauthorizedResponse(auth.error);
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Quiz id is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, surveyData, status } = body;

    const existingQuiz = await prisma.quiz.findUnique({
      where: { id }
    });

    if (!existingQuiz) {
      return NextResponse.json(
        { success: false, error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est propriétaire du quiz
    if (existingQuiz.userId !== auth.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const currentData = existingQuiz.data || {};
    const updatedData = {
      ...currentData,
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(surveyData !== undefined && { surveyData }),
      ...(status !== undefined && { status }),
      updatedAt: new Date().toISOString()
    };

    const quiz = await prisma.quiz.update({
      where: { id },
      data: { data: updatedData }
    });

    return NextResponse.json({
      success: true,
      data: { id: quiz.id, ...(quiz.data || {}) }
    });
  } catch (error) {
    console.error('Error updating quiz:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update quiz' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/quizzes/:id
 * Supprime un quiz
 */
export async function DELETE(request, { params }) {
  try {
    // Vérifier l'authentification
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return createUnauthorizedResponse(auth.error);
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Quiz id is required' },
        { status: 400 }
      );
    }

    const existingQuiz = await prisma.quiz.findUnique({
      where: { id }
    });

    if (!existingQuiz) {
      return NextResponse.json(
        { success: false, error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est propriétaire du quiz
    if (existingQuiz.userId !== auth.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await prisma.quiz.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete quiz' },
      { status: 500 }
    );
  }
}
