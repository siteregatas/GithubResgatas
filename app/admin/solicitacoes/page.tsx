"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import {
  getContactRequests,
  updateContactStatus,
  deleteContactRequest
} from "../../../lib/actions";
import { CONTACT_TEMPLATES } from "../../../types/gato";
import type { ContactRequest, ContactSubject } from "../../../types/gato";

const subjectMeta: Record<ContactSubject, { label: string; class: string; icon: string }> = {
  "doação": { label: "Doação", class: "admin-badge-doacao", icon: "🎁" },
  "adoção": { label: "Adoção", class: "admin-badge-adocao", icon: "💕" },
  "ser voluntário": { label: "Voluntário", class: "admin-badge-voluntario", icon: "🤝" },
  "parceria": { label: "Parceria", class: "admin-badge-parceria", icon: "🤖" },
  "outro": { label: "Outro", class: "admin-badge-outro", icon: "❓" }
};

export default function AdminSolicitacoes() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filtros
  const [filterSubject, setFilterSubject] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  // Modais e Estados Auxiliares
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  async function loadRequests() {
    setLoading(true);
    try {
      // Faz o fetch das solicitações com base nos filtros
      const data = await getContactRequests({
        assunto: filterSubject || undefined,
        status: filterStatus || undefined
      });
      setRequests(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao carregar solicitações.");
    } finally {
      setLoading(false);
    }
  }

  // Recarrega sempre que os filtros mudam
  useEffect(() => {
    loadRequests();
  }, [filterSubject, filterStatus]);

  async function handleMarkAsRead(id: string) {
    setActionLoadingId(id);
    const res = await updateContactStatus(id, "respondido");
    if (res.success) {
      // Atualiza localmente
      setRequests(prev =>
        prev.map(r => (r.id === id ? { ...r, status: "respondido" as const } : r))
      );
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest(prev => prev ? { ...prev, status: "respondido" as const } : null);
      }
    } else {
      alert(res.error || "Erro ao atualizar status.");
    }
    setActionLoadingId(null);
  }

  async function handleDelete(id: string) {
    setActionLoadingId(id);
    const res = await deleteContactRequest(id);
    if (res.success) {
      setRequests(prev => prev.filter(r => r.id !== id));
      setDeleteTargetId(null);
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest(null);
      }
    } else {
      alert(res.error || "Erro ao excluir solicitação.");
    }
    setActionLoadingId(null);
  }

  function handleCopy(request: ContactRequest) {
    const text = CONTACT_TEMPLATES[request.assunto]({
      nome: request.nome,
      email: request.email,
      telefone: request.telefone,
      mensagem: request.mensagem
    });

    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(request.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  function formatDate(dateString: string) {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateString;
    }
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1>Solicitações de Contato</h1>
            <p style={{ color: "var(--text-muted)", marginTop: 4 }}>
              Gerencie as mensagens e contatos dos visitantes da ONG
            </p>
          </div>

          <div className="admin-filters">
            <select
              className="admin-filter-select"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="">Todos os Assuntos</option>
              <option value="doação">🎁 Doação</option>
              <option value="adoção">💕 Adoção</option>
              <option value="ser voluntário">🤝 Voluntário</option>
              <option value="parceria">🤖 Parceria</option>
              <option value="outro">❓ Outro</option>
            </select>

            <select
              className="admin-filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Todos os Status</option>
              <option value="novo">Novo</option>
              <option value="respondido">Respondido</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="admin-login-error" style={{ marginBottom: 24 }}>
            {error}
          </div>
        )}

        <div className="admin-table-card">
          <div className="admin-table-header">
            <h2>Mensagens Recebidas</h2>
          </div>

          {loading ? (
            <div className="admin-loading">
              <div className="admin-spinner" />
              <span>Carregando solicitações...</span>
            </div>
          ) : requests.length === 0 ? (
            <div className="admin-empty">
              <span>✉️</span>
              <p>Nenhuma solicitação de contato encontrada.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Assunto</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => {
                    const subject = subjectMeta[req.assunto] || subjectMeta["outro"];
                    const isNew = req.status === "novo";

                    return (
                      <tr key={req.id} style={{ cursor: "pointer" }} onClick={() => setSelectedRequest(req)}>
                        <td>
                          <div style={{ fontWeight: 700, color: "var(--text)" }}>{req.nome}</div>
                          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                            {req.email} • {req.telefone}
                          </div>
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <span className={`admin-badge ${subject.class}`}>
                            {subject.icon} {subject.label}
                          </span>
                        </td>
                        <td>{formatDate(req.created_at)}</td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <span className={`admin-badge ${isNew ? "admin-badge-novo" : "admin-badge-respondido"}`}>
                            {isNew ? "Novo" : "Respondido"}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                          <div className="admin-actions" style={{ justifyContent: "flex-end" }}>
                            <button
                              className="admin-btn-edit"
                              onClick={() => setSelectedRequest(req)}
                              title="Visualizar detalhes da mensagem"
                            >
                              👁️ Ver
                            </button>

                            <button
                              className="admin-btn-edit"
                              onClick={() => handleCopy(req)}
                              style={{ background: copiedId === req.id ? "#dcfce7" : undefined, color: copiedId === req.id ? "#166534" : undefined }}
                              title="Copiar mensagem formatada para WhatsApp"
                            >
                              {copiedId === req.id ? "✓ Copiado" : "📋 Copiar"}
                            </button>

                            {isNew && (
                              <button
                                className="admin-btn-action admin-btn-action-primary"
                                onClick={() => handleMarkAsRead(req.id)}
                                disabled={actionLoadingId === req.id}
                              >
                                {actionLoadingId === req.id ? "..." : "✓ Respondido"}
                              </button>
                            )}

                            <button
                              className="admin-btn-delete"
                              onClick={() => setDeleteTargetId(req.id)}
                              title="Excluir mensagem"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MODAL: Confirmação de Exclusão */}
        {deleteTargetId && (
          <div className="admin-modal-overlay">
            <div className="admin-modal">
              <div style={{ fontSize: "3rem", marginBottom: 12 }}>⚠️</div>
              <h3>Excluir Solicitação</h3>
              <p>Tem certeza de que deseja excluir esta solicitação? Esta ação é irreversível.</p>
              <div className="admin-modal-actions">
                <button
                  className="admin-btn-cancel"
                  onClick={() => setDeleteTargetId(null)}
                  disabled={actionLoadingId === deleteTargetId}
                >
                  Cancelar
                </button>
                <button
                  className="admin-btn-danger"
                  onClick={() => handleDelete(deleteTargetId)}
                  disabled={actionLoadingId === deleteTargetId}
                >
                  {actionLoadingId === deleteTargetId ? "Excluindo..." : "Confirmar Exclusão"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Detalhes Completos */}
        {selectedRequest && (
          <div className="admin-modal-overlay" onClick={() => setSelectedRequest(null)}>
            <div
              className="admin-modal"
              style={{ maxWidth: 600, textAlign: "left", padding: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: "1.3rem" }}>Ficha da Solicitação</h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "var(--text-muted)" }}
                >
                  ×
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>Nome</label>
                  <div style={{ fontWeight: 700, color: "var(--text)" }}>{selectedRequest.nome}</div>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>Data</label>
                  <div>{formatDate(selectedRequest.created_at)}</div>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>Email</label>
                  <div>
                    <a href={`mailto:${selectedRequest.email}`} style={{ color: "var(--primary)", textDecoration: "underline" }}>
                      {selectedRequest.email}
                    </a>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>Telefone</label>
                  <div>
                    <a
                      href={`https://wa.me/55${selectedRequest.telefone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "var(--primary)", textDecoration: "underline", fontWeight: 700 }}
                    >
                      {selectedRequest.telefone} 💬
                    </a>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>Assunto</label>
                  <div>
                    <span className={`admin-badge ${subjectMeta[selectedRequest.assunto]?.class || "admin-badge-outro"}`}>
                      {subjectMeta[selectedRequest.assunto]?.icon} {subjectMeta[selectedRequest.assunto]?.label}
                    </span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>Status</label>
                  <div>
                    <span className={`admin-badge ${selectedRequest.status === "novo" ? "admin-badge-novo" : "admin-badge-respondido"}`}>
                      {selectedRequest.status === "novo" ? "Novo" : "Respondido"}
                    </span>
                  </div>
                </div>
              </div>

              {selectedRequest.mensagem && (
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, display: "block", marginBottom: 6 }}>Mensagem extra da Solicitação</label>
                  <div style={{ background: "var(--bg)", padding: 14, borderRadius: 8, fontSize: "0.9rem", color: "var(--text)", border: "1px solid var(--bg-alt)", whiteSpace: "pre-wrap" }}>
                    {selectedRequest.mensagem}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, display: "block", marginBottom: 6 }}>Mensagem</label>
                <pre style={{ background: "var(--bg-alt)", padding: 14, borderRadius: 8, fontSize: "0.82rem", color: "var(--text)", maxHeight: 180, overflowY: "auto", whiteSpace: "pre-wrap", fontFamily: "var(--font-mono, monospace)", border: "1px dashed rgba(123,75,227,0.3)" }}>
                  {CONTACT_TEMPLATES[selectedRequest.assunto]({
                    nome: selectedRequest.nome,
                    email: selectedRequest.email,
                    telefone: selectedRequest.telefone,
                    mensagem: selectedRequest.mensagem
                  })}
                </pre>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", borderTop: "1px solid var(--bg-alt)", paddingTop: 18 }}>
                {selectedRequest.status === "novo" && (
                  <button
                    className="admin-btn-action admin-btn-action-primary"
                    style={{ padding: "10px 18px", fontSize: "0.85rem" }}
                    onClick={() => handleMarkAsRead(selectedRequest.id)}
                  >
                    Marcar como Respondido
                  </button>
                )}

                <button
                  className="btn btn-outline"
                  style={{ padding: "10px 18px", fontSize: "0.85rem" }}
                  onClick={() => handleCopy(selectedRequest)}
                >
                  {copiedId === selectedRequest.id ? "Copiado!" : "📋 Copiar Texto"}
                </button>

                <button
                  className="admin-btn-cancel"
                  style={{ padding: "10px 18px", fontSize: "0.85rem", border: "2px solid var(--bg-alt)" }}
                  onClick={() => setSelectedRequest(null)}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
