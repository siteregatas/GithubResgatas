"use client";

import { useState, useRef } from "react";
import type { Gato } from "../../../types/gato";

type CatFormProps = {
  initialData?: Partial<Gato>;
  onSubmit: (data: {
    nome: string;
    idade: number | null;
    descricao: string;
    status: "disponivel" | "adotado";
    fotoFile: File | null;
  }) => Promise<void>;
  isLoading?: boolean;
  onCancel: () => void;
};

export default function CatForm({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}: CatFormProps) {
  const [nome, setNome] = useState(initialData?.nome || "");
  const [idade, setIdade] = useState(initialData?.idade?.toString() || "");
  const [descricao, setDescricao] = useState(initialData?.descricao || "");
  const [status, setStatus] = useState<"disponivel" | "adotado">(
    initialData?.status || "disponivel"
  );
  
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.foto_url || null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoFile(file);
      // Criar URL temporária para preview
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome) {
      alert("O nome é obrigatório!");
      return;
    }
    
    await onSubmit({
      nome,
      idade: idade ? parseInt(idade, 10) : null,
      descricao,
      status,
      fotoFile,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form-card">
      <div className="admin-form-group">
        <label htmlFor="nome">Nome *</label>
        <input
          id="nome"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Mimi"
          required
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="admin-form-group">
          <label htmlFor="idade">Idade (anos)</label>
          <input
            id="idade"
            type="number"
            min="0"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
            placeholder="Ex: 2"
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as "disponivel" | "adotado")}
          >
            <option value="disponivel">Disponível para adoção</option>
            <option value="adotado">Já adotado</option>
          </select>
        </div>
      </div>

      <div className="admin-form-group">
        <label htmlFor="descricao">Descrição / Personalidade</label>
        <textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex: Gatinha muito dócil e carinhosa..."
        />
      </div>

      <div className="admin-form-group">
        <label>Foto do Gato</label>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        
        <div 
          className={`admin-photo-upload ${previewUrl ? 'has-photo' : ''}`}
          onClick={() => fileInputRef.current?.click()}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="admin-photo-preview" />
          ) : (
            <div className="admin-photo-placeholder">
              <span>📷</span>
              <p>Clique aqui para selecionar uma foto</p>
              <small>Formatos aceitos: JPG, PNG, WEBP</small>
            </div>
          )}
        </div>
        {previewUrl && (
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", fontSize: "0.85rem", fontWeight: "bold" }}
            >
              Trocar foto
            </button>
          </div>
        )}
      </div>

      <div className="admin-form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="admin-btn-cancel"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? "Salvando..." : "Salvar Gatinho"}
        </button>
      </div>
    </form>
  );
}
