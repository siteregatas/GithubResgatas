"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logout, getUsuarioAtual } from "../../../lib/auth";
import { countNewRequests } from "../../../lib/actions";
import type { User } from "@supabase/supabase-js";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    getUsuarioAtual().then((u) => setUser(u));
  }, []);

  useEffect(() => {
    // Busca contagem de novas solicitações
    countNewRequests().then((c) => setNewCount(c));
  }, [pathname]);

  async function handleLogout() {
    await logout();
    router.replace("/admin/login");
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <h2>ResGatas</h2>
        <span>Painel Admin</span>
      </div>

      <div className="admin-sidebar-user">
        <div className="admin-sidebar-avatar">
          {user?.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} alt="Avatar" />
          ) : (
            "👤"
          )}
        </div>
        <div className="admin-sidebar-user-info">
          <div className="admin-sidebar-user-name">
            {user?.user_metadata?.full_name || "Administrador"}
          </div>
          <div className="admin-sidebar-user-email">
            {user?.email || "Carregando..."}
          </div>
        </div>
      </div>

      <nav className="admin-sidebar-nav">
        <Link
          href="/admin"
          className={`admin-sidebar-link ${pathname === "/admin" ? "active" : ""}`}
        >
          <span className="sidebar-icon">📊</span>
          <span>Dashboard</span>
        </Link>
        <Link
          href="/admin/gatos/novo"
          className={`admin-sidebar-link ${pathname.includes("/admin/gatos") ? "active" : ""}`}
        >
          <span className="sidebar-icon">🐱</span>
          <span>Gatinhos</span>
        </Link>
        <Link
          href="/admin/solicitacoes"
          className={`admin-sidebar-link ${pathname.includes("/admin/solicitacoes") ? "active" : ""}`}
        >
          <span className="sidebar-icon">✉️</span>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <span>Solicitações</span>
            {newCount > 0 && (
              <span
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  borderRadius: "999px",
                  padding: "2px 8px",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  marginLeft: "8px",
                  minWidth: "20px",
                  textAlign: "center"
                }}
              >
                {newCount}
              </span>
            )}
          </span>
        </Link>
      </nav>

      <div className="admin-sidebar-footer">
        <button onClick={handleLogout} className="admin-sidebar-link" style={{ color: "#ef4444" }}>
          <span className="sidebar-icon">🚪</span>
          <span>Sair do sistema</span>
        </button>
      </div>
    </aside>
  );
}
