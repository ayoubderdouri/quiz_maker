import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * GET /api/share/:token
 * Get a quiz by share token
 */
export async function GET(request, { params }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const token = resolvedParams?.token;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token requis' },
        { status: 400 }
      );
    }

    const quiz = await prisma.quiz.findUnique({
      where: { shareToken: token },
    });

    if (!quiz) {
      return NextResponse.json(
        { success: false, error: 'Quiz non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: {
          id: quiz.id,
          ...quiz.data,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting quiz by share token:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
