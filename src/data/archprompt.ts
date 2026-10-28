export type PromptMode = 'quick' | 'advanced'

export type ArchContextId =
  | 'exterior'
  | 'interior'
  | 'interior-design'
  | 'lighting'
  | 'environment'
  | 'furniture'
  | 'furniture-3d'
  | 'floor-plan'

export type QuickFieldId =
  | 'style'
  | 'materials'
  | 'environment'
  | 'foreground'
  | 'lighting'
  | 'mood'
  | 'technical'

export type AdvancedFieldId =
  | 'archStyle'
  | 'buildingType'
  | 'location'
  | 'materials'
  | 'environment'
  | 'foreground'
  | 'lighting'
  | 'lightingDetail'
  | 'mood'
  | 'renderStyle'
  | 'aspectRatio'
  | 'extraCommands'

export type QuickPromptData = Record<QuickFieldId, string>
export type AdvancedPromptData = Record<AdvancedFieldId, string>

export interface PromptChip {
  label: string
  value: string
}

export interface PresetOption {
  value: string
  labelPt: string
}

export type FieldIconName =
  | 'home'
  | 'building'
  | 'compass'
  | 'box'
  | 'trees'
  | 'layers'
  | 'sun'
  | 'sparkles'
  | 'palette'
  | 'settings'
  | 'ratio'
  | 'sliders'

export type FieldAccent =
  | 'blue'
  | 'orange'
  | 'emerald'
  | 'cyan'
  | 'amber'
  | 'pink'
  | 'purple'
  | 'indigo'

export interface ArchFieldConfig<T extends string = string> {
  id: T
  phase: number
  phaseTitle: string
  label: string
  labelPt: string
  description: string
  guideTip: string
  icon: FieldIconName
  accent: FieldAccent
  placeholder: string
  singleSelectChip?: boolean
  joinWithAnd?: boolean
  options: PresetOption[]
  chips: PromptChip[]
}

export interface CuratedPreset {
  id: string
  contextId: ArchContextId
  name: string
  badge: string
  description: string
  quick: QuickPromptData
  advanced: AdvancedPromptData
}

export interface ContextSentenceConnectors {
  intro: string
  materialsBridge: string
  environmentBridge: string
  foregroundBridge: string
  lightingBridge: string
  moodBridge: string
  advIntro: string
  advLocationBridge: string
  advMaterialsBridge: string
  advEnvironmentBridge: string
  advForegroundBridge: string
  advLightingBridge: string
  advLightingDetailBridge: string
  advMoodBridge: string
}

export interface ArchContextConfig {
  id: ArchContextId
  label: string
  subtitle: string
  badge: string
  icon:
    | 'exterior'
    | 'interior'
    | 'interior-design'
    | 'lighting'
    | 'environment'
    | 'furniture'
    | 'furniture-3d'
    | 'floor-plan'
  connectors: ContextSentenceConnectors
  quickFields: ArchFieldConfig<QuickFieldId>[]
  advancedFields: ArchFieldConfig<AdvancedFieldId>[]
  presets: CuratedPreset[]
}

export interface GuidePhaseInfo {
  phase: number
  tag: string
  title: string
  originalText: string
  whatItDoes: string
  placement: string
  accent: FieldAccent
}

export const GUIDE_PHASES: GuidePhaseInfo[] = [
  {
    phase: 1,
    tag: 'MACRO · INÍCIO DO PROMPT',
    title: 'Fase 1: O Sujeito Principal e o Contexto',
    originalText:
      '"Render the architecture as a refined contemporary luxury residence in a natural forest hillside setting..."',
    whatItDoes:
      'Define a ação ("Render"), o sujeito principal (fachada, interior, luminotécnica, móvel 3D ou planta baixa) e o contexto espacial.',
    placement:
      'Sempre no início. Os modelos de geração de imagem dão maior peso semântico às primeiras palavras do prompt.',
    accent: 'blue'
  },
  {
    phase: 2,
    tag: 'MÉDIO · ESTRUTURA E TEXTURA',
    title: 'Fase 2: Materialidade e Acabamentos',
    originalText:
      '"...using warm off-white masonry, natural timber, large floor-to-ceiling glass, and dark metal frames."',
    whatItDoes:
      'Dá textura, cor e substância física ao sujeito principal (alvenaria, concreto, marcenaria, tecidos, pedras ou metais).',
    placement:
      'Logo após definir o sujeito principal, para que a IA aplique esses materiais diretamente à estrutura recém-criada.',
    accent: 'orange'
  },
  {
    phase: 3,
    tag: 'MICRO · ENTORNO OU LAYOUT',
    title: 'Fase 3: Paisagismo, Enquadramento ou Layout',
    originalText:
      '"Surround the house with mature pine trees, layered grasses, shrubs, and subtle planting."',
    whatItDoes:
      'No externo, define o paisagismo; no interno/design, define a arquitetura envolvente e distribuição; em móveis 3D, o fundo de estúdio.',
    placement:
      'Após a materialidade da construção, estabelecendo o contexto ambiental imediato.',
    accent: 'emerald'
  },
  {
    phase: 4,
    tag: 'PROFUNDIDADE · PRIMEIRO PLANO E DETALHES',
    title: 'Fase 4: Elementos de Composição (Foreground)',
    originalText:
      '"Add a calm natural pond in the foreground with realistic reflections, soft ripples, shoreline stones, and a small rustic wooden rowboat."',
    whatItDoes:
      'Cria sensação tridimensional de profundidade em camadas (frente, meio e fundo) ou destaca detalhes táteis em close-up.',
    placement:
      'Após o entorno geral, direcionando o olhar do observador desde o primeiro plano até o ponto focal.',
    accent: 'cyan'
  },
  {
    phase: 5,
    tag: 'ATMOSFERA · LUZ E CLIMA',
    title: 'Fase 5: Iluminação, Clima e Atmosfera',
    originalText:
      '"Use warm late-afternoon golden-hour light filtering through the trees, with soft cinematic shadows and subtle interior glow. Keep the scene peaceful, luxurious, natural, and architecture-focused."',
    whatItDoes:
      'A luz define o fotorrealismo. Temperatura de cor (2700K–6500K), golden-hour, sombras suaves e o "mood" orientam a paleta de cores.',
    placement:
      'Do meio para o fim. Depois que a IA "construiu" a cena física, você instrui como iluminá-la e qual emoção transmitir.',
    accent: 'amber'
  },
  {
    phase: 6,
    tag: 'COMANDOS FINAIS · QUALIDADE E SAÍDA',
    title: 'Fase 6: Parâmetros Técnicos e Estilo de Renderização',
    originalText:
      '"Ultra-realistic architectural visualization, soft global illumination, detailed vegetation, no text, 1:1."',
    whatItDoes:
      'Atuam como modificadores de qualidade (V-Ray, Corona, Unreal 5, 8K, PBR), restrições (no text) e proporção (1:1, 16:9, 4:5).',
    placement:
      'Sempre no final. Funcionam como instruções técnicas estritas de pós-processamento e formatação.',
    accent: 'purple'
  }
]

// ============================================================================
// 1. CONTEXTO: EXTERNO (FACHADA E IMPLANTAÇÃO)
// ============================================================================
const EXTERIOR_QUICK_FIELDS: ArchFieldConfig<QuickFieldId>[] = [
  {
    id: 'style',
    phase: 1,
    phaseTitle: 'Fase 1 · Macro',
    label: 'Style & Exterior Subject',
    labelPt: 'Estilo & Sujeito Arquitetônico',
    description: 'Defina o estilo arquitetônico, tipologia do edifício e o cenário de implantação.',
    guideTip: 'Combine estilo + tipo de prédio + cenário geográfico logo nas primeiras palavras.',
    icon: 'home',
    accent: 'blue',
    placeholder: 'Ex: refined contemporary luxury residence in a natural forest hillside setting',
    joinWithAnd: false,
    options: [
      { value: 'refined contemporary luxury residence in a natural forest hillside setting', labelPt: 'Residência contemporânea de luxo em encosta florestal (Referência do Guia)' },
      { value: 'brutalist concrete mansion perched on a dramatic coastal cliffside', labelPt: 'Mansão brutalista em concreto sobre penhasco costeiro' },
      { value: 'minimalist glass pavilion nestled in a serene Japanese zen garden', labelPt: 'Pavilhão minimalista de vidro em jardim zen japonês' },
      { value: 'sustainable eco-lodge integrated into a dense tropical rainforest canopy', labelPt: 'Eco-lodge sustentável integrado à floresta tropical' },
      { value: 'Nordic timber cabin in a snowy alpine mountain valley', labelPt: 'Cabana nórdica de madeira em vale alpino nevado' }
    ],
    chips: [
      { label: 'Luxo Contemporâneo', value: 'refined contemporary luxury residence' },
      { label: 'Mansão Brutalista', value: 'brutalist concrete mansion' },
      { label: 'Pavilhão Minimalista', value: 'minimalist glass pavilion' },
      { label: 'Eco-Lodge Sustentável', value: 'sustainable eco-lodge' },
      { label: 'Encosta Florestal', value: 'in a natural forest hillside setting' },
      { label: 'Penhasco no Deserto', value: 'in an arid desert cliff setting' },
      { label: 'Beira-mar Tropical', value: 'in a tropical beachfront setting' },
      { label: 'Montanha Nevada', value: 'in a snowy mountain setting' }
    ]
  },
  {
    id: 'materials',
    phase: 2,
    phaseTitle: 'Fase 2 · Médio',
    label: 'Facade Materials',
    labelPt: 'Materiais de Fachada',
    description: 'Revestimentos externos, estrutura, brises, vidro e esquadrias.',
    guideTip: 'Combine de 3 a 4 materiais contrastantes (ex: alvenaria off-white + madeira + vidro + metal escuro).',
    icon: 'box',
    accent: 'orange',
    placeholder: 'Ex: warm off-white masonry, natural timber, large floor-to-ceiling glass, and dark metal frames',
    joinWithAnd: true,
    options: [
      { value: 'warm off-white masonry, natural timber, large floor-to-ceiling glass, and dark metal frames', labelPt: 'Alvenaria off-white quente, madeira natural, vidro piso-teto e esquadrias escuras' },
      { value: 'exposed board-formed concrete, weathered corten steel, and expansive frameless glazing', labelPt: 'Concreto aparente ripado, aço corten e vidro sem caixilho' },
      { value: 'charred cedar Shou Sugi Ban, matte black aluminum, and double-height glass facades', labelPt: 'Madeira carbonizada Shou Sugi Ban, alumínio preto fosco e pé-direito duplo envidraçado' }
    ],
    chips: [
      { label: 'Alvenaria Off-White', value: 'warm off-white masonry' },
      { label: 'Madeira Natural', value: 'natural timber' },
      { label: 'Vidro Piso-Teto', value: 'large floor-to-ceiling glass' },
      { label: 'Esquadrias Escuras', value: 'dark metal frames' },
      { label: 'Concreto Aparente', value: 'exposed board-formed concrete' },
      { label: 'Aço Corten', value: 'corten steel' },
      { label: 'Brises de Madeira', value: 'vertical wooden louvers' },
      { label: 'Pedra Natural', value: 'local natural stone' }
    ]
  },
  {
    id: 'environment',
    phase: 3,
    phaseTitle: 'Fase 3 · Micro',
    label: 'Landscaping & Surroundings',
    labelPt: 'Paisagismo & Entorno',
    description: 'Vegetação, árvores, topografia e elementos que envolvem a edificação.',
    guideTip: 'Descreva a vegetação em camadas (árvores altas, arbustos médios e gramíneas sutis).',
    icon: 'trees',
    accent: 'emerald',
    placeholder: 'Ex: mature pine trees, layered grasses, shrubs, and subtle planting',
    joinWithAnd: true,
    options: [
      { value: 'mature pine trees, layered grasses, shrubs, and subtle planting', labelPt: 'Pinheiros maduros, gramíneas em camadas, arbustos e plantio sutil' },
      { value: 'dense tropical jungle, lush giant ferns, monsteras, and swaying palm trees', labelPt: 'Selva tropical densa, samambaias gigantes, costelas-de-adão e palmeiras' },
      { value: 'arid desert landscape, sculptural agave plants, saguaro cacti, and red rock formations', labelPt: 'Paisagem desértica, agaves esculturais, cactos e rochas avermelhadas' }
    ],
    chips: [
      { label: 'Pinheiros Maduros', value: 'mature pine trees' },
      { label: 'Gramíneas em Camadas', value: 'layered grasses' },
      { label: 'Arbustos & Plantio Sutil', value: 'shrubs and subtle planting' },
      { label: 'Vegetação Tropical', value: 'dense tropical foliage and palm trees' },
      { label: 'Cactos & Rochas', value: 'arid desert bushes and red rock formations' },
      { label: 'Pinheiros com Neve', value: 'snow-covered pine trees' }
    ]
  },
  {
    id: 'foreground',
    phase: 4,
    phaseTitle: 'Fase 4 · Profundidade',
    label: 'Foreground Composition',
    labelPt: 'Composição de Primeiro Plano',
    description: 'Elementos à frente da câmera para criar camadas e profundidade tridimensional.',
    guideTip: 'Água, reflexos, pisantes de pedra ou espelhos d’água em primeiro plano multiplicam o realismo.',
    icon: 'layers',
    accent: 'cyan',
    placeholder: 'Ex: calm natural pond in the foreground with realistic reflections, soft ripples, shoreline stones, and a small rustic wooden rowboat',
    joinWithAnd: true,
    options: [
      { value: 'calm natural pond in the foreground with realistic reflections, soft ripples, shoreline stones, and a small rustic wooden rowboat', labelPt: 'Lago natural calmo com reflexos realistas, pedras na margem e barco a remo rústico' },
      { value: 'sleek infinity pool in the foreground reflecting the architecture, with minimalist lounge chairs', labelPt: 'Piscina de borda infinita refletindo a arquitetura com espreguiçadeiras' },
      { value: 'wet dark asphalt street in the foreground with rain puddles reflecting warm architectural lights', labelPt: 'Asfalto molhado com poças refletindo as luzes quentes da fachada' }
    ],
    chips: [
      { label: 'Lago Natural com Reflexos', value: 'calm natural pond in the foreground with realistic reflections' },
      { label: 'Ondulações & Pedras', value: 'soft ripples and shoreline stones' },
      { label: 'Barco Rústico', value: 'a small rustic wooden rowboat' },
      { label: 'Piscina Borda Infinita', value: 'sleek infinity pool reflecting the sky' },
      { label: 'Caminho de Pedras', value: 'stepping stone pathway through low grasses' },
      { label: 'Asfalto Molhado', value: 'wet asphalt with mirror reflections' }
    ]
  },
  {
    id: 'lighting',
    phase: 5,
    phaseTitle: 'Fase 5A · Iluminação',
    label: 'Exterior Lighting',
    labelPt: 'Luz Natural & Brilho Interno',
    description: 'Horário solar, sombras projetadas e iluminação interna visível através dos vidros.',
    guideTip: 'Combine luz externa (golden-hour / blue-hour) com "subtle interior glow".',
    icon: 'sun',
    accent: 'amber',
    placeholder: 'Ex: warm late-afternoon golden-hour light filtering through the trees, with soft cinematic shadows and subtle interior glow',
    joinWithAnd: true,
    options: [
      { value: 'warm late-afternoon golden-hour light filtering through the trees, with soft cinematic shadows and subtle interior glow', labelPt: 'Luz dourada de fim de tarde filtrada pelas árvores, sombras suaves e brilho interno' },
      { value: 'moody overcast morning sky with soft diffused ambient lighting and warm inviting interior lights', labelPt: 'Manhã nublada dramática com luz difusa e interior aquecido' },
      { value: 'deep twilight blue-hour illumination with glowing warm architectural LED strips', labelPt: 'Hora azul do crepúsculo com fitas de LED arquitetônicas quentes' }
    ],
    chips: [
      { label: 'Golden Hour Filtrada', value: 'warm late-afternoon golden-hour light filtering through the trees' },
      { label: 'Sombras Cinematográficas', value: 'soft cinematic shadows' },
      { label: 'Brilho Interno Sutil', value: 'subtle interior glow' },
      { label: 'Blue Hour (Crepúsculo)', value: 'deep blue-hour twilight lighting' },
      { label: 'Manhã Nublada Difusa', value: 'moody overcast sky with soft diffused lighting' },
      { label: 'Sol de Meio-Dia Nítido', value: 'bright midday sun with sharp architectural shadows' }
    ]
  },
  {
    id: 'mood',
    phase: 5,
    phaseTitle: 'Fase 5B · Atmosfera',
    label: 'Scene Mood',
    labelPt: 'Atmosfera & Clima',
    description: 'Adjetivos que orientam a paleta de cores e o sentimento da visualização.',
    guideTip: 'Use de 3 a 4 adjetivos coesos, incluindo "architecture-focused".',
    icon: 'palette',
    accent: 'pink',
    placeholder: 'Ex: peaceful, luxurious, natural, and architecture-focused',
    joinWithAnd: true,
    options: [
      { value: 'peaceful, luxurious, natural, and architecture-focused', labelPt: 'Pacífica, luxuosa, natural e focada na arquitetura' },
      { value: 'dramatic, moody, striking, and cinematic', labelPt: 'Dramática, intimista, impactante e cinematográfica' },
      { value: 'serene, meditative, minimalist, and timeless', labelPt: 'Serena, meditativa, minimalista e atemporal' }
    ],
    chips: [
      { label: 'Pacífica', value: 'peaceful' },
      { label: 'Luxuosa', value: 'luxurious' },
      { label: 'Natural', value: 'natural' },
      { label: 'Focada na Arquitetura', value: 'architecture-focused' },
      { label: 'Dramática & Cinematográfica', value: 'dramatic and cinematic' },
      { label: 'Serena & Minimalista', value: 'serene and minimalist' }
    ]
  },
  {
    id: 'technical',
    phase: 6,
    phaseTitle: 'Fase 6 · Técnico',
    label: 'Technical & Render',
    labelPt: 'Parâmetros Técnicos & Proporção',
    description: 'Motor de renderização, lente, prompt negativo e aspect ratio.',
    guideTip: 'Finalize com qualificadores de fotorrealismo, "no text" e a proporção (1:1, 16:9).',
    icon: 'settings',
    accent: 'purple',
    placeholder: 'Ex: Ultra-realistic architectural visualization, soft global illumination, detailed vegetation, no text, 1:1',
    joinWithAnd: false,
    options: [
      { value: 'Ultra-realistic architectural visualization, soft global illumination, detailed vegetation, no text, 1:1', labelPt: 'Visualização arquitetônica ultra-realista, iluminação global suave, vegetação detalhada, sem texto, 1:1' },
      { value: 'Unreal Engine 5 render, path tracing, photorealistic architectural photography, 8k resolution, no text, 16:9', labelPt: 'Render Unreal Engine 5, path tracing, fotografia arquitetônica 8K, sem texto, 16:9' },
      { value: 'V-Ray and Corona Renderer masterpiece, ArchDaily editorial photography, 24mm tilt-shift lens, no text, 4:5', labelPt: 'V-Ray & Corona Renderer, fotografia editorial ArchDaily, lente 24mm tilt-shift, 4:5' }
    ],
    chips: [
      { label: 'Ultra-realistic ArchViz', value: 'Ultra-realistic architectural visualization' },
      { label: 'Soft Global Illumination', value: 'soft global illumination' },
      { label: 'Detailed Vegetation', value: 'detailed vegetation' },
      { label: '8K Photorealistic', value: '8k resolution, photorealistic' },
      { label: 'V-Ray / Corona Render', value: 'V-Ray and Corona Renderer' },
      { label: 'Lente 24mm Tilt-Shift', value: '24mm tilt-shift lens' },
      { label: 'Sem Texto (no text)', value: 'no text' },
      { label: '1:1', value: '1:1' },
      { label: '16:9', value: '16:9' },
      { label: '4:5', value: '4:5' }
    ]
  }
]

