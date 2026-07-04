# 🐾 ResgatAS - Plataforma de Adoção e Bem-Estar Felino

**ResgatAS** é uma aplicação web desenvolvida para facilitar a conexão entre gatos resgatados e potenciais adotantes. O projeto visa promover o bem-estar animal através de um sistema de adoção responsável, doação e gestão de eventos beneficentes, além de oferecer conteúdo informativo para a comunidade.

## 🎯 Objetivo do Projeto

Desenvolver uma plataforma que automatize e organize os processos da ONG **ResgatAS**, desde a divulgação dos animais para adoção até o gerenciamento de eventos e contribuições da comunidade. A solução visa aumentar o alcance da ONG, melhorar a experiência dos adotantes e facilitar o trabalho dos voluntários.

## 🛠️ Tecnologias Utilizadas

### Stack Principal

- **[Next.js](https://nextjs.org/) (App Router):** Framework React para renderização híbrida (SSG/SSR) e roteamento avançado.
- **[React](https://react.dev/):** Biblioteca JavaScript para construção de interfaces de usuário.
- **[TypeScript](https://www.typescriptlang.org/):** Superset do JavaScript que adiciona tipagem estática ao código, garantindo mais segurança e manutenibilidade.
- **[Bootstrap](https://getbootstrap.com/):** Framework CSS para criação de componentes estilizados e responsivos de forma ágil.
- **[Supabase](https://supabase.com/):** Backend-as-a-Service (BaaS) com PostgreSQL para banco de dados, armazenamento de fotos e autenticação (OAuth).

## 📂 Estrutura do Projeto

```text
site-ong-gatos/
├── app/                   # Rotas e páginas da aplicação (Next.js App Router)
├── fotos/                 # Imagens e recursos visuais locais
├── lib/                   # Configurações de bibliotecas de terceiros (ex: cliente do Sanity)
├── public/                # Arquivos estáticos servidos diretamente na raiz
├── types/                 # Definições de tipos e interfaces TypeScript
├── next.config.ts         # Configurações do Next.js
├── package.json           # Dependências e scripts do projeto
└── tsconfig.json          # Configuração do compilador TypeScript
```

## 🚀 Como Executar

Siga os passos abaixo para configurar e rodar o projeto localmente.

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [npm](https://www.npmjs.com/) (gerenciador de pacotes)

### Instalação

1. Clone o repositório:

   ```bash
   git clone <url-do-repositorio>
   cd site-ong-gatos
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env.local` na raiz do projeto (use o arquivo `.env.example` como modelo).
   - Adicione as variáveis necessárias para conectar-se ao Supabase (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse a aplicação:
   - Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o projeto em funcionamento.

---

**Feito por integrantes do projeto: Hugo Bertoglio, João Guero e Mariah Bork**
