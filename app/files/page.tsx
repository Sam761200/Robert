'use client'
import { useEffect, useState } from "react";

export default function Files() {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch("/api/list-uploads");
        if (res.ok) {
          const data = await res.json();
          setFiles(data.files);
        } else {
          alert("Erreur lors de la récupération des fichiers.");
        }
      } catch (error) {
        console.error("Erreur:", error);
        alert("Une erreur est survenue lors de la récupération des fichiers.");
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-[#27AE60]">Documents Uploadés</h1>
      {files.length > 0 ? (
        <ul className="w-3/4">
          {files.map((file, index) => (
            <li key={index} className="mb-2">
              <a
                href={file}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#27AE60] underline hover:text-[#1B4332]"
              >
                {file.split('/').pop()}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">Aucun document uploadé pour le moment.</p>
      )}
    </div>
  );
}
