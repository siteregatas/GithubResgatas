export function getAnosDeAtuacao(): number {
  const startYear = 2013; // 2025 - 13 = 2012
  const currentYear = new Date().getFullYear();
  return currentYear - startYear;
}
