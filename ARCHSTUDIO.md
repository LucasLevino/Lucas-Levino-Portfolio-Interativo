# 🏛️ ArchStudio — Documentação Técnica e Funcional Completa

O **ArchStudio** é um laboratório interativo de engenharia de prompts, catalogação de referências e geração multimodal (2D ArchViz, Pranchas PBR e Malhas 3D) voltado para **Arquitetura Contemporânea, Design de Interiores, Luminotécnica, Paisagismo e Mobiliário**.

Integrado ao ecossistema do portfólio de **Lucas Levino** na rota `/archstudio`, o sistema funciona **100% client-side** (diretamente no navegador), traduzindo decisões projetuais de arquitetura em especificações técnicas em inglês otimizadas para modelos generativos de imagem e 3D.

---

## 📑 Índice

1. [O que é o ArchStudio e o que ele faz](#1-o-que-é-o-archstudio-e-o-que-ele-faz)
2. [Metodologia de Engenharia de Prompts (As 6 Fases)](#2-metodologia-de-engenharia-de-prompts-as-6-fases)
3. [Como funcionam os Prompts (7 Blocos vs. 12 Blocos e Compilação)](#3-como-funcionam-os-prompts-7-blocos-vs-12-blocos-e-compilação)
4. [Os 9 Contextos Especializados de Arquitetura](#4-os-9-contextos-especializados-de-arquitetura)
5. [Módulos Interativos Especializados (Planta Baixa 2D→3D e Ficha PBR)](#5-módulos-interativos-especializados-planta-baixa-2d3d-e-ficha-pbr)
6. [Como funciona o Módulo Canvas e os Inputs de Imagens](#6-como-funciona-o-módulo-canvas-e-os-inputs-de-imagens)
7. [Catálogo de Projetos, Galeria de Referências e Biblioteca Local](#7-catálogo-de-projetos-galeria-de-referências-e-biblioteca-local)
8. [Como o ArchStudio roda (Arquitetura, Persistência e Segurança)](#8-como-o-archstudio-roda-arquitetura-persistência-e-segurança)
9. [Estrutura de Arquivos no Repositório](#9-estrutura-de-arquivos-no-repositório)

---

## 1. O que é o ArchStudio e o que ele faz

A maioria dos profissionais de arquitetura e visualização 3D (*ArchViz*) enfrenta dificuldade ao escrever prompts para IA porque descrições genéricas geram resultados plásticos, desproporcionais ou sem rigor construtivo.

O **ArchStudio** resolve esse problema atuando como um **compilador arquitetônico**:

- **Traduz vocabulário técnico (PT-BR → EN):** O usuário navega por categorias, *chips* combináveis e *presets* descritos em português técnico de arquitetura, enquanto o motor monta automaticamente a sintaxe em inglês exigida pelos modelos de difusão.
- **Adapta a estrutura gramatical ao contexto:** Um prompt para fachada externa exige conectores sintáticos diferentes de um prompt para iluminação IES, planta baixa humanizada ou malha 3D de mobiliário.
- **Separa o Render da Diretriz de Imagem:** O texto descritivo da cena (*Render*) permanece puro e coeso, enquanto instruções sobre imagens anexadas (croquis, prints de SketchUp/Revit, plantas ou fotos de reforma) ficam isoladas em uma camada própria e opcional.
- **Oferece Sistemas Interativos Visuais:** Inclui um construtor vetorial de **Plantas Baixas 2D para 3D** (com posicionamento de pino de câmera) e um gerador de **Pranchas de Textura PBR**.
- **Conecta-se diretamente às APIs de Geração (Canvas):** Permite anexar até 3 imagens de referência e disparar gerações via **Google Gemini / Imagen 3**, **OpenAI GPT-Image-1**, **Fal.ai Flux 1.1 Pro Ultra** e **Tencent Hunyuan 3D (`3d.hunyuan`)**.

---

## 2. Metodologia de Engenharia de Prompts (As 6 Fases)

Modelos generativos de difusão atribuem maior peso semântico aos tokens posicionados no início da sentença. Por isso, o **ArchStudio** estrutura todo prompt seguindo uma hierarquia **do Macro ao Micro em 6 Fases**:

| Fase | Escala | Nome da Fase | Função Visual e Semântica no Modelo |
| :--- | :--- | :--- | :--- |
| **01** | `MACRO` | **Sujeito Principal e Implantação** | Define a ação (`Render...`), o estilo arquitetônico, a tipologia do edifício/ambiente e o contexto geográfico ou espacial. |
| **02** | `MÉDIO` | **Materialidade e Envoltória** | Especifica os materiais construtivos primários (concreto aparente ripado, travertino bruto, madeira cumaru, vidro extra-clear, caixilharia anodizada). |
| **03** | `MICRO` | **Entorno, Paisagismo e Ambiência** | Descreve a envoltória imediata: vegetação nativa, topografia em desnível, marcenaria fixa ou transição interior-exterior. |
| **04** | `1º PLANO` | **Primeiro Plano (*Foreground*)** | Adiciona camadas de profundidade óptica próximas à lente (espelhos d'água com reflexos, pedras naturais, mobiliário de primeiro plano). |
| **05** | `LUZ & CLIMA` | **Luminotécnica e Atmosfera** | Controla a direção solar (azimute/elevação), temperatura de cor em Kelvin (`2700K`–`6500K`), curvas fotométricas IES e o clima emocional (*mood*). |
| **06** | `TÉCNICO` | **Motor de Render, Lente e Proporção** | Finaliza com diretrizes de motor físico (*Global Illumination*, *V-Ray/Corona style*, perspectiva de 2 pontos, `no text` e proporção `16:9`, `4:5` ou `1:1`). |

---

## 3. Como funcionam os Prompts (7 Blocos vs. 12 Blocos e Compilação)

O estado e a compilação dos prompts são gerenciados pelo composable `src/composables/useArchPrompt.ts`.

### 3.1. Dois Modos de Detalhamento (Sincronizados)
O cabeçalho do estúdio permite alternar a qualquer momento entre dois níveis de granularidade sem perder o que já foi preenchido:

1. **Modo Rápido (`7 Blocos`):**
   - Ideal para concepção ágil. Agrupa a narrativa nos 7 campos essenciais:
     1. `style` (Fase 1 — Estilo, Sujeito e Local)
     2. `materials` (Fase 2 — Materiais e Superfícies)
     3. `environment` (Fase 3 — Entorno / Paisagismo / Layout)
     4. `foreground` (Fase 4 — Elementos de Primeiro Plano)
     5. `lighting` (Fase 5 — Iluminação Natural e Artificial)
     6. `mood` (Fase 5 — Atmosfera e Sensação Espacial)
     7. `technical` (Fase 6 — Qualidade, Lente e Proporção)

2. **Modo Avançado (`12 Blocos`):**
   - Desmembra as fases inicial, luminotécnica e técnica para controle cirúrgico:
     - Fase 1 divide-se em: `archStyle` (Estilo Arquitetônico) + `buildingType` (Tipologia) + `location` (Implantação/Contexto).
     - Fase 5 divide-se em: `lighting` (Luz Principal) + `lightingDetail` (Sombras, Brilho Interno e Efeitos Volumétricos) + `mood` (Atmosfera).
     - Fase 6 divide-se em: `renderStyle` (Motor e Fotografia) + `extraCommands` (Restrições como `no text, no people`) + `aspectRatio` (`16:9`, `1:1`, `9:16`, `4:5`, `21:9`).

### 3.2. Chips Combináveis e Formatação Inteligente em Inglês
Cada campo possui:
- **Menu de Presets Completos:** Frases técnicas inteiras prontas para aplicação imediata.
- **Chips Combináveis (Multi-select):** Ao clicar em múltiplos termos técnicos (ex.: `board-formed concrete` + `natural Cumaru timber` + `floor-to-ceiling glass`), o algoritmo `formatFieldTokens()` remove duplicatas e monta automaticamente a pontuação gramatical correta em inglês com vírgulas e conjunção final (`, and `).
- **Edição Livre:** O usuário pode digitar ou ajustar qualquer termo diretamente na caixa de texto de cada variável ou habilitar o modo **Editar Texto** no card do Prompt Compilado.

### 3.3. Separação entre o Prompt de Render e a Diretriz de Imagem (`imageRef`)
Para evitar que instruções de imagem anexada se misturem com a descrição arquitetônica do *Render*:
- O parágrafo principal do **Prompt Compilado** exibe exclusivamente a narrativa de renderização (Fases 01 a 06), com destaque visual nas variáveis preenchidas e *badges* clicáveis nas pendentes.
- Quando o usuário clica em um trecho do preview, a página rola suavemente (`scrollToField`) até o bloco correspondente na coluna esquerda e foca o campo de edição.
- Abaixo do texto do Render, existe um **container dedicado e separado para a Diretriz de Imagem Anexada (`imageRef`)**. Se preenchida, ela é anexada ao final do prompt como uma cláusula independente (`Reference image directive: ...`), mantendo a frase inicial do Render limpa.

---

## 4. Os 9 Contextos Especializados de Arquitetura

Ao trocar de contexto na barra superior do estúdio, o **ArchStudio** altera automaticamente:
1. Os **conectores gramaticais** da frase em inglês (`ContextSentenceConnectors`);
2. A **cor de destaque (*accent*)** do Design System;
3. Os **presets rápidos** e todas as **opções/chips técnicos** de cada bloco.

Os 9 contextos disponíveis em `src/data/archprompt.ts` são:

1. **Externo (`exterior`):** Fachadas, volumetria, implantação topográfica, paisagismo e espelhos d'água.
2. **Interno (`interior`):** Arquitetura de interiores estrutural, pé-direito duplo, escadas esculturais, forros, pisos e aberturas zenitais.
3. **Design de Interiores (`interior-design`):** Curadoria de decoração, *styling*, têxteis (bouclé, linho, couro), obras de arte, tapetes e composição de mobiliário assinado.
4. **Luzes / Luminotécnico (`lighting`):** Simulação de perfis de LED lineares, sancas, *wall grazing*, focos direcionais, curvas IES e contraste entre luz natural e temperatura de cor em Kelvin.
5. **Ambiente & Paisagismo (`environment`):** Masterplans, praças, jardins contemplativos, pavilhões, neblina atmosférica, biomas e integração arquitetura-natureza.
6. **Móveis (`furniture`):** Fotografia editorial de peças de mobiliário (poltronas, mesas monolíticas, luminárias) ambientadas ou em estúdio.
7. **Móveis em 3D (`furniture-3d`):** Otimizado para geração de ativos tridimensionais e *packshots* isolados com topologia limpa (integrado ao preset de malha para o modelo `3d.hunyuan`).
8. **Planta Baixa (`floor-plan`):** Conversão e renderização de plantas baixas 2D em vistas isométricas 3D (*cutaway*), plantas humanizadas *top-down* 90° ou perspectivas ao nível do olho.
9. **Ficha de Textura (`texture-sheet`):** Geração de pranchas técnicas de especificação de materiais (*PBR Material Boards*) e texturas *seamless* 1:1 para modelagem 3D.

---

## 5. Módulos Interativos Especializados (Planta Baixa 2D→3D e Ficha PBR)

Determinados contextos ativam painéis gráficos interativos no topo da coluna construtora:

### 5.1. Sistema Interativo de Plantas Baixas (`ArchFloorPlanInteractive.vue`)
Ativado automaticamente no contexto **Planta Baixa**, possui dois modos de operação:

- **Aba 1 — Planta 2D & Zonas (Blueprint SVG):**
  - Exibe uma planta arquitetônica vetorial interativa dividida em 6 zonas clicáveis (`Z-01 Living & Jantar`, `Z-02 Cozinha Gourmet`, `Z-03 Suíte Master`, `Z-04 Banheiro Spa`, `Z-05 Estúdio Técnico`, `Z-06 Varanda & Espelho D'Água`).
  - Ao ativar/desativar cômodos no SVG, o sistema recalcula a área total em `m²` e compila automaticamente o programa de necessidades, os revestimentos de piso de cada setor e o mobiliário correspondente em inglês.
  - Permite configurar: **Tipo de Projeção** (`Isométrica 45°`, `Planta Humanizada 90°`, `Axonométrica Explodida`, `Nível do Olho`), **Altura de Corte das Paredes** (`2.80m`, `1.40m Meia-Parede`, `0.80m Corte Baixo`), **Preenchimento de Parede / Poché** (`Branco`, `Carvão`, `Concreto`, `Madeira Balsa`) e **Ângulo Solar/Câmera** (`SW`, `SE`, `NW`, `NE`).

- **Aba 2 — Pino de Câmera 2D → Vista 3D:**
  - Permite clicar diretamente sobre a planta baixa para posicionar o **Pino da Câmera (Observador)** e o **Pino do Alvo (Direção do Olhar)**.
  - O sistema identifica em qual ambiente o observador está, para qual zona ele está olhando, calcula o ângulo azimutal da lente em graus e gera um prompt de perspectiva interna (`eye-level interior perspective`) fiel à posição marcada na planta.

### 5.2. Criador de Ficha de Textura PBR (`ArchTextureSheetInteractive.vue`)
Ativado pelo botão **Criar Ficha de Textura** ou pelo contexto **Ficha de Textura**:
- Permite selecionar famílias de materiais arquitetônicos (Travertino Romano Bruto, Madeira Freijó Natural, Concreto Aparente Ripado, Mármore Calacatta Viola, Bouclé & Linho Cru, Terracota Artesanal) com visualização das paletas cromáticas (*swatches*).
- Configura o **Formato da Prancha** (`Prancha PBR Completa com esfera de shader`, `Textura Seamless 1:1`, `Comparativo de 4 Acabamentos`, `Amostra Física em Bancada`), **Acabamento / Rugosidade**, **Modulação / Junta** (`Contínuo`, `Placas com junta 1.5mm`, `Ripado 30mm`, `Espinha de Peixe`) e **Escala Física Real** (`100×100cm` até `25×25cm Macro`), sincronizando tudo com o prompt compilado.

---

## 6. Como funciona o Módulo Canvas e os Inputs de Imagens

Localizado na coluna direita (`src/components/archprompt/ArchCanvasModule.vue` e `src/composables/useArchCanvas.ts`), o módulo **Canvas** transforma o prompt compilado em imagens ou ativos 3D.

### 6.1. Inputs de Imagens (3 Slots Multimodais)
O usuário pode anexar até **3 imagens de referência** simultaneamente:
1. **Slot 1 (`IMG 01 · ESTRUTURA`):** Croqui, print da viewport 3D (SketchUp, Revit, Archicad, Blender), planta baixa ou foto base.
2. **Slot 2 (`IMG 02 · ATMOSFERA`):** Referência de iluminação, fotografia editorial ou *moodboard* de cores.
3. **Slot 3 (`IMG 03 · MATERIAIS / 3D`):** Amostra de revestimento, textura ou peça de mobiliário de referência.

Cada slot aceita **Drag & Drop**, **Seleção de Arquivo**, **Colar da Área de Transferência (`Ctrl+V`)** ou **URL externa**, e possui um botão para sincronizar automaticamente as diretrizes de papel de cada imagem (`Image 1`, `Image 2`, `Image 3`) com o prompt.

### 6.2. Os 4 Motores de Geração Suportados
| ID do Modelo | Provedor | Foco Técnico no ArchStudio |
| :--- | :--- | :--- |
| **`gemini.imagen`** | Google Gemini / Imagen 3 | **Multimodal + Referências:** Envia o prompt em texto junto com os arquivos de imagem convertidos em base64 (`inlineData`) diretamente para a API do Gemini. |
| **`openai.gpt-image`** | OpenAI (`gpt-image-1` / DALL-E 3) | **Alta Precisão Textual:** Ideal para pranchas técnicas PBR, plantas baixas detalhadas e instruções longas. |
| **`fal.flux-pro`** | Fal.ai (`Flux 1.1 Pro Ultra`) | **ArchViz 8K Editorial:** Fotorrealismo avançado de concreto, madeira, vegetação e iluminação volumétrica. |
| **`3d.hunyuan`** | Tencent Hunyuan 3D v2 (via Fal.ai) | **Ativos e Móveis 3D (`.GLB`):** Voltado para os contextos de Móveis e Objetos Arquitetônicos 3D; retorna tanto a visualização isolada quanto o link para download da **malha tridimensional `.GLB`**. |

### 6.3. Execução Real via API vs. Modo Simulação
- **Com Chave de API configurada:** O Canvas executa requisições `fetch` reais diretamente do navegador do usuário para o endpoint oficial do provedor selecionado e adiciona o resultado na galeria do Canvas com opção de download (`.png`/`.webp` e `.glb` para 3D).
- **Sem Chave de API (Modo Simulação):** Caso o visitante queira apenas testar a interface sem inserir chaves pagas, o Canvas opera em modo de demonstração visual, gerando uma prévia arquitetônica simulada contextualizada e exibindo um aviso claro de que nenhuma chave foi consumida.

---

## 7. Catálogo de Projetos, Galeria de Referências e Biblioteca Local

1. **Catálogo Rápido de Projetos (`Seção Expansível no Topo`):**
   - Apresenta pranchas editoriais prontas (*Residência Casa das Pedras*, *Apartamento Galeria Itaim*, *Pavilhão Botânico Horizonte*) com ficha técnica completa (código, área em `m²`, escala, coordenadas geográficas e tags de materiais). Clicar em um card carrega toda a sua configuração no estúdio.
2. **Aba Catálogo de Referências (`ArchReferenceGallery.vue`):**
   - Alternável pelo botão superior **Catálogo de Referências**. Funciona como um acervo curatorial de arquitetura contemporânea com filtro por especialidade, busca por material/estilo e modal de inspeção técnica (mostrando orientação solar, pé-direito, nota curatorial e prompt de renderização separado da diretriz de imagem).
3. **Biblioteca Local (Histórico e Favoritos):**
   - Todo prompt copiado ou favoritado é salvo automaticamente no `localStorage` (`lucaslevino_archprompt_history_v1`), permitindo filtrar favoritos, copiar novamente com 1 clique ou restaurar todas as variáveis daquele projeto no construtor.

---

## 8. Como o ArchStudio roda (Arquitetura, Persistência e Segurança)

### 8.1. Stack Tecnológica
- **Framework:** Vue 3 (Composition API com `<script setup lang="ts">`)
- **Tipagem:** TypeScript estrito (`vue-tsc`)
- **Estilização:** Tailwind CSS + Tokens customizados do *Architectural Soft Neobrutalism* em `src/style.css`
- **Bundler:** Vite 8
- **Roteamento Leve:** Gerenciado em `src/App.vue` via History API (`window.location.pathname`), respondendo na rota `/archstudio` (e mantendo compatibilidade com `/archprompt`).

### 8.2. Privacidade e Persistência de Chaves (100% Client-Side BYOK)
O ArchStudio utiliza o modelo **BYOK (*Bring Your Own Key*)** sem servidor intermediário:
- As chaves de API inseridas no modal **Config APIs (`.JSON`)** (`ArchConfigModal.vue`) **nunca são enviadas para nenhum backend intermediário**.
- O usuário escolhe no próprio modal onde deseja persistir suas configurações no navegador:
  1. **LocalStorage + Cookie (Redundante — Padrão)**
  2. **Apenas LocalStorage** (`lucaslevino_archprompt_config_v1`)
  3. **Apenas Cookies** (`archprompt_config_v1`, validade de 1 ano com `SameSite=Strict`)
- **Portabilidade via `.JSON`:** Com um clique em **Baixar Config (`.JSON`)**, o estúdio gera um arquivo `archstudio-config-YYYY-MM-DD.json` contendo as chaves e endpoints configurados. Para restaurar em outro computador ou navegador, basta arrastar o arquivo `.json` para dentro do modal.

### 8.3. Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento (Vite)
npm run dev
# Acesse http://localhost:5173/archstudio

# 3. Verificar tipagem TypeScript e gerar build de produção
npm run build

# 4. Visualizar o build de produção localmente
npm run preview
```

---

## 9. Workflows Avançados, Presets Cirúrgicos e Travas de Segurança (Fase 06)

O ArchStudio conta com 14 recursos especializados projetados para fluxos reais de escritórios de arquitetura e interiores:

### 9.1. Inteligência Multimodal e Testes no Canvas (`ArchCanvasModule.vue` + `useArchCanvas.ts`)
1. **Analisar Referência (`analyzeReferenceImages`):**
   - Lê as imagens anexadas nos slots do Canvas (via Gemini Vision, OpenAI Vision ou decodificador contextual local) e extrai automaticamente **móveis**, **materiais**, **composição espacial** e **iluminação**, preenchendo os blocos `[style]`, `[materials]`, `[environment]`, `[foreground]`, `[lighting]`, `[mood]`, `[technical]` e `[imageRef]`.
2. **Engenharia Reversa de Estilo (`extractAuthorStyleProfile`):**
   - Permite enviar fotos de projetos anteriores do próprio arquiteto/estúdio para extrair os **4 Pilares Visuais do Autor** (*1. Geometria*, *2. Paleta de Cores*, *3. Materiais Assinatura* e *4. Escolhas de Design*), gerando um perfil aplicável em 1 clique a qualquer novo projeto.
3. **Testes em Lote / Batch Testing (`generateBatchOnCanvas`):**
   - Dispara o mesmo prompt simultaneamente em múltiplos motores (`gemini.imagen`, `openai.gpt-image`, `fal.flux-pro` e `3d.hunyuan`) e apresenta uma grade comparativa lado a lado para avaliar comportamento de luz e fidelidade de materiais.

### 9.2. Presets e Workflows de Reforma, Luminotécnica e PBR (`archprompt.ts`)
4. **Demolição Virtual — Áreas Secas (`virtual-demolition-dry-room`):**
   - Remove 100% dos móveis, cortinas e decorações de fotos de levantamento de salas e quartos, deixando paredes brancas rebocadas e piso cinza de contrapiso sem alterar a estrutura.
5. **Demolição Virtual — Áreas Molhadas (`virtual-demolition-wet-area`):**
   - Limpa fotos de banheiros e cozinhas removendo bancadas, louças e marcenaria, substituindo-os por pequenos **canos de PVC aparentes** de espera de água e esgoto em obra bruta.
6. **Workflow de Virtual Staging (`virtual-staging-architect-style`):**
   - Combina a casca limpa da Demolição Virtual com os pilares visuais extraídos na Engenharia Reversa de Estilo, mobiliando o espaço vazio sem distorcer a perspectiva da foto original.
7. **Re-Skin Cirúrgico com Trava de Pegada (`surgical-material-reskin`):**
   - Utiliza o **Slot 1** como trava geométrica (*Geometry Master*) e o **Slot 3** como fonte de textura (*Texture Source*), aplicando a regra de **Footprint Lock** (Trava de Pegada) para que o novo revestimento preencha apenas a área original sem vazar para outros móveis.
8. **Estudos de Iluminação Isolados (`isolated-lighting-study-shadow-reset`):**
   - Permite testar *Golden Hour*, *Blue Hour* ou *Overcast Daylight* com instrução obrigatória para **apagar/neutralizar todas as sombras da imagem original**, permitindo que a nova luz dite 100% do sombreamento.
9. **Simulação de "Luz Central Única" (`single-central-bulb-simulation`):**
   - Cenário didático para apresentações luminotécnicas: apaga todas as luzes indiretas (sancas, fitas LED, arandelas e abajures) e mantém apenas uma lâmpada forte no centro do teto, demonstrando como texturas e profundidade desaparecem sem projeto de iluminação.
10. **Moodboard Físico Top-Down no Módulo PBR (`physical-topdown-moodboard-pbr`):**
    - Disponível tanto nos presets quanto como modo interativo em `ArchTextureSheetInteractive.vue`, organiza amostras físicas (*swatches*) com sobreposições naturais sobre bancada, **proibindo grids rígidos** e incluindo um **elemento botânico orgânico** (ramo/folha) para dar escala real.
11. **Inserção de Pessoas com "Motion Blur":**
    - Disponível em `foreground` e `extraCommands`, adiciona figura humana translúcida (**70% a 85% de opacidade**) com *motion blur* fotográfico de longa exposição para dar escala humana sem roubar o protagonismo da arquitetura.

### 9.3. Travas de Segurança na Fase 06 (`useArchPrompt.ts` + `extraCommands`)
12. **Preservação Total (100%):**
    - Ordena à IA que preserve 100% da arquitetura original, materiais e proporções, proibindo adicionar, remover ou redimensionar qualquer elemento.
13. **Proteção do Projeto de Iluminação Original:**
    - Proíbe a criação de fontes de luz inventadas, restringindo o ganho de fotorrealismo ao comportamento físico exato e à transição suave de sombras das luminárias já existentes no projeto.
14. **Negative Prompt Automático Contra Estética Digital (`ANTI_DIGITAL_AESTHETIC_SUFFIX`):**
    - Fixado automaticamente na Fase 06 (`Do not look like a 3D render, CGI, VFX, video game, or digital art.`) com botão de controle `✓ Trava Anti-CGI (Fase 06)` no rodapé do Prompt Compilado.

---

## 10. Estrutura de Arquivos no Repositório

```text
src/
├── App.vue                                          # Roteador principal (/ e /archstudio)
├── style.css                                        # Design System (Architectural Soft Neobrutalism)
├── views/
│   └── ArchPromptView.vue                           # View principal do ArchStudio
├── composables/
│   ├── useArchPrompt.ts                             # Motor de estado, chips, modos 7/12 e compilação de prompts
│   └── useArchCanvas.ts                             # Motor do Canvas, slots de imagem, chamadas de API e persistência JSON/Cookies
├── data/
│   ├── archprompt.ts                                # Os 9 contextos, conectores gramaticais, 6 fases, presets e chips
│   └── archDesignSystem.ts                          # Tokens de cor, projetos de referência e acervo curatorial
└── components/
    └── archprompt/
        ├── ArchPromptField.vue                      # Card individual de cada variável do construtor
        ├── ArchFloorPlanInteractive.vue             # Sistema interativo SVG de plantas baixas 2D→3D + Pino de Câmera
        ├── ArchTextureSheetInteractive.vue          # Construtor de fichas técnicas de materiais PBR
        ├── ArchCanvasModule.vue                     # Módulo de 3 slots de imagem + geração multimodal 2D/3D
        ├── ArchConfigModal.vue                      # Modal de chaves de API, modo de persistência e import/export .JSON
        ├── ArchReferenceGallery.vue                 # Aba de catálogo curatorial de referências arquitetônicas
        ├── ArchPromptGuideModal.vue                 # Drawer lateral com a documentação das 6 fases
        └── ArchIcon.vue                             # Biblioteca de ícones vetoriais arquitetônicos
```
