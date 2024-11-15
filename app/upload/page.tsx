// src/app/admin/upload/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminUpload() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirige vers la page de connexion
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      setMessage("Accès refusé : cette page est réservée aux administrateurs.");
    }
  }, [status, session, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Veuillez sélectionner un fichier.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setMessage("Fichier uploadé avec succès !");
      } else {
        setMessage("Erreur lors de l'upload.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Une erreur est survenue.");
    }
  };

  if (message) return <p>{message}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Uploader un Document pour la Base de Connaissances</h1>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleUpload}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg"
      >
        Upload
      </button>
      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
}
