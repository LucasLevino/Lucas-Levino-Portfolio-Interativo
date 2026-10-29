import type { ArchContextId, QuickPromptData } from './archprompt'

export type ArchAccentKey =
  | 'terracotta'
  | 'sage'
  | 'mineral-blue'
  | 'lavender'
  | 'sand'
  | 'coral'

export interface ArchAccentToken {
  key: ArchAccentKey
  name: string
  namePt: string
  hex: string
  softBg: string
  materialRef: string
  usage: string
}

export interface ArchProjectCardData {
  id: string
  code: string
  title: string
  subtitle: string
  typology: 'Residencial' | 'Interiores' | 'Pavilhão' | 'Reabilitação'
  location: string
  areaSqm: string
  scale: string
  stage: string
  accentKey: ArchAccentKey
  materials: string[]
  coordinates: string
  photoUrl: string
  photoCaption: string
  contextId: ArchContextId
  imageRef?: string
  quickPrompt: QuickPromptData
}

export interface ArchReferenceItem {
  id: string
  code: string
  title: string
  editorialIssue: string
  category: 'Fachada & Volume' | 'Interiores' | 'Materiais & Luz' | 'Implantação'
  location: string
  coordinates: string
  areaMeasure: string
  ceilingHeight: string
  solarOrientation: string
  primaryMaterial: string
  materialSwatches: { label: string; hex: string }[]
  accentKey: ArchAccentKey
  photoUrl: string
  photographerCredit: string
  curatorialNote: string
  contextId: ArchContextId
  imageRef: string
  quickPrompt: QuickPromptData
}

export const ARCH_ACCENT_TOKENS: Record<ArchAccentKey, ArchAccentToken> = {
  terracotta: {
    key: 'terracotta',
    name: 'Terracotta',
    namePt: 'Terracota Natural',
    hex: '#C98268',
    softBg: 'rgba(201, 130, 104, 0.18)',
    materialRef: 'Cerâmica arquitetônica queimada, tijolo maciço e taipa de pilão',
    usage: 'Arquitetura Externa & Mobiliário'
  },
  sand: {
    key: 'sand',
    name: 'Sand',
    namePt: 'Areia Quente',
    hex: '#D8B99A',
    softBg: 'rgba(216, 185, 154, 0.24)',
    materialRef: 'Travertino bruto, madeira freijó natural e reboco mineral',
    usage: 'Arquitetura de Interiores & Iluminação'
  },
  sage: {
    key: 'sage',
    name: 'Sage Green',
    namePt: 'Verde Sálvia',
    hex: '#A5B4A0',
    softBg: 'rgba(165, 180, 160, 0.22)',
    materialRef: 'Vegetação nativa mediterrânea, ardósia verde e cobre oxidado',
    usage: 'Paisagismo, Implantação & Catálogo de Referências'
  },
  'mineral-blue': {
    key: 'mineral-blue',
    name: 'Mineral Blue',
    namePt: 'Azul Mineral',
    hex: '#91B5C8',
    softBg: 'rgba(145, 181, 200, 0.22)',
    materialRef: 'Vidro laminado extra-clear, espelho d’água e desenho técnico',
    usage: 'Plantas Baixas 2D→3D & Cotas'
  },
  lavender: {
    key: 'lavender',
    name: 'Muted Lavender',
    namePt: 'Lilás Mineral',
    hex: '#C7B4E8',
    softBg: 'rgba(199, 180, 232, 0.22)',
    materialRef: 'Luz crepuscular refletida em concreto aparente e pedra âmbar',
    usage: 'Design de Interiores & Curadoria'
  },
  coral: {
    key: 'coral',
    name: 'Soft Coral',
    namePt: 'Coral Suave',
    hex: '#F47760',
    softBg: 'rgba(244, 119, 96, 0.18)',
    materialRef: 'Marcações de revisão em prancha executiva e pontos focais',
    usage: 'Objetos 3D & Pinos de Câmera'
  }
}

export const CONTEXT_PREDOMINANT_ACCENT: Record<ArchContextId, ArchAccentKey> = {
  exterior: 'terracotta',
  interior: 'sand',
  'interior-design': 'lavender',
  lighting: 'sand',
  environment: 'sage',
  furniture: 'terracotta',
  'furniture-3d': 'coral',
  'floor-plan': 'mineral-blue',
  'texture-sheet': 'sand'
}

