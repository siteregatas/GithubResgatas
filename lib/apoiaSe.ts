export async function getApoiaSeData() {
  try {
    const res = await fetch("https://apoia.se/api/v1/users/resgatas", {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    const campaign = data?.campaigns?.[0];
    return {
      arrecadado: campaign?.supports?.total?.value || 0,
      apoiadores: campaign?.supports?.total?.count || 0,
      meta: campaign?.goals?.[0]?.value || 10000,
    };
  } catch (error) {
    console.error("Erro ao buscar dados do Apoia.se:", error);
    return { arrecadado: 0, apoiadores: 0, meta: 10000 };
  }
}
