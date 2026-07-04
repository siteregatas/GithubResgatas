"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Esconde o footer público no painel admin
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <h3>ResGatas</h3>
            <p>
              Resgatamos, castramos e doamos gatas adultas em estado de abandono
              em Itajaí&nbsp;–&nbsp;SC. Toda ajuda faz a diferença.
            </p>
            <div className="social-links">
              <a
                href="https://instagram.com/ResGatas"
                target="_blank"
                rel="noreferrer"
                className="social-link"
                aria-label="Instagram"
              >
                📷
              </a>
              <a
                href="https://facebook.com/ResGatas"
                target="_blank"
                rel="noreferrer"
                className="social-link"
                aria-label="Facebook"
              >
                📘
              </a>
              <a
                href="https://wa.me/5547992129083"
                target="_blank"
                rel="noreferrer"
                className="social-link"
                aria-label="WhatsApp"
              >
                💬
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Navegação</h4>
            <Link href="/">Início</Link>
            <Link href="/sobre">Quem Somos</Link>
            <Link href="/gatos">Gatinhos</Link>
            <Link href="/ajudar">Ajude / Doe</Link>
          </div>

          <div className="footer-col">
            <h4>Contato</h4>
            <a href="tel:+5547992129083">(47) 99212-9083</a>
            <a
              href="https://instagram.com/ResGatas"
              target="_blank"
              rel="noreferrer"
            >
              @ResGatas
            </a>
            <Link href="/contato">Fale conosco</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} ResGatas — Todos os direitos
            reservados. Feito com ❤ para os gatinhos.
          </p>
        </div>
      </div>
    </footer>
  );
}
