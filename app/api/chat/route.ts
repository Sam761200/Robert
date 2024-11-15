import { NextRequest, NextResponse } from 'next/server';
import { searchInKnowledgeBase } from '../../lib/searchInKnowledgeBase';
import openai from '../../lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();
    if (!question || question.trim() === '') {
      return NextResponse.json({ success: false, message: 'Question manquante ou vide' });
    }

    // Recherche dans la base de connaissances
    const localAnswer = await searchInKnowledgeBase(question);
    if (localAnswer) {
      return NextResponse.json({ success: true, answer: localAnswer });
    }

    // Si pas de réponse dans la base, interroger GPT
    const gptResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: question }],
      max_tokens: 150,
      temperature: 0.7,
    });

    const gptAnswer = gptResponse.choices[0]?.message?.content?.trim() ?? 'Aucune réponse trouvée.';
    return NextResponse.json({ success: true, answer: gptAnswer });
  } catch (error) {
    console.error('Erreur lors du traitement de la question:', error);
    return NextResponse.json({ success: false, message: 'Erreur lors du traitement de la question' });
  }
}