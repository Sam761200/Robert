// src/app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/login"); // Redirige vers la page de connexion
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error(error);
      setError("Une erreur est survenue.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-[#27AE60]">Inscription</h1>
      <form onSubmit={handleRegister} className="w-1/3 bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:border-[#27AE60] focus:outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:border-[#27AE60] focus:outline-none"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button type="submit" className="w-full p-2 bg-[#27AE60] text-white font-semibold rounded-lg shadow-md hover:bg-[#1B4332] transition-all duration-300">
          S&apos;inscrire
        </button>
      </form>
      <p className="mt-4">
        Déjà inscrit ? <a href="/login" className="text-[#27AE60] underline">Connectez-vous</a>
      </p>
    </div>
  );
}