// ============================================================================
// 2. CONTEXTO: INTERNO (ARQUITETURA DE INTERIORES & ESPAÇO)
// ============================================================================
const INTERIOR_QUICK_FIELDS: ArchFieldConfig<QuickFieldId>[] = [
  {
    id: 'style',
    phase: 1,
    phaseTitle: 'Fase 1 · Espaço Interno',
    label: 'Interior Space & Style',
    labelPt: 'Ambiente Interno & Estilo Arquitetônico',
    description: 'Defina qual é o cômodo/espaço interno, a volumetria (ex: pé-direito duplo) e o estilo.',
    guideTip: 'Especifique o tipo de espaço interno e sua escala (ex: double-height living room, minimalist kitchen).',
    icon: 'home',
    accent: 'blue',
    placeholder: 'Ex: double-height contemporary luxury living room with panoramic forest views',
    joinWithAnd: false,
    options: [
      { value: 'double-height contemporary luxury living room with panoramic forest views', labelPt: 'Living contemporâneo de luxo com pé-direito duplo e vista panorâmica para a floresta' },
      { value: 'minimalist warm Japandi master bedroom suite with private zen courtyard view', labelPt: 'Suíte master Japandi minimalista aconchegante com vista para pátio zen' },
      { value: 'architectural monolithic concrete and oak kitchen with an oversized sculptural island', labelPt: 'Cozinha arquitetônica em concreto monolítico e carvalho com ilha escultural' },
      { value: 'serene spa-inspired bathroom carved in natural travertine stone with a sunken tub', labelPt: 'Banheiro estilo spa esculpido em travertino natural com banheira rebaixada' }
    ],
    chips: [
      { label: 'Living Pé-Direito Duplo', value: 'double-height contemporary living room' },
      { label: 'Cozinha Gourmet Integrada', value: 'open-concept architectural kitchen and dining space' },
      { label: 'Suíte Master Minimalista', value: 'minimalist luxury master bedroom suite' },
      { label: 'Banheiro Spa', value: 'spa-like architectural bathroom' },
      { label: 'Loft Brutalista', value: 'raw brutalist industrial loft interior' },
      { label: 'Estilo Japandi', value: 'in a warm Japandi style' },
      { label: 'Vista Panorâmica', value: 'with floor-to-ceiling panoramic views' }
    ]
  },
  {
    id: 'materials',
    phase: 2,
    phaseTitle: 'Fase 2 · Revestimentos',
    label: 'Interior Surfaces & Finishes',
    labelPt: 'Pisos, Paredes & Forros',
    description: 'Revestimentos arquitetônicos do espaço: piso, painéis de parede, forro e caixilharia.',
    guideTip: 'Mencione o material do piso, das paredes e do teto para evitar superfícies genéricas.',
    icon: 'box',
    accent: 'orange',
    placeholder: 'Ex: wide-plank brushed European oak flooring, microcement walls, acoustic slatted timber ceiling, and slim black steel window frames',
    joinWithAnd: true,
    options: [
      { value: 'wide-plank brushed European oak flooring, warm limewash walls, slatted timber ceiling, and slim dark bronze window frames', labelPt: 'Piso de carvalho europeu escovado, paredes em pintura cal (limewash), forro ripado e caixilhos em bronze' },
      { value: 'seamless polished microcement floors, raw board-formed concrete walls, and honed travertine stone slabs', labelPt: 'Piso contínuo de microcimento, paredes de concreto aparente ripado e placas de travertino bruto' },
      { value: 'large-format terrazzo tiles, fluted walnut wood wall panels, and concealed shadow-gap baseboards', labelPt: 'Porcelanato granilite grande formato, painéis de nogueira canelada e rodapés invertidos' }
    ],
    chips: [
      { label: 'Piso Carvalho Europeu', value: 'wide-plank European oak flooring' },
      { label: 'Piso Microcimento', value: 'seamless microcement flooring' },
      { label: 'Paredes Limewash (Cal)', value: 'textured warm limewash walls' },
      { label: 'Forro Ripado de Madeira', value: 'slatted natural timber ceiling' },
      { label: 'Mármore Travertino Bruto', value: 'honed travertine stone walls' },
      { label: 'Concreto Aparente Interno', value: 'exposed architectural concrete walls' },
      { label: 'Painel de Nogueira', value: 'fluted walnut wood paneling' }
    ]
  },
  {
    id: 'environment',
    phase: 3,
    phaseTitle: 'Fase 3 · Enquadramento Espacial',
    label: 'Architectural Elements & Views',
    labelPt: 'Elementos Arquitetônicos & Aberturas',
    description: 'Escadas esculturais, lareiras, claraboias, brises internos e o que se vê através das janelas.',
    guideTip: 'Descreva elementos fixos da arquitetura interna (escadas, lareiras, claraboias, jardins internos).',
    icon: 'building',
    accent: 'emerald',
    placeholder: 'Ex: floor-to-ceiling sliding glass doors opening to a misty pine forest, a floating concrete staircase, and a suspended black steel fireplace',
    joinWithAnd: true,
    options: [
      { value: 'expansive floor-to-ceiling glass walls framing a lush private garden, a floating sculptural staircase, and a minimalist hearth', labelPt: 'Paredes de vidro piso-teto enquadrando jardim privado, escada escultural flutuante e lareira minimalista' },
      { value: 'overhead architectural skylights casting geometric light beams, indoor olive tree courtyard, and bespoke recessed shelving', labelPt: 'Claraboias zenitais projetando feixes geométricos, pátio interno com oliveira e nichos embutidos' }
    ],
    chips: [
      { label: 'Esquadrias Piso-Teto', value: 'expansive floor-to-ceiling glass walls' },
      { label: 'Escada Flutuante Escultural', value: 'a floating sculptural staircase' },
      { label: 'Claraboia Zenital (Skylight)', value: 'overhead architectural skylights' },
      { label: 'Lareira Suspensa', value: 'a suspended black steel fireplace' },
      { label: 'Jardim de Inverno Interno', value: 'an indoor glass-enclosed zen atrium' },
      { label: 'Estante Arquitetônica', value: 'floor-to-ceiling built-in millwork shelving' }
    ]
  },
  {
    id: 'foreground',
    phase: 4,
    phaseTitle: 'Fase 4 · Primeiro Plano Interno',
    label: 'Foreground Anchor',
    labelPt: 'Composição Frontal do Ambiente',
    description: 'Mobiliário principal ou superfície em primeiro plano que dá escala e profundidade à câmera.',
    guideTip: 'Posicione uma mesa baixa, sofá em linho ou bancada em primeiro plano para ancorar a lente.',
    icon: 'layers',
    accent: 'cyan',
    placeholder: 'Ex: a low-profile modularbouclé sofa, a monolithic travertine coffee table, and a hand-knotted wool rug in the foreground',
    joinWithAnd: true,
    options: [
      { value: 'a low-profile modular bouclé sofa, a monolithic travertine coffee table, and a textured wool rug in the foreground', labelPt: 'Sofá modular baixo em bouclé, mesa de centro monolítica em travertino e tapete de lã no primeiro plano' },
      { value: 'a sculptural monolithic stone kitchen island with minimalist barstools and handmade ceramic vessels in the foreground', labelPt: 'Ilha de cozinha monolítica em pedra com banquetas minimalistas e cerâmicas artesanais em primeiro plano' }
    ],
    chips: [
      { label: 'Sofá Modular em Bouclé', value: 'a low-profile modular bouclé sofa' },
      { label: 'Mesa de Centro em Travertino', value: 'a monolithic travertine coffee table' },
      { label: 'Tapete de Lã Natural', value: 'a textured hand-woven wool rug' },
      { label: 'Ilha Monolítica em Pedra', value: 'a sculptural monolithic stone island' },
      { label: 'Poltrona Assinada em Couro', value: 'an iconic cognac leather lounge chair' }
    ]
  },
  {
    id: 'lighting',
    phase: 5,
    phaseTitle: 'Fase 5A · Luz no Interior',
    label: 'Natural & Artificial Light',
    labelPt: 'Luz Natural & Iluminação Indireta',
    description: 'Entrada de sol lateral/zenital combinada com iluminação arquitetônica embutida.',
    guideTip: 'Especifique como a luz do sol entra pelas janelas e interage com sancas e spots 2700K.',
    icon: 'sun',
    accent: 'amber',
    placeholder: 'Ex: soft late-afternoon sunlight streaming through sheer curtains with long shadows and warm 2700K recessed cove lighting',
    joinWithAnd: true,
    options: [
      { value: 'soft late-afternoon golden sunlight streaming through floor-to-ceiling windows, casting long shadows across the floor, paired with warm 2700K recessed LED cove lighting', labelPt: 'Sol dourado de fim de tarde entrando pelas janelas com sombras longas e iluminação indireta 2700K' },
      { value: 'diffused overcast daylight from overhead skylights balanced with warm architectural wall washers and subtle cabinet backlighting', labelPt: 'Luz natural difusa zenital equilibrada com wall washers quentes e iluminação embutida na marcenaria' }
    ],
    chips: [
      { label: 'Sol Lateral pelas Janelas', value: 'warm sunlight streaming through the windows' },
      { label: 'Cortinas de Linho Translúcidas', value: 'filtered through sheer linen curtains' },
      { label: 'Sancas de LED 2700K', value: 'warm 2700K recessed LED cove lighting' },
      { label: 'Luz Zenital Difusa', value: 'soft diffused zenithal skylight illumination' },
      { label: 'Sombras Suaves no Piso', value: 'soft dappled shadows across the floor' }
    ]
  },
  EXTERIOR_QUICK_FIELDS[5],
  {
    ...EXTERIOR_QUICK_FIELDS[6],
    placeholder: 'Ex: Ultra-realistic interior architectural visualization, Corona Renderer, soft global illumination, 35mm architectural lens, no text, 4:5',
    options: [
      { value: 'Ultra-realistic interior architectural visualization, Corona Renderer, soft global illumination, 35mm lens, eye-level view, no text, 4:5', labelPt: 'Visualização interna ultra-realista, Corona Renderer, GI suave, lente 35mm, nível do olhar, 4:5' },
      { value: 'V-Ray photorealistic interior photography, Architectural Digest editorial style, natural color grading, 8k resolution, no text, 16:9', labelPt: 'Fotografia de interiores fotorrealista V-Ray, estilo editorial Architectural Digest, 8K, 16:9' }
    ],
    chips: [
      { label: 'Interior ArchViz Ultra-Realista', value: 'Ultra-realistic interior architectural visualization' },
      { label: 'Corona Renderer / V-Ray', value: 'Corona Renderer and V-Ray' },
      { label: 'Lente 35mm (Olhar Humano)', value: '35mm architectural lens, eye-level perspective' },
      { label: 'Estilo Architectural Digest', value: 'Architectural Digest editorial photography' },
      { label: 'Soft Global Illumination', value: 'soft global illumination' },
      { label: 'Sem Texto (no text)', value: 'no text' },
      { label: '4:5', value: '4:5' },
      { label: '16:9', value: '16:9' },
      { label: '1:1', value: '1:1' }
    ]
  }
]