export const ARCH_PROJECTS: ArchProjectCardData[] = [
  {
    id: 'proj-01',
    code: 'PRJ-01',
    title: 'Residência Casa das Pedras',
    subtitle: 'Volume em balanço de concreto ripado inserido em topografia de encosta com espelho d’água frontal.',
    typology: 'Residencial',
    location: 'Serra da Mantiqueira, SP',
    areaSqm: '485,00 m²',
    scale: 'ESC 1:50',
    stage: 'Fachada & Implantação',
    accentKey: 'terracotta',
    materials: ['Concreto Ripado', 'Madeira Cumaru', 'Vidro Extra-Clear', 'Pedra Moledo'],
    coordinates: '22°44\'19"S 45°35\'32"W',
    photoUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',
    photoCaption: 'Elevação Sul · Luz natural de fim de tarde (Azimute 245°)',
    contextId: 'exterior',
    imageRef: 'strictly following the exact architectural geometry, proportions, and camera angle from the attached reference image',
    quickPrompt: {
      style: 'refined contemporary luxury residence in a natural forest hillside setting',
      materials: 'warm board-formed architectural concrete, natural Cumaru timber louvers, large floor-to-ceiling glass, and dark anodized metal frames',
      environment: 'mature pine trees, layered native grasses, sloped stone topography, and subtle planting',
      foreground: 'a calm natural reflecting pond in the foreground with realistic reflections, shoreline stones, and architectural stepping slabs',
      lighting: 'warm late-afternoon golden-hour light filtering through the trees, with soft cinematic shadows and subtle 2700K interior glow',
      mood: 'peaceful, luxurious, natural, and architecture-focused',
      technical: 'Ultra-realistic architectural visualization, soft global illumination, detailed vegetation, no text, 16:9'
    }
  },
  {
    id: 'proj-02',
    code: 'PRJ-02',
    title: 'Apartamento Galeria Itaim',
    subtitle: 'Planta livre com painéis pivotantes em carvalho europeu, piso em travertino bruto levigado e mobiliário assinado.',
    typology: 'Interiores',
    location: 'São Paulo, SP',
    areaSqm: '310,00 m²',
    scale: 'ESC 1:25',
    stage: 'Interiores & Marcenaria',
    accentKey: 'sand',
    materials: ['Travertino Romano', 'Carvalho Natural', 'Linho Cru', 'Aço Escovado'],
    coordinates: '23°35\'08"S 46°40\'42"W',
    photoUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85',
    photoCaption: 'Living Integrado · Vão livre estrutural de 11.40m',
    contextId: 'interior',
    imageRef: 'preserving the existing spatial structure and perspective from the attached photo while upgrading the finishes, lighting, and decor',
    quickPrompt: {
      style: 'minimalist contemporary double-height living room in an urban penthouse overlooking a tree canopy',
      materials: 'honed travertine stone flooring, slatted European oak wall panels, lime-washed plaster walls, and bronze metal accents',
      environment: 'seamless indoor-outdoor balcony transition, floor-to-ceiling sheer linen curtains, and minimalist architectural joinery',
      foreground: 'a low-profile off-white bouclé modular sofa, monolithic travertine coffee table, and handmade wool rug in the foreground',
      lighting: 'soft diffused morning daylight entering through expansive glazing with gentle bounce light and warm recessed coves',
      mood: 'serene, tactile, editorial, and spatially balanced',
      technical: 'Architectural interior photography, Corona Renderer, vertical two-point perspective, natural color grading, no text, 4:5'
    }
  },
  {
    id: 'proj-03',
    code: 'PRJ-03',
    title: 'Pavilhão Botânico Horizonte',
    subtitle: 'Estrutura modular em madeira laminada colada (MLC) e pátio central contemplativo com cobertura translúcida.',
    typology: 'Pavilhão',
    location: 'Brumadinho, MG',
    areaSqm: '640,00 m²',
    scale: 'ESC 1:100',
    stage: 'Planta Baixa 3D',
    accentKey: 'mineral-blue',
    materials: ['Madeira MLC', 'Travertino', 'Basalto Serrado', 'Cobre Oxidado'],
    coordinates: '20°07\'28"S 44°13\'12"W',
    photoUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=85',
    photoCaption: 'Implantação Pavilhonar · Modulação estrutural 6.00m × 6.00m',
    contextId: 'floor-plan',
    imageRef: 'extruding and rendering the scene strictly following the exact wall layout, doors, and windows of the attached floor plan image',
    quickPrompt: {
      style: '3D isometric 45-degree cutaway floor plan viewed from the SW corner with clean 1.4m half-height cutaway walls',
      materials: 'large-format honed travertine stone in the social living zone, warm wide-plank European oak flooring in the suites, crisp white poché',
      environment: 'integrated open-concept living and dining area, gourmet kitchen with central stone island, outdoor veranda and swimming pool deck',
      foreground: 'modular L-shaped bouclé sofa, dining table for eight, outdoor lounge sunbeds, and calm reflecting pool',
      lighting: 'warm late-afternoon directional sunlight at 45 degrees with soft ambient occlusion along wall-floor corners',
      mood: 'clear, organized, and architecturally legible',
      technical: 'Ultra-detailed architectural floor plan visualization, V-Ray and Corona Renderer, razor-sharp edges, no text labels, 1:1'
    }
  }
]

