"use client";

import { useState, useEffect } from "react";
import { saveContactRequest } from "../../lib/actions";
import { CONTACT_TEMPLATES, getWhatsAppLink } from "../../types/gato";
import type { ContactSubject } from "../../types/gato";

export default function Contato() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [assunto, setAssunto] = useState<ContactSubject | "">("");
  const [mensagem, setMensagem] = useState("");
  
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Aplica máscara de telefone (47) 99999-9999
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const clean = value.replace(/\D/g, "");
    
    if (clean.length === 0) {
      setTelefone("");
      return;
    }
    
    let formatted = "";
    if (clean.length <= 2) {
      formatted = `(${clean}`;
    } else if (clean.length <= 6) {
      formatted = `(${clean.slice(0, 2)}) ${clean.slice(2)}`;
    } else if (clean.length <= 10) {
      formatted = `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
    } else {
      formatted = `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7, 11)}`;
    }
    setTelefone(formatted);
  };



  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (!nome || !email || !telefone || !assunto) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    setError("");

    // 1. Salvar solicitação no Supabase via Server Action
    const result = await saveContactRequest({
      nome,
      email,
      telefone,
      assunto,
      mensagem: mensagem || null
    });

    if (!result.success) {
      setError(result.error || "Ocorreu um erro ao salvar sua solicitação.");
      setLoading(false);
      return;
    }

    // 2. Gerar o link do WhatsApp com a mensagem formatada final
    const finalMsg = CONTACT_TEMPLATES[assunto]({
      nome,
      email,
      telefone,
      mensagem: mensagem || null
    });
    
    const whatsappLink = getWhatsAppLink(finalMsg);
    
    // 3. Abrir o WhatsApp Web em uma nova guia
    window.open(whatsappLink, "_blank");

    // 4. Exibir tela de sucesso
    setSent(true);
    setLoading(false);
  }

  function handleReset() {
    setNome("");
    setEmail("");
    setTelefone("");
    setAssunto("");
    setMensagem("");
    setSent(false);
    setError("");
  }

  return (
    <main>
      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <p className="eyebrow">Contato</p>
          <h1 style={{ fontSize: "2.8rem", marginBottom: 16 }}>
            Fale conosco
          </h1>
          <p className="about-subtitle">
            Dúvidas sobre adoção, doações, parcerias ou visitas? Estamos aqui
            para ajudar!
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="section contact-section">
        <div className="container contact-grid">
          {/* Informações de contato */}
          <div>
            <div className="contact-info-card">
              <h3>📍 Informações</h3>

              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <strong>Telefone / WhatsApp</strong>
                  <br />
                  <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "5547991918029"}`} target="_blank" rel="noreferrer">
                    (47) 99191-8029
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📷</div>
                <div>
                  <strong>Instagram</strong>
                  <br />
                  <a
                    href="https://instagram.com/ResGatas"
                    target="_blank"
                    rel="noreferrer"
                  >
                    @ResGatas
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📘</div>
                <div>
                  <strong>Facebook</strong>
                  <br />
                  <a
                    href="https://facebook.com/ResGatas"
                    target="_blank"
                    rel="noreferrer"
                  >
                    ResGatas
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-info-card" style={{ marginTop: 24 }}>
              <h3>🕐 Horário de Funcionamento</h3>
              <div className="contact-item">
                <div className="contact-icon">📅</div>
                <div>
                  <strong>Segunda a Sexta:</strong> 09h às 18h
                  <br />
                  <strong>Sábado:</strong> 09h às 13h
                  <br />
                  <strong>Domingo:</strong> Fechado
                </div>
              </div>
            </div>
          </div>

          {/* Formulário / Sucesso */}
          <div className="contact-form">
            {sent ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                }}
              >
                <div style={{ fontSize: "4rem", marginBottom: 16 }}>🎉</div>
                <h3 style={{ color: "var(--primary)", marginBottom: 12 }}>
                  Solicitação Enviada!
                </h3>
                <p style={{ color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 24 }}>
                  Sua mensagem foi registrada com sucesso e a conversa do WhatsApp foi iniciada. Caso a janela não tenha aberto, você pode clicar no botão abaixo:
                </p>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <a
                    href={getWhatsAppLink(
                      CONTACT_TEMPLATES[assunto || "outro"]({
                        nome,
                        email,
                        telefone,
                        mensagem: mensagem || null
                      })
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                  >
                    <span>💬</span> Reabrir WhatsApp
                  </a>
                  <button
                    className="btn btn-outline"
                    onClick={handleReset}
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3>✉️ Envie uma mensagem</h3>
                
                {error && (
                  <div className="admin-login-error" style={{ marginBottom: 20 }}>
                    ⚠️ {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="nome">Nome completo *</label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      placeholder="Seu nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">E-mail *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="telefone">Telefone / WhatsApp *</label>
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      placeholder="(47) 99999-9999"
                      value={telefone}
                      onChange={handlePhoneChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="assunto">Assunto *</label>
                    <select
                      id="assunto"
                      name="assunto"
                      value={assunto}
                      onChange={(e) => setAssunto(e.target.value as ContactSubject)}
                      required
                    >
                      <option value="">Selecione um assunto...</option>
                      <option value="doação">🎁 Doação</option>
                      <option value="adoção">💕 Adoção</option>
                      <option value="ser voluntário">🤝 Ser voluntário</option>
                      <option value="parceria">🤖 Parceria</option>
                      <option value="outro">❓ Outro</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="mensagem">Mensagem adicional (opcional)</label>
                    <textarea
                      id="mensagem"
                      name="mensagem"
                      placeholder="Escreva detalhes adicionais aqui..."
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                    />
                  </div>



                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: "100%", marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>Enviando...</>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.244 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.27-3.66c1.645.976 3.266 1.488 4.908 1.492 5.568.003 10.101-4.52 10.104-10.091.002-2.7-1.041-5.239-2.936-7.14C16.505 2.69 13.97 1.643 11.272 1.641c-5.57 0-10.103 4.529-10.107 10.103-.001 1.764.482 3.486 1.397 5.006l-.916 3.348 3.411-.898zm11.391-7.042c-.3-.15-1.772-.875-2.046-.975-.273-.1-.472-.15-.672.15-.2.3-.773.975-.947 1.175-.175.2-.35.225-.65.075-1.125-.562-1.924-.975-2.695-2.3-.2-.343.2-.319.572-1.066.075-.15.037-.281-.019-.394-.056-.113-.472-1.137-.647-1.555-.17-.41-.358-.354-.472-.36l-.372-.008c-.127 0-.335.048-.51.24-.175.192-.67.654-.67 1.594s.684 1.848.779 1.977c.095.13 1.35 2.062 3.27 2.894.457.198.814.316 1.092.404.459.146.877.125 1.208.076.368-.055 1.772-.726 2.02-.975.249-.25.249-.475.175-.625-.075-.15-.274-.25-.574-.4z"/>
                        </svg>
                        Enviar via WhatsApp
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
