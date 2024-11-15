import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import openai from '../../lib/openai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    const filePath = path.join(uploadDir, file.name);

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    await writeFile(filePath, buffer);

    // Extraction de contenu du fichier (fichier texte uniquement)
    const content = buffer.toString('utf-8');

    // Génération de l'embedding du contenu
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: content,
    });
    
    const embedding = embeddingResponse.data[0].embedding;

    // Stockage dans la base de données
    await prisma.document.create({
      data: {
        name: file.name,
        content,
        embedding: JSON.stringify(embedding), // Stocke l'embedding comme une chaîne JSON
      },
    });

    return NextResponse.json({ success: true, filePath: `/uploads/${file.name}` });
  } catch (error) {
    console.error('Erreur lors de l\'upload du fichier:', error);
    return NextResponse.json({ success: false, message: 'Error uploading file' });
  }
}
