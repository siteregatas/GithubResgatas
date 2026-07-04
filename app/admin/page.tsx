import Link from "next/link";
import AdminSidebar from "./components/AdminSidebar";
import CatTable from "./components/CatTable";
import { getTodosGatos } from "../../lib/supabase";
import type { Gato } from "../../types/gato";

export const revalidate = 0; // Não fazer cache no admin (sempre dados frescos)

export default async function AdminDashboard() {
  const gatos: Gato[] = await getTodosGatos();

  const total = gatos.length;
  const disponiveis = gatos.filter((g) => g.status === "disponivel").length;
  const adotados = gatos.filter((g) => g.status === "adotado").length;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1>Dashboard</h1>
            <p style={{ color: "var(--text-muted)", marginTop: 4 }}>
              Visão geral dos gatinhos da ONG
            </p>
          </div>
          <Link href="/admin/gatos/novo" className="btn btn-primary">
            + Adicionar Gatinho
          </Link>
        </div>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">🐱</div>
            <div className="admin-stat-value">{total}</div>
            <div className="admin-stat-label">Total de gatos</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">💚</div>
            <div className="admin-stat-value">{disponiveis}</div>
            <div className="admin-stat-label">Disponíveis para adoção</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">🏡</div>
            <div className="admin-stat-value">{adotados}</div>
            <div className="admin-stat-label">Já adotados</div>
          </div>
        </div>

        <CatTable gatos={gatos} />
      </main>
    </div>
  );
}
