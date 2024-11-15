import { NextRequest, NextResponse } from 'next/server';
import openai from '../../lib/openai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    // Générer l'embedding de la question
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: question,
    });
    const questionEmbedding = embeddingResponse.data[0].embedding;

    // Recherche dans la base de connaissances (similarité)
    const documents = await prisma.document.findMany();
    let bestMatch = null;
    let highestScore = -Infinity;

    for (const document of documents) {
      const documentEmbedding = JSON.parse(document.embedding) as number[];
      const score = cosineSimilarity(questionEmbedding, documentEmbedding);
      if (score > highestScore) {
        highestScore = score;
        bestMatch = document;
      }
    }

    if (highestScore > 0.8 && bestMatch) {
      return NextResponse.json({ success: true, answer: bestMatch.content });
    } else {
      // Interroger GPT si aucune correspondance n'est trouvée
      const gptResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: question }],
        max_tokens: 150,
      });
    
      const gptAnswer = gptResponse.choices[0].message?.content;
      return NextResponse.json({ success: true, answer: gptAnswer || 'Aucune réponse trouvée.' });
    }
    
  } catch (error) {
    console.error('Erreur lors de la recherche de réponse:', error);
    return NextResponse.json({ success: false, message: 'Erreur lors de la recherche de réponse' });
  }
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}
