"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingDonate() {
  const pathname = usePathname();

  // Esconde o botão flutuante no painel admin
  if (pathname.startsWith("/admin")) return null;

  return (
    <Link href="/ajudar" className="floating-donate">
      ❤ Doe via PIX
    </Link>
  );
}
