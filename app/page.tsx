'use client'
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen h-lvh flex flex-col items-center justify-center bg-gradient-to-br from-[#1A2A44] via-[#3C3F41] to-[#2D6A4F] text-center text-white relative overflow-hidden px-4">
      <div className="absolute inset-0 -z-10">
        <div className="bg-gradient-radial from-[#ffffff0f] to-transparent absolute w-96 h-96 top-10 left-10 rounded-full blur-3xl opacity-70"></div>
        <div className="bg-gradient-radial from-[#ffffff0f] to-transparent absolute w-96 h-96 bottom-10 right-10 rounded-full blur-3xl opacity-70"></div>
      </div>

      <h1 className="text-5xl font-extrabold mb-6 animate-fade-in-down">
        Bienvenue sur <span className="text-[#27AE60]">ROBERT</span>
      </h1>
      
      <p className="mb-8 text-xl max-w-lg animate-fade-in-up">
        Une application intuitive pour aider les dirigeants d&apos;associations sportives à gérer leurs documents et poser des questions facilement.
      </p>
      
      <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 mt-6">
        {/* <Link
          href="/upload"
          className="px-8 py-3 bg-[#27AE60] text-white font-semibold rounded-lg shadow-lg hover:shadow-2xl hover:bg-[#1B4332] transition-all duration-300 transform hover:scale-105 animate-slide-up"
        >
          Uploader un Document
        </Link> */}
        <Link
          href="/chat"
          className="px-8 py-3 bg-[#27AE60] text-white font-semibold rounded-lg shadow-lg hover:shadow-2xl hover:bg-[#1B4332] transition-all duration-300 transform hover:scale-105 animate-slide-up"
        >
          Poser une Question
        </Link>
        {/* <Link
          href="/files"
          className="px-8 py-3 bg-[#27AE60] text-white font-semibold rounded-lg shadow-lg hover:shadow-2xl hover:bg-[#1B4332] transition-all duration-300 transform hover:scale-105 animate-slide-up"
        >
          Voir les Documents
        </Link> */}
      </div>
      
      <section className="mt-12 text-white">
        <h2 className="text-3xl font-bold mb-4">Pourquoi nous choisir ?</h2>
        <ul className="text-lg space-y-2">
          <li>✅ Simplifiez la gestion des documents</li>
          <li>✅ Obtenez des réponses précises</li>
          <li>✅ Rejoignez une communauté engagée</li>
        </ul>
      </section>
    </div>
  );
}
