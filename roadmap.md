### Fase 1: Arquitetura e Setup Inicial
* [x] **1.1. Inicialização:** Criar o projeto limpo com Vite + Vue 3 (sem bibliotecas extras de UI, state ou rotas neste primeiro momento).
* [x] **1.2. Configuração do Tailwind:** Instalar e configurar o Tailwind CSS.
* [x] **1.3. Design System (Tailwind Config):** Mapear e adicionar as cores exatas do WhatsApp Web (Light/Dark mode) no `tailwind.config.js` (ex: Verde WhatsApp, fundos de chat, cores de balão).
* [x] **1.4. Assets e Tipografia:** Configurar a fonte padrão (Segoe UI, Helvetica Neue, etc.) e preparar os SVGs in-line para os ícones (evitando dependências como FontAwesome).
* [x] **1.5. Estrutura de Diretórios:** Criar a organização das pastas (`/components`, `/composables`, `/assets`, `/data`).

### Fase 2: Layout Base e Semântica (Mobile-First)
* [x] **2.1. Container Principal:** Criar o invólucro do app (`<main>`) garantindo 100vh e fundo contrastante (aquele fundo cinza/verde atrás da janela principal no desktop).
* [x] **2.2. Grid/Flexbox Responsivo:** Estruturar o layout para que no mobile seja exibida apenas uma view por vez (Lista ou Chat), e no desktop acima de `md:` ou `lg:` assuma o layout de duas colunas (Sidebar + Área de Mensagens).
* [x] **2.3. Semântica Estrutural:** Definir o uso correto de tags: `<aside>` para a lista lateral (abas), `<section>` para a área ativa da conversa, `<header>` e `<footer>` para os topos e inputs de cada área.

### Fase 3: Componentização da Sidebar (As "Abas")
* [x] **3.1. Header da Sidebar:** Criar o topo com sua "foto de perfil" (Avatar) e ícones de status/menu (SVGs estáticos).
* [x] **3.2. Barra de Pesquisa (Falsa/Funcional):** Criar o input de busca (pode servir para filtrar suas habilidades ou apenas visual).
* [x] **3.3. Componente `ChatItem`:** Construir o card de cada "conversa" (Sobre Mim, Experiência, Projetos).
* [x] **3.4. Lista de Conversas:** Renderizar os `ChatItems` através de um mock de dados, incluindo marcadores de "mensagens não lidas" para chamar a atenção para seções importantes.

### Fase 4: Componentização da Área de Chat (O Conteúdo)
* [x] **4.1. Header do Chat:** Mostrar o nome da seção atual (ex: "Experiência Profissional"), sua foto menor e um status (ex: "online").
* [x] **4.2. Background do Chat:** Implementar o fundo clássico do WhatsApp com os *doodles* sutis.
* [x] **4.3. Componente `MessageBubble`:** Criar os balões de mensagem. Precisará de variação (Enviado por você vs. Enviado pelo recrutador/visitante) para criar uma dinâmica de entrevista.
* [x] **4.4. Scroll Area:** Configurar o *overflow-y* para que apenas a área das mensagens role, mantendo os headers fixos.
* [x] **4.5. Footer (Input de Mensagem):** Criar a barra inferior. Pode conter um botão para "Baixar CV em PDF" simulando o botão de enviar áudio ou anexo.

### Fase 5: Lógica e Gerenciamento de Estado
* [x] **5.1. Composable de Estado (`useChat`):** Criar a lógica para gerenciar qual "conversa" está ativa no momento.
* [x] **5.2. Navegação Mobile:** Implementar a lógica de "Voltar" no mobile (esconder o chat e mostrar a lista).
* [x] **5.3. Mock de Dados Estruturado:** Criar o JSON/Object literal que alimentará todo o portfólio de forma dinâmica.
* [x] **5.4. Animações de Entrada:** Adicionar pequenas transições ao abrir uma conversa, para que as mensagens não apareçam secas na tela.

### Fase 6: SEO e Acessibilidade (A11y)
* [ ] **6.1. Meta Tags Globais:** Configurar Title, Description e tags Open Graph (para quando compartilharem o link do seu portfólio no LinkedIn).
* [ ] **6.2. Estrutura de Heading (`<h1>`, `<h2>`):** Garantir que, mesmo dentro de balões de mensagem, exista uma hierarquia lógica de títulos escondida ou integrada no layout.
* [ ] **6.3. JSON-LD (Schema Markup):** Adicionar microdados estruturados (`Person` ou `ProfilePage`) no `<head>` para que os motores de busca leiam seus dados profissionais independentemente do layout visual.
* [ ] **6.4. ARIA Labels:** Garantir que botões com apenas ícones tenham `aria-label` descritivo.

### Fase 7: Polimento e Deploy
* [ ] **7.1. Auditoria de Performance:** Rodar o Lighthouse no Chrome para garantir nota 100 em Performance, Accessibility e SEO.
* [ ] **7.2. Revisão Cross-Browser:** Testar visualmente no Safari, Chrome e Firefox.
* [ ] **7.3. Deploy:** Configurar a subida do projeto (sugestão: Vercel ou Netlify, pela integração nativa e rápida com Vite).
