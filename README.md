# 💬 Lucas Levino | Portfólio Interativo

<div align="center">
  <img src="public/assets/avatar/avatar.webp" width="120" style="border-radius: 50%; border: 3px solid #25D366;" alt="Lucas Levino" />
</div>

<br/>

> **[10:00] Visitante:** Olá, Lucas! Você tem um portfólio comum?
> 
> **[10:01] Lucas Levino:** Não! Eu transformei meu portfólio em uma simulação de Whatsapp Web. Acesse e fale comigo de forma interativa. 😎

<div align="center">
  <a href="https://lucaslevino-94a21.web.app/" target="_blank">
    <img src="https://img.shields.io/badge/Acessar_Portfólio_Online-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="Acessar Portfólio" />
  </a>
</div>

<br/>

<div align="center">
  <img alt="Vue.js" src="https://img.shields.io/badge/Vue.js-35495E?style=flat-square&logo=vue.js&logoColor=4FC08D" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-B73BFE?style=flat-square&logo=vite&logoColor=FFD62E" />
  <img alt="Firebase" src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black" />
</div>

---

## 🟢 O que é este projeto?

Este repositório mostra como eu penso como desenvolvedor: prefiro inovar na experiência do usuário a entregar o básico.

Eu recriei, pixel por pixel, a interface de um dos aplicativos de comunicação mais famosos do mundo utilizando **Vue 3** e **TypeScript**. O objetivo é provar tecnicamente o que consigo construir com código. O foco foi entregar:
- Uma **UI/UX imersiva**.
- Código limpo, componentizado e estruturado (Arquitetura **SOLID**).
- Otimização extrema de **Performance e SEO**.

## ✨ Destaques de Arquitetura

O capô deste projeto esconde técnicas avançadas de front-end:

- **State Management Desacoplado:** A lógica não está misturada na árvore de componentes. Uso *Composables* globais (`useChat.ts`) para injetar dados e reatividade de forma limpa.
- **Tipagem Estrita (Discriminated Unions):** O fluxo de mensagens interativas possui múltiplos tipos (Textos, Links OG, PDFs, Figurinhas). O TypeScript garante dinamicamente que nenhum dado seja acessado de forma indevida ao compor os balões no `<MessageBubble />`.
- **Lightbox Nativo (Teleport):** Figurinhas e avatares possuem um visualizador de tela cheia criado do zero, renderizado via `<Teleport>` para o topo da árvore DOM (fugindo de conflitos de `z-index`), com transições idênticas às dos apps nativos.
- **Micro-Interações (Easter Eggs):** O chat escuta o *input* funcional do rodapé e executa instâncias roteirizadas, simulando o clássico status de *"digitando..."* e o som de Pop antes de entregar respostas sequenciais.

## 📱 Responsividade (Mobile-First Realista)

A responsividade deste portfólio muda a aplicação por completo:
- **No Desktop**, a interface reflete a exata proporção (Sidebar fixa, Chat central) do sistema *Web* original.
- **No Mobile**, a barra lateral colapsa e o roteamento via Hash (`useHashRouter`) transforma a UX em algo idêntico a um app nativo, alterando até a cor predominante do cabeçalho.


## 🔒 Uso deste Repositório

Deixei este repositório público pra quem quiser conhecer meu trabalho para Tech Recruiters, gestores e outros desenvolvedores interessados.
