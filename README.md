# 📱 Lucas Levino - Portfólio Interativo

<div align="center">
  <img alt="Vue.js" src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
  <img alt="Firebase" src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
</div>

<br>

Este é o repositório oficial do meu portfólio web, projetado do zero para simular a interface de um dos aplicativos de comunicação mais conhecidos do mundo. O objetivo principal deste projeto é demonstrar, de forma criativa e imersiva, minhas habilidades em **Front-End**, **UI/UX Design** e **Arquitetura de Software**.

🔗 **Acesse o portfólio ao vivo:** [lucaslevino-94a21.web.app](https://lucaslevino-94a21.web.app/)

---

## 🎯 Sobre o Projeto

O portfólio vai muito além de uma simples página estática. Ele entrega uma experiência de chat interativo. Nele, o visitante assume o controle do dispositivo e "conversa" comigo. O projeto conta com respostas automatizadas sequenciais, currículo em PDF anexo, links estilizados de projetos, figurinhas interativas e efeitos sonoros.

Tudo foi pensado para não ser apenas visualmente impactante, mas tecnicamente robusto.

## 🚀 Principais Features e Diferenciais Técnicos

- **Design Pixel-Perfect e Responsivo:** Simulação incrivelmente fiel ao WhatsApp Web no desktop, adaptando-se para simular o aplicativo mobile quando acessado por smartphones.
- **Gamificação e Interatividade:** O input de texto no rodapé é funcional. Ao enviar mensagens, o visitante dispara rotinas simuladas ("digitando...") e interações ocultas (Easter Eggs).
- **Visualizador de Imagens (Lightbox):** Sistema customizado de *lightbox* em tela cheia com animações de entrada para avatares, figurinhas e *previews* de links.
- **Arquitetura SOLID e Escalável:**
  - Separação extrema de responsabilidades. O estado da interface é gerenciado de forma externa e injetada através de *Composables* (`useChat.ts`, `useLightbox.ts`, `useHashRouter.ts`).
  - Uso intensivo do sistema de tipos do TypeScript, implementando *Discriminated Unions* para garantir segurança estrita nas variações de componentes do chat (`MessageSticker`, `MessageIframe`, `MessageLinkPreview`).
- **SEO & Acessibilidade Avançada:** Estruturado com `robots.txt`, `sitemap.xml`, *Open Graph* (OG) tags nativas, e marcação semântica Schema JSON-LD para indexação robusta em motores de busca.
- **Tema Dinâmico Nativo:** Configurado no Tailwind para detectar automaticamente a preferência do sistema operacional do visitante, alternando suavemente entre os modos *Light* e *Dark*.

## 🛠️ Tecnologias Utilizadas

- **Core:** [Vue 3](https://vuejs.org/) (Composition API / `<script setup>`)
- **Linguagens:** [TypeScript](https://www.typescriptlang.org/) (Segurança em larga escala) e HTML5/CSS3.
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Ferramental:** [Vite](https://vitejs.dev/) (Build ultrarrápido)
- **Deploy & Hospedagem:** [Firebase Hosting](https://firebase.google.com/)
- **Análise de Dados:** Google Analytics (`gtag`) integrado nativamente.

## 🔒 Direitos de Uso

Este projeto foi desenvolvido como uma peça de demonstração **exclusiva** para meu uso pessoal e profissional. 

Seu código-fonte está aberto no GitHub puramente com propósitos educacionais e de transparência técnica (para que recrutadores e outros desenvolvedores possam avaliar a qualidade do meu código e arquitetura). 

**⚠️ Importante: Não é permitida a cópia, clonagem, modificação ou publicação deste repositório para ser utilizado como template de portfólio por terceiros.**

---
<p align="center">
  Desenvolvido com dedicação por <b>Lucas Levino</b>. <br/>
  <i>Especialista de Desenvolvimento Web & Soluções Digitais</i>
</p>
