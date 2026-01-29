import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * POST /api/responses
 * Save a guest response to a quiz
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { quizId, responseData } = body;

    if (!quizId || !responseData) {
      return NextResponse.json(
        { success: false, error: 'quizId et responseData sont requis' },
        { status: 400 }
      );
    }

    // Check if quiz exists
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz) {
      return NextResponse.json(
        { success: false, error: 'Quiz non trouvé' },
        { status: 404 }
      );
    }

    // Save response
    const response = await prisma.response.create({
      data: {
        quizId,
        data: responseData,
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        data: response
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving response:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/responses?quizId=xxx
 * Get all responses for a quiz
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId');

    if (!quizId) {
      return NextResponse.json(
        { success: false, error: 'quizId est requis' },
        { status: 400 }
      );
    }

    const responses = await prisma.response.findMany({
      where: { quizId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      { 
        success: true, 
        data: responses,
        count: responses.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting responses:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
