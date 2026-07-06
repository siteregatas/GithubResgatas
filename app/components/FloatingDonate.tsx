"use client";


import { usePathname } from "next/navigation";

export default function FloatingDonate() {
  const pathname = usePathname();

  // Esconde o botão flutuante no painel admin
  if (pathname.startsWith("/admin")) return null;

  return (
    <a href="https://apoia.se/resgatas" target="_blank" rel="noreferrer" className="floating-donate">
      ❤ Doe via Apoia.se
    </a>
  );
}
