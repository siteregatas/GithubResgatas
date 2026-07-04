import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Client para uso em Client Components (browser).
 * Mantém a sessão do usuário automaticamente.
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Client para uso em Server Components, Route Handlers e Server Actions.
 * Não mantém sessão — usado para leituras públicas.
 */
export function createServerSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Busca todos os gatos disponíveis para adoção (uso público).
 */
export async function getGatosDisponiveis() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("cats")
    .select("*")
    .eq("status", "disponivel")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar gatos:", error);
    return [];
  }

  return data;
}

/**
 * Busca todos os gatos (admin — inclui adotados).
 */
export async function getTodosGatos() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("cats")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar gatos:", error);
    return [];
  }

  return data;
}

/**
 * Busca um gato por ID.
 */
export async function getGatoPorId(id: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("cats")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erro ao buscar gato:", error);
    return null;
  }

  return data;
}

/**
 * Gera a URL pública de uma foto no Storage.
 */
export function getFotoUrl(path: string) {
  const supabase = createServerSupabaseClient();
  const { data } = supabase.storage.from("cat-photos").getPublicUrl(path);
  return data.publicUrl;
}
