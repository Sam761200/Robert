import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Récupérer tous les utilisateurs
    const users = await prisma.user.findMany();
    // Récupérer tous les documents
    const documents = await prisma.document.findMany();

    return NextResponse.json({
      success: true,
      message: 'Contenu de la base SQLite',
      data: {
        users,
        documents,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la lecture de la base SQLite:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la lecture de la base SQLite' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
