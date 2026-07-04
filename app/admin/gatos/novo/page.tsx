"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../../components/AdminSidebar";
import CatForm from "../../components/CatForm";
import { createBrowserSupabaseClient } from "../../../../lib/supabase";

export default function NovoGatoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      let foto_url = null;

      // 1. Fazer upload da foto se existir
      if (data.fotoFile) {
        // Gerar um nome de arquivo único
        const fileExt = data.fotoFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("cat-photos")
          .upload(fileName, data.fotoFile);

        if (uploadError) {
          throw new Error("Erro ao fazer upload da foto: " + uploadError.message);
        }

        // Pegar a URL pública da foto recém upada
        const { data: urlData } = supabase.storage
          .from("cat-photos")
          .getPublicUrl(fileName);
          
        foto_url = urlData.publicUrl;
      }

      // 2. Inserir dados no banco
      const { error: insertError } = await supabase.from("cats").insert({
        nome: data.nome,
        idade: data.idade,
        descricao: data.descricao,
        status: data.status,
        foto_url: foto_url,
      });

      if (insertError) {
        throw new Error("Erro ao salvar no banco: " + insertError.message);
      }

      // Sucesso! Voltar pro dashboard
      router.push("/admin");
      router.refresh(); // Força o Next.js a recarregar os dados do servidor
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocorreu um erro ao salvar o gato.");
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1>Adicionar Gatinho</h1>
            <p style={{ color: "var(--text-muted)", marginTop: 4 }}>
              Cadastre um novo gato resgatado
            </p>
          </div>
        </div>

        {error && (
          <div className="admin-login-error" style={{ maxWidth: 640 }}>
            {error}
          </div>
        )}

        <CatForm 
          onSubmit={handleSubmit} 
          isLoading={loading} 
          onCancel={() => router.push("/admin")} 
        />
      </main>
    </div>
  );
}
