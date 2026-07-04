import { createBrowserSupabaseClient } from "./supabase";

/**
 * Login com Google OAuth via Supabase.
 * Redireciona o usuário para a tela do Google e volta para /admin após o login.
 */
export async function loginComGoogle() {
  const supabase = createBrowserSupabaseClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/admin`,
    },
  });

  if (error) {
    console.error("Erro no login:", error);
    throw error;
  }
}

/**
 * Logout — encerra a sessão do usuário.
 */
export async function logout() {
  const supabase = createBrowserSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Erro no logout:", error);
    throw error;
  }
}

/**
 * Retorna o usuário autenticado atual ou null.
 */
export async function getUsuarioAtual() {
  const supabase = createBrowserSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Retorna a sessão atual ou null.
 */
export async function getSessaoAtual() {
  const supabase = createBrowserSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
