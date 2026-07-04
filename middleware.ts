import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Pega o usuário logado atualmente (isso também atualiza o token se necessário)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Verifica se a rota é do painel admin (mas não a página de login em si)
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/admin/login")
  ) {
    // Se não estiver logado, redireciona pra tela de login
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    // Se estiver logado, verifica se o email dele está na tabela 'admins'
    const { data: adminUser } = await supabase
      .from("admins")
      .select("id")
      .eq("email", user.email)
      .single();

    // Se não encontrar o email na tabela, bloqueia
    if (!adminUser) {
      // Faz o logout do invasor por segurança
      await supabase.auth.signOut();
      
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("error", "unauthorized"); // Para mostrar uma mensagem na tela
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

// Aplica o middleware apenas em certas rotas (ignora arquivos estáticos)
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
