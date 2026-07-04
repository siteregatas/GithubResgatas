"use server";

import { createActionSupabaseClient } from "./supabase-server";
import type { ContactRequest } from "../types/gato";
import { revalidatePath } from "next/cache";

/**
 * Auxiliar para verificar se o usuário atual é um administrador cadastrado.
 */
async function requireAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Não autorizado: Usuário não autenticado");
  }

  const { data: admin, error } = await supabase
    .from("admins")
    .select("id")
    .eq("email", user.email)
    .single();

  if (error || !admin) {
    throw new Error("Não autorizado: Email não consta na lista de administradores");
  }

  return user;
}

/**
 * Salva uma nova solicitação de contato no banco de dados.
 * Acesso público (qualquer visitante pode enviar).
 */
export async function saveContactRequest(
  data: Omit<ContactRequest, "id" | "status" | "created_at">
) {
  try {
    const supabase = await createActionSupabaseClient();
    
    const { error } = await supabase
      .from("contact_requests")
      .insert({
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        assunto: data.assunto,
        mensagem: data.mensagem || null,
        status: "novo",
      });

    if (error) {
      console.error("Erro ao salvar solicitação:", error);
      throw new Error("Erro ao salvar no banco de dados: " + error.message);
    }

    // Revalida o admin para atualizar contadores se um admin estiver logado
    revalidatePath("/admin");
    revalidatePath("/admin/solicitacoes");

    return { success: true };
  } catch (err: any) {
    console.error("saveContactRequest err:", err);
    return { success: false, error: err.message || "Erro desconhecido" };
  }
}

/**
 * Busca todas as solicitações de contato, permitindo filtros opcionais.
 * Restrito apenas a administradores.
 */
export async function getContactRequests(filters?: {
  assunto?: string;
  status?: string;
}) {
  try {
    const supabase = await createActionSupabaseClient();
    await requireAdmin(supabase);

    let query = supabase
      .from("contact_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters?.assunto) {
      query = query.eq("assunto", filters.assunto);
    }

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data as ContactRequest[];
  } catch (err: any) {
    console.error("getContactRequests err:", err);
    throw new Error(err.message || "Não foi possível carregar as solicitações.");
  }
}

/**
 * Atualiza o status de uma solicitação de contato (ex: marcar como respondido).
 * Restrito apenas a administradores.
 */
export async function updateContactStatus(id: string, status: "novo" | "respondido") {
  try {
    const supabase = await createActionSupabaseClient();
    await requireAdmin(supabase);

    const { data, error } = await supabase
      .from("contact_requests")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin");
    revalidatePath("/admin/solicitacoes");

    return { success: true, data };
  } catch (err: any) {
    console.error("updateContactStatus err:", err);
    return { success: false, error: err.message || "Erro ao atualizar status." };
  }
}

/**
 * Exclui uma solicitação de contato.
 * Restrito apenas a administradores.
 */
export async function deleteContactRequest(id: string) {
  try {
    const supabase = await createActionSupabaseClient();
    await requireAdmin(supabase);

    const { error } = await supabase
      .from("contact_requests")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin");
    revalidatePath("/admin/solicitacoes");

    return { success: true };
  } catch (err: any) {
    console.error("deleteContactRequest err:", err);
    return { success: false, error: err.message || "Erro ao deletar solicitação." };
  }
}

/**
 * Conta a quantidade de novas solicitações de contato (status = 'novo').
 * Usado para exibir o contador dinâmico no menu lateral.
 * Restrito apenas a administradores.
 */
export async function countNewRequests() {
  try {
    const supabase = await createActionSupabaseClient();
    await requireAdmin(supabase);

    const { count, error } = await supabase
      .from("contact_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "novo");

    if (error) {
      throw new Error(error.message);
    }

    return count || 0;
  } catch (err) {
    console.error("countNewRequests err:", err);
    return 0; // Retorna 0 silenciando o erro caso não esteja logado na sidebar
  }
}
