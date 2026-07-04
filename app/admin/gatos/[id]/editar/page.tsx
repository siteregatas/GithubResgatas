"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../../../components/AdminSidebar";
import CatForm from "../../../components/CatForm";
import { createBrowserSupabaseClient } from "../../../../../lib/supabase";
import type { Gato } from "../../../../../types/gato";

export default function EditarGatoPage({ params }: { params: Promise<{ id: string }> }) {
  // O Next.js a partir da versão 15 pede que params seja consumido com `use()` se for assíncrono.
  // Em Client Components, desembrulhamos o params.
  const resolvedParams = use(params);
  const gatoId = resolvedParams.id;
  
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [gato, setGato] = useState<Gato | null>(null);

  useEffect(() => {
    async function fetchGato() {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data, error } = await supabase
          .from("cats")
          .select("*")
          .eq("id", gatoId)
          .single();

        if (error) throw error;
        setGato(data);
      } catch (err: any) {
        setError("Erro ao carregar os dados do gato.");
      } finally {
        setFetching(false);
      }
    }
    fetchGato();
  }, [gatoId]);

  const handleSubmit = async (data: {
    nome: string;
    idade: number | null;
    descricao: string;
    status: "disponivel" | "adotado";
    fotoFile: File | null;
  }) => {
    setLoading(true);
    setError("");

    try {
      const supabase = createBrowserSupabaseClient();
      let foto_url = gato?.foto_url; // Mantém a foto antiga por padrão

      // Se enviou uma foto nova, faz o upload
      if (data.fotoFile) {
        const fileExt = data.fotoFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("cat-photos")
          .upload(fileName, data.fotoFile);

        if (uploadError) {
          throw new Error("Erro ao fazer upload da foto: " + uploadError.message);
        }

        const { data: urlData } = supabase.storage
          .from("cat-photos")
          .getPublicUrl(fileName);
          
        foto_url = urlData.publicUrl;
      }

      // Atualiza os dados no banco
      const { error: updateError } = await supabase
        .from("cats")
        .update({
          nome: data.nome,
          idade: data.idade,
          descricao: data.descricao,
          status: data.status,
          foto_url: foto_url,
        })
        .eq("id", gatoId);

      if (updateError) {
        throw new Error("Erro ao atualizar no banco: " + updateError.message);
      }

      // Sucesso! Volta pro dashboard
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocorreu um erro ao atualizar o gato.");
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1>Editar Gatinho</h1>
            <p style={{ color: "var(--text-muted)", marginTop: 4 }}>
              Atualize as informações do gatinho
            </p>
          </div>
        </div>

        {error && (
          <div className="admin-login-error" style={{ maxWidth: 640 }}>
            {error}
          </div>
        )}

        {fetching ? (
          <div className="admin-loading">
            <div className="admin-spinner" />
            <span>Carregando dados...</span>
          </div>
        ) : gato ? (
          <CatForm 
            initialData={gato}
            onSubmit={handleSubmit} 
            isLoading={loading} 
            onCancel={() => router.push("/admin")} 
          />
        ) : (
          <div className="admin-empty">
            <p>Gato não encontrado.</p>
          </div>
        )}
      </main>
    </div>
  );
}
