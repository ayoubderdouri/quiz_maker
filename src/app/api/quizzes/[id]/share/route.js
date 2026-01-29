import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * POST /api/quizzes/:id/share
 * Generate a share token for a quiz
 */
export async function POST(request, { params }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID du quiz requis' },
        { status: 400 }
      );
    }

    // Check if quiz exists
    const quiz = await prisma.quiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      return NextResponse.json(
        { success: false, error: 'Quiz non trouvé' },
        { status: 404 }
      );
    }

    // Generate a unique share token
    const shareToken = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);

    // Update quiz with share token
    const updatedQuiz = await prisma.quiz.update({
      where: { id },
      data: { shareToken },
    });

    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/share/${shareToken}`;

    return NextResponse.json(
      { 
        success: true, 
        shareToken,
        shareUrl,
        data: updatedQuiz
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating share token:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/quizzes/:id/share
 * Get the share token for a quiz
 */
export async function GET(request, { params }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID du quiz requis' },
        { status: 400 }
      );
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      select: { shareToken: true },
    });

    if (!quiz) {
      return NextResponse.json(
        { success: false, error: 'Quiz non trouvé' },
        { status: 404 }
      );
    }

    const shareUrl = quiz.shareToken 
      ? `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/share/${quiz.shareToken}`
      : null;

    return NextResponse.json(
      { 
        success: true, 
        shareToken: quiz.shareToken,
        shareUrl
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting share token:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