// ============================================================================
// 3. CONTEXTO: DESIGN DE INTERIORES (DECORAÇÃO, CURADORIA & STYLING)
// ============================================================================
const INTERIOR_DESIGN_QUICK_FIELDS: ArchFieldConfig<QuickFieldId>[] = [
  {
    id: 'style',
    phase: 1,
    phaseTitle: 'Fase 1 · Conceito & Curadoria',
    label: 'Interior Design Concept',
    labelPt: 'Conceito & Estilo de Decoração',
    description: 'Linguagem estética do design de interiores, época, assinatura e atmosfera.',
    guideTip: 'Combine o estilo decorativo (ex: Mid-Century Modern, Quiet Luxury, Wabi-Sabi) com o ambiente.',
    icon: 'palette',
    accent: 'blue',
    placeholder: 'Ex: quiet luxury contemporary living salon curated with Brazilian modernist design pieces',
    joinWithAnd: false,
    options: [
      { value: 'quiet luxury contemporary living salon curated with iconic Brazilian modernist design pieces', labelPt: 'Living Quiet Luxury contemporâneo curado com peças icônicas do modernismo brasileiro' },
      { value: 'warm Wabi-Sabi and Japandi dining room with organic tactile forms and artisanal decor', labelPt: 'Sala de jantar Wabi-Sabi e Japandi com formas orgânicas táteis e decoração artesanal' },
      { value: 'Parisian Haussmannian apartment lounge blending classic moldings with avant-garde contemporary furniture', labelPt: 'Living parisiense Haussmanniano mesclando boiseries clássicas com mobiliário contemporâneo de vanguarda' }
    ],
    chips: [
      { label: 'Quiet Luxury Contemporâneo', value: 'quiet luxury contemporary interior design' },
      { label: 'Modernismo Brasileiro', value: 'curated Brazilian modernist design' },
      { label: 'Wabi-Sabi & Japandi', value: 'organic Wabi-Sabi Japandi interior' },
      { label: 'Mid-Century Modern', value: 'refined Mid-Century Modern interior' },
      { label: 'Clássico Contemporâneo (Boiserie)', value: 'contemporary classic interior with wall moldings' },
      { label: 'Minimalismo Quente', value: 'warm tactile minimalist interior' }
    ]
  },
  {
    id: 'materials',
    phase: 2,
    phaseTitle: 'Fase 2 · Paleta Tátil & Tecidos',
    label: 'Textiles, Woods & Stones',
    labelPt: 'Tecidos, Madeiras & Pedras Naturais',
    description: 'Estofados, tramas, tapetes, madeiras nobres, mármores e metais da decoração.',
    guideTip: 'Texturas ricas (bouclé, linho cru, couro conhaque, palhinha, travertino) dão realismo imediato.',
    icon: 'box',
    accent: 'orange',
    placeholder: 'Ex: ivory bouclé upholstery, raw Belgian linen drapery, solid Freijó wood, saddle leather, and brushed aged brass',
    joinWithAnd: true,
    options: [
      { value: 'ivory bouclé upholstery, raw Belgian linen drapery, solid Freijó wood, cognac saddle leather, and brushed aged brass', labelPt: 'Estofado em bouclé marfim, cortinas de linho belga cru, madeira Freijó, couro conhaque e latão escovado' },
      { value: ' emerald green velvet, honed Calacatta Viola marble, smoked oak, and blackened bronze accents', labelPt: 'Veludo verde-esmeralda, mármore Calacatta Viola fosco, carvalho defumado e bronze enegrecido' }
    ],
    chips: [
      { label: 'Tecido Bouclé Marfim', value: 'ivory bouclé upholstery' },
      { label: 'Cortinas de Linho Cru', value: 'flowing raw Belgian linen drapery' },
      { label: 'Madeira Freijó / Cumaru', value: 'warm solid Freijó timber' },
      { label: 'Couro Natural Conhaque', value: 'aged cognac saddle leather' },
      { label: 'Palhinha Natural (Cane)', value: 'woven natural cane webbing' },
      { label: 'Mármore Calacatta Viola', value: 'honed Calacatta Viola marble' },
      { label: 'Latão Escovado', value: 'brushed aged brass accents' }
    ]
  },
  {
    id: 'environment',
    phase: 3,
    phaseTitle: 'Fase 3 · Layout & Mobiliário',
    label: 'Furniture Layout & Millwork',
    labelPt: 'Arranjo de Mobiliário & Marcenaria',
    description: 'Distribuição dos móveis, estantes, obras de arte e integração das peças no espaço.',
    guideTip: 'Descreva como as peças conversam entre si (sofá curvo, poltronas, estante, quadros).',
    icon: 'layers',
    accent: 'emerald',
    placeholder: 'Ex: a curved sculptural sofa paired with a Sergio Rodrigues Mole armchair, custom floor-to-ceiling oak bookcase, and large-scale abstract canvas art',
    joinWithAnd: true,
    options: [
      { value: 'a curved sculptural sofa paired with iconic modernist lounge chairs, bespoke floor-to-ceiling oak shelving, and large-scale abstract textured canvas art', labelPt: 'Sofá curvo escultural com poltronas modernistas, estante piso-teto em carvalho e tela abstrata em grande escala' },
      { value: 'an organic solid-wood dining table surrounded by wishbone chairs, a minimalist credenza, and sculptural plaster wall reliefs', labelPt: 'Mesa de jantar orgânica em madeira maciça com cadeiras wishbone, aparador minimalista e relevo escultural' }
    ],
    chips: [
      { label: 'Sofá Curvo Escultural', value: 'a curved sculptural sofa' },
      { label: 'Poltrona Assinada (Design)', value: 'iconic designer lounge armchairs' },
      { label: 'Estante em Marcenaria', value: 'bespoke floor-to-ceiling timber shelving' },
      { label: 'Arte Abstrata Grande Formato', value: 'large-scale textured abstract canvas art' },
      { label: 'Tapete Orgânico Sob Medida', value: 'an oversized hand-tufted wool area rug' }
    ]
  },
  {
    id: 'foreground',
    phase: 4,
    phaseTitle: 'Fase 4 · Styling & Objetos',
    label: 'Editorial Styling & Vignette',
    labelPt: 'Produção de Objetos (Styling)',
    description: 'Livros de arte, vasos cerâmicos, arranjos botânicos e objetos em primeiro plano.',
    guideTip: 'O styling editorial (coffee table books, cerâmica artesanal, ramos secos) assina a cena.',
    icon: 'sparkles',
    accent: 'cyan',
    placeholder: 'Ex: curated architecture art books, handmade stoneware ceramics, and a minimalist ikebana floral branch on the foreground table',
    joinWithAnd: true,
    options: [
      { value: 'curated hardcover art books, handmade matte stoneware ceramics, and a sculptural ikebana branch on the coffee table in the foreground', labelPt: 'Livros de arte de capa dura, cerâmicas artesanais foscas e ramo ikebana escultural na mesa de centro' },
      { value: 'artisan blown-glass vases, a travertine tray, and subtle linen table runners in the foreground', labelPt: 'Vasos de vidro soprado artesanal, bandeja de travertino e caminho de mesa em linho' }
    ],
    chips: [
      { label: 'Livros de Arte (Coffee Table Books)', value: 'curated hardcover architecture books' },
      { label: 'Cerâmica Artesanal', value: 'handmade matte stoneware ceramic vessels' },
      { label: 'Arranjo Ikebana / Botânico', value: 'a minimalist sculptural botanical branch' },
      { label: 'Bandeja em Pedra Natural', value: 'a carved travertine decorative tray' },
      { label: 'Vaso em Vidro Soprado', value: 'amber blown-glass sculptural vase' }
    ]
  },
  {
    id: 'lighting',
    phase: 5,
    phaseTitle: 'Fase 5A · Luz Decorativa',
    label: 'Decorative & Ambient Lighting',
    labelPt: 'Luminárias & Luz Difusa',
    description: 'Pendentes assinados, abajures, arandelas e luz natural filtrada.',
    guideTip: 'Combine luz natural suave com luminárias decorativas acesas (pendentes, arandelas, abajures).',
    icon: 'sun',
    accent: 'amber',
    placeholder: 'Ex: soft filtered daylight through linen curtains, complemented by a sculptural alabaster pendant lamp and warm floor lamp glow',
    joinWithAnd: true,
    options: [
      { value: 'soft filtered afternoon daylight through sheer linen curtains, complemented by a glowing sculptural alabaster pendant and warm table lamps', labelPt: 'Luz de tarde filtrada por cortinas de linho, somada a pendente escultural de alabastro e abajures quentes' }
    ],
    chips: [
      { label: 'Luz Filtrada por Linho', value: 'soft daylight filtered through sheer linen curtains' },
      { label: 'Pendente em Alabastro', value: 'a glowing sculptural alabaster pendant lamp' },
      { label: 'Luminária de Piso Quente', value: 'a minimalist warm designer floor lamp' },
      { label: 'Arandelas Indiretas', value: 'warm indirect architectural wall sconces' }
    ]
  },
  {
    ...EXTERIOR_QUICK_FIELDS[5],
    placeholder: 'Ex: warm, curated, sophisticated, tactile, and editorial',
    chips: [
      { label: 'Sofisticada & Editorial', value: 'sophisticated and editorial' },
      { label: 'Acolhedora & Tátil', value: 'warm, inviting, and tactile' },
      { label: 'Curada & Atemporal', value: 'curated and timeless' },
      { label: 'Serena & Orgânica', value: 'serene and organic' }
    ]
  },
  INTERIOR_QUICK_FIELDS[6]
]

// ============================================================================
// 4. CONTEXTO: LUZES (PROJETO LUMINOTÉCNICO)
// ============================================================================
const LIGHTING_QUICK_FIELDS: ArchFieldConfig<QuickFieldId>[] = [
  {
    id: 'style',
    phase: 1,
    phaseTitle: 'Fase 1 · Espaço & Conceito Luminotécnico',
    label: 'Architectural Space & Lighting Concept',
    labelPt: 'Espaço & Conceito de Iluminação',
    description: 'Defina o espaço arquitetônico e o partido luminotécnico principal.',
    guideTip: 'Especifique se é um estudo noturno/crepúsculo focado em iluminação artificial ou luz natural dramática.',
    icon: 'sun',
    accent: 'amber',
    placeholder: 'Ex: contemporary architectural living gallery showcasing a layered museum-grade lighting design at twilight',
    joinWithAnd: false,
    options: [
      { value: 'contemporary architectural living gallery showcasing a layered museum-grade lighting design at twilight', labelPt: 'Living galeria contemporâneo exibindo projeto luminotécnico em camadas no crepúsculo' },
      { value: 'minimalist luxury residence facade and garden showcasing nocturnal architectural landscape lighting', labelPt: 'Fachada e jardim de residência minimalista destacando iluminação noturna arquitetônica e paisagística' }
    ],
    chips: [
      { label: 'Projeto Luminotécnico Residencial', value: 'contemporary luxury interior with layered architectural lighting design' },
      { label: 'Iluminação Noturna de Fachada', value: 'nocturnal architectural facade and landscape lighting study' },
      { label: 'Iluminação de Galeria / Museu', value: 'museum-grade gallery architectural lighting scheme' },
      { label: 'Luminotécnica de Restaurante/Hotel', value: 'hospitality boutique lounge dramatic lighting design' }
    ]
  },
  {
    id: 'materials',
    phase: 2,
    phaseTitle: 'Fase 2 · Superfícies Refletoras',
    label: 'Light-Interacting Surfaces',
    labelPt: 'Superfícies que Interagem com a Luz',
    description: 'Texturas que recebem luz rasante (grazing light): pedra bruta, ripados, concreto, metais.',
    guideTip: 'Luz rasante só aparece se houver relevo tátil (pedra clivada, madeira canelada, concreto ripado).',
    icon: 'box',
    accent: 'orange',
    placeholder: 'Ex: split-face natural stone walls, fluted dark walnut panels, honed travertine, and brushed bronze',
    joinWithAnd: true,
    options: [
      { value: 'split-face natural stone walls, fluted dark walnut panels, honed travertine floors, and brushed bronze details', labelPt: 'Parede de pedra bruta clivada, painéis de nogueira canelada, piso de travertino fosco e bronze escovado' }
    ],
    chips: [
      { label: 'Pedra Bruta (Luz Rasante)', value: 'split-face textured stone walls' },
      { label: 'Painel Ripado / Canelado', value: 'fluted timber wall panels' },
      { label: 'Concreto Aparente Texturizado', value: 'board-formed textured concrete' },
      { label: 'Mármore Fosco (Honed)', value: 'honed matte marble surfaces' },
      { label: 'Metal Escovado Anodizado', value: 'anodized brushed bronze' }
    ]
  },
  {
    id: 'environment',
    phase: 3,
    phaseTitle: 'Fase 3 · Circuitos & Luminárias',
    label: 'Luminaires & Circuits',
    labelPt: 'Perfis de LED, Spots & Sancas',
    description: 'Sistemas técnicos de iluminação: perfis lineares, no-frame, trilhos magnéticos, wall-washers.',
    guideTip: 'Use termos técnicos como "recessed linear LED profiles", "wall grazing", "pin-spotlights".',
    icon: 'sliders',
    accent: 'emerald',
    placeholder: 'Ex: recessed trimless anti-glare spotlights, indirect ceiling cove LED strips, wall-grazing uplights, and magnetic track lights',
    joinWithAnd: true,
    options: [
      { value: 'recessed trimless anti-glare pin-spotlights, indirect ceiling cove LED strips, wall-grazing uplights, and magnetic low-voltage track lighting', labelPt: 'Spots embutidos no-frame antiofuscantes, sancas de LED indiretas, uplights rasantes e trilho magnético' }
    ],
    chips: [
      { label: 'Spots No-Frame Antiofuscantes', value: 'recessed trimless anti-glare spotlights' },
      { label: 'Perfis Lineares de LED Embutidos', value: 'recessed linear LED light profiles' },
      { label: 'Sanca de Luz Indireta (Cove)', value: 'indirect ceiling cove lighting' },
      { label: 'Wall Grazing (Luz Rasante)', value: 'grazing wall-washer LED strips' },
      { label: 'Trilho Magnético Minimalista', value: 'ultra-slim magnetic track lighting' },
      { label: 'Balizadores de Piso/Degrau', value: 'recessed step and floor marker lights' }
    ]
  },
  {
    id: 'foreground',
    phase: 4,
    phaseTitle: 'Fase 4 · Destaque Focal (Accent)',
    label: 'Focal Accent Lighting',
    labelPt: 'Iluminação de Destaque (Ponto Focal)',
    description: 'Peça, escultura, bancada ou vegetação iluminada em primeiro plano.',
    guideTip: 'Defina onde o feixe de luz foca em primeiro plano para criar hierarquia visual.',
    icon: 'sparkles',
    accent: 'cyan',
    placeholder: 'Ex: a dramatic 15-degree narrow beam spotlight illuminating a sculptural stone table and artwork in the foreground',
    joinWithAnd: true,
    options: [
      { value: 'a narrow-beam accent spotlight illuminating a monolithic stone island and suspended glass pendant in the foreground', labelPt: 'Feixe fechado de spot destacando ilha monolítica de pedra e pendente de vidro em primeiro plano' }
    ],
    chips: [
      { label: 'Feixe Focado em Obra/Mesa', value: 'narrow-beam accent spotlight on a sculptural table' },
      { label: 'Fita de LED sob Marcenaria', value: 'warm under-cabinet floating millwork LED glow' },
      { label: 'Pendente Escultural Iluminado', value: 'a glowing sculptural designer pendant light' },
      { label: 'Uplight em Árvore/Vegetação', value: 'warm landscape uplighting on architectural foliage' }
    ]
  },
  {
    id: 'lighting',
    phase: 5,
    phaseTitle: 'Fase 5A · Temperatura de Cor & Contraste',
    label: 'Color Temperature (Kelvin) & Contrast',
    labelPt: 'Temperatura de Cor (Kelvin) & Contraste',
    description: 'Equilíbrio entre temperatura de cor quente (2400K–3000K) e luz ambiente externa.',
    guideTip: 'O contraste entre o azul do crepúsculo externo (blue-hour) e o âmbar interno (2700K) é clássico em ArchViz.',
    icon: 'sun',
    accent: 'amber',
    placeholder: 'Ex: warm 2700K CRI-95 artificial illumination contrasting against deep twilight blue-hour ambient sky',
    joinWithAnd: true,
    options: [
      { value: 'warm 2700K CRI-95 artificial illumination with soft falloff gradients contrasting against deep twilight blue-hour sky', labelPt: 'Iluminação artificial quente 2700K IRC-95 com degradê suave contrastando com o céu azul do crepúsculo' }
    ],
    chips: [
      { label: '2700K Quente Aconchegante', value: 'warm 2700K architectural light temperature' },
      { label: '2400K Âmbar Intimista', value: 'ultra-warm 2400K dimmable amber glow' },
      { label: '3000K Branco Quente Neutro', value: 'clean 3000K warm-white illumination' },
      { label: 'Contraste Blue Hour + 2700K', value: 'contrasting deep blue-hour twilight with warm 2700K interior light' },
      { label: 'Degradê Suave (Soft Light Falloff)', value: 'realistic IES light distribution profiles and soft shadow falloff' }
    ]
  },
  EXTERIOR_QUICK_FIELDS[5],
  {
    ...EXTERIOR_QUICK_FIELDS[6],
    placeholder: 'Ex: Physically based IES photometric lighting render, Corona Renderer, realistic light bloom, soft global illumination, no text, 16:9',
    chips: [
      { label: 'Perfis Fotométricos IES Reais', value: 'physically accurate IES photometric lighting profiles' },
      { label: 'Corona Renderer / Ray Tracing', value: 'Corona Renderer, full path-traced global illumination' },
      { label: 'Halos de Luz Suaves (Subtle Bloom)', value: 'subtle photographic lens bloom and glare' },
      { label: 'Sem Texto (no text)', value: 'no text' },
      { label: '16:9', value: '16:9' },
      { label: '4:5', value: '4:5' }
    ]
  }
]

