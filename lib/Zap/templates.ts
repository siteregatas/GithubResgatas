import type { ContactSubject, ContactRequest } from "../../types/gato";

type TemplateData = Omit<ContactRequest, "id" | "status" | "created_at" | "assunto">;

export const CONTACT_TEMPLATES: Record<ContactSubject, (data: TemplateData) => string> = {
  "doação": (data) => {
    const mensagemAdicional = data.mensagem && data.mensagem.trim()
      ? `\n${data.mensagem.trim()}\n`
      : "";
    return `Olá! Meu nome é ${data.nome} e gostaria de fazer uma DOAÇÃO para ajudar os gatinhos da ONG! 
${mensagemAdicional}
Podem me contatar para mais informações sobre como ajudar!`;
  },

  "adoção": (data) => {
    const mensagemAdicional = data.mensagem && data.mensagem.trim()
      ? `\n${data.mensagem.trim()}\n`
      : "";
    return `Olá! Meu nome é ${data.nome} e estou interessado em ADOTAR um gatinho! 
${mensagemAdicional}
Fico no aguardo do retorno com as opções disponíveis!`;
  },

  "ser voluntário": (data) => {
    const mensagemAdicional = data.mensagem && data.mensagem.trim()
      ? `\n${data.mensagem.trim()}\n`
      : "";
    return `Olá! Meu nome é ${data.nome} e gostaria de ser VOLUNTÁRIO na ONG! 
${mensagemAdicional}
Estou pronto para contribuir com o trabalho de vocês!`;
  },

  "parceria": (data) => {
    const mensagemAdicional = data.mensagem && data.mensagem.trim()
      ? `\n${data.mensagem.trim()}\n`
      : "";
    return `Olá! Meu nome é ${data.nome} e gostaria de discutir uma PARCERIA! 
${mensagemAdicional}
Fico à disposição para conversar sobre como podemos colaborar!`;
  },

  "outro": (data) => {
    const mensagemAdicional = data.mensagem && data.mensagem.trim()
      ? `\n${data.mensagem.trim()}\n`
      : "";
    return `Olá! Meu nome é ${data.nome} e gostaria de entrar em contato! 
${mensagemAdicional}
Aguardo o retorno!`;
  }
};

/**
 * Gera o link do WhatsApp para o telefone da ONG
 */
export function getWhatsAppLink(message: string): string {
  const cleanPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "5547991918029";
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
