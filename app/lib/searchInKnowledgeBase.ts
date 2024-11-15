// lib/searchInKnowledgeBase.ts
import openai from './openai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function searchInKnowledgeBase(question: string): Promise<string | null> {
  // Génère l'embedding pour la question
  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: question,
  });
  const questionEmbedding = embeddingResponse.data[0].embedding;

  // Recherche dans la base de données pour trouver la meilleure correspondance
  const documents = await prisma.document.findMany();
  let bestMatch = null;
  let highestScore = -Infinity;

  for (const document of documents) {
    // Diviser le contenu en phrases ou paragraphes
    const sections = document.content.split('\n').map(section => section.trim()).filter(Boolean);

    for (const section of sections) {
      const sectionEmbeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: section,
      });
      const sectionEmbedding = sectionEmbeddingResponse.data[0].embedding;
      const score = cosineSimilarity(questionEmbedding, sectionEmbedding);

      if (score > highestScore) {
        highestScore = score;
        bestMatch = section;
      }
    }
  }

  // Retourne la meilleure section si le score de similarité est suffisant
  if (highestScore > 0.8 && bestMatch) {
    return bestMatch;
  } else {
    return null;
  }
}

// Fonction pour calculer la similarité cosinus entre deux vecteurs
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}
