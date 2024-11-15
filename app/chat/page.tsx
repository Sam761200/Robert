// src/app/chat/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Chat() {
  // const { data: session, status } = useSession();
  const { status } = useSession();
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirige vers la page de connexion si non authentifié
    }
  }, [status, router]);

  const handleAsk = async () => {
    if (!question.trim()) return alert("Veuillez entrer une question.");

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (res.ok) {
        const data = await res.json();
        setResponse(data.answer);
        setQuestion("");
      } else {
        alert("Erreur lors de la récupération de la réponse.");
      }
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-[#1A2A44] to-[#2D6A4F] text-white">
      <h1 className="text-4xl font-bold mb-6 animate-fade-in-down">Posez une Question</h1>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-3/4 h-32 mb-4 p-4 border-2 border-[#3C3F41] rounded-lg focus:outline-none focus:ring-4 focus:ring-[#2D6A4F] bg-white text-[#1A2A44] shadow-lg transition duration-300 animate-fade-in-up"
        placeholder="Votre question..."
      />
      <button
        onClick={handleAsk}
        className="px-8 py-3 bg-[#2D6A4F] text-white font-semibold rounded-lg shadow-lg hover:shadow-2xl hover:bg-[#1B4332] transition-all duration-300 transform hover:scale-105 animate-slide-up"
      >
        Envoyer
      </button>
      {response && (
        <div className="mt-6 w-3/4 bg-white p-6 border-2 border-[#1A2A44] rounded-lg shadow-xl text-left text-[#1A2A44] animate-fade-in-up">
          <h2 className="text-2xl font-bold mb-4">Réponse :</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