// ============================================================================
// 5. CONTEXTO: AMBIENTE (INTEGRAÇÃO INDOOR-OUTDOOR, LOUNGES & LAZER)
// ============================================================================
const ENVIRONMENT_QUICK_FIELDS: ArchFieldConfig<QuickFieldId>[] = [
  {
    id: 'style',
    phase: 1,
    phaseTitle: 'Fase 1 · Conceito do Ambiente',
    label: 'Integrated Environment & Spatial Concept',
    labelPt: 'Ambiente Integrado & Conceito Espacial',
    description: 'Espaços de convivência completos: varandas gourmet, lounges indoor-outdoor, pátios e rooftops.',
    guideTip: 'Destaque a fluidez entre interior e exterior (seamless indoor-outdoor living).',
    icon: 'compass',
    accent: 'blue',
    placeholder: 'Ex: seamless indoor-outdoor tropical luxury veranda and gourmet lounge overlooking a tranquil lagoon',
    joinWithAnd: false,
    options: [
      { value: 'seamless indoor-outdoor contemporary luxury veranda and gourmet lounge overlooking a tranquil forest valley', labelPt: 'Varanda gourmet e lounge contemporâneo de luxo integrado ao exterior com vista para o vale' },
      { value: 'meditative courtyard oasis with sunken conversation pit, water mirror, and bioclimatic pergola', labelPt: 'Oásis de pátio meditativo com lounge rebaixado, espelho d’água e pérgola bioclimática' }
    ],
    chips: [
      { label: 'Living Indoor-Outdoor Integrado', value: 'seamless indoor-outdoor architectural living space' },
      { label: 'Varanda Gourmet & Deck', value: 'covered luxury gourmet terrace and timber deck' },
      { label: 'Pátio Central com Espelho d’Água', value: 'internal architectural courtyard oasis with reflecting pool' },
      { label: 'Rooftop Lounge Panorâmico', value: 'panoramic architectural rooftop lounge and garden' }
    ]
  },
  EXTERIOR_QUICK_FIELDS[1],
  EXTERIOR_QUICK_FIELDS[2],
  EXTERIOR_QUICK_FIELDS[3],
  EXTERIOR_QUICK_FIELDS[4],
  EXTERIOR_QUICK_FIELDS[5],
  EXTERIOR_QUICK_FIELDS[6]
]

// ============================================================================
// 6. CONTEXTO: MÓVEIS (MOBILIÁRIO E MARCENARIA EM CONTEXTO)
// ============================================================================
const FURNITURE_QUICK_FIELDS: ArchFieldConfig<QuickFieldId>[] = [
  {
    id: 'style',
    phase: 1,
    phaseTitle: 'Fase 1 · Peça de Mobiliário / Marcenaria',
    label: 'Furniture Piece & Design Style',
    labelPt: 'Peça de Mobiliário / Marcenaria & Estilo',
    description: 'Defina qual é o móvel ou peça de marcenaria sob medida que protagoniza a imagem.',
    guideTip: 'Seja específico sobre a peça principal e sua linguagem formal (orgânica, brutalista, modernista).',
    icon: 'box',
    accent: 'blue',
    placeholder: 'Ex: bespoke sculptural dining table and ergonomic timber chairs in a Brazilian modernist style',
    joinWithAnd: false,
    options: [
      { value: 'bespoke sculptural dining table and ergonomic solid-wood chairs in a refined Brazilian modernist style', labelPt: 'Mesa de jantar escultural sob medida e cadeiras ergonômicas em madeira maciça no estilo modernista brasileiro' },
      { value: 'architectural floor-to-ceiling custom millwork wall unit with integrated desk and concealed bar', labelPt: 'Estante em marcenaria arquitetônica piso-teto com bancada integrada e bar oculto' },
      { value: 'organic curved modular lounge sofa with low-profile solid timber base', labelPt: 'Sofá modular curvo orgânico com base baixa em madeira maciça' }
    ],
    chips: [
      { label: 'Mesa de Jantar Escultural', value: 'a bespoke sculptural dining table' },
      { label: 'Poltrona Assinada de Madeira e Couro', value: 'an iconic modernist lounge armchair' },
      { label: 'Sofá Modular Orgânico', value: 'an organic curved modular sofa' },
      { label: 'Marcenaria Sob Medida Piso-Teto', value: 'bespoke floor-to-ceiling architectural millwork' },
      { label: 'Aparador / Credenza Minimalista', value: 'a minimalist low-profile timber credenza' }
    ]
  },
  {
    id: 'materials',
    phase: 2,
    phaseTitle: 'Fase 2 · Materiais & Encaixes',
    label: 'Craftsmanship & Materials',
    labelPt: 'Materiais, Acabamentos & Marcenaria',
    description: 'Veios da madeira, encaixes de marcenaria, costuras de couro, tramas de tecido e pedras.',
    guideTip: 'Mencione detalhes construtivos como "visible wood grain", "finger-joint joinery", "saddle stitching".',
    icon: 'layers',
    accent: 'orange',
    placeholder: 'Ex: oiled solid Brazilian rosewood with rich natural grain, hand-stitched cognac leather, and brushed brass hardware',
    joinWithAnd: true,
    options: [
      { value: 'oiled solid Jacarandá and Freijó wood with visible natural grain, hand-stitched saddle leather, and brushed brass joinery details', labelPt: 'Madeira Jacarandá e Freijó maciça oleada com veios aparentes, couro pespontado à mão e detalhes em latão' }
    ],
    chips: [
      { label: 'Madeira Maciça com Veios Naturais', value: 'oiled solid hardwood with rich natural wood grain' },
      { label: 'Encaixes Tradicionais (Joinery)', value: 'precision mortise-and-tenon wooden joinery' },
      { label: 'Couro Pespontado', value: 'hand-stitched full-grain saddle leather' },
      { label: 'Linho & Bouclé Texturizado', value: 'heavyweight textured bouclé fabric' },
      { label: 'Mármore Esculpido Bruto', value: 'chiseled and honed natural marble' },
      { label: 'Palhinha Trançada', value: 'hand-woven natural cane mesh' }
    ]
  },
  {
    id: 'environment',
    phase: 3,
    phaseTitle: 'Fase 3 · Cenário Arquitetônico',
    label: 'Architectural Backdrop',
    labelPt: 'Ambiente Arquitetônico de Fundo',
    description: 'O espaço arquitetônico onde o móvel está inserido.',
    guideTip: 'Um fundo arquitetônico minimalista valoriza o desenho da peça sem competir com ela.',
    icon: 'home',
    accent: 'emerald',
    placeholder: 'Ex: a sunlit minimalist architectural gallery room with textured limewash walls and oak parquet flooring',
    joinWithAnd: true,
    options: [
      { value: 'a sunlit minimalist architectural room with warm limewash walls, travertine flooring, and soft shadow play', labelPt: 'Sala arquitetônica minimalista iluminada pelo sol com paredes em cal e piso de travertino' }
    ],
    chips: [
      { label: 'Sala Minimalista com Parede de Cal', value: 'a minimalist room with warm limewash walls' },
      { label: 'Galeria em Concreto Aparente', value: 'an architectural board-formed concrete gallery' },
      { label: 'Piso Parquet de Madeira', value: 'herringbone natural oak parquet flooring' }
    ]
  },
  {
    id: 'foreground',
    phase: 4,
    phaseTitle: 'Fase 4 · Detalhes Táteis (Close-Up)',
    label: 'Tactile & Edge Details',
    labelPt: 'Detalhes Táteis & Acabamento de Borda',
    description: 'Chanfros, bordas orgânicas, costuras e reflexos sutis na superfície do móvel.',
    guideTip: 'Destaque o acabamento de borda (chamfered edges, rounded corners) para evidenciar o design.',
    icon: 'sparkles',
    accent: 'cyan',
    placeholder: 'Ex: softly chamfered timber edges, tactile fabric weave micro-details, and subtle surface reflections',
    joinWithAnd: true,
    options: [
      { value: 'softly chamfered timber edges, tactile fabric weave micro-details, and artisan ceramic objects', labelPt: 'Bordas de madeira suavemente chanfradas, micro-detalhes da trama do tecido e cerâmicas artesanais' }
    ],
    chips: [
      { label: 'Bordas Chanfradas (Chamfered)', value: 'precision chamfered timber edges' },
      { label: 'Micro-textura da Trama', value: 'sharp macro detail of the fabric weave' },
      { label: 'Borda Orgânica Natural', value: 'sculpted organic live-edge contour' }
    ]
  },
  INTERIOR_DESIGN_QUICK_FIELDS[4],
  INTERIOR_DESIGN_QUICK_FIELDS[5],
  {
    ...INTERIOR_QUICK_FIELDS[6],
    placeholder: 'Ex: Bespoke furniture photography, 50mm lens, shallow depth of field, Corona Renderer, 8k PBR textures, no text, 4:5'
  }
]

// ============================================================================
// 7. CONTEXTO: MÓVEL/EIS EM 3D (ASSET 3D, PACKSHOT DE ESTÚDIO & CATÁLOGO)
// ============================================================================
const FURNITURE_3D_QUICK_FIELDS: ArchFieldConfig<QuickFieldId>[] = [
  {
    id: 'style',
    phase: 1,
    phaseTitle: 'Fase 1 · Objeto 3D & Ângulo',
    label: '3D Furniture Subject & Angle',
    labelPt: 'Móvel(is) em 3D & Ângulo de Câmera',
    description: 'Defina a peça (ou conjunto de móveis 3D) e o ângulo de apresentação (3/4, frontal, isométrico).',
    guideTip: 'Para assets 3D de catálogo ou biblioteca, especifique "three-quarter studio view" ou "isometric 3D asset".',
    icon: 'box',
    accent: 'blue',
    placeholder: 'Ex: a standalone designer lounge armchair in a clean three-quarter 3D studio view',
    joinWithAnd: false,
    options: [
      { value: 'a standalone designer lounge armchair in a clean three-quarter 3D studio product view', labelPt: 'Poltrona de design isolada em vista 3/4 limpa de estúdio 3D' },
      { value: 'a coordinated 3D furniture collection (modular sofa, coffee table, and accent chair) in an isometric studio composition', labelPt: 'Conjunto coordenado de móveis 3D (sofá, mesa de centro e poltrona) em composição isométrica de estúdio' },
      { value: 'an exploded axonometric 3D view of a bespoke timber chair showing joinery components', labelPt: 'Vista axonométrica explodida em 3D de uma cadeira de madeira mostrando os componentes de encaixe' }
    ],
    chips: [
      { label: 'Poltrona 3D Isolada (Vista 3/4)', value: 'a standalone designer armchair in a three-quarter 3D studio view' },
      { label: 'Sofá 3D (Packshot de Catálogo)', value: 'a sculptural 3D sofa model in a catalog product angle' },
      { label: 'Conjunto de Móveis 3D', value: 'a curated set of 3D architectural furniture pieces' },
      { label: 'Cadeira Design em Vista 3/4', value: 'an ergonomic wooden dining chair in a 45-degree 3D angle' },
      { label: 'Vista Explodida 3D (Encaixes)', value: 'an exploded axonometric 3D assembly view of a bespoke furniture piece' }
    ]
  },
  FURNITURE_QUICK_FIELDS[1],
  {
    id: 'environment',
    phase: 3,
    phaseTitle: 'Fase 3 · Fundo de Estúdio (Backdrop)',
    label: 'Studio Backdrop & Cyclorama',
    labelPt: 'Fundo Infinito de Estúdio (Cyclorama)',
    description: 'Fundo neutro de estúdio, pedestal monolítico ou fundo puro para recorte.',
    guideTip: 'Use "seamless neutral warm-grey cyclorama studio background" para catálogo limpo.',
    icon: 'layers',
    accent: 'emerald',
    placeholder: 'Ex: a seamless warm alabaster studio cyclorama background with soft contact shadows on the floor',
    joinWithAnd: false,
    options: [
      { value: 'a seamless warm alabaster studio cyclorama background with realistic ambient occlusion contact shadows', labelPt: 'Fundo infinito de estúdio em tom alabastro quente com sombras de contato realistas (ambient occlusion)' },
      { value: 'a minimalist dark charcoal studio backdrop with a low travertine display plinth', labelPt: 'Fundo de estúdio carvão escuro minimalista com pedestal baixo de travertino' },
      { value: 'isolated pure white studio background (#FFFFFF) with soft ground shadow for catalog cutout', labelPt: 'Fundo branco puro de estúdio (#FFFFFF) com sombra suave no piso para catálogo' }
    ],
    chips: [
      { label: 'Fundo Infinito Alabastro Quente', value: 'a seamless warm alabaster studio cyclorama' },
      { label: 'Fundo Branco Puro (Catálogo)', value: 'an isolated pure white studio background with soft contact shadow' },
      { label: 'Estúdio Escuro Minimalista', value: 'a matte dark charcoal studio backdrop' },
      { label: 'Pedestal de Pedra (Plinth)', value: 'placed on a low monolithic travertine pedestal' }
    ]
  },
  {
    id: 'foreground',
    phase: 4,
    phaseTitle: 'Fase 4 · Geometria & Micro-Texturas PBR',
    label: 'Mesh & PBR Surface Details',
    labelPt: 'Geometria 3D & Micro-Texturas PBR',
    description: 'Qualidade da malha 3D, dobras naturais de tecido, chanfros e mapas de rugosidade.',
    guideTip: 'Termos como "8K PBR textures", "natural fabric creases" e "clean bevels" garantem qualidade de asset 3D.',
    icon: 'sliders',
    accent: 'cyan',
    placeholder: 'Ex: realistic fabric tension folds, fine piping seams, open-pore wood grain normal maps, and clean beveled edges',
    joinWithAnd: true,
    options: [
      { value: 'realistic fabric tension folds, precision piping seams, open-pore wood grain normal maps, and clean beveled edges', labelPt: 'Dobras de tensão realistas no tecido, costuras precisas, poros abertos na madeira e bordas chanfradas' }
    ],
    chips: [
      { label: 'Dobras Naturais de Tecido', value: 'realistic fabric tension folds and subtle creases' },
      { label: 'Texturas PBR 8K (Roughness/Normal)', value: 'high-resolution 8K PBR roughness and normal maps' },
      { label: 'Poros Abertos da Madeira', value: 'open-pore natural wood grain texture' },
      { label: 'Costuras &Acabamento Preciso', value: 'precision upholstery stitching and clean bevels' }
    ]
  },
  {
    id: 'lighting',
    phase: 5,
    phaseTitle: 'Fase 5A · Iluminação de Estúdio Fotográfico',
    label: '3-Point Studio Lighting',
    labelPt: 'Iluminação de Estúdio (Softbox & Rim Light)',
    description: 'Key light, fill light e rim light (contraluz de recorte) para destacar volume e textura.',
    guideTip: 'A iluminação de 3 pontos (key + fill + rim light) destaca as bordas e o relevo dos materiais.',
    icon: 'sun',
    accent: 'amber',
    placeholder: 'Ex: three-point photographic studio lighting with a large diffused overhead softbox, gentle fill light, and crisp rim light highlighting the silhouette',
    joinWithAnd: true,
    options: [
      { value: 'three-point photographic studio lighting with a large diffused softbox, soft fill light, and subtle rim light accentuating material contours', labelPt: 'Iluminação de estúdio de 3 pontos com softbox difuso, luz de preenchimento e contraluz destacando contornos' }
    ],
    chips: [
      { label: 'Estúdio 3 Pontos (Key + Fill + Rim)', value: 'three-point photographic studio lighting' },
      { label: 'Softbox Superior Difuso', value: 'large diffused overhead softbox illumination' },
      { label: 'Contraluz de Recorte (Rim Light)', value: 'crisp rim light highlighting material contours' },
      { label: 'Ambient Occlusion Suave', value: 'soft grounded ambient occlusion shadows' }
    ]
  },
  {
    ...EXTERIOR_QUICK_FIELDS[5],
    placeholder: 'Ex: clean, tactile, studio-grade, minimalist, and product-focused',
    chips: [
      { label: 'Foco 100% no Produto', value: 'clean, studio-grade, and product-focused' },
      { label: 'Editorial de Design', value: 'refined, tactile, and high-end catalog style' }
    ]
  },
  {
    ...EXTERIOR_QUICK_FIELDS[6],
    placeholder: 'Ex: 3D product visualization, Octane and Corona Renderer, 85mm prime lens, zero distortion, 8k PBR materials, no text, 1:1',
    chips: [
      { label: '3D Product Visualization', value: 'Ultra-detailed 3D furniture product visualization' },
      { label: 'Lente 85mm Sem Distorção', value: '85mm studio prime lens, zero perspective distortion' },
      { label: 'Corona / Octane Studio Render', value: 'Corona and Octane studio render, ray-traced reflections' },
      { label: 'Sem Texto (no text)', value: 'no text' },
      { label: '1:1', value: '1:1' },
      { label: '4:5', value: '4:5' }
    ]
  }
]

