"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "../../../lib/supabase";
import type { Gato } from "../../../types/gato";

type CatTableProps = {
  gatos: Gato[];
};

export default function CatTable({ gatos }: CatTableProps) {
  const router = useRouter();
  const [catToDelete, setCatToDelete] = useState<Gato | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!catToDelete) return;
    
    setIsDeleting(true);
    try {
      const supabase = createBrowserSupabaseClient();
      
      // Se tiver foto, podemos tentar excluir do storage também,
      // mas vamos focar em remover do banco primeiro.
      const { error } = await supabase
        .from("cats")
        .delete()
        .eq("id", catToDelete.id);

      if (error) {
        throw new Error("Erro ao excluir: " + error.message);
      }

      setCatToDelete(null);
      router.refresh(); // Recarrega os dados da página
    } catch (err: any) {
      alert(err.message || "Ocorreu um erro ao excluir o gato.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (gatos.length === 0) {
    return (
      <div className="admin-table-card">
        <div className="admin-empty">
          <span>🐱</span>
          <p>Nenhum gatinho cadastrado ainda.</p>
          <Link href="/admin/gatos/novo" className="btn btn-primary">
            + Adicionar o primeiro
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="admin-table-card">
        <div className="admin-table-header">
          <h2>Todos os Gatinhos</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Gato</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {gatos.map((gato) => (
                <tr key={gato.id}>
                  <td>
                    <div className="admin-cat-info">
                      <img
                        src={gato.foto_url || "/fotos/1.png"}
                        alt={gato.nome}
                        className="admin-cat-thumb"
                      />
                      <div>
                        <div className="admin-cat-name">{gato.nome}</div>
                        <div className="admin-cat-desc">
                          {gato.idade} {gato.idade === 1 ? "ano" : "anos"}{" "}
                          {gato.descricao ? `· ${gato.descricao}` : ""}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {gato.status === "disponivel" ? (
                      <span className="admin-badge admin-badge-disponivel">
                        💚 Disponível
                      </span>
                    ) : (
                      <span className="admin-badge admin-badge-adotado">
                        🏡 Adotado
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="admin-actions">
                      <Link
                        href={`/admin/gatos/${gato.id}/editar`}
                        className="admin-btn-edit"
                      >
                        ✏️ Editar
                      </Link>
                      <button 
                        onClick={() => setCatToDelete(gato)}
                        className="admin-btn-delete"
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Confirmação */}
      {catToDelete && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3>Excluir Gatinho</h3>
            <p>
              Tem certeza que deseja excluir <strong>{catToDelete.nome}</strong>? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="admin-modal-actions">
              <button 
                className="admin-btn-cancel"
                onClick={() => setCatToDelete(null)}
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button 
                className="admin-btn-danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Excluindo..." : "Sim, excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
