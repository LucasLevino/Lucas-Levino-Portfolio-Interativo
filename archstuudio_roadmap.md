### Melhorias no Módulo Canvas (`ArchCanvasModule.vue`) e Integrações Multimodais

* **[x] Implementar Botão "Analisar Referência" no Canvas:** Crie uma funcionalidade para a IA ler imagens de referência enviadas pelo cliente. O sistema deve decodificar os móveis, materiais, composição e iluminação para preencher automaticamente os blocos do seu prompt.


* **[x] Criar Ferramenta de "Engenharia Reversa de Estilo":** Desenvolva uma rotina onde o usuário faz o upload de seus próprios projetos antigos. A IA deve analisar a geometria, paleta de cores e escolhas de design para criar um perfil textual com os "pilares visuais" do autor, facilitando a geração de novas imagens.


* **[x] Adicionar "Testes em Lote" (Batch Testing):** Configure o módulo Canvas para disparar o mesmo prompt simultaneamente em múltiplos motores de IA (como Gemini e OpenAI). Isso permite comparar diferentes interpretações de luz e consistência lado a lado.



### Criação de Novos Presets e Contextos (`archprompt.ts`)

* **[x] Adicionar Presets de "Demolição Virtual" para Áreas Secas:** Crie comandos rápidos para limpar completamente salas e quartos a partir de fotos de levantamento. O prompt deve instruir a IA a remover todos os móveis e decorações, deixando as paredes brancas e o piso cinza.


* **[x] Adicionar Presets de "Demolição Virtual" para Áreas Molhadas:** Desenvolva um comando específico para limpar banheiros e cozinhas. O prompt deve remover toda a bancada, louças e marcenaria, substituindo-os por pequenos canos de PVC aparentes que simulam pontos de água e esgoto de uma obra bruta recém-finalizada.


* **[x] Configurar Workflow de "Virtual Staging":** Integre a imagem gerada na "Demolição Virtual" com o estilo extraído na "Engenharia Reversa". O prompt deve orientar a IA a mobiliar o ambiente vazio respeitando rigorosamente a perspectiva da foto original e as regras de estilo do arquiteto.


* **[x] Criar Funcionalidade de "Re-Skin Cirúrgico":** Adicione um preset que utilize o Slot 1 como trava geométrica ("Geometry Master") e o Slot 3 como fonte de textura ("Texture Source"). O comando deve incluir regras como a "Trava de Pegada" (Footprint Lock) para garantir que o novo material preencha a mesma área original sem vazar para outros móveis.


* **[x] Implementar "Estudos de Iluminação Isolados":** Insira opções textuais para alterar exclusivamente o clima da cena, como "Golden Hour" ou "Blue Hour". É obrigatório incluir a instrução para que a IA apague as sombras da imagem original, permitindo que a nova luz dite o sombreamento.


* **[x] Criar Simulação de "Luz Central Única":** Desenvolva um cenário para convencer o cliente sobre a importância do projeto luminotécnico. O prompt deve apagar as luzes indiretas e usar apenas uma forte lâmpada no meio do teto, mostrando como as texturas desaparecem e o ambiente perde a força.


* **[x] Criar Preset de "Moodboard Físico Top-Down" no Módulo PBR:** Programe um prompt para criar amostras físicas (swatches) de texturas organizadas de forma natural, com algumas sobreposições, sobre uma bancada. O comando deve proibir grids perfeitos e solicitar a inclusão de um elemento orgânico, como uma planta, para dar escala à imagem.


* **[x] Adicionar Inserção de Pessoas com "Motion Blur":** Crie um comando específico para adicionar uma figura humana de forma sutil à cena. O prompt deve exigir que a pessoa seja translúcida (70 a 85% de opacidade) e possua um desfoque de movimento, mantendo o realismo fotográfico sem roubar a atenção da arquitetura.



### Aprimoramento da Estrutura e Segurança (Fase 06 e `extraCommands`)

* **[x] Inserir Blocos de "Preservação Total":** No campo `extraCommands`, adicione uma trava de segurança ordenando à IA que preserve 100% da arquitetura original, materiais e proporções. A instrução deve proibir explicitamente a adição, remoção ou redimensionamento de qualquer elemento ao buscar o fotorrealismo.


* **[x] Proteger o Projeto de Iluminação Original:** Crie uma trava específica para impedir que a IA crie fontes de luz inventadas. O comando deve orientar a melhoria do fotorrealismo apenas através do comportamento preciso da luz e transição suave de sombras com base nas luzes já existentes no projeto.


* **[x] Fixar "Negative Prompts" Contra Estética Digital:** Adicione sufixos de segurança invisíveis na Fase 06 para proibir aspectos genéricos. A frase deve exigir que a imagem não se pareça com render 3D, CGI, VFX, videogame ou arte digital.
