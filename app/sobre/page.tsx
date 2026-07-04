import { getApoiaSeData } from "../../lib/apoiaSe";
import { getAnosDeAtuacao } from "../../lib/utils";

export default async function Sobre() {
  const { arrecadado, apoiadores, meta } = await getApoiaSeData();
  const anosAtuacao = getAnosDeAtuacao();
  return (
    <main>
      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <p className="eyebrow">Quem Somos</p>
          <h1 style={{ fontSize: "2.8rem", marginBottom: 16 }}>ResGatas</h1>
          <p className="about-subtitle">
            Santuário dedicado ao resgate, cuidado e adoção consciente de gatas adultas em
            Itajaí&nbsp;–&nbsp;Santa Catarina. Há {anosAtuacao} anos transformando
            o abandono em amor para nossas ~100 moradoras.
          </p>
        </div>
      </section>

      {/* Texto Corrido (Sobre) */}
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <article
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-muted)",
              marginTop: -20,
            }}
          >
            <h2 style={{ color: "var(--primary)", marginBottom: 16, fontSize: "1.8rem" }}>Nossa História</h2>
            <p style={{ marginBottom: 16 }}>
              A <strong>ResGatas</strong> atua na cidade de Itajaí – Santa Catarina há {anosAtuacao} anos como um santuário focado no resgate, cuidado e adoção consciente de gatas adultas em estado de abandono.
            </p>
            <p style={{ marginBottom: 32 }}>
              Tudo começou em 27/05/2020, quando a gatinha Alana foi internada com uma sonda gástrica. Esse momento marcante deu início à nossa missão oficial de transformar o abandono em histórias de amor.
            </p>

            <h2 style={{ color: "var(--primary)", marginBottom: 16, fontSize: "1.8rem" }}>Nossa Missão</h2>
            <p style={{ marginBottom: 16 }}>
              Diferente de muitas ONGs, nosso foco principal é voltado para <strong>gatas adultas</strong>, e não filhotes. Atualmente, nosso santuário abriga aproximadamente 100 felinas.
            </p>
            <p style={{ marginBottom: 32 }}>
              <strong>Atenção:</strong> Somos um santuário definitivo para a maioria das nossas moradoras. A grande parte das gatinhas tem mais de 9 anos ou apresenta comportamento arisco, vivendo aqui de forma permanente e segura. Somente gatas recém-resgatadas que são sociáveis (atualmente cerca de 6) estão disponíveis para adoção.
            </p>

            <h2 style={{ color: "var(--primary)", marginBottom: 16, fontSize: "1.8rem" }}>Como nos Mantemos</h2>
            <p style={{ marginBottom: 16 }}>
              A ResGatas vive <strong>100% de doações</strong>, não recebendo nenhum auxílio público ou governamental. Nossa despesa principal é com a alimentação, chegando a consumir 10 kg de ração a cada 3 dias, além dos gastos contínuos com patês, areia higiênica, vermífugos, vacinas e consultas veterinárias.
            </p>
            <p style={{ marginBottom: 32 }}>
              A nossa meta mensal de arrecadação no Apoia.se é de R$ {meta.toLocaleString("pt-BR")} (sendo R$ 8.000 para gastos fixos e R$ 2.000 reservados para emergências). Hoje contamos com o apoio de {apoiadores} pessoas incríveis, arrecadando cerca de R$ {arrecadado.toLocaleString("pt-BR")} por mês.
            </p>


          </article>
        </div>
      </section>
    </main>
  );
}
