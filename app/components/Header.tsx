"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Quem Somos" },
  { href: "/gatos", label: "Gatinhos" },
  { href: "/ajudar", label: "Ajude / Transparência" },
  { href: "/contato", label: "Contato" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Esconde o header público no painel admin
  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="header-logo">
          <img src="/assets/imgs/logo.png" alt="ResGatas - Logo" />
          <span className="logo-text">ResGatas</span>
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`header-nav${open ? " open" : ""}`}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={pathname === l.href ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/ajudar" className="header-donate" onClick={() => setOpen(false)}>
            ❤ Doar agora
          </Link>
        </nav>
      </div>
    </header>
  );
}