// ============================================================================
// 8. CONTEXTO: PLANTAS BAIXAS (FLOOR PLAN 2D / 3D ISOMÉTRICO / HUMANIZADA)
// ============================================================================
const FLOOR_PLAN_QUICK_FIELDS: ArchFieldConfig<QuickFieldId>[] = [
  {
    id: 'style',
    phase: 1,
    phaseTitle: 'Fase 1 · Tipo de Planta & Conversão',
    label: 'Floor Plan Presentation Type',
    labelPt: 'Tipo de Visualização da Planta Baixa',
    description: 'Defina se é uma maquete 3D isométrica (cutaway), planta baixa 2D humanizada top-down ou extrusão de imagem anexada.',
    guideTip: 'Use o Mapeador Interativo de Planta Baixa acima para preencher automaticamente ângulo, paredes e cômodos.',
    icon: 'ratio',
    accent: 'blue',
    placeholder: 'Ex: 3D isometric cutaway floor plan of a contemporary single-story luxury residence',
    joinWithAnd: false,
    options: [
      { value: '3D isometric cutaway floor plan of a contemporary luxury residence, preserving exact wall layout and room proportions', labelPt: 'Planta baixa em corte isométrico 3D (maquete) de residência contemporânea preservando paredes e proporções' },
      { value: 'top-down 90-degree orthographic humanized architectural floor plan with realistic textures and furniture layout', labelPt: 'Planta baixa humanizada ortogonal 90° (vista superior) com texturas realistas e layout de mobiliário' },
      { value: 'exploded axonometric architectural diagram showing structural grid, interior room zoning, and roof terrace', labelPt: 'Diagrama arquitetônico axonométrico explodido mostrando estrutura, zoneamento interno e cobertura' }
    ],
    chips: [
      { label: 'Maquete 3D Isométrica (45° Cutaway)', value: '3D isometric 45-degree cutaway floor plan' },
      { label: 'Planta Humanizada 2D (90° Top-Down)', value: 'top-down 90-degree orthographic humanized floor plan' },
      { label: 'Axonométrica Explodida', value: 'exploded axonometric 3D architectural floor plan' },
      { label: 'Fidelidade à Planta Anexada', value: 'strictly following the attached reference floor plan walls, doors, and window openings' }
    ]
  },
  {
    id: 'materials',
    phase: 2,
    phaseTitle: 'Fase 2 · Pisos por Zona & Paredes Cortadas',
    label: 'Flooring Zones & Cut-Wall Finish',
    labelPt: 'Pisos por Ambiente & Acabamento das Paredes Cortadas',
    description: 'Diferenciação de pisos entre áreas sociais, íntimas e molhadas, mais a cor do topo das paredes seccionadas.',
    guideTip: 'Definir a cor do topo da parede cortada (ex: clean white / solid charcoal poche) deixa a planta muito mais legível.',
    icon: 'box',
    accent: 'orange',
    placeholder: 'Ex: warm oak parquet in bedrooms, large-format travertine in living and kitchen, timber decking on the terrace, with clean white cut-wall tops',
    joinWithAnd: true,
    options: [
      { value: 'warm oak parquet in bedrooms, large-format travertine stone in social areas, slatted timber decking on the terrace, and crisp white architectural cut-wall pochés', labelPt: 'Parquet de carvalho nos quartos, travertino na área social, deck na varanda e topo das paredes cortadas em branco nítido' }
    ],
    chips: [
      { label: 'Topo das Paredes Branco (White Poché)', value: 'crisp white architectural cut-wall tops' },
      { label: 'Topo das Paredes Grafite Escuro', value: 'solid charcoal architectural wall poché' },
      { label: 'Piso Madeira nos Quartos', value: 'warm oak wood flooring in the private suites' },
      { label: 'Porcelanato/Pedra na Área Social', value: 'large-format stone tiles in the living and kitchen zones' },
      { label: 'Deck de Madeira na Varanda', value: 'natural timber decking on the outdoor terrace' }
    ]
  },
  {
    id: 'environment',
    phase: 3,
    phaseTitle: 'Fase 3 · Programa de Ambientes (Zoning)',
    label: 'Rooms & Spatial Zoning',
    labelPt: 'Cômodos & Zoneamento da Planta',
    description: 'Quais ambientes compõem a planta e como se conectam.',
    guideTip: 'Clique nos cômodos no Mapeador de Planta Baixa para adicioná-los automaticamente.',
    icon: 'home',
    accent: 'emerald',
    placeholder: 'Ex: integrated living and dining room, gourmet island kitchen, master bedroom suite with walk-in closet, spa bathroom, home office, and outdoor pool deck',
    joinWithAnd: true,
    options: [
      { value: 'integrated living and dining room, gourmet island kitchen, master bedroom suite with walk-in closet, guest bedroom, spa bathroom, and outdoor pool deck', labelPt: 'Living e jantar integrados, cozinha com ilha, suíte master com closet, quarto de hóspedes, banheiro spa e deck com piscina' }
    ],
    chips: [
      { label: 'Living & Jantar Integrados', value: 'integrated open-concept living and dining area' },
      { label: 'Cozinha com Ilha Central', value: 'gourmet kitchen with central stone island' },
      { label: 'Suíte Master com Closet', value: 'master bedroom suite with walk-in closet and en-suite bath' },
      { label: 'Home Office / Escritório', value: 'dedicated home office study' },
      { label: 'Banheiro Spa', value: 'bathroom with walk-in shower and freestanding tub' },
      { label: 'Varanda Gourmet & Piscina', value: 'outdoor gourmet veranda and swimming pool deck' }
    ]
  },
  {
    id: 'foreground',
    phase: 4,
    phaseTitle: 'Fase 4 · Mobiliário em Escala & Humanização',
    label: 'Scale Furniture & Interior Fixtures',
    labelPt: 'Mobiliário em Escala, Louças & Vegetação',
    description: 'Móveis, tapetes, bancadas, louças sanitárias e vasos que humanizam cada ambiente da planta.',
    guideTip: 'Mobiliário proporcional em escala correta permite ler a circulação da planta baixa.',
    icon: 'layers',
    accent: 'cyan',
    placeholder: 'Ex: accurately scaled modern furniture, area rugs defining circulation paths, built-in cabinetry, kitchen appliances, and indoor potted plants',
    joinWithAnd: true,
    options: [
      { value: 'accurately scaled contemporary furniture, textured area rugs defining circulation zones, built-in millwork cabinetry, sanitary fixtures, and indoor potted plants', labelPt: 'Mobiliário contemporâneo em escala exata, tapetes delimitando circulação, marcenaria, louças e plantas' }
    ],
    chips: [
      { label: 'Mobiliário em Escala Exata', value: 'accurately scaled contemporary furniture' },
      { label: 'Tapetes Delimitando Zonas', value: 'textured area rugs defining each functional zone' },
      { label: 'Marcenaria & Bancadas Completas', value: 'built-in wardrobes, kitchen counters, and bathroom vanities' },
      { label: 'Vegetação Humanizada', value: 'subtle indoor plants and perimeter landscaping' }
    ]
  },
  {
    id: 'lighting',
    phase: 5,
    phaseTitle: 'Fase 5A · Sombras de Profundidade na Planta',
    label: 'Plan Lighting & Cast Shadows',
    labelPt: 'Iluminação da Planta & Sombras Projetadas',
    description: 'Luz direcional suave a 45° que projeta sombras curtas para dar leitura de altura às paredes e móveis.',
    guideTip: 'Sombras oblíquas suaves (soft 45-degree directional shadows) dão volume imediato a plantas 2D e 3D.',
    icon: 'sun',
    accent: 'amber',
    placeholder: 'Ex: soft 45-degree directional daylight casting gentle volumetric shadows inside each room, with warm interior recessed glow',
    joinWithAnd: true,
    options: [
      { value: 'soft 45-degree directional daylight casting clean volumetric shadows inside the rooms, balanced with even ambient occlusion', labelPt: 'Luz direcional suave a 45° projetando sombras volumétricas limpas dentro dos cômodos com ambient occlusion' }
    ],
    chips: [
      { label: 'Sombras Oblíquas a 45° (Volume)', value: 'soft 45-degree directional sunlight casting clean volumetric room shadows' },
      { label: 'Ambient Occlusion nos Cantos', value: 'crisp ambient occlusion along wall-floor junctions' },
      { label: 'Fundo Limpo de Apresentação', value: 'isolated on a clean neutral architectural presentation background' }
    ]
  },
  {
    ...EXTERIOR_QUICK_FIELDS[5],
    placeholder: 'Ex: clear, organized, legible, architectural, and presentation-ready',
    chips: [
      { label: 'Legível & Técnica', value: 'clear, organized, and architecturally legible' },
      { label: 'Pronta para Apresentação', value: 'refined, tactile, and client-presentation ready' }
    ]
  },
  {
    ...EXTERIOR_QUICK_FIELDS[6],
    placeholder: 'Ex: Ultra-detailed architectural floor plan visualization, V-Ray render, crisp edges, no text labels, no dimension lines, no numbers, 1:1',
    chips: [
      { label: 'Sem Cotas ou Textos (no text, no dimensions)', value: 'no text labels, no dimension lines, no numbers' },
      { label: 'Bordas Nítidas (Crisp Edges)', value: 'ultra-sharp architectural edges, 8k resolution' },
      { label: 'Estilo Maquete Física (Physical Model)', value: 'architectural scale model aesthetic, balsa wood and matte white card' },
      { label: '1:1', value: '1:1' },
      { label: '16:9', value: '16:9' }
    ]
  }
]

