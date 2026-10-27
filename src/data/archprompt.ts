export type PromptMode = 'quick' | 'advanced'

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
  name: string
  badge: string
  description: string
  quick: QuickPromptData
  advanced: AdvancedPromptData
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
      'Define a ação ("Render"), o estilo principal ("refined contemporary luxury residence") e a localização geral ("natural forest hillside setting").',
    placement:
      'Sempre no início. Os modelos de geração de imagem dão maior peso semântico às primeiras palavras do prompt.',
    accent: 'blue'
  },
  {
    phase: 2,
    tag: 'MÉDIO · ESTRUTURA E TEXTURA',
    title: 'Fase 2: Materialidade e Design',
    originalText:
      '"...using warm off-white masonry, natural timber, large floor-to-ceiling glass, and dark metal frames."',
    whatItDoes:
      'Dá textura, cor e substância física ao sujeito principal. É aqui que você define do que a edificação é construída.',
    placement:
      'Logo após definir o sujeito principal, para que a IA aplique esses materiais diretamente à estrutura recém-criada.',
    accent: 'orange'
  },
  {
    phase: 3,
    tag: 'MICRO · BACKGROUND E MIDGROUND',
    title: 'Fase 3: Paisagismo e Entorno',
    originalText:
      '"Surround the house with mature pine trees, layered grasses, shrubs, and subtle planting."',
    whatItDoes:
      'Preenche o fundo e as laterais da cena, integrando organicamente a arquitetura ao bioma e ao terreno.',
    placement:
      'Após a materialidade da construção, estabelecendo o contexto ambiental imediato ao redor do edifício.',
    accent: 'emerald'
  },
  {
    phase: 4,
    tag: 'PROFUNDIDADE · PRIMEIRO PLANO',
    title: 'Fase 4: Elementos de Composição (Foreground)',
    originalText:
      '"Add a calm natural pond in the foreground with realistic reflections, soft ripples, shoreline stones, and a small rustic wooden rowboat."',
    whatItDoes:
      'Cria sensação tridimensional de profundidade. Especificar elementos no primeiro plano ajuda a IA a compor a cena em camadas (frente, meio e fundo).',
    placement:
      'Após o paisagismo geral, direcionando o olhar do observador desde a borda inferior da imagem até a arquitetura.',
    accent: 'cyan'
  },
  {
    phase: 5,
    tag: 'ATMOSFERA · LUZ E CLIMA',
    title: 'Fase 5: Iluminação, Clima e Atmosfera',
    originalText:
      '"Use warm late-afternoon golden-hour light filtering through the trees, with soft cinematic shadows and subtle interior glow. Keep the scene peaceful, luxurious, natural, and architecture-focused."',
    whatItDoes:
      'A luz define o fotorrealismo. Termos como "golden-hour", "cinematic shadows" e "interior glow" criam contraste realista, enquanto o "mood" orienta a paleta de cores.',
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
      'Atuam como modificadores de qualidade. Garantem um render 3D fotorrealista em vez de ilustração, além de definir restrições (no text) e proporção (1:1, 16:9).',
    placement:
      'Sempre no final. Funcionam como instruções técnicas estritas de pós-processamento e formatação.',
    accent: 'purple'
  }
]

