// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Identifiants incorrects ou utilisateur non trouvé.");
    } else {
      router.push("/chat"); // Redirige vers le chat
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-[#27AE60]">Connexion</h1>
      <form onSubmit={handleLogin} className="w-1/3 bg-white p-6 rounded-lg shadow-lg">
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
          Se connecter
        </button>
      </form>
      <p className="mt-4">
        Pas encore inscrit ? <a href="/register" className="text-[#27AE60] underline">Créez un compte</a>
      </p>
    </div>
  );
}