// Helper to build Advanced 12-block fields adapted to any context's Quick 7-block fields
function createAdvancedFieldsForContext(
  quick: ArchFieldConfig<QuickFieldId>[],
  styleLabelPt: string,
  typeLabelPt: string,
  locLabelPt: string,
  styleChips: PromptChip[],
  typeChips: PromptChip[],
  locChips: PromptChip[]
): ArchFieldConfig<AdvancedFieldId>[] {
  return [
    {
      id: 'archStyle',
      phase: 1,
      phaseTitle: 'Fase 1A · Estilo',
      label: 'Design Style',
      labelPt: styleLabelPt,
      description: 'A linguagem estética ou estilo principal do projeto.',
      guideTip: quick[0].guideTip,
      icon: 'sparkles',
      accent: 'blue',
      placeholder: `Ex: ${styleChips[0]?.value || 'refined contemporary luxury'}`,
      joinWithAnd: false,
      options: styleChips.map(c => ({ value: c.value, labelPt: c.label })),
      chips: styleChips
    },
    {
      id: 'buildingType',
      phase: 1,
      phaseTitle: 'Fase 1B · Tipologia / Objeto',
      label: 'Subject / Typology',
      labelPt: typeLabelPt,
      description: 'O elemento principal que será renderizado.',
      guideTip: 'Seja específico quanto à tipologia ou peça principal.',
      icon: 'building',
      accent: 'blue',
      placeholder: `Ex: ${typeChips[0]?.value || 'residence'}`,
      singleSelectChip: true,
      joinWithAnd: false,
      options: typeChips.map(c => ({ value: c.value, labelPt: c.label })),
      chips: typeChips
    },
    {
      id: 'location',
      phase: 1,
      phaseTitle: 'Fase 1C · Contexto / Vista',
      label: 'Context & Setting',
      labelPt: locLabelPt,
      description: 'A implantação, vista, ângulo ou cenário envolvente.',
      guideTip: 'Define a ambiência geográfica ou o enquadramento espacial.',
      icon: 'compass',
      accent: 'blue',
      placeholder: `Ex: ${locChips[0]?.value || 'natural forest hillside'}`,
      singleSelectChip: true,
      joinWithAnd: false,
      options: locChips.map(c => ({ value: c.value, labelPt: c.label })),
      chips: locChips
    },
    {
      id: 'materials',
      phase: 2,
      phaseTitle: 'Fase 2 · Materialidade',
      label: quick[1].label,
      labelPt: quick[1].labelPt,
      description: quick[1].description,
      guideTip: quick[1].guideTip,
      icon: 'box',
      accent: 'orange',
      placeholder: quick[1].placeholder,
      joinWithAnd: true,
      options: quick[1].options,
      chips: quick[1].chips
    },
    {
      id: 'environment',
      phase: 3,
      phaseTitle: 'Fase 3 · Entorno / Layout',
      label: quick[2].label,
      labelPt: quick[2].labelPt,
      description: quick[2].description,
      guideTip: quick[2].guideTip,
      icon: 'trees',
      accent: 'emerald',
      placeholder: quick[2].placeholder,
      joinWithAnd: true,
      options: quick[2].options,
      chips: quick[2].chips
    },
    {
      id: 'foreground',
      phase: 4,
      phaseTitle: 'Fase 4 · Primeiro Plano / Detalhes',
      label: quick[3].label,
      labelPt: quick[3].labelPt,
      description: quick[3].description,
      guideTip: quick[3].guideTip,
      icon: 'layers',
      accent: 'cyan',
      placeholder: quick[3].placeholder,
      joinWithAnd: true,
      options: quick[3].options,
      chips: quick[3].chips
    },
    {
      id: 'lighting',
      phase: 5,
      phaseTitle: 'Fase 5A · Luz Principal',
      label: 'Primary Lighting',
      labelPt: 'Fonte de Luz Principal',
      description: quick[4].description,
      guideTip: quick[4].guideTip,
      icon: 'sun',
      accent: 'amber',
      placeholder: quick[4].placeholder,
      joinWithAnd: false,
      options: quick[4].options,
      chips: quick[4].chips
    },
    {
      id: 'lightingDetail',
      phase: 5,
      phaseTitle: 'Fase 5B · Sombras & Detalhes de Luz',
      label: 'Shadows & Light Falloff',
      labelPt: 'Sombras & Complemento Luminoso',
      description: 'Comportamento das sombras, reflexos e luz complementar.',
      guideTip: 'Combine sombras suaves com luz indireta ou oclusão de ambiente.',
      icon: 'sliders',
      accent: 'amber',
      placeholder: 'Ex: soft cinematic shadows and subtle warm glow',
      joinWithAnd: true,
      options: [
        { value: 'soft cinematic shadows and subtle warm glow', labelPt: 'Sombras cinematográficas suaves e brilho quente sutil' },
        { value: 'crisp architectural shadows and realistic surface reflections', labelPt: 'Sombras arquitetônicas nítidas e reflexos de superfície realistas' },
        { value: 'volumetric light rays and gentle ambient occlusion', labelPt: 'Feixes de luz volumétricos e oclusão de ambiente suave' }
      ],
      chips: [
        { label: 'Sombras Cinematográficas', value: 'soft cinematic shadows' },
        { label: 'Brilho Quente Sutil', value: 'subtle warm glow' },
        { label: 'Reflexos Realistas', value: 'realistic surface reflections' },
        { label: 'Ambient Occlusion Suave', value: 'soft ambient occlusion' }
      ]
    },
    {
      id: 'mood',
      phase: 5,
      phaseTitle: 'Fase 5C · Atmosfera',
      label: quick[5].label,
      labelPt: quick[5].labelPt,
      description: quick[5].description,
      guideTip: quick[5].guideTip,
      icon: 'palette',
      accent: 'pink',
      placeholder: quick[5].placeholder,
      joinWithAnd: true,
      options: quick[5].options,
      chips: quick[5].chips
    },
    {
      id: 'renderStyle',
      phase: 6,
      phaseTitle: 'Fase 6A · Motor & Qualidade',
      label: 'Render Engine & Quality',
      labelPt: 'Motor de Render & Qualidade',
      description: 'Especificações de fotorrealismo, motor 3D e resolução.',
      guideTip: 'Especifique Corona, V-Ray, Octane ou Unreal Engine 5 + 8K.',
      icon: 'settings',
      accent: 'purple',
      placeholder: 'Ex: Ultra-realistic architectural visualization, soft global illumination, 8k resolution',
      joinWithAnd: false,
      options: quick[6].options,
      chips: quick[6].chips.filter(c => !['1:1', '16:9', '4:5', 'no text'].includes(c.value))
    },
    {
      id: 'extraCommands',
      phase: 6,
      phaseTitle: 'Fase 6B · Câmera & Restrições',
      label: 'Camera & Negative Rules',
      labelPt: 'Lente & Restrições (Prompt Negativo)',
      description: 'Lente fotográfica e elementos banidos da geração.',
      guideTip: 'Inclua "no text" para evitar textos ou marcas d’água indesejadas.',
      icon: 'sliders',
      accent: 'purple',
      placeholder: 'Ex: no text, no watermark',
      joinWithAnd: false,
      options: [
        { value: 'no text', labelPt: 'Sem texto (no text)' },
        { value: 'eye-level view, 24mm tilt-shift lens, no people, no text', labelPt: 'Nível do olhar, lente 24mm tilt-shift, sem pessoas, sem texto' },
        { value: 'no text labels, no dimension lines, no watermark', labelPt: 'Sem rótulos de texto, sem linhas de cota, sem marca d’água' }
      ],
      chips: [
        { label: 'Sem Texto (no text)', value: 'no text' },
        { label: 'Sem Pessoas (no people)', value: 'no people' },
        { label: 'Sem Cotas (no dimension lines)', value: 'no dimension lines' },
        { label: 'Lente 24mm Tilt-Shift', value: '24mm tilt-shift lens' },
        { label: 'Lente 35mm Editorial', value: '35mm editorial lens' }
      ]
    },
    {
      id: 'aspectRatio',
      phase: 6,
      phaseTitle: 'Fase 6C · Proporção',
      label: 'Aspect Ratio',
      labelPt: 'Proporção da Imagem',
      description: 'Formato final da imagem gerada.',
      guideTip: '1:1 (quadrado), 16:9 (horizontal widescreen), 4:5 (retrato editorial).',
      icon: 'ratio',
      accent: 'indigo',
      placeholder: 'Ex: 1:1',
      singleSelectChip: true,
      joinWithAnd: false,
      options: [
        { value: '1:1', labelPt: 'Quadrado (1:1)' },
        { value: '16:9', labelPt: 'Horizontal Widescreen (16:9)' },
        { value: '4:5', labelPt: 'Retrato Editorial (4:5)' },
        { value: '9:16', labelPt: 'Vertical (9:16)' },
        { value: '--ar 16:9', labelPt: 'Midjourney Horizontal (--ar 16:9)' }
      ],
      chips: [
        { label: '1:1', value: '1:1' },
        { label: '16:9', value: '16:9' },
        { label: '4:5', value: '4:5' },
        { label: '9:16', value: '9:16' },
        { label: '--ar 16:9', value: '--ar 16:9' }
      ]
    }
  ]
}

