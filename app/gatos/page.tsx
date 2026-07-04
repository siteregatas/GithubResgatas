import Link from "next/link";
import { getGatosDisponiveis } from "../../lib/supabase";
import type { Gato } from "../../types/gato";

export const revalidate = 60; // revalida a cada 60 segundos

export default async function Gatos() {
  const gatos: Gato[] = await getGatosDisponiveis();

  return (
    <main>
      {/* Hero */}
      <section className="gatos-hero">
        <div className="container">
          <p className="eyebrow">Gatinhos para adoção</p>
          <h1 style={{ fontSize: "2.8rem", marginBottom: 16 }}>
            Conheça nossas gatinhas
          </h1>
          <p className="about-subtitle">
            Todas as nossas gatas são adultas resgatadas, castradas e vacinadas.
            Elas só precisam de um lar com amor!
          </p>
        </div>
      </section>

      {/* Como adotar */}
      <section className="section adocao-form-section">
        <div className="container split">
          <div className="split-text">
            <p className="eyebrow">Adoção</p>
            <h2>Quer adotar uma gatinha?</h2>
            <p>
              Nosso processo é simples e responsável. Queremos garantir que
              cada gatinha vá para um lar onde será amada e bem cuidada.
            </p>
          </div>
          <div className="form-card">
            <h3>Como funciona</h3>
            <ol>
              <li>Entre em contato pelo formulário ou Instagram</li>
              <li>Passe por uma entrevista e agende sua visita</li>
              <li>Conheça as gatinhas disponíveis para adoção</li>
              <li>Receba orientações e finalize a adoção</li>
            </ol>
            <div style={{ marginTop: 20 }}>
              <Link href="/contato" className="btn btn-primary">
                Quero adotar →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria de gatos */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Galeria</p>
            <h2>Nossos gatinhos disponíveis</h2>
            <p>
              Cada uma tem sua personalidade única. Venha conhecer e se
              apaixonar!
            </p>
          </div>

          {gatos.length > 0 ? (
            <div className="cats-grid">
              {gatos.map((gato) => (
                <article key={gato.id} className="cat-card">
                  <div className="cat-card-overflow">
                    <img
                      src={gato.foto_url || "/fotos/1.png"}
                      alt={`Gata ${gato.nome}`}
                    />
                  </div>
                  <div className="cat-card-body">
                    <h3>{gato.nome}</h3>
                    <span>
                      {gato.idade} {gato.idade === 1 ? "ano" : "anos"}
                      {gato.descricao ? ` · ${gato.descricao}` : ""}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: 48,
                background: "var(--card)",
                borderRadius: "var(--radius)",
                boxShadow: "var(--shadow)",
              }}
            >
              <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
                🐱 Nenhum gatinho disponível no momento. Volte em breve!
              </p>
            </div>
          )}

          <div
            style={{
              textAlign: "center",
              marginTop: 48,
              padding: 32,
              background: "var(--card)",
              borderRadius: "var(--radius)",
              boxShadow: "var(--shadow)",
            }}
          >
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "1.05rem",
                marginBottom: 16,
              }}
            >
              Interessou por alguma gatinha? Entre em contato!
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/contato" className="btn btn-primary">
                📩 Falar sobre adoção
              </Link>
              <a
                href="https://instagram.com/ResGatas"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
              >
                📷 Ver no Instagram
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