export const QUICK_FIELDS: ArchFieldConfig<QuickFieldId>[] = [
  {
    id: 'style',
    phase: 1,
    phaseTitle: 'Fase 1 · Macro',
    label: 'Style & Subject',
    labelPt: 'Estilo & Sujeito Principal',
    description: 'Defina o estilo arquitetônico, tipologia e o contexto principal da construção.',
    guideTip: 'A IA dá mais peso às primeiras palavras: combine estilo + tipo de prédio + cenário.',
    icon: 'home',
    accent: 'blue',
    placeholder: 'Ex: refined contemporary luxury residence in a natural forest hillside setting',
    joinWithAnd: false,
    options: [
      {
        value: 'refined contemporary luxury residence in a natural forest hillside setting',
        labelPt: 'Residência contemporânea de luxo em encosta florestal (Referência do Guia)'
      },
      {
        value: 'brutalist concrete mansion perched on a dramatic coastal cliffside',
        labelPt: 'Mansão brutalista em concreto sobre penhasco costeiro'
      },
      {
        value: 'minimalist glass pavilion nestled in a serene Japanese zen garden',
        labelPt: 'Pavilhão minimalista de vidro em jardim zen japonês'
      },
      {
        value: 'sustainable eco-lodge integrated into a dense tropical rainforest canopy',
        labelPt: 'Eco-lodge sustentável integrado à copa da floresta tropical'
      },
      {
        value: 'Nordic timber cabin in a snowy alpine mountain valley',
        labelPt: 'Cabana nórdica de madeira em vale alpino nevado'
      },
      {
        value: 'parametric futuristic cultural museum in a modern urban plaza',
        labelPt: 'Museu cultural paramétrico futurista em praça urbana'
      }
    ],
    chips: [
      { label: 'Luxo Contemporâneo', value: 'refined contemporary luxury residence' },
      { label: 'Mansão Brutalista', value: 'brutalist concrete mansion' },
      { label: 'Pavilhão Minimalista', value: 'minimalist glass pavilion' },
      { label: 'Eco-Lodge Sustentável', value: 'sustainable eco-lodge' },
      { label: 'Cabana Alpina', value: 'modern Nordic mountain cabin' },
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
    label: 'Materials',
    labelPt: 'Materialidade & Design',
    description: 'Materiais de construção, revestimentos, esquadrias e texturas da fachada.',
    guideTip: 'Combine de 3 a 4 materiais contrastantes (ex: alvenaria quente + madeira + vidro + metal escuro).',
    icon: 'box',
    accent: 'orange',
    placeholder: 'Ex: warm off-white masonry, natural timber, large floor-to-ceiling glass, and dark metal frames',
    joinWithAnd: true,
    options: [
      {
        value: 'warm off-white masonry, natural timber, large floor-to-ceiling glass, and dark metal frames',
        labelPt: 'Alvenaria off-white quente, madeira natural, vidro piso-teto e esquadrias metálicas escuras'
      },
      {
        value: 'exposed board-formed concrete, weathered corten steel, and expansive frameless glazing',
        labelPt: 'Concreto aparente ripado, aço corten patinado e amplos painéis de vidro sem caixilho'
      },
      {
        value: 'reclaimed teak wood, local limestone, rammed earth walls, and structural glass',
        labelPt: 'Madeira teca de demolição, pedra calcária local, taipa de pilão e vidro estrutural'
      },
      {
        value: 'charred cedar Shou Sugi Ban, matte black aluminum, and double-height glass facades',
        labelPt: 'Madeira carbonizada (Shou Sugi Ban), alumínio preto fosco e vidro de pé-direito duplo'
      },
      {
        value: 'smooth white stucco, natural travertine marble, warm oak louvers, and bronze accents',
        labelPt: 'Estuque branco liso, mármore travertino natural, brises de carvalho e detalhes em bronze'
      }
    ],
    chips: [
      { label: 'Alvenaria Off-White', value: 'warm off-white masonry' },
      { label: 'Madeira Natural', value: 'natural timber' },
      { label: 'Vidro Piso-Teto', value: 'large floor-to-ceiling glass' },
      { label: 'Esquadrias Escuras', value: 'dark metal frames' },
      { label: 'Concreto Aparente', value: 'exposed board-formed concrete' },
      { label: 'Aço Corten', value: 'corten steel' },
      { label: 'Pedra Natural', value: 'local natural stone' },
      { label: 'Brises de Madeira', value: 'vertical wooden louvers' },
      { label: 'Mármore Travertino', value: 'honed travertine stone' },
      { label: 'Taipa de Pilão', value: 'rammed earth walls' }
    ]
  },
  {
    id: 'environment',
    phase: 3,
    phaseTitle: 'Fase 3 · Micro',
    label: 'Environment',
    labelPt: 'Paisagismo & Entorno',
    description: 'Vegetação, árvores, topografia e elementos que envolvem a edificação.',
    guideTip: 'Descreva a vegetação em camadas (árvores altas, arbustos médios e forrações sutis).',
    icon: 'trees',
    accent: 'emerald',
    placeholder: 'Ex: mature pine trees, layered grasses, shrubs, and subtle planting',
    joinWithAnd: true,
    options: [
      {
        value: 'mature pine trees, layered grasses, shrubs, and subtle planting',
        labelPt: 'Pinheiros maduros, gramíneas em camadas, arbustos e paisagismo sutil'
      },
      {
        value: 'dense tropical jungle, lush giant ferns, monsteras, and swaying palm trees',
        labelPt: 'Selva tropical densa, samambaias gigantes, costelas-de-adão e palmeiras'
      },
      {
        value: 'arid desert landscape, sculptural agave plants, saguaro cacti, and red rock formations',
        labelPt: 'Paisagem desértica árida, agaves esculturais, cactos e formações rochosas avermelhadas'
      },
      {
        value: 'snow-covered evergreen pines, frost-kissed boulders, and misty mountain peaks',
        labelPt: 'Pinheiros cobertos de neve, rochas congeladas e picos montanhosos na neblina'
      },
      {
        value: 'ancient Mediterranean olive trees, lavender bushes, cypress trees, and terraced stone walls',
        labelPt: 'Oliveiras mediterrâneas, lavandas, ciprestes e muros de pedra em patamares'
      }
    ],
    chips: [
      { label: 'Pinheiros Maduros', value: 'mature pine trees' },
      { label: 'Gramíneas em Camadas', value: 'layered grasses' },
      { label: 'Arbustos & Plantio Sutil', value: 'shrubs and subtle planting' },
      { label: 'Vegetação Tropical', value: 'dense tropical foliage and palm trees' },
      { label: 'Cactos & Rochas', value: 'arid desert bushes and red rock formations' },
      { label: 'Pinheiros com Neve', value: 'snow-covered pine trees' },
      { label: 'Oliveiras & Lavanda', value: 'ancient olive trees and lavender bushes' },
      { label: 'Jardim de Pedras Zen', value: 'minimalist moss and sculpted boulders' }
    ]
  },
  {
    id: 'foreground',
    phase: 4,
    phaseTitle: 'Fase 4 · Profundidade',
    label: 'Foreground',
    labelPt: 'Composição de Primeiro Plano',
    description: 'Elementos posicionados à frente da câmera para criar camadas e profundidade tridimensional.',
    guideTip: 'Incluir água, reflexos, pedras ou caminhos no primeiro plano multiplica o realismo da cena.',
    icon: 'layers',
    accent: 'cyan',
    placeholder: 'Ex: calm natural pond in the foreground with realistic reflections, soft ripples, shoreline stones, and a small rustic wooden rowboat',
    joinWithAnd: true,
    options: [
      {
        value: 'calm natural pond in the foreground with realistic reflections, soft ripples, shoreline stones, and a small rustic wooden rowboat',
        labelPt: 'Lago natural calmo com reflexos realistas, ondulações suaves, pedras na margem e barco a remo rústico'
      },
      {
        value: 'sleek infinity pool in the foreground reflecting the architecture, with minimalist lounge chairs and timber decking',
        labelPt: 'Piscina de borda infinita espelhando a arquitetura, com espreguiçadeiras minimalistas e deck'
      },
      {
        value: 'winding stepping-stone pathway in the foreground through wildflower meadow and morning dew',
        labelPt: 'Caminho sinuoso de pisantes de pedra entre flores silvestres e orvalho da manhã'
      },
      {
        value: 'wet dark asphalt street in the foreground with rain puddles reflecting warm architectural lights and a sleek modern sports car',
        labelPt: 'Asfalto escuro molhado com poças refletindo as luzes da arquitetura e carro esportivo moderno'
      },
      {
        value: 'sunken concrete firepit lounge in the foreground with glowing embers and built-in seating',
        labelPt: 'Lounge rebaixado em concreto com lareira externa acesa e bancos integrados'
      }
    ],
    chips: [
      { label: 'Lago Natural com Reflexos', value: 'calm natural pond in the foreground with realistic reflections' },
      { label: 'Ondulações & Pedras na Margem', value: 'soft ripples and shoreline stones' },
      { label: 'Barco de Madeira Rústico', value: 'a small rustic wooden rowboat' },
      { label: 'Piscina Borda Infinita', value: 'sleek infinity pool reflecting the sky' },
      { label: 'Deck com Espreguiçadeiras', value: 'minimalist lounge chairs on a timber deck' },
      { label: 'Caminho de Pedras', value: 'stepping stone pathway through low grasses' },
      { label: 'Asfalto Molhado com Reflexos', value: 'wet asphalt with realistic mirror reflections' },
      { label: 'Lareira Externa (Firepit)', value: 'sunken outdoor firepit with warm glowing embers' }
    ]
  },
  {
    id: 'lighting',
    phase: 5,
    phaseTitle: 'Fase 5A · Iluminação',
    label: 'Lighting',
    labelPt: 'Iluminação & Sombras',
    description: 'Condições de luz natural, horário do dia, sombras e iluminação interna da arquitetura.',
    guideTip: 'Combinar luz natural externa (ex: golden-hour) com brilho interno sutil (subtle interior glow) dá vida à arquitetura.',
    icon: 'sun',
    accent: 'amber',
    placeholder: 'Ex: warm late-afternoon golden-hour light filtering through the trees, with soft cinematic shadows and subtle interior glow',
    joinWithAnd: true,
    options: [
      {
        value: 'warm late-afternoon golden-hour light filtering through the trees, with soft cinematic shadows and subtle interior glow',
        labelPt: 'Luz dourada de fim de tarde filtrada pelas árvores, sombras cinematográficas e brilho interno sutil'
      },
      {
        value: 'moody overcast morning sky with soft diffused ambient lighting, delicate mist, and warm inviting interior lights',
        labelPt: 'Manhã nublada dramática com luz difusa suave, neblina delicada e luzes internas aconchegantes'
      },
      {
        value: 'bright clear midday sun casting crisp geometric architectural shadows and sparkling water reflections',
        labelPt: 'Sol claro de meio-dia projetando sombras geométricas nítidas e reflexos brilhantes na água'
      },
      {
        value: 'deep twilight blue-hour illumination with glowing warm architectural LED strips and recessed interior spotlights',
        labelPt: 'Hora azul do crepúsculo com fitas de LED arquitetônicas quentes e spots internos acesos'
      },
      {
        value: 'soft sunrise light with volumetric god rays cutting through morning fog and gentle long shadows',
        labelPt: 'Luz suave de amanhecer com raios volumétricos cortando a névoa matinal e sombras longas'
      }
    ],
    chips: [
      { label: 'Golden Hour (Fim de Tarde)', value: 'warm late-afternoon golden-hour light filtering through the trees' },
      { label: 'Sombras Cinematográficas', value: 'soft cinematic shadows' },
      { label: 'Brilho Interno Sutil', value: 'subtle warm interior glow' },
      { label: 'Blue Hour (Crepúsculo)', value: 'deep blue-hour twilight lighting' },
      { label: 'Manhã Nublada Difusa', value: 'moody overcast sky with soft diffused lighting' },
      { label: 'Sol Forte & Sombras Nítidas', value: 'bright midday sun with sharp architectural shadows' },
      { label: 'Neblina & Raios de Luz', value: 'volumetric morning mist and god rays' }
    ]
  },
  {
    id: 'mood',
    phase: 5,
    phaseTitle: 'Fase 5B · Atmosfera',
    label: 'Mood',
    labelPt: 'Atmosfera & Sentimento',
    description: 'Adjetivos que orientam a paleta de cores, a sensação emocional e o foco da composição.',
    guideTip: 'Adjetivos claros como "peaceful, luxurious, architecture-focused" evitam que a IA polua a cena.',
    icon: 'palette',
    accent: 'pink',
    placeholder: 'Ex: peaceful, luxurious, natural, and architecture-focused',
    joinWithAnd: true,
    options: [
      {
        value: 'peaceful, luxurious, natural, and architecture-focused',
        labelPt: 'Pacífica, luxuosa, natural e focada na arquitetura'
      },
      {
        value: 'dramatic, moody, striking, and cinematic',
        labelPt: 'Dramática, intimista, impactante e cinematográfica'
      },
      {
        value: 'serene, meditative, minimalist, and timeless',
        labelPt: 'Serena, meditativa, minimalista e atemporal'
      },
      {
        value: 'vibrant, lively, inviting, warm, and open',
        labelPt: 'Vibrante, viva, convidativa, acolhedora e aberta'
      },
      {
        value: 'imposing, monolithic, raw, and contemplative',
        labelPt: 'Imponente, monolítica, bruta e contemplativa'
      }
    ],
    chips: [
      { label: 'Pacífica', value: 'peaceful' },
      { label: 'Luxuosa', value: 'luxurious' },
      { label: 'Natural', value: 'natural' },
      { label: 'Focada na Arquitetura', value: 'architecture-focused' },
      { label: 'Dramática & Cinematográfica', value: 'dramatic and cinematic' },
      { label: 'Serena & Minimalista', value: 'serene and minimalist' },
      { label: 'Acolhedora & Convidativa', value: 'warm and inviting' },
      { label: 'Imponente & Monolítica', value: 'imposing and monolithic' }
    ]
  },
  {
    id: 'technical',
    phase: 6,
    phaseTitle: 'Fase 6 · Técnico',
    label: 'Technical',
    labelPt: 'Parâmetros Técnicos & Render',
    description: 'Comandos finais de qualidade de renderização, iluminação global, prompt negativo e proporção.',
    guideTip: 'Sempre finalize com qualificadores de render 3D realista, "no text" e o aspect ratio desejado.',
    icon: 'settings',
    accent: 'purple',
    placeholder: 'Ex: Ultra-realistic architectural visualization, soft global illumination, detailed vegetation, no text, 1:1',
    joinWithAnd: false,
    options: [
      {
        value: 'Ultra-realistic architectural visualization, soft global illumination, detailed vegetation, no text, 1:1',
        labelPt: 'Visualização arquitetônica ultra-realista, iluminação global suave, vegetação detalhada, sem texto, 1:1'
      },
      {
        value: 'Unreal Engine 5 render, path tracing, photorealistic architectural photography, 8k resolution, highly detailed, no text, 16:9',
        labelPt: 'Render Unreal Engine 5, path tracing, fotografia arquitetônica fotorrealista, 8K, sem texto, 16:9'
      },
      {
        value: 'V-Ray and Corona Renderer masterpiece, ArchDaily editorial photography, 24mm tilt-shift lens, crisp details, no people, no text, 4:5',
        labelPt: 'V-Ray & Corona Renderer, fotografia editorial ArchDaily, lente 24mm tilt-shift, sem pessoas, 4:5'
      },
      {
        value: 'Octane render, physically based rendering, ray-traced reflections, cinematic color grading, 8k, no watermark, no text, 16:9',
        labelPt: 'Octane Render, PBR, reflexos ray-tracing, color grading cinematográfico, 8K, 16:9'
      },
      {
        value: 'architectural sketch style, watercolor wash, loose ink lines, conceptual presentation board, 1:1',
        labelPt: 'Croqui arquitetônico conceitual, aquarela suave e linhas de nanquim, 1:1'
      }
    ],
    chips: [
      { label: 'Ultra-realistic ArchViz', value: 'Ultra-realistic architectural visualization' },
      { label: 'Soft Global Illumination', value: 'soft global illumination' },
      { label: 'Detailed Vegetation', value: 'detailed vegetation' },
      { label: '8K Photorealistic', value: '8k resolution, photorealistic' },
      { label: 'Unreal Engine 5 / Path Tracing', value: 'Unreal Engine 5, path tracing' },
      { label: 'V-Ray / Corona Render', value: 'V-Ray and Corona Renderer' },
      { label: 'Lente 24mm Tilt-Shift', value: '24mm tilt-shift architectural lens' },
      { label: 'Sem Texto (no text)', value: 'no text' },
      { label: 'Sem Pessoas (no people)', value: 'no people' },
      { label: '1:1', value: '1:1' },
      { label: '16:9', value: '16:9' },
      { label: '9:16', value: '9:16' }
    ]
  }
]

export const ADVANCED_FIELDS: ArchFieldConfig<AdvancedFieldId>[] = [
  {
    id: 'archStyle',
    phase: 1,
    phaseTitle: 'Fase 1A · Estilo (Macro)',
    label: 'Architectural Style',
    labelPt: 'Estilo Arquitetônico',
    description: 'A linguagem arquitetônica predominante do projeto.',
    guideTip: 'Use adjetivos qualificadores como "refined contemporary", "raw brutalist" ou "warm minimalist".',
    icon: 'sparkles',
    accent: 'blue',
    placeholder: 'Ex: refined contemporary luxury',
    joinWithAnd: false,
    options: [
      { value: 'refined contemporary luxury', labelPt: 'Contemporâneo de luxo refinado' },
      { value: 'raw brutalist monolithic', labelPt: 'Brutalista monolítico em concreto' },
      { value: 'warm minimalist Nordic', labelPt: 'Minimalista aconchegante nórdico' },
      { value: ' tropical modernist Brazilian', labelPt: 'Modernista tropical brasileiro' },
      { value: 'organic parametric futuristic', labelPt: 'Paramétrico orgânico futurista' },
      { value: 'Japanese wabi-sabi zen', labelPt: 'Japonês Wabi-Sabi Zen' }
    ],
    chips: [
      { label: 'Contemporâneo de Luxo', value: 'refined contemporary luxury' },
      { label: 'Brutalista', value: 'brutalist' },
      { label: 'Minimalista', value: 'minimalist' },
      { label: 'Modernista Tropical', value: 'tropical modernist' },
      { label: 'Nórdico / Escandinavo', value: 'Nordic minimalist' },
      { label: 'Paramétrico / Orgânico', value: 'organic parametric' },
      { label: 'Industrial Contemporâneo', value: 'contemporary industrial' },
      { label: 'Neoclássico', value: 'neoclassical' }
    ]
  },
  {
    id: 'buildingType',
    phase: 1,
    phaseTitle: 'Fase 1B · Tipologia (Macro)',
    label: 'Building Type',
    labelPt: 'Tipo de Construção',
    description: 'A função ou tipologia do edifício principal.',
    guideTip: 'Defina claramente se é uma residência, cabana, pavilhão, museu ou edifício vertical.',
    icon: 'building',
    accent: 'blue',
    placeholder: 'Ex: residence',
    singleSelectChip: true,
    joinWithAnd: false,
    options: [
      { value: 'residence', labelPt: 'Residência unifamiliar' },
      { value: 'cliffside villa', labelPt: 'Villa na encosta/penhasco' },
      { value: 'glass pavilion', labelPt: 'Pavilhão de vidro' },
      { value: 'mountain cabin', labelPt: 'Cabana de montanha' },
      { value: 'boutique eco-lodge', labelPt: 'Eco-lodge boutique' },
      { value: 'cultural museum', labelPt: 'Museu cultural' },
      { value: 'high-rise tower', labelPt: 'Torre / Skyscraper' }
    ],
    chips: [
      { label: 'Residência (Residence)', value: 'residence' },
      { label: 'Mansão / Villa', value: 'villa' },
      { label: 'Cabana (Cabin)', value: 'cabin' },
      { label: 'Pavilhão (Pavilion)', value: 'pavilion' },
      { label: 'Eco-Lodge', value: 'eco-lodge' },
      { label: 'Museu (Museum)', value: 'museum' },
      { label: 'Arranha-céu (Skyscraper)', value: 'skyscraper' },
      { label: 'Casa de Praia (Beach House)', value: 'beach house' }
    ]
  },
  {
    id: 'location',
    phase: 1,
    phaseTitle: 'Fase 1C · Bioma (Macro)',
    label: 'Location & Biome',
    labelPt: 'Localização & Bioma',
    description: 'O cenário geográfico ou ambiente onde a obra está implantada.',
    guideTip: 'O bioma orienta a luz indireta e o horizonte da imagem.',
    icon: 'compass',
    accent: 'blue',
    placeholder: 'Ex: natural forest hillside',
    singleSelectChip: true,
    joinWithAnd: false,
    options: [
      { value: 'natural forest hillside', labelPt: 'Encosta de floresta natural' },
      { value: 'snowy alpine mountain', labelPt: 'Montanha alpina nevada' },
      { value: 'arid red-rock desert cliff', labelPt: 'Penhasco em deserto de rochas vermelhas' },
      { value: 'tropical coastal beachfront', labelPt: 'Beira-mar em costa tropical' },
      { value: 'misty Nordic fjord shoreline', labelPt: 'Margem de fiorde nórdico com neblina' },
      { value: 'bustling cosmopolitan urban downtown', labelPt: 'Centro urbano cosmopolita' }
    ],
    chips: [
      { label: 'Encosta Florestal', value: 'natural forest hillside' },
      { label: 'Montanha Nevada', value: 'snowy mountain' },
      { label: 'Penhasco no Deserto', value: 'desert cliff' },
      { label: 'Costa Tropical', value: 'tropical beachfront' },
      { label: 'Fiorde Nebuloso', value: 'misty fjord coastline' },
      { label: 'Centro Urbano', value: 'urban downtown' },
      { label: 'Campo Mediterrâneo', value: 'Mediterranean countryside' }
    ]
  },
  {
    id: 'materials',
    phase: 2,
    phaseTitle: 'Fase 2 · Materialidade (Médio)',
    label: 'Materials & Textures',
    labelPt: 'Materiais Principais & Texturas',
    description: 'Materiais construtivos, acabamentos de fachada e esquadrias.',
    guideTip: 'Liste os materiais em ordem de predominância visual na fachada.',
    icon: 'box',
    accent: 'orange',
    placeholder: 'Ex: warm off-white masonry, natural timber, large floor-to-ceiling glass, and dark metal frames',
    joinWithAnd: true,
    options: QUICK_FIELDS[1].options,
    chips: QUICK_FIELDS[1].chips
  },
  {
    id: 'environment',
    phase: 3,
    phaseTitle: 'Fase 3 · Paisagismo (Micro)',
    label: 'Landscaping & Surroundings',
    labelPt: 'Paisagismo & Entorno',
    description: 'Vegetação próxima, árvores e tratamento paisagístico do terreno.',
    guideTip: 'Especifique espécies e portes (ex: mature pine trees + layered grasses + shrubs).',
    icon: 'trees',
    accent: 'emerald',
    placeholder: 'Ex: mature pine trees, layered grasses, shrubs, and subtle planting',
    joinWithAnd: true,
    options: QUICK_FIELDS[2].options,
    chips: QUICK_FIELDS[2].chips
  },
  {
    id: 'foreground',
    phase: 4,
    phaseTitle: 'Fase 4 · Primeiro Plano',
    label: 'Foreground Composition',
    labelPt: 'Elementos de 1º Plano',
    description: 'Elementos no plano frontal da câmera que criam profundidade e escala.',
    guideTip: 'Espelhos d’água, lagos, pedras ou decks em primeiro plano criam reflexos realistas.',
    icon: 'layers',
    accent: 'cyan',
    placeholder: 'Ex: a calm natural pond with realistic reflections, soft ripples, shoreline stones, and a small rustic wooden rowboat',
    joinWithAnd: true,
    options: [
      {
        value: 'a calm natural pond with realistic reflections, soft ripples, shoreline stones, and a small rustic wooden rowboat',
        labelPt: 'Lago natural calmo com reflexos realistas, ondulações suaves, pedras na margem e barco a remo'
      },
      {
        value: 'a sleek infinity pool reflecting the sky, with minimalist lounge chairs',
        labelPt: 'Piscina de borda infinita refletindo o céu com espreguiçadeiras minimalistas'
      },
      {
        value: 'a winding stone pathway flanked by ornamental grasses and subtle ground spotlights',
        labelPt: 'Caminho sinuoso de pedras ladeado por gramíneas ornamentais e balizadores'
      },
      {
        value: 'wet dark cobblestone pavement reflecting the facade lights and a sleek modern electric car',
        labelPt: 'Pavimento de pedra molhado refletindo as luzes da fachada e carro elétrico moderno'
      }
    ],
    chips: [
      { label: 'Lago Calmo com Reflexos', value: 'a calm natural pond with realistic reflections' },
      { label: 'Ondulações & Pedras', value: 'soft ripples and shoreline stones' },
      { label: 'Barco de Madeira Rústico', value: 'a small rustic wooden rowboat' },
      { label: 'Piscina de Borda Infinita', value: 'a sleek infinity pool reflecting the sky' },
      { label: 'Caminho de Pedras', value: 'a stepping-stone pathway' },
      { label: 'Asfalto Molhado', value: 'wet asphalt with mirror reflections' },
      { label: 'Carro Esportivo Moderno', value: 'a sleek modern sports car' },
      { label: 'Lago Congelado', value: 'a frozen lake with crystalline ice' }
    ]
  },
  {
    id: 'lighting',
    phase: 5,
    phaseTitle: 'Fase 5A · Luz Principal',
    label: 'Primary Lighting',
    labelPt: 'Iluminação Principal & Horário',
    description: 'Fonte de luz principal e momento do dia.',
    guideTip: 'Luz lateral de fim de tarde (golden-hour) ou crepúsculo (blue-hour) valoriza volumes arquitetônicos.',
    icon: 'sun',
    accent: 'amber',
    placeholder: 'Ex: warm late-afternoon golden-hour light filtering through the trees',
    joinWithAnd: false,
    options: [
      {
        value: 'warm late-afternoon golden-hour light filtering through the trees',
        labelPt: 'Luz dourada de fim de tarde filtrada pelas árvores'
      },
      {
        value: 'moody overcast morning light with soft diffused sky illumination',
        labelPt: 'Luz matinal nublada dramática com iluminação celeste difusa'
      },
      {
        value: 'deep twilight blue-hour ambient light',
        labelPt: 'Luz ambiente profunda de hora azul (crepúsculo)'
      },
      {
        value: 'bright high-noon sunlight under a crisp clear sky',
        labelPt: 'Sol forte de meio-dia sob céu limpo'
      },
      {
        value: 'soft misty sunrise light with golden horizon glow',
        labelPt: 'Luz suave de nascer do sol com horizonte dourado'
      }
    ],
    chips: [
      { label: 'Golden Hour Filtrada', value: 'warm late-afternoon golden-hour light filtering through the trees' },
      { label: 'Manhã Nublada Difusa', value: 'moody overcast morning light' },
      { label: 'Blue Hour (Crepúsculo)', value: 'deep twilight blue-hour light' },
      { label: 'Sol de Meio-Dia', value: 'bright high-noon sun' },
      { label: 'Amanhecer Suave', value: 'soft sunrise light' },
      { label: 'Noite Iluminada', value: 'dramatic nighttime architectural lighting' }
    ]
  },
  {
    id: 'lightingDetail',
    phase: 5,
    phaseTitle: 'Fase 5B · Detalhes de Luz',
    label: 'Shadows & Light Details',
    labelPt: 'Sombras & Brilho Interno',
    description: 'Comportamento das sombras, neblina volumétrica e iluminação artificial interna.',
    guideTip: 'O termo "subtle interior glow" cria profundidade atrás dos grandes panos de vidro.',
    icon: 'sliders',
    accent: 'amber',
    placeholder: 'Ex: soft cinematic shadows and subtle interior glow',
    joinWithAnd: true,
    options: [
      {
        value: 'soft cinematic shadows and subtle interior glow',
        labelPt: 'Sombras cinematográficas suaves e brilho interno sutil'
      },
      {
        value: 'heavy volumetric fog, god rays, and warm inviting interior illumination',
        labelPt: 'Neblina volumétrica densa, raios de luz e iluminação interna acolhedora'
      },
      {
        value: 'sharp geometric architectural shadows and caustic water reflections',
        labelPt: 'Sombras arquitetônicas geométricas nítidas e reflexos cáusticos da água'
      }
    ],
    chips: [
      { label: 'Sombras Cinematográficas', value: 'soft cinematic shadows' },
      { label: 'Brilho Interno Sutil', value: 'subtle interior glow' },
      { label: 'Neblina Volumétrica', value: 'heavy volumetric fog' },
      { label: 'Sombras Geométricas Nítidas', value: 'sharp architectural shadows' },
      { label: 'Raios de Luz (God Rays)', value: 'volumetric god rays' },
      { label: 'Luzes Internas Quentes', value: 'warm 2700K interior lighting' }
    ]
  },
  {
    id: 'mood',
    phase: 5,
    phaseTitle: 'Fase 5C · Clima & Vibe',
    label: 'Mood & Atmosphere',
    labelPt: 'Atmosfera da Cena',
    description: 'O tom emocional e estético que unifica a paleta de cores.',
    guideTip: 'Mantenha de 3 a 4 adjetivos coesos com o horário escolhido.',
    icon: 'palette',
    accent: 'pink',
    placeholder: 'Ex: peaceful, luxurious, natural, and architecture-focused',
    joinWithAnd: true,
    options: QUICK_FIELDS[5].options,
    chips: QUICK_FIELDS[5].chips
  },
  {
    id: 'renderStyle',
    phase: 6,
    phaseTitle: 'Fase 6A · Motor & Qualidade',
    label: 'Render Style & Quality',
    labelPt: 'Estilo de Render & Qualidade',
    description: 'Modificadores técnicos de fotorrealismo, iluminação global e nível de detalhe.',
    guideTip: 'Termos como "soft global illumination" e "detailed vegetation" elevam a fidelidade das texturas.',
    icon: 'settings',
    accent: 'purple',
    placeholder: 'Ex: Ultra-realistic architectural visualization, soft global illumination, detailed vegetation',
    joinWithAnd: false,
    options: [
      {
        value: 'Ultra-realistic architectural visualization, soft global illumination, detailed vegetation',
        labelPt: 'Visualização arquitetônica ultra-realista, iluminação global suave e vegetação detalhada'
      },
      {
        value: 'Unreal Engine 5 render, path tracing, 8k resolution, photorealistic editorial photography',
        labelPt: 'Render Unreal Engine 5, path tracing, resolução 8K, fotografia editorial fotorrealista'
      },
      {
        value: 'V-Ray and Corona Renderer, physically based rendering, ArchDaily award-winning photography, 8k',
        labelPt: 'V-Ray & Corona Renderer, PBR, fotografia premiada estilo ArchDaily, 8K'
      }
    ],
    chips: [
      { label: 'Ultra-realistic ArchViz', value: 'Ultra-realistic architectural visualization' },
      { label: 'Soft Global Illumination', value: 'soft global illumination' },
      { label: 'Detailed Vegetation', value: 'detailed vegetation' },
      { label: '8K Resolution', value: '8k resolution' },
      { label: 'Octane / V-Ray Render', value: 'Octane and V-Ray render' },
      { label: 'Unreal Engine 5 Path Tracing', value: 'Unreal Engine 5 path tracing' },
      { label: 'ArchDaily Editorial Photo', value: 'ArchDaily architectural photography' }
    ]
  },
  {
    id: 'extraCommands',
    phase: 6,
    phaseTitle: 'Fase 6B · Comandos Extras',
    label: 'Camera & Negative Rules',
    labelPt: 'Câmera & Restrições (Prompt Negativo)',
    description: 'Lente fotográfica, ângulo de câmera e elementos que não devem aparecer (ex: no text).',
    guideTip: 'Inclua "no text" ou "no people" para manter o foco 100% na arquitetura.',
    icon: 'sliders',
    accent: 'purple',
    placeholder: 'Ex: no text',
    joinWithAnd: false,
    options: [
      { value: 'no text', labelPt: 'Sem texto ou marcas d’água (no text)' },
      { value: 'eye-level architectural shot, 24mm tilt-shift lens, no people, no text', labelPt: 'Ângulo no nível do observador, lente 24mm tilt-shift, sem pessoas, sem texto' },
      { value: 'drone aerial three-quarter view, crisp depth of field, no text', labelPt: 'Vista aérea de drone 3/4, profundidade de campo nítida, sem texto' }
    ],
    chips: [
      { label: 'Sem Texto (no text)', value: 'no text' },
      { label: 'Sem Pessoas (no people)', value: 'no people' },
      { label: 'Sem Marca d’Água', value: 'no watermark' },
      { label: 'Nível do Olhar (Eye-Level)', value: 'eye-level shot' },
      { label: 'Lente 24mm Tilt-Shift', value: '24mm tilt-shift lens' },
      { label: 'Vista Aérea Drone', value: 'aerial drone perspective' }
    ]
  },
  {
    id: 'aspectRatio',
    phase: 6,
    phaseTitle: 'Fase 6C · Proporção',
    label: 'Aspect Ratio',
    labelPt: 'Proporção da Imagem',
    description: 'Formato de saída para Midjourney, Nano Banana, Flux ou Stable Diffusion.',
    guideTip: 'Use 1:1 para feed quadrado, 16:9 para apresentações widescreen ou --ar 16:9 no Midjourney.',
    icon: 'ratio',
    accent: 'indigo',
    placeholder: 'Ex: 1:1',
    singleSelectChip: true,
    joinWithAnd: false,
    options: [
      { value: '1:1', labelPt: 'Quadrado (1:1) — Padrão do Guia' },
      { value: '16:9', labelPt: 'Widescreen Horizontal (16:9)' },
      { value: '4:5', labelPt: 'Retrato Editorial / Instagram (4:5)' },
      { value: '9:16', labelPt: 'Vertical Stories / Reels (9:16)' },
      { value: '--ar 16:9', labelPt: 'Parâmetro Midjourney Widescreen (--ar 16:9)' },
      { value: '--ar 1:1', labelPt: 'Parâmetro Midjourney Quadrado (--ar 1:1)' }
    ],
    chips: [
      { label: '1:1 (Quadrado)', value: '1:1' },
      { label: '16:9 (Horizontal)', value: '16:9' },
      { label: '4:5 (Retrato)', value: '4:5' },
      { label: '9:16 (Vertical)', value: '9:16' },
      { label: '3:2 (Fotografia)', value: '3:2' },
      { label: '--ar 16:9 (MJ)', value: '--ar 16:9' },
      { label: '--ar 4:5 (MJ)', value: '--ar 4:5' }
    ]
  }
]

export const CURATED_PRESETS: CuratedPreset[] = [
  {
    id: 'forest-refuge-reference',
    name: 'Refúgio Florestal (Referência do Guia)',
    badge: 'Oficial do Guia',
    description: 'O prompt exato de referência do Guia de Engenharia de Prompts Arquitetônicos.',
    quick: {
      style: 'refined contemporary luxury residence in a natural forest hillside setting',
      materials: 'warm off-white masonry, natural timber, large floor-to-ceiling glass, and dark metal frames',
      environment: 'mature pine trees, layered grasses, shrubs, and subtle planting',
      foreground: 'calm natural pond in the foreground with realistic reflections, soft ripples, shoreline stones, and a small rustic wooden rowboat',
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
      lightingDetail: 'soft cinematic shadows and subtle interior glow',
      mood: 'peaceful, luxurious, natural, and architecture-focused',
      renderStyle: 'Ultra-realistic architectural visualization, soft global illumination, detailed vegetation',
      extraCommands: 'no text',
      aspectRatio: '1:1'
    }
  },
  {
    id: 'brutalist-desert-cliff',
    name: 'Mansão Brutalista no Deserto',
    badge: 'Brutalismo',
    description: 'Concreto aparente e aço corten cravados em um cânion desértico ao pôr do sol.',
    quick: {
      style: 'brutalist monolithic concrete mansion perched on an arid red-rock desert cliff',
      materials: 'exposed board-formed concrete, weathered corten steel, and expansive frameless glazing',
      environment: 'arid desert landscape, sculptural agave plants, saguaro cacti, and red rock formations',
      foreground: 'sleek infinity pool in the foreground reflecting the sky, with sunken concrete firepit lounge',
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
      foreground: 'a sleek infinity pool reflecting the sky and a sunken concrete firepit with glowing embers',
      lighting: 'warm late-afternoon golden-hour light',
      lightingDetail: 'sharp geometric architectural shadows and warm 2700K interior lighting',
      mood: 'dramatic, moody, striking, and cinematic',
      renderStyle: 'Ultra-realistic architectural visualization, Unreal Engine 5 path tracing, 8k resolution',
      extraCommands: 'eye-level shot, no people, no text',
      aspectRatio: '16:9'
    }
  },
  {
    id: 'nordic-alpine-cabin',
    name: 'Pavilhão Alpino na Neve',
    badge: 'Nórdico',
    description: 'Madeira carbonizada e vidro duplo em contraste com a hora azul nas montanhas nevadas.',
    quick: {
      style: 'minimalist Nordic glass and timber cabin in a snowy alpine mountain valley',
      materials: 'charred cedar Shou Sugi Ban, natural oak interiors, and large floor-to-ceiling triple glazing',
      environment: 'snow-covered evergreen pines, frost-kissed boulders, and misty mountain peaks',
      foreground: 'frozen alpine lake in the foreground with crystalline ice reflections and snowdrifts',
      lighting: 'deep twilight blue-hour illumination with soft diffused mist and warm inviting interior fireplace glow',
      mood: 'serene, contemplative, cozy, and architecture-focused',
      technical: 'V-Ray and Corona Renderer masterpiece, ArchDaily editorial photography, soft global illumination, no text, 4:5'
    },
    advanced: {
      archStyle: 'warm minimalist Nordic',
      buildingType: 'mountain cabin',
      location: 'snowy alpine mountain',
      materials: 'charred cedar Shou Sugi Ban, natural oak timber, and large floor-to-ceiling glass',
      environment: 'snow-covered pine trees, frost-kissed boulders, and misty mountain peaks',
      foreground: 'a frozen lake with crystalline ice reflections and undisturbed snow',
      lighting: 'deep twilight blue-hour light',
      lightingDetail: 'heavy volumetric fog and warm inviting interior illumination',
      mood: 'serene, meditative, minimalist, and timeless',
      renderStyle: 'V-Ray and Corona Renderer, soft global illumination, 8k resolution',
      extraCommands: '24mm tilt-shift lens, no people, no text',
      aspectRatio: '4:5'
    }
  },
  {
    id: 'tropical-modernist-villa',
    name: 'Villa Modernista Tropical',
    badge: 'Brasilidade',
    description: 'Arquitetura bioclimática com brises de madeira, pedra natural e vegetação exuberante.',
    quick: {
      style: 'tropical modernist luxury villa in a lush coastal rainforest setting',
      materials: 'exposed architectural concrete, vertical Ipê wooden louvers, natural stone walls, and expansive glass',
      environment: 'dense tropical jungle, giant ferns, monsteras, and swaying palm trees',
      foreground: 'natural emerald reflecting pool in the foreground with floating stone steps and tropical water lilies',
      lighting: 'moody overcast morning sky with soft diffused tropical light, morning mist, and subtle warm interior glow',
      mood: 'peaceful, organic, luxurious, and harmonious with nature',
      technical: 'Ultra-realistic architectural visualization, Corona Renderer, detailed vegetation, soft global illumination, no text, 16:9'
    },
    advanced: {
      archStyle: 'tropical modernist Brazilian',
      buildingType: 'villa',
      location: 'tropical coastal beachfront',
      materials: 'exposed board-formed concrete, vertical wooden louvers, local natural stone, and large floor-to-ceiling glass',
      environment: 'dense tropical foliage and palm trees, giant ferns, and subtle planting',
      foreground: 'a stepping-stone pathway over a calm natural pond with realistic reflections',
      lighting: 'moody overcast morning light',
      lightingDetail: 'soft cinematic shadows, volumetric morning mist, and subtle interior glow',
      mood: 'peaceful, luxurious, natural, and architecture-focused',
      renderStyle: 'Ultra-realistic architectural visualization, soft global illumination, detailed vegetation',
      extraCommands: 'eye-level shot, no text',
      aspectRatio: '16:9'
    }
  }
]