export const ARCH_REFERENCE_GALLERY: ArchReferenceItem[] = [
  {
    id: 'ref-01',
    code: 'REF-ARQ.01',
    title: 'Monólito em Concreto Ripado & Luz Zenital',
    editorialIssue: 'Caderno de Matéria · Ed. 14',
    category: 'Fachada & Volume',
    location: 'Cidade do México, MX',
    coordinates: '19°25\'10"N 99°10\'50"W',
    areaMeasure: '540 m² · Balanço 5.20m',
    ceilingHeight: 'Pé-direito duplo 6.40m',
    solarOrientation: 'Fachada Oeste · Brise-soleil vertical',
    primaryMaterial: 'Concreto aparente ripado com agregado calcário',
    materialSwatches: [
      { label: 'Concreto Quente', hex: '#D8D0C3' },
      { label: 'Cedro Natural', hex: '#C98268' },
      { label: 'Grafite Estrutural', hex: '#282824' }
    ],
    accentKey: 'terracotta',
    photoUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=85',
    photographerCredit: 'Luz Natural Direta',
    curatorialNote: 'A textura das fôrmas de madeira no concreto filtra a luz rasante da tarde, suavizando a escala monumental do volume em balanço.',
    contextId: 'exterior',
    imageRef: 'using the attached reference image as visual inspiration for the architectural style, lighting atmosphere, and color palette',
    quickPrompt: {
      style: 'monolithic brutalist-contemporary residence with cantilevered board-formed concrete volumes in a lush courtyard setting',
      materials: 'warm board-formed architectural concrete, vertical cedar timber louvers, frameless recessed glazing, and volcanic basalt stone',
      environment: 'mature olive trees, architectural gravel garden, and monolithic concrete boundary walls',
      foreground: 'still black-bottom reflecting pool in the foreground mirroring the cantilevered concrete volume',
      lighting: 'dramatic late-afternoon grazing sunlight casting long geometric shadows across the textured concrete facade',
      mood: 'contemplative, monolithic, timeless, and editorial',
      technical: 'Award-winning architectural photography, 24mm tilt-shift lens, natural daylight, high dynamic range, no text, 16:9'
    }
  },
  {
    id: 'ref-02',
    code: 'REF-INT.02',
    title: 'Atmosfera Calcária & Marcenaria Minimalista',
    editorialIssue: 'Ensaio Espacial · Ed. 09',
    category: 'Interiores',
    location: 'Comporta, Portugal',
    coordinates: '38°22\'45"N 08°47\'11"W',
    areaMeasure: '185 m² · Vão 8.60m',
    ceilingHeight: 'Pé-direito 3.60m',
    solarOrientation: 'Iluminação Norte Difusa',
    primaryMaterial: 'Estuque mineral de cal e carvalho europeu escovado',
    materialSwatches: [
      { label: 'Cal Arquitetônica', hex: '#FAF9F6' },
      { label: 'Areia Calcária', hex: '#D8B99A' },
      { label: 'Linho Cru', hex: '#E8E8E3' }
    ],
    accentKey: 'sand',
    photoUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=85',
    photographerCredit: 'Interiores · Luz Difusa',
    curatorialNote: 'Superfícies contínuas sem rodapé aparente ampliam a percepção silenciosa do espaço, priorizando a variação sutil da luz natural.',
    contextId: 'interior-design',
    imageRef: 'applying the exact surface materials, textures, and finishes shown in the attached reference images',
    quickPrompt: {
      style: 'quiet-luxury Mediterranean minimalist interior living space with seamless architectural volumes',
      materials: 'hand-troweled warm lime plaster walls, continuous honed limestone floors, bleached oak joinery, and raw Belgian linen',
      environment: 'deep recessed window reveals, built-in architectural bench seating, and curated ceramic vessels',
      foreground: 'sculptural low-slung linen sofa and rough-hewn travertine plinth table in the foreground',
      lighting: 'soft indirect coastal daylight washing gently over the textured plaster surfaces with organic shadow gradients',
      mood: 'calm, tactile, poetic, and understated',
      technical: 'Editorial interior photography, medium format camera, natural light only, authentic material textures, no text, 4:5'
    }
  },
  {
    id: 'ref-03',
    code: 'REF-MAT.03',
    title: 'Galeria de Luz Zenital & Travertino Bruto',
    editorialIssue: 'Dossiê Iluminação · Ed. 21',
    category: 'Materiais & Luz',
    location: 'Milão, Itália',
    coordinates: '45°27\'51"N 09°11\'22"E',
    areaMeasure: '420 m² · Eixo 18.00m',
    ceilingHeight: 'Pé-direito 4.80m',
    solarOrientation: 'Claraboia Linear Zenital',
    primaryMaterial: 'Travertino Romano bruto e bronze oxidado',
    materialSwatches: [
      { label: 'Travertino', hex: '#D8D0C3' },
      { label: 'Terracota', hex: '#C98268' },
      { label: 'Sálvia Mineral', hex: '#A5B4A0' }
    ],
    accentKey: 'lavender',
    photoUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85',
    photographerCredit: 'Estudo Luminotécnico · 3000K + Luz Solar',
    curatorialNote: 'O rasgo zenital perimetral dissocia o plano do teto das paredes de pedra, criando um efeito de gravidade suspensa.',
    contextId: 'lighting',
    imageRef: 'preserving the exact building geometry and perspective from the first attached image while applying the materials and lighting mood from the second attached reference image',
    quickPrompt: {
      style: 'architectural lighting study inside a contemporary stone and concrete gallery residence',
      materials: 'porous raw Roman travertine slabs, architectural fair-faced concrete, brushed dark bronze, and acoustic timber ceilings',
      environment: 'perimeter skylight slot washing the stone wall, concealed linear architectural coves at 2700K, and minimal circulation axis',
      foreground: 'monolithic stone console and subtle floor grazing light in the foreground',
      lighting: 'balanced interplay of zenithal natural daylight beam and warm 2700K architectural grazing light revealing deep stone pores',
      mood: 'dramatic, museum-grade, refined, and contemplative',
      technical: 'Photorealistic architectural lighting visualization, physically based rendering, accurate IES light profiles, no text, 16:9'
    }
  },
  {
    id: 'ref-04',
    code: 'REF-IMP.04',
    title: 'Pavilhão Transparente & Jardim de Gramíneas',
    editorialIssue: 'Paisagem Construída · Ed. 06',
    category: 'Implantação',
    location: 'Vale do Café, RJ',
    coordinates: '22°27\'14"S 43°49\'30"W',
    areaMeasure: '720 m² · Lote 4.200 m²',
    ceilingHeight: 'Pé-direito 3.80m',
    solarOrientation: 'Orientação Nascente Leste',
    primaryMaterial: 'Aço corten, vidro laminado e basalto natural',
    materialSwatches: [
      { label: 'Verde Sálvia', hex: '#A5B4A0' },
      { label: 'Azul Mineral', hex: '#91B5C8' },
      { label: 'Aço Grafite', hex: '#282824' }
    ],
    accentKey: 'sage',
    photoUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=85',
    photographerCredit: 'Inserção Topográfica · Manhã',
    curatorialNote: 'A implantação respeita a cota natural do terreno através de plataformas escalonadas em pedra seca e espelhos d’água.',
    contextId: 'environment',
    imageRef: 'seamlessly integrating the architectural design into the real site photograph provided in the attached image',
    quickPrompt: {
      style: 'horizontal glass and weathered steel pavilion seamlessly integrated into a sloped native botanical landscape',
      materials: 'weathered Corten steel beams, ultra-clear structural glass, dry-stacked local fieldstone walls, and Cumaru decking',
      environment: 'wind-swept ornamental grasses, native tropical perennials, preserved century-old trees, and misty mountain horizon',
      foreground: 'natural basalt stepping stones crossing a shallow biological water garden in the foreground',
      lighting: 'crisp early-morning golden sunlight with long dew-kissed shadows and gentle atmospheric mist',
      mood: 'organic, biophilic, tranquil, and harmonious',
      technical: 'Masterpiece architectural landscape visualization, realistic botanical ecosystems, soft global illumination, no text, 16:9'
    }
  },
  {
    id: 'ref-05',
    code: 'REF-INT.05',
    title: 'Estúdio Monástico em Madeira & Concreto',
    editorialIssue: 'Geometria & Silêncio · Ed. 18',
    category: 'Interiores',
    location: 'Kyoto / São Paulo',
    coordinates: '35°00\'42"N 135°46\'05"E',
    areaMeasure: '140 m² · Módulo Tatami',
    ceilingHeight: 'Pé-direito 3.20m',
    solarOrientation: 'Luz Filtrada por Brises',
    primaryMaterial: 'Cedro japonês, concreto liso e papel washi',
    materialSwatches: [
      { label: 'Madeira Hinoki', hex: '#D8B99A' },
      { label: 'Concreto', hex: '#E8E8E3' },
      { label: 'Grafite', hex: '#282824' }
    ],
    accentKey: 'mineral-blue',
    photoUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1000&q=85',
    photographerCredit: 'Detalhe Construtivo · Luz Filtrada',
    curatorialNote: 'O encontro preciso entre a marcenaria sem ferragens aparentes e a laje de concreto exposto define o rigor geométrico do ambiente.',
    contextId: 'interior',
    imageRef: 'strictly following the exact architectural geometry, proportions, and camera angle from the attached reference image',
    quickPrompt: {
      style: 'Japandi architectural study and living space with rigorous modular timber grid and exposed concrete ceiling',
      materials: 'quarter-sawn Hinoki cedar joinery, smooth architectural concrete, matte black steel details, and woven tatami-inspired textiles',
      environment: 'sliding shoji-inspired timber screens overlooking a minimalist moss courtyard garden',
      foreground: 'handcrafted solid timber dining table and sculptural wishbone chairs in the foreground',
      lighting: 'dappled afternoon sunlight filtered through vertical timber louvers casting rhythmic linear shadows on the floor',
      mood: 'zen, disciplined, warm, and architecturally pure',
      technical: 'Editorial architectural photography, 35mm prime lens, crisp geometric alignment, natural tonal balance, no text, 4:5'
    }
  },
  {
    id: 'ref-06',
    code: 'REF-ARQ.06',
    title: 'Residência Pátio de Terracota & Calcário',
    editorialIssue: 'Arquitetura Solar · Ed. 12',
    category: 'Fachada & Volume',
    location: 'Oaxaca / Brasília',
    coordinates: '17°04\'01"N 96°43\'18"W',
    areaMeasure: '390 m² · Pátio 12×12m',
    ceilingHeight: 'Pé-direito 4.10m',
    solarOrientation: 'Pátio Central Sombreado',
    primaryMaterial: 'Tijolo de terracota artesanal e calcário creme',
    materialSwatches: [
      { label: 'Terracota', hex: '#C98268' },
      { label: 'Creme Solar', hex: '#F5F1E9' },
      { label: 'Sálvia', hex: '#A5B4A0' }
    ],
    accentKey: 'terracotta',
    photoUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85',
    photographerCredit: 'Volumetria Pura · Sol a Pino',
    curatorialNote: 'Volumes prismáticos em terracota pigmentada criam pátios internos de sombra fresca e ventilação cruzada permanente.',
    contextId: 'exterior',
    imageRef: 'using the attached reference image as visual inspiration for the architectural style, lighting atmosphere, and color palette',
    quickPrompt: {
      style: 'contemporary courtyard residence built with geometric pigmented terracotta and limestone volumes',
      materials: 'earth-toned pigmented concrete, handcrafted terracotta brick brise-soleil, honed cream limestone, and dark bronze frames',
      environment: 'sculptural desert cacti, xeriscape gravel courtyard, and recessed shaded colonnades',
      foreground: 'geometric limestone courtyard paving and a tranquil shallow water basin in the foreground',
      lighting: 'warm late-afternoon sunlight creating bold architectural chiaroscuro shadows across the terracotta volumes',
      mood: 'sculptural, warm, grounded, and editorial',
      technical: 'Architectural digest photography, crisp geometric lines, authentic mineral textures, natural sunlight, no text, 16:9'
    }
  }
]
