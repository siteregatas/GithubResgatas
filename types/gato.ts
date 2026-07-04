export type Gato = {
  id: string;
  nome: string;
  idade: number | null;
  descricao: string | null;
  foto_url: string | null;
  status: "disponivel" | "adotado";
  created_at: string;
};

export type ContactSubject = "doação" | "adoção" | "ser voluntário" | "parceria" | "outro";

export type ContactRequest = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  assunto: ContactSubject;
  mensagem: string | null;
  status: "novo" | "respondido";
  created_at: string;
};

export { CONTACT_TEMPLATES, getWhatsAppLink } from "../lib/Zap/templates";

