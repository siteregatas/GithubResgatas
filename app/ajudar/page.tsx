import Link from "next/link";
import { getApoiaSeData } from "../../lib/apoiaSe";

export default async function Ajudar() {
  const { arrecadado, apoiadores, meta } = await getApoiaSeData();
  const faltam = meta > arrecadado ? meta - arrecadado : 0;
  const porcentagem = Math.min((arrecadado / meta) * 100, 100);

  return (
    <main>
      {/* Hero */}
      <section className="donation-hero">
        <div className="container">
          <p className="eyebrow">Ajude e Transparência</p>
          <h1 style={{ fontSize: "2.8rem", marginBottom: 16 }}>
            Sua doação faz a diferença
          </h1>
          <p className="donation-subtitle">
            A ResGatas acredita na transparência total. Cada contribuição ajuda a manter o santuário, comprar ração, remédios e garantir novos resgates. Vivemos 100% de doações.
          </p>
        </div>
      </section>

      {/* Números atuais */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Números atuais</p>
            <h2>Como estamos hoje</h2>
          </div>
          <div className="about-highlight" style={{ maxWidth: 800, marginBottom: 48 }}>
            <div>
              <p className="about-label">Meta mensal</p>
              <p className="about-value">R$ {meta.toLocaleString("pt-BR")}</p>
            </div>
            <div>
              <p className="about-label">Arrecadação atual</p>
              <p className="about-value">~R$ {arrecadado.toLocaleString("pt-BR")}</p>
            </div>
            <div>
              <p className="about-label">Apoiadores</p>
              <p className="about-value">{apoiadores}</p>
            </div>
            <div>
              <p className="about-label">Gatas no santuário</p>
              <p className="about-value">~100</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meta de arrecadação */}
      <section className="section">
        <div className="container" style={{ maxWidth: 700 }}>
          <div
            style={{
              background: "var(--card)",
              borderRadius: "var(--radius)",
              padding: 32,
              boxShadow: "var(--shadow)",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: "1.4rem",
                marginBottom: 20,
              }}
            >
              Meta mensal de arrecadação
            </h2>
            <div className="progress-label">
              <span>R$ {arrecadado.toLocaleString("pt-BR")} arrecadados</span>
              <span>Meta: R$ {meta.toLocaleString("pt-BR")}</span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${porcentagem}%` }}
              />
            </div>
            <p
              style={{
                color: "var(--text-muted)",
                marginTop: 12,
                fontSize: "0.95rem",
              }}
            >
              Faltam <strong>R$ {faltam.toLocaleString("pt-BR")}</strong>{" "}
              para atingir a meta. Cada real conta!
            </p>
          </div>
        </div>
      </section>

      {/* Formas de doação */}
      <section className="section" style={{ background: "var(--bg-alt)" }}>
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Formas de ajudar</p>
            <h2>Escolha como contribuir</h2>
          </div>
          <div className="donation-grid">
            <article className="donation-card">
              <div
                className="help-icon"
                style={{ margin: "0 auto 18px" }}
              >
                ❤
              </div>
              <h2>Doe via Apoia.se</h2>
              <p>
                Contribuição mensal para sustentar os cuidados do santuário.
                Receba novidades dos nossos resgatados direto no seu e-mail.
              </p>
              <a
                href="https://apoia.se/resgatas"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                Acessar Apoia.se →
              </a>
            </article>

            <article className="donation-card">
              <div
                className="help-icon"
                style={{ margin: "0 auto 18px" }}
              >
                💜
              </div>
              <h2>Doe via PIX</h2>
              <p>
                Doe qualquer valor escaneando o QR Code abaixo. Compartilhe
                com amigos que amam gatinhos!
              </p>
              <div className="pix-placeholder">QR PIX</div>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  marginTop: 12,
                }}
              >
                Chave PIX será adicionada em breve
              </p>
            </article>

            <article className="donation-card">
              <div
                className="help-icon"
                style={{ margin: "0 auto 18px" }}
              >
                🏠
              </div>
              <h2>Adote uma gatinha</h2>
              <p>
                A melhor forma de ajudar é dar um lar para uma das nossas
                resgatadas. O processo é simples e responsável.
              </p>
              <Link href="/gatos" className="btn btn-outline">
                Conhecer gatinhas
              </Link>
            </article>

            <article className="donation-card">
              <div
                className="help-icon"
                style={{ margin: "0 auto 18px" }}
              >
                📦
              </div>
              <h2>Doe suprimentos</h2>
              <p>
                Ração, patês, areia, vermífugos e outros itens são sempre
                bem-vindos. Entre em contato para combinar a entrega.
              </p>
              <Link href="/contato" className="btn btn-outline">
                Falar conosco
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* Gastos detalhados */}
      <section id="transparencia" className="section">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Gastos mensais</p>
            <h2>Para onde vão os recursos</h2>
            <p>
              100% das doações são investidas no cuidado das gatas. Não temos
              auxílio público. Nossa despesa fixa com alimentação e areia é de R$ 8.000, 
              por isso nossa meta é R$ 10.000 para cobrir também as despesas veterinárias.
            </p>
          </div>

          <div className="transparency-grid">
            <div className="transparency-card">
              <h3>🥫 Alimentação</h3>
              <div className="expense-item">
                <span>Ração seca (10kg a cada 3 dias)</span>
                <strong>~100kg/mês</strong>
              </div>
              <div className="expense-item">
                <span>Patês e sachês</span>
                <strong>Diário</strong>
              </div>
              <div className="expense-item">
                <span>Suplementos</span>
                <strong>Conforme necessidade</strong>
              </div>
            </div>

            <div className="transparency-card">
              <h3>🩺 Saúde</h3>
              <div className="expense-item">
                <span>Consultas veterinárias</span>
                <strong>Mensal</strong>
              </div>
              <div className="expense-item">
                <span>Vacinas</span>
                <strong>Periódico</strong>
              </div>
              <div className="expense-item">
                <span>Vermífugos</span>
                <strong>Periódico</strong>
              </div>
              <div className="expense-item">
                <span>Castrações</span>
                <strong>Conforme resgates</strong>
              </div>
            </div>

            <div className="transparency-card">
              <h3>🧹 Higiene e manutenção</h3>
              <div className="expense-item">
                <span>Areia higiênica</span>
                <strong>Contínuo</strong>
              </div>
              <div className="expense-item">
                <span>Produtos de limpeza</span>
                <strong>Mensal</strong>
              </div>
              <div className="expense-item">
                <span>Manutenção do espaço</span>
                <strong>Conforme necessidade</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