// ============================================================================
// CONFIGURAÇÃO COMPLETA DOS 8 CONTEXTOS ARQUITETÔNICOS
// ============================================================================
export const ARCH_CONTEXTS: ArchContextConfig[] = [
  {
    id: 'exterior',
    label: 'Externo',
    subtitle: 'Fachadas, volumetria, implantação e paisagismo',
    badge: 'Fachada & Implantação',
    icon: 'exterior',
    connectors: {
      intro: 'Render the architecture as a ',
      materialsBridge: ', using ',
      environmentBridge: '. Surround the house with ',
      foregroundBridge: '. Add ',
      lightingBridge: '. Use ',
      moodBridge: '. Keep the scene ',
      advIntro: 'Render the architecture as a ',
      advLocationBridge: ' in a ',
      advMaterialsBridge: ' setting, using ',
      advEnvironmentBridge: '. Surround the architecture with ',
      advForegroundBridge: '. In the foreground, add ',
      advLightingBridge: '. Use ',
      advLightingDetailBridge: ' with ',
      advMoodBridge: '. Keep the scene '
    },
    quickFields: EXTERIOR_QUICK_FIELDS,
    advancedFields: createAdvancedFieldsForContext(
      EXTERIOR_QUICK_FIELDS,
      'Estilo Arquitetônico',
      'Tipo de Edificação',
      'Bioma & Localização',
      [
        { label: 'Contemporâneo de Luxo', value: 'refined contemporary luxury' },
        { label: 'Brutalista Monolítico', value: 'raw brutalist monolithic' },
        { label: 'Minimalista Nórdico', value: 'warm minimalist Nordic' },
        { label: 'Modernista Tropical', value: 'tropical modernist Brazilian' }
      ],
      [
        { label: 'Residência', value: 'residence' },
        { label: 'Villa na Encosta', value: 'cliffside villa' },
        { label: 'Pavilhão de Vidro', value: 'glass pavilion' },
        { label: 'Cabana de Montanha', value: 'mountain cabin' },
        { label: 'Museu Cultural', value: 'cultural museum' }
      ],
      [
        { label: 'Encosta Florestal', value: 'natural forest hillside' },
        { label: 'Montanha Nevada', value: 'snowy alpine mountain' },
        { label: 'Penhasco no Deserto', value: 'arid red-rock desert cliff' },
        { label: 'Beira-Mar Tropical', value: 'tropical coastal beachfront' }
      ]
    ),
    presets: [
      {
        id: 'forest-refuge-reference',
        contextId: 'exterior',
        name: 'Refúgio Florestal (Guia Oficial)',
        badge: 'Referência',
        description: 'Residência contemporânea na floresta com lago e barco em primeiro plano.',
        quick: {
          style: 'refined contemporary luxury residence in a natural forest hillside setting',
          materials: 'warm off-white masonry, natural timber, large floor-to-ceiling glass, and dark metal frames',
          environment: 'mature pine trees, layered grasses, shrubs, and subtle planting',
          foreground: 'a calm natural pond in the foreground with realistic reflections, soft ripples, shoreline stones, and a small rustic wooden rowboat',
          lighting: 'warm late-afternoon golden-hour light filtering through the trees, with soft cinematic shadows and subtle interior glow',
          mood: 'peaceful, luxurious, natural, and architecture-focused',
          technical: 'Ultra-realistic architectural visualization, soft global illumination, detailed vegetation, no text, 1:1'
        },
        advanced: {
          archStyle: 'refined contemporary luxury',
          buildingType: 'residence',
          location: 'natural forest hillside',
          materials: 'warm off-white masonry, natural timber, large floor-to-ceiling glass, and dark metal frames',
          environment: 'mature pine trees, layered grasses, shrubs, and subtle planting',
          foreground: 'a calm natural pond with realistic reflections, soft ripples, shoreline stones, and a small rustic wooden rowboat',
          lighting: 'warm late-afternoon golden-hour light filtering through the trees',
          lightingDetail: 'soft cinematic shadows and subtle warm glow',
          mood: 'peaceful, luxurious, natural, and architecture-focused',
          renderStyle: 'Ultra-realistic architectural visualization, soft global illumination, detailed vegetation',
          extraCommands: 'no text',
          aspectRatio: '1:1'
        }
      },
      {
        id: 'brutalist-desert-cliff',
        contextId: 'exterior',
        name: 'Mansão Brutalista no Deserto',
        badge: 'Brutalismo',
        description: 'Concreto aparente e aço corten sobre cânion desértico ao pôr do sol.',
        quick: {
          style: 'brutalist monolithic concrete mansion perched on an arid red-rock desert cliff',
          materials: 'exposed board-formed concrete, weathered corten steel, and expansive frameless glazing',
          environment: 'arid desert landscape, sculptural agave plants, saguaro cacti, and red rock formations',
          foreground: 'a sleek infinity pool in the foreground reflecting the sky, with sunken concrete firepit lounge',
          lighting: 'warm late-afternoon golden-hour light casting long dramatic shadows and warm 2700K interior glow',
          mood: 'dramatic, moody, striking, and cinematic',
          technical: 'Ultra-realistic architectural visualization, Unreal Engine 5 path tracing, 8k resolution, no text, 16:9'
        },
        advanced: {
          archStyle: 'raw brutalist monolithic',
          buildingType: 'cliffside villa',
          location: 'arid red-rock desert cliff',
          materials: 'exposed board-formed concrete, weathered corten steel, and expansive frameless glazing',
          environment: 'arid desert landscape, sculptural agave plants, saguaro cacti, and red rock formations',
          foreground: 'a sleek infinity pool reflecting the sky and a sunken concrete firepit',
          lighting: 'warm late-afternoon golden-hour light',
          lightingDetail: 'crisp architectural shadows and realistic surface reflections',
          mood: 'dramatic, moody, striking, and cinematic',
          renderStyle: 'Ultra-realistic architectural visualization, Unreal Engine 5 path tracing, 8k resolution',
          extraCommands: 'no text',
          aspectRatio: '16:9'
        }
      }
    ]
  },
  {
    id: 'interior',
    label: 'Interno',
    subtitle: 'Espaço arquitetônico interno, pé-direito, revestimentos e aberturas',
    badge: 'Arquitetura Interna',
    icon: 'interior',
    connectors: {
      intro: 'Render the architectural interior of a ',
      materialsBridge: ', featuring surfaces of ',
      environmentBridge: '. Frame the interior space with ',
      foregroundBridge: '. In the foreground, compose ',
      lightingBridge: '. Illuminate the space with ',
      moodBridge: '. Keep the spatial atmosphere ',
      advIntro: 'Render the architectural interior of a ',
      advLocationBridge: ' with ',
      advMaterialsBridge: ', featuring surfaces of ',
      advEnvironmentBridge: '. Frame the space with ',
      advForegroundBridge: '. In the foreground, compose ',
      advLightingBridge: '. Illuminate the interior with ',
      advLightingDetailBridge: ' and ',
      advMoodBridge: '. Keep the spatial atmosphere '
    },
    quickFields: INTERIOR_QUICK_FIELDS,
    advancedFields: createAdvancedFieldsForContext(
      INTERIOR_QUICK_FIELDS,
      'Estilo do Espaço Interno',
      'Ambiente / Cômodo',
      'Escala & Abertura Visual',
      [
        { label: 'Contemporâneo Minimalista', value: 'minimalist contemporary' },
        { label: 'Japandi Quente', value: 'warm Japandi' },
        { label: 'Brutalista Monolítico', value: 'monolithic brutalist' }
      ],
      [
        { label: 'Living Pé-Direito Duplo', value: 'double-height living room' },
        { label: 'Cozinha Arquitetônica', value: 'open-concept kitchen' },
        { label: 'Suíte Master', value: 'master bedroom suite' },
        { label: 'Banheiro Spa', value: 'spa bathroom' }
      ],
      [
        { label: 'Vista Panorâmica para Floresta', value: 'panoramic forest views' },
        { label: 'Pátio Interno Zen', value: 'private zen courtyard views' },
        { label: 'Claraboia Zenital', value: 'dramatic overhead skylight apertures' }
      ]
    ),
    presets: [
      {
        id: 'interior-double-height-living',
        contextId: 'interior',
        name: 'Living Pé-Direito Duplo na Floresta',
        badge: 'Living Interno',
        description: 'Sala de estar com pé-direito duplo, carvalho europeu, travertino e grandes panos de vidro.',
        quick: {
          style: 'double-height contemporary luxury living room with panoramic forest views',
          materials: 'wide-plank brushed European oak flooring, warm limewash walls, slatted timber ceiling, and slim dark bronze window frames',
          environment: 'expansive floor-to-ceiling glass walls framing a misty pine forest, a floating sculptural staircase, and a suspended black steel fireplace',
          foreground: 'a low-profile modular bouclé sofa, a monolithic travertine coffee table, and a textured wool rug in the foreground',
          lighting: 'soft late-afternoon golden sunlight streaming through floor-to-ceiling windows, paired with warm 2700K recessed LED cove lighting',
          mood: 'peaceful, luxurious, natural, and architecture-focused',
          technical: 'Ultra-realistic interior architectural visualization, Corona Renderer, soft global illumination, 35mm lens, eye-level view, no text, 4:5'
        },
        advanced: {
          archStyle: 'minimalist contemporary',
          buildingType: 'double-height living room',
          location: 'panoramic forest views',
          materials: 'wide-plank brushed European oak flooring, warm limewash walls, and slatted timber ceiling',
          environment: 'expansive floor-to-ceiling glass walls and a floating sculptural staircase',
          foreground: 'a low-profile modular bouclé sofa and a monolithic travertine coffee table',
          lighting: 'soft late-afternoon golden sunlight streaming through the windows',
          lightingDetail: 'soft cinematic shadows and subtle warm glow',
          mood: 'peaceful, luxurious, natural, and architecture-focused',
          renderStyle: 'Ultra-realistic interior architectural visualization, Corona Renderer, soft global illumination',
          extraCommands: '35mm editorial lens, no text',
          aspectRatio: '4:5'
        }
      }
    ]
  },
  {
    id: 'interior-design',
    label: 'Design de Interiores',
    subtitle: 'Decoração, curadoria de mobiliário, tecidos, arte e styling editorial',
    badge: 'Decoração & Styling',
    icon: 'interior-design',
    connectors: {
      intro: 'Design a curated interior space as a ',
      materialsBridge: ', combining tactile materials such as ',
      environmentBridge: '. Arrange the interior layout with ',
      foregroundBridge: '. Style the foreground vignette with ',
      lightingBridge: '. Layer the ambient lighting using ',
      moodBridge: '. Keep the interior mood ',
      advIntro: 'Design a curated ',
      advLocationBridge: ' in a ',
      advMaterialsBridge: ' aesthetic, combining ',
      advEnvironmentBridge: '. Arrange the layout with ',
      advForegroundBridge: '. Style the foreground with ',
      advLightingBridge: '. Layer the lighting using ',
      advLightingDetailBridge: ' and ',
      advMoodBridge: '. Keep the interior mood '
    },
    quickFields: INTERIOR_DESIGN_QUICK_FIELDS,
    advancedFields: createAdvancedFieldsForContext(
      INTERIOR_DESIGN_QUICK_FIELDS,
      'Assinatura / Estilo Decorativo',
      'Ambiente Decorado',
      'Atmosfera Curatorial',
      [
        { label: 'Quiet Luxury Contemporâneo', value: 'quiet luxury contemporary' },
        { label: 'Modernismo Brasileiro', value: 'Brazilian modernist' },
        { label: 'Wabi-Sabi & Japandi', value: 'organic Wabi-Sabi Japandi' }
      ],
      [
        { label: 'Living & Estar Social', value: 'living salon' },
        { label: 'Sala de Jantar Editorial', value: 'dining room' },
        { label: 'Lounge & Biblioteca', value: 'reading lounge and library' }
      ],
      [
        { label: 'Curadoria de Galeria Residencial', value: 'collector gallery-like residential' },
        { label: 'Refúgio Natural Orgânico', value: 'warm organic sanctuary' }
      ]
    ),
    presets: [
      {
        id: 'brazilian-modernist-salon',
        contextId: 'interior-design',
        name: 'Salão Modernista Brasileiro',
        badge: 'Curadoria BR',
        description: 'Madeira Freijó, bouclé marfim, couro conhaque, arte em grande escala e styling editorial.',
        quick: {
          style: 'quiet luxury contemporary living salon curated with iconic Brazilian modernist design pieces',
          materials: 'ivory bouclé upholstery, raw Belgian linen drapery, solid Freijó wood, cognac saddle leather, and brushed aged brass',
          environment: 'a curved sculptural sofa paired with iconic modernist lounge chairs, bespoke floor-to-ceiling oak shelving, and large-scale abstract textured canvas art',
          foreground: 'curated hardcover art books, handmade matte stoneware ceramics, and a sculptural ikebana branch on the coffee table in the foreground',
          lighting: 'soft filtered afternoon daylight through sheer linen curtains, complemented by a glowing sculptural alabaster pendant and warm table lamps',
          mood: 'sophisticated, warm, tactile, and editorial',
          technical: 'V-Ray photorealistic interior photography, Architectural Digest editorial style, 35mm lens, natural color grading, 8k resolution, no text, 4:5'
        },
        advanced: {
          archStyle: 'Brazilian modernist',
          buildingType: 'living salon',
          location: 'collector gallery-like residential',
          materials: 'ivory bouclé upholstery, raw Belgian linen drapery, solid Freijó wood, and cognac saddle leather',
          environment: 'a curved sculptural sofa, modernist lounge armchairs, and bespoke timber shelving',
          foreground: 'curated hardcover architecture books and handmade matte stoneware ceramics',
          lighting: 'soft daylight filtered through sheer linen curtains',
          lightingDetail: 'soft cinematic shadows and subtle warm glow',
          mood: 'sophisticated and editorial',
          renderStyle: 'V-Ray photorealistic interior photography, Architectural Digest editorial style, 8k',
          extraCommands: '35mm editorial lens, no text',
          aspectRatio: '4:5'
        }
      }
    ]
  },
  {
    id: 'lighting',
    label: 'Luzes',
    subtitle: 'Projeto luminotécnico, perfis de LED, temperatura Kelvin e luz/sombra',
    badge: 'Luminotécnico',
    icon: 'lighting',
    connectors: {
      intro: 'Create an architectural lighting visualization for a ',
      materialsBridge: ', highlighting textured surfaces of ',
      environmentBridge: '. Configure the lighting scheme with ',
      foregroundBridge: '. Accent the foreground using ',
      lightingBridge: '. Balance the illumination with ',
      moodBridge: '. Keep the luminous atmosphere ',
      advIntro: 'Create an architectural lighting visualization of a ',
      advLocationBridge: ' during ',
      advMaterialsBridge: ', highlighting surfaces of ',
      advEnvironmentBridge: '. Configure the lighting circuits with ',
      advForegroundBridge: '. Accent the foreground with ',
      advLightingBridge: '. Balance the color temperature using ',
      advLightingDetailBridge: ' with ',
      advMoodBridge: '. Keep the luminous atmosphere '
    },
    quickFields: LIGHTING_QUICK_FIELDS,
    advancedFields: createAdvancedFieldsForContext(
      LIGHTING_QUICK_FIELDS,
      'Conceito Luminotécnico',
      'Espaço Iluminado',
      'Horário / Luz Externa',
      [
        { label: 'Luminotécnica em Camadas (Layered)', value: 'layered museum-grade architectural' },
        { label: 'Minimalismo Monolítico Dramático', value: 'dramatic chiaroscuro architectural' }
      ],
      [
        { label: 'Living Galeria Residencial', value: 'living gallery interior' },
        { label: 'Fachada & Paisagismo Noturno', value: 'exterior facade and landscape' },
        { label: 'Adega & Bar Arquitetônico', value: 'bespoke wine cellar and lounge' }
      ],
      [
        { label: 'Crepúsculo (Blue Hour)', value: 'deep blue-hour twilight' },
        { label: 'Noite Fechada (Nighttime)', value: 'pure nighttime darkness' }
      ]
    ),
    presets: [
      {
        id: 'twilight-lighting-study',
        contextId: 'lighting',
        name: 'Estudo Luminotécnico 2700K no Crepúsculo',
        badge: 'IES 2700K',
        description: 'Luz rasante em pedra natural, perfis lineares ocultos, spots antiofuscantes e contraste Blue Hour.',
        quick: {
          style: 'contemporary architectural living gallery showcasing a layered museum-grade lighting design at twilight',
          materials: 'split-face natural stone walls, fluted dark walnut panels, honed travertine floors, and brushed bronze details',
          environment: 'recessed trimless anti-glare pin-spotlights, indirect ceiling cove LED strips, wall-grazing uplights, and magnetic low-voltage track lighting',
          foreground: 'a narrow-beam accent spotlight illuminating a monolithic stone island and suspended glass pendant in the foreground',
          lighting: 'warm 2700K CRI-95 artificial illumination with soft falloff gradients contrasting against deep twilight blue-hour sky',
          mood: 'dramatic, moody, striking, and cinematic',
          technical: 'Physically based IES photometric lighting render, Corona Renderer, realistic light bloom, soft global illumination, no text, 16:9'
        },
        advanced: {
          archStyle: 'layered museum-grade architectural',
          buildingType: 'living gallery interior',
          location: 'deep blue-hour twilight',
          materials: 'split-face textured stone walls, fluted timber wall panels, and honed matte marble surfaces',
          environment: 'recessed trimless anti-glare spotlights, indirect ceiling cove lighting, and grazing wall-washer LED strips',
          foreground: 'narrow-beam accent spotlight on a sculptural table',
          lighting: 'warm 2700K architectural light temperature',
          lightingDetail: 'soft cinematic shadows and subtle warm glow',
          mood: 'dramatic and cinematic',
          renderStyle: 'Corona Renderer, full path-traced global illumination, physically accurate IES photometric lighting profiles',
          extraCommands: 'no text',
          aspectRatio: '16:9'
        }
      }
    ]
  },
  {
    id: 'environment',
    label: 'Ambiente',
    subtitle: 'Integração indoor-outdoor, varandas gourmet, lounges, pátios e atmosfera',
    badge: 'Indoor-Outdoor',
    icon: 'environment',
    connectors: {
      intro: 'Render an immersive architectural environment featuring a ',
      materialsBridge: ', crafted with ',
      environmentBridge: '. Integrate the surrounding landscape with ',
      foregroundBridge: '. In the foreground, include ',
      lightingBridge: '. Bathe the environment in ',
      moodBridge: '. Keep the sensory ambiance ',
      advIntro: 'Render an immersive ',
      advLocationBridge: ' integrated into a ',
      advMaterialsBridge: ' setting, crafted with ',
      advEnvironmentBridge: '. Surround and connect the space with ',
      advForegroundBridge: '. In the foreground, include ',
      advLightingBridge: '. Bathe the scene in ',
      advLightingDetailBridge: ' with ',
      advMoodBridge: '. Keep the sensory ambiance '
    },
    quickFields: ENVIRONMENT_QUICK_FIELDS,
    advancedFields: createAdvancedFieldsForContext(
      ENVIRONMENT_QUICK_FIELDS,
      'Conceito de Integração',
      'Espaço de Convivência',
      'Cenário Natural',
      [
        { label: 'Integração Fluida Indoor-Outdoor', value: 'seamless indoor-outdoor bioclimatic' },
        { label: 'Refúgio Resort Contemporâneo', value: 'luxury resort-style architectural' }
      ],
      [
        { label: 'Varanda Gourmet & Deck', value: 'gourmet veranda and pool lounge' },
        { label: 'Pátio Central com Espelho d’Água', value: 'courtyard sanctuary' }
      ],
      [
        { label: 'Mata Atlântica / Floresta Tropical', value: 'lush tropical rainforest' },
        { label: 'Vale Montanhoso', value: 'serene mountain valley' }
      ]
    ),
    presets: [
      {
        id: 'indoor-outdoor-veranda',
        contextId: 'environment',
        name: 'Varanda Gourmet & Lounge Integrado',
        badge: 'Lazer & Clima',
        description: 'Transição sem barreiras entre estar interno, deck de madeira, piscina infinita e mata nativa.',
        quick: {
          style: 'seamless indoor-outdoor contemporary luxury veranda and gourmet lounge overlooking a tranquil forest valley',
          materials: 'exposed board-formed concrete, vertical wooden louvers, local natural stone, and large floor-to-ceiling glass',
          environment: 'dense tropical foliage and palm trees, layered grasses, and subtle planting',
          foreground: 'sleek infinity pool reflecting the sky and minimalist lounge chairs on a timber deck',
          lighting: 'warm late-afternoon golden-hour light filtering through the trees, with soft cinematic shadows and subtle interior glow',
          mood: 'peaceful, luxurious, natural, and architecture-focused',
          technical: 'Ultra-realistic architectural visualization, soft global illumination, detailed vegetation, no text, 16:9'
        },
        advanced: {
          archStyle: 'seamless indoor-outdoor bioclimatic',
          buildingType: 'gourmet veranda and pool lounge',
          location: 'lush tropical rainforest',
          materials: 'exposed board-formed concrete, vertical wooden louvers, and local natural stone',
          environment: 'dense tropical foliage and palm trees',
          foreground: 'sleek infinity pool reflecting the sky',
          lighting: 'warm late-afternoon golden-hour light filtering through the trees',
          lightingDetail: 'soft cinematic shadows and subtle warm glow',
          mood: 'peaceful, luxurious, natural, and architecture-focused',
          renderStyle: 'Ultra-realistic architectural visualization, soft global illumination, detailed vegetation',
          extraCommands: 'no text',
          aspectRatio: '16:9'
        }
      }
    ]
  },
  {
    id: 'furniture',
    label: 'Móveis',
    subtitle: 'Design de mobiliário autoral e marcenaria arquitetônica sob medida em contexto',
    badge: 'Mobiliário & Marcenaria',
    icon: 'furniture',
    connectors: {
      intro: 'Visualize bespoke architectural furniture and millwork featuring ',
      materialsBridge: ', crafted from ',
      environmentBridge: '. Place the piece within ',
      foregroundBridge: '. Highlight close-up craftsmanship details such as ',
      lightingBridge: '. Illuminate the textures with ',
      moodBridge: '. Keep the presentation ',
      advIntro: 'Visualize a bespoke ',
      advLocationBridge: ' placed within ',
      advMaterialsBridge: ', crafted from ',
      advEnvironmentBridge: '. Complement the setting with ',
      advForegroundBridge: '. Highlight craftsmanship details including ',
      advLightingBridge: '. Light the piece using ',
      advLightingDetailBridge: ' and ',
      advMoodBridge: '. Keep the presentation '
    },
    quickFields: FURNITURE_QUICK_FIELDS,
    advancedFields: createAdvancedFieldsForContext(
      FURNITURE_QUICK_FIELDS,
      'Linguagem do Design',
      'Peça de Mobiliário / Marcenaria',
      'Ambiente de Implantação',
      [
        { label: 'Modernismo Brasileiro Autoral', value: 'authored Brazilian modernist' },
        { label: 'Minimalismo Escultural Orgânico', value: 'sculptural organic minimalist' }
      ],
      [
        { label: 'Mesa de Jantar Escultural', value: 'solid-wood dining table' },
        { label: 'Poltrona de Couro e Madeira', value: 'lounge armchair' },
        { label: 'Estante em Marcenaria Piso-Teto', value: 'floor-to-ceiling custom millwork unit' }
      ],
      [
        { label: 'Galeria Minimalista Iluminada', value: 'a sunlit minimalist architectural gallery' },
        { label: 'Living com Paredes de Cal', value: 'a warm limewash architectural living room' }
      ]
    ),
    presets: [
      {
        id: 'bespoke-modernist-furniture',
        contextId: 'furniture',
        name: 'Mobiliário Autoral em Madeira & Couro',
        badge: 'Design Autoral',
        description: 'Mesa e cadeiras em madeira maciça oleada com encaixes aparentes inseridas em galeria arquitetônica.',
        quick: {
          style: 'bespoke sculptural dining table and ergonomic solid-wood chairs in a refined Brazilian modernist style',
          materials: 'oiled solid Jacarandá and Freijó wood with visible natural grain, hand-stitched saddle leather, and brushed brass joinery details',
          environment: 'a sunlit minimalist architectural room with warm limewash walls, travertine flooring, and soft shadow play',
          foreground: 'softly chamfered timber edges, tactile fabric weave micro-details, and artisan ceramic objects',
          lighting: 'soft daylight filtered through sheer linen curtains',
          mood: 'sophisticated, warm, tactile, and editorial',
          technical: 'Bespoke furniture photography, 50mm lens, shallow depth of field, Corona Renderer, 8k PBR textures, no text, 4:5'
        },
        advanced: {
          archStyle: 'authored Brazilian modernist',
          buildingType: 'solid-wood dining table',
          location: 'a sunlit minimalist architectural gallery',
          materials: 'oiled solid hardwood with rich natural wood grain and hand-stitched full-grain saddle leather',
          environment: 'a minimalist room with warm limewash walls',
          foreground: 'precision chamfered timber edges',
          lighting: 'soft daylight filtered through sheer linen curtains',
          lightingDetail: 'soft cinematic shadows and subtle warm glow',
          mood: 'sophisticated and editorial',
          renderStyle: 'Corona Renderer and V-Ray, 8k resolution, photorealistic',
          extraCommands: '35mm editorial lens, no text',
          aspectRatio: '4:5'
        }
      }
    ]
  },
  {
    id: 'furniture-3d',
    label: 'Móvel/eis em 3D',
    subtitle: 'Render de produto 3D em estúdio infinito, packshot de catálogo e vista explodida',
    badge: 'Asset 3D / Estúdio',
    icon: 'furniture-3d',
    connectors: {
      intro: 'Render a 3D studio product visualization of ',
      materialsBridge: ', constructed with ',
      environmentBridge: '. Set the studio backdrop as ',
      foregroundBridge: '. Showcase 3D mesh and surface details including ',
      lightingBridge: '. Light the studio scene with ',
      moodBridge: '. Keep the product aesthetic ',
      advIntro: 'Render a 3D studio product visualization of a ',
      advLocationBridge: ' presented on ',
      advMaterialsBridge: ', constructed with ',
      advEnvironmentBridge: '. Configure the backdrop with ',
      advForegroundBridge: '. Showcase surface micro-details including ',
      advLightingBridge: '. Use studio lighting with ',
      advLightingDetailBridge: ' and ',
      advMoodBridge: '. Keep the product aesthetic '
    },
    quickFields: FURNITURE_3D_QUICK_FIELDS,
    advancedFields: createAdvancedFieldsForContext(
      FURNITURE_3D_QUICK_FIELDS,
      'Acabamento & Estilo do Modelo 3D',
      'Peça / Conjunto 3D',
      'Ângulo & Fundo de Estúdio',
      [
        { label: 'Design Escultural Contemporâneo', value: 'contemporary sculptural designer' },
        { label: 'Clássico Modernista Mid-Century', value: 'iconic mid-century modernist' }
      ],
      [
        { label: 'Poltrona 3D Isolada', value: 'standalone lounge armchair' },
        { label: 'Sofá Modular 3D', value: 'modular curved sofa' },
        { label: 'Coleção Coordenada de Móveis 3D', value: 'coordinated 3D furniture collection' }
      ],
      [
        { label: 'Fundo Infinito Alabastro (Vista 3/4)', value: 'a seamless warm alabaster cyclorama in a three-quarter angle' },
        { label: 'Fundo Branco Puro #FFFFFF (Catálogo)', value: 'an isolated pure white studio background' }
      ]
    ),
    presets: [
      {
        id: 'studio-3d-armchair-packshot',
        contextId: 'furniture-3d',
        name: 'Packshot 3D de Poltrona em Estúdio',
        badge: 'Estúdio 3D',
        description: 'Render 3D de produto em fundo infinito com iluminação de 3 pontos e texturas PBR 8K.',
        quick: {
          style: 'a standalone designer lounge armchair in a clean three-quarter 3D studio product view',
          materials: 'oiled solid hardwood with rich natural wood grain, hand-stitched full-grain saddle leather, and brushed aged brass',
          environment: 'a seamless warm alabaster studio cyclorama background with realistic ambient occlusion contact shadows',
          foreground: 'realistic fabric tension folds, precision piping seams, open-pore wood grain normal maps, and clean beveled edges',
          lighting: 'three-point photographic studio lighting with a large diffused softbox, soft fill light, and subtle rim light accentuating material contours',
          mood: 'clean, studio-grade, and product-focused',
          technical: 'Ultra-detailed 3D furniture product visualization, Corona and Octane studio render, 85mm prime lens, zero distortion, 8k PBR materials, no text, 1:1'
        },
        advanced: {
          archStyle: 'contemporary sculptural designer',
          buildingType: 'standalone lounge armchair',
          location: 'a seamless warm alabaster cyclorama in a three-quarter angle',
          materials: 'oiled solid hardwood with rich natural wood grain and hand-stitched full-grain saddle leather',
          environment: 'a seamless warm alabaster studio cyclorama',
          foreground: 'realistic fabric tension folds and subtle creases, high-resolution 8K PBR roughness and normal maps',
          lighting: 'three-point photographic studio lighting',
          lightingDetail: 'soft ambient occlusion and realistic surface reflections',
          mood: 'clean, studio-grade, and product-focused',
          renderStyle: 'Ultra-detailed 3D furniture product visualization, Corona and Octane studio render',
          extraCommands: 'no text',
          aspectRatio: '1:1'
        }
      }
    ]
  },
  {
    id: 'floor-plan',
    label: 'Plantas Baixas',
    subtitle: 'Maquete 3D isométrica, planta baixa 2D humanizada e extrusão de planta anexada',
    badge: 'Interativo 2D/3D',
    icon: 'floor-plan',
    connectors: {
      intro: 'Generate an architectural ',
      materialsBridge: ', featuring floor and wall materials of ',
      environmentBridge: '. Organize the floor plan layout with ',
      foregroundBridge: '. Populate the interior zones with ',
      lightingBridge: '. Illuminate the plan using ',
      moodBridge: '. Keep the presentation ',
      advIntro: 'Generate an architectural ',
      advLocationBridge: ' for a ',
      advMaterialsBridge: ', featuring ',
      advEnvironmentBridge: '. Organize the spatial zoning with ',
      advForegroundBridge: '. Populate each room with ',
      advLightingBridge: '. Illuminate the floor plan with ',
      advLightingDetailBridge: ' and ',
      advMoodBridge: '. Keep the presentation '
    },
    quickFields: FLOOR_PLAN_QUICK_FIELDS,
    advancedFields: createAdvancedFieldsForContext(
      FLOOR_PLAN_QUICK_FIELDS,
      'Tipo de Projeção da Planta',
      'Tipologia do Imóvel',
      'Fidelidade & Corte de Parede',
      [
        { label: 'Maquete Isométrica 3D (45° Cutaway)', value: '3D isometric 45-degree cutaway floor plan' },
        { label: 'Planta Humanizada 2D (90° Top-Down)', value: 'top-down 90-degree orthographic humanized floor plan' },
        { label: 'Axonométrica Explodida', value: 'exploded axonometric 3D floor plan' }
      ],
      [
        { label: 'Residência Térrea Contemporânea', value: 'contemporary single-story luxury residence' },
        { label: 'Apartamento Studio / Loft', value: 'modern open-plan studio apartment' },
        { label: ' cobertura Duplex / Penthouse', value: 'luxury penthouse apartment' }
      ],
      [
        { label: 'Fidelidade Estrita à Planta Anexada (Paredes 2.8m)', value: 'strictly preserving the attached reference floor plan walls extruded to 2.8m height' },
        { label: 'Paredes Meia-Altura (1.4m Cutaway)', value: 'with clean 1.4m half-height cutaway walls for unobstructed interior visibility' }
      ]
    ),
    presets: [
      {
        id: 'isometric-3d-floorplan',
        contextId: 'floor-plan',
        name: 'Maquete Isométrica 3D a partir de Planta',
        badge: '3D Cutaway 45°',
        description: 'Converte planta baixa 2D em maquete 3D isométrica mobiliada com pisos realistas e sombras a 45°.',
        quick: {
          style: '3D isometric cutaway floor plan of a contemporary luxury residence, strictly following the attached reference floor plan walls, doors, and window openings',
          materials: 'warm oak parquet in bedrooms, large-format travertine stone in social areas, slatted timber decking on the terrace, and crisp white architectural cut-wall pochés',
          environment: 'integrated living and dining room, gourmet island kitchen, master bedroom suite with walk-in closet, spa bathroom, and outdoor pool deck',
          foreground: 'accurately scaled contemporary furniture, textured area rugs defining circulation zones, built-in millwork cabinetry, sanitary fixtures, and indoor potted plants',
          lighting: 'soft 45-degree directional daylight casting clean volumetric shadows inside the rooms, balanced with even ambient occlusion',
          mood: 'clear, organized, and architecturally legible',
          technical: 'Ultra-detailed architectural floor plan visualization, V-Ray render, crisp edges, no text labels, no dimension lines, no numbers, 1:1'
        },
        advanced: {
          archStyle: '3D isometric 45-degree cutaway floor plan',
          buildingType: 'contemporary single-story luxury residence',
          location: 'strictly preserving the attached reference floor plan walls extruded to 2.8m height',
          materials: 'warm oak wood flooring in the private suites, large-format stone tiles in the living and kitchen zones, and crisp white architectural cut-wall tops',
          environment: 'integrated open-concept living and dining area, gourmet kitchen with central stone island, and master bedroom suite with walk-in closet and en-suite bath',
          foreground: 'accurately scaled contemporary furniture and textured area rugs defining each functional zone',
          lighting: 'soft 45-degree directional sunlight casting clean volumetric room shadows',
          lightingDetail: 'soft ambient occlusion',
          mood: 'clear, organized, and architecturally legible',
          renderStyle: 'Ultra-sharp architectural edges, 8k resolution, V-Ray and Corona Renderer',
          extraCommands: 'no text, no dimension lines',
          aspectRatio: '1:1'
        }
      },
      {
        id: 'humanized-2d-topdown-plan',
        contextId: 'floor-plan',
        name: 'Planta Humanizada 2D Top-Down (90°)',
        badge: '2D Humanizada',
        description: 'Vista ortogonal 90° superior para apresentação comercial com texturas de piso, tapetes e vegetação.',
        quick: {
          style: 'top-down 90-degree orthographic humanized architectural floor plan with realistic textures and furniture layout',
          materials: 'warm oak wood flooring in the private suites, large-format stone tiles in the living and kitchen zones, and solid charcoal architectural wall poché',
          environment: 'integrated open-concept living and dining area, gourmet kitchen with central stone island, master bedroom suite, and outdoor gourmet veranda',
          foreground: 'accurately scaled contemporary furniture, textured area rugs defining each functional zone, built-in wardrobes, kitchen counters, and subtle indoor plants',
          lighting: 'soft 45-degree directional sunlight casting clean volumetric room shadows and crisp ambient occlusion along wall-floor junctions',
          mood: 'refined, tactile, and client-presentation ready',
          technical: 'Ultra-detailed architectural floor plan presentation board, top-down orthographic projection, no text labels, no dimension lines, 1:1'
        },
        advanced: {
          archStyle: 'top-down 90-degree orthographic humanized floor plan',
          buildingType: 'contemporary single-story luxury residence',
          location: 'strictly preserving the attached reference floor plan walls extruded to 2.8m height',
          materials: 'warm oak wood flooring in the private suites, large-format stone tiles in the living and kitchen zones, and solid charcoal architectural wall poché',
          environment: 'integrated open-concept living and dining area and gourmet kitchen with central stone island',
          foreground: 'accurately scaled contemporary furniture and textured area rugs defining each functional zone',
          lighting: 'soft 45-degree directional sunlight casting clean volumetric room shadows',
          lightingDetail: 'soft ambient occlusion',
          mood: 'refined, tactile, and client-presentation ready',
          renderStyle: 'Ultra-sharp architectural edges, 8k resolution',
          extraCommands: 'no text, no dimension lines',
          aspectRatio: '1:1'
        }
      }
    ]
  }
]

// ============================================================================
// CAMPO GLOBAL DE DIRETRIZ DE IMAGEM(NS) DE REFERÊNCIA ENVIADA(S) COM O PROMPT
// ============================================================================
export const REFERENCE_IMAGE_FIELD: ArchFieldConfig<'imageRef'> = {
  id: 'imageRef',
  phase: 0,
  phaseTitle: 'Imagem(ns) de Referência no Prompt',
  label: 'Attached Image Directive',
  labelPt: 'Referência à(s) Imagem(ns) Enviada(s) com o Prompt',
  description:
    'Instrua a IA sobre como utilizar a(s) imagem(ns) que você anexar junto com o prompt (print do 3D/SketchUp, croqui, planta baixa, foto do local ou referências de materiais/estilo). Deixe em branco se não for enviar imagem.',
  guideTip:
    'Ao enviar mais de uma imagem na IA, especifique o papel de cada uma (ex: Imagem 1 para geometria/estrutura e Imagem 2 para estilo/materiais).',
  icon: 'layers',
  accent: 'amber',
  placeholder:
    'Ex: strictly following the exact architectural geometry and camera angle from the attached reference image (deixe vazio se não anexar imagem)',
  joinWithAnd: true,
  options: [
    {
      value:
        'strictly following the exact architectural geometry, massing, proportions, and camera angle from the attached reference image',
      labelPt:
        'Print 3D / Croqui (1 Imagem): Seguir estritamente a geometria, volumetria, proporções e ângulo da imagem enviada'
    },
    {
      value:
        'preserving the exact building geometry and perspective from the first attached image while applying the surface materials, textures, and lighting mood from the second attached reference image',
      labelPt:
        '2 Imagens Anexas: Manter a geometria/perspectiva da 1ª imagem e aplicar materiais e iluminação da 2ª imagem'
    },
    {
      value:
        'preserving the spatial layout from the first attached image, applying the wall and floor finishes from the second image, and incorporating the furniture pieces from the third attached reference image',
      labelPt:
        '3 Imagens Anexas: 1ª Imagem (Espaço/Layout) + 2ª Imagem (Revestimentos) + 3ª Imagem (Mobiliário)'
    },
    {
      value:
        'using the attached reference image as visual inspiration for the architectural style, lighting atmosphere, and color palette',
      labelPt:
        'Moodboard / Estilo: Usar a imagem enviada apenas como referência estética, atmosfera e paleta de cores'
    },
    {
      value:
        'applying the exact surface materials, textures, and finishes shown in the attached reference images to the architectural surfaces',
      labelPt:
        'Amostra de Materiais: Aplicar os materiais, texturas e revestimentos exatos mostrados nas imagens anexas'
    },
    {
      value:
        'keeping the existing spatial structure, walls, windows, and camera perspective from the attached photo while upgrading only the finishes, lighting, and furniture',
      labelPt:
        'Foto do Local (Reforma / Retrofit): Manter paredes, janelas e ângulo da foto enviada, renovando apenas acabamentos e mobiliário'
    },
    {
      value:
        'seamlessly integrating the architectural design into the real site photograph provided in the attached image, matching its perspective, horizon line, and natural sunlight',
      labelPt:
        'Foto Real do Terreno: Implantar o projeto na foto do terreno enviada, respeitando perspectiva e luz solar'
    },
    {
      value:
        'extruding and rendering the scene strictly based on the exact wall layout, room proportions, doors, and window openings of the attached floor plan image',
      labelPt:
        'Planta Baixa Anexada: Levantar e renderizar o espaço seguindo exatamente paredes, portas e janelas da planta enviada'
    },
    {
      value:
        'incorporating the exact furniture pieces, lighting fixtures, and decor objects shown in the attached reference images into the scene',
      labelPt:
        'Mobiliário / Objetos de Referência: Inserir no ambiente as peças de mobiliário e luminárias exatas das imagens enviadas'
    }
  ],
  chips: [
    {
      label: 'Seguir Geometria/Câmera da Imagem (Print 3D / Croqui)',
      value:
        'strictly following the exact architectural geometry, proportions, and camera angle from the attached reference image'
    },
    {
      label: 'Imagem 1 (Geometria/Base) + Imagem 2 (Estilo/Materiais)',
      value:
        'preserving the exact building geometry and perspective from the first attached image while applying the materials and lighting mood from the second attached reference image'
    },
    {
      label: 'Seguir Estilo e Atmosfera da Imagem (Moodboard)',
      value:
        'using the attached reference image as visual inspiration for the architectural style, lighting atmosphere, and color palette'
    },
    {
      label: 'Aplicar Materiais/Texturas da(s) Imagem(ns)',
      value:
        'applying the exact surface materials, textures, and finishes shown in the attached reference images'
    },
    {
      label: 'Manter Foto do Local e Reformar Acabamentos',
      value:
        'keeping the existing spatial structure and perspective from the attached photo while upgrading the finishes, lighting, and decor'
    },
    {
      label: 'Inserir Projeto na Foto do Terreno Enviada',
      value:
        'seamlessly integrating the architectural design into the real site photograph provided in the attached image'
    },
    {
      label: 'Seguir Paredes e Layout da Planta Anexa',
      value:
        'extruding and rendering the scene strictly following the exact wall layout, doors, and windows of the attached floor plan image'
    },
    {
      label: 'Inserir Mobiliário/Objeto da Imagem Anexa',
      value:
        'incorporating the exact furniture pieces and fixtures shown in the attached reference images'
    }
  ]
}

// Backwards-compatible exports
export const QUICK_FIELDS = EXTERIOR_QUICK_FIELDS
export const ADVANCED_FIELDS = ARCH_CONTEXTS[0].advancedFields
export const CURATED_PRESETS = ARCH_CONTEXTS.flatMap(c => c.presets)
