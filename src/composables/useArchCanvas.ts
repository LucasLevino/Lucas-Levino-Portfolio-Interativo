import { ref, computed, watch } from 'vue'
import type { ArchContextId } from '../data/archprompt'

export type CanvasModelId =
  | 'gemini.imagen'
  | 'openai.gpt-image'
  | 'fal.flux-pro'
  | '3d.hunyuan'

export type StoragePersistenceMode = 'localStorage' | 'cookies' | 'both'

export interface CanvasModelOption {
  id: CanvasModelId
  label: string
  shortLabel: string
  provider: 'gemini' | 'openai' | 'fal' | 'hunyuan'
  badge: string
  is3D?: boolean
  recommendedContexts: ArchContextId[]
  description: string
  promptSuffix?: string
}

export interface ArchApiConfig {
  version: string
  storageMode: StoragePersistenceMode
  selectedModelId: CanvasModelId
  aspectRatio: '1:1' | '16:9' | '4:5' | '9:16'
  geminiApiKey: string
  geminiModelName: string
  openaiApiKey: string
  openaiModelName: string
  falApiKey: string
  falFluxEndpoint: string
  hunyuanApiKey: string
  hunyuanEndpointUrl: string
  autoSyncImageDirective: boolean
  updatedAt: string
}

export type ImageSlotRole = 'geometry' | 'style' | 'material'

export interface ReferenceImageSlot {
  id: string
  role: ImageSlotRole
  label: string
  badge: string
  placeholder: string
  directiveEn: string
  dataUrl: string
  fileName: string
  mimeType: string
  urlInput: string
}

export interface CanvasGeneratedItem {
  id: string
  modelId: CanvasModelId
  modelLabel: string
  contextId: ArchContextId
  prompt: string
  imageUrl: string
  meshGlbUrl?: string
  aspectRatio: string
  createdAt: string
  isSimulated?: boolean
  inputImagesCount: number
  batchGroupId?: string
}

export interface DecodedReferenceResult {
  style: string
  materials: string
  environment: string
  foreground: string
  lighting: string
  mood: string
  technical: string
  imageRef: string
  summaryPt: string
  isSimulated: boolean
}

export interface AuthorStyleProfile {
  id: string
  authorName: string
  createdAt: string
  geometryPillarPt: string
  colorPalettePillarPt: string
  materialsPillarPt: string
  designChoicesPillarPt: string
  visualPillarsPromptEn: string
  quickBlocks: {
    style: string
    materials: string
    environment: string
    foreground: string
    lighting: string
    mood: string
    technical: string
  }
}

const CONFIG_STORAGE_KEY = 'lucaslevino_archprompt_config_v1'
const CONFIG_COOKIE_NAME = 'archprompt_config_v1'
const CANVAS_GALLERY_KEY = 'lucaslevino_archprompt_canvas_gallery_v1'
const AUTHOR_STYLE_KEY = 'lucaslevino_archstudio_author_style_v1'

export const CANVAS_MODELS: CanvasModelOption[] = [
  {
    id: 'gemini.imagen',
    label: 'Google Imagen 3 / Gemini',
    shortLabel: 'gemini.imagen',
    provider: 'gemini',
    badge: 'Multimodal + Ref',
    recommendedContexts: ['exterior', 'interior', 'interior-design', 'floor-plan', 'texture-sheet'],
    description: 'Excelente interpretação de múltiplas imagens de referência (planta baixa, croqui + moodboard) e iluminação natural.'
  },
  {
    id: 'openai.gpt-image',
    label: 'OpenAI GPT-Image-1',
    shortLabel: 'gpt-image-1',
    provider: 'openai',
    badge: 'Alta Precisão',
    recommendedContexts: ['interior-design', 'lighting', 'floor-plan', 'texture-sheet'],
    description: 'Fidelidade rigorosa às instruções textuais longas, pranchas técnicas de textura PBR e diagramação arquitetônica.'
  },
  {
    id: 'fal.flux-pro',
    label: 'Flux 1.1 Pro Ultra',
    shortLabel: 'flux.pro',
    provider: 'fal',
    badge: 'ArchViz 8K',
    recommendedContexts: ['exterior', 'interior', 'environment', 'lighting', 'furniture'],
    description: 'Fotorrealismo fotográfico editorial para fachadas, paisagismo, concreto aparente e luz volumétrica.'
  },
  {
    id: '3d.hunyuan',
    label: 'Hunyuan 3D (Tencent)',
    shortLabel: '3d.hunyuan',
    provider: 'hunyuan',
    badge: '3D Mesh & Packshot',
    is3D: true,
    recommendedContexts: ['furniture', 'furniture-3d'],
    description: 'Especializado em Móveis e Objetos Arquitetônicos 3D: gera visualização 3D isolada e malha tridimensional (.GLB).',
    promptSuffix:
      '3d.hunyuan ready asset, watertight 3D mesh topology, clean isolated silhouette, neutral studio lighting without harsh cast shadows'
  }
]

const createDefaultConfig = (): ArchApiConfig => ({
  version: '1.0.0',
  storageMode: 'both',
  selectedModelId: 'gemini.imagen',
  aspectRatio: '1:1',
  geminiApiKey: '',
  geminiModelName: 'gemini-2.0-flash-exp-image-generation',
  openaiApiKey: '',
  openaiModelName: 'gpt-image-1',
  falApiKey: '',
  falFluxEndpoint: 'https://fal.run/fal-ai/flux-pro/v1.1-ultra',
  hunyuanApiKey: '',
  hunyuanEndpointUrl: 'https://fal.run/fal-ai/hunyuan3d-v2',
  autoSyncImageDirective: true,
  updatedAt: new Date().toISOString()
})

const createDefaultImageSlots = (): ReferenceImageSlot[] => [
  {
    id: 'slot-1',
    role: 'geometry',
    label: 'Slot 1 · Base / Geometria / Planta',
    badge: 'IMG 01 · ESTRUTURA',
    placeholder: 'Croqui, print 3D (SketchUp/Revit), planta baixa ou foto do móvel p/ 3d.hunyuan',
    directiveEn:
      'strictly following the exact architectural geometry, proportions, and camera angle from the first attached reference image',
    dataUrl: '',
    fileName: '',
    mimeType: '',
    urlInput: ''
  },
  {
    id: 'slot-2',
    role: 'style',
    label: 'Slot 2 · Estilo / Iluminação / Mood',
    badge: 'IMG 02 · ATMOSFERA',
    placeholder: 'Referência de iluminação, atmosfera ou fotografia editorial',
    directiveEn:
      'applying the lighting atmosphere, mood, and color grading from the attached style reference image',
    dataUrl: '',
    fileName: '',
    mimeType: '',
    urlInput: ''
  },
  {
    id: 'slot-3',
    role: 'material',
    label: 'Slot 3 · Material / Textura / Objeto',
    badge: 'IMG 03 · TEXTURA/PBR',
    placeholder: 'Amostra de pedra, madeira, tecido ou peça de mobiliário específica',
    directiveEn:
      'incorporating the exact surface material textures, finishes, and design elements shown in the attached material reference image',
    dataUrl: '',
    fileName: '',
    mimeType: '',
    urlInput: ''
  }
]

function setCookieValue(name: string, value: string, days = 365) {
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString()
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`
  } catch {}
}

function getCookieValue(name: string): string | null {
  try {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? decodeURIComponent(match[2]) : null
  } catch {
    return null
  }
}

function deleteCookieValue(name: string) {
  try {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict`
  } catch {}
}

function loadInitialConfig(): ArchApiConfig {
  const defaults = createDefaultConfig()
  try {
    const fromLocal = localStorage.getItem(CONFIG_STORAGE_KEY)
    if (fromLocal) {
      return { ...defaults, ...JSON.parse(fromLocal) }
    }
    const fromCookie = getCookieValue(CONFIG_COOKIE_NAME)
    if (fromCookie) {
      return { ...defaults, ...JSON.parse(fromCookie) }
    }
  } catch {}
  return defaults
}

function loadInitialGallery(): CanvasGeneratedItem[] {
  try {
    const raw = localStorage.getItem(CANVAS_GALLERY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function loadInitialAuthorProfile(): AuthorStyleProfile | null {
  try {
    const raw = localStorage.getItem(AUTHOR_STYLE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

// Singleton state so Config Modal, Image Inputs, 3D Context Bar, and Canvas Module stay in sync
const config = ref<ArchApiConfig>(loadInitialConfig())
const imageSlots = ref<ReferenceImageSlot[]>(createDefaultImageSlots())
const gallery = ref<CanvasGeneratedItem[]>(loadInitialGallery())
const activeCanvasItem = ref<CanvasGeneratedItem | null>(gallery.value[0] || null)
const isGenerating = ref(false)
const generationStatusText = ref('')
const generationError = ref<string | null>(null)
const isConfigModalOpen = ref(false)

// Novos estados: Análise de Referência, Engenharia Reversa de Estilo e Batch Testing
const isAnalyzingReference = ref(false)
const lastDecodedReference = ref<DecodedReferenceResult | null>(null)
const isReverseEngineering = ref(false)
const authorStyleProfile = ref<AuthorStyleProfile | null>(loadInitialAuthorProfile())
const batchSelectedModels = ref<CanvasModelId[]>(['gemini.imagen', 'openai.gpt-image', 'fal.flux-pro'])
const batchResults = ref<CanvasGeneratedItem[]>([])
const isBatchGenerating = ref(false)

export function useArchCanvas() {
  const persistConfig = () => {
    config.value.updatedAt = new Date().toISOString()
    const serialized = JSON.stringify(config.value)
    try {
      if (config.value.storageMode === 'localStorage' || config.value.storageMode === 'both') {
        localStorage.setItem(CONFIG_STORAGE_KEY, serialized)
      } else {
        localStorage.removeItem(CONFIG_STORAGE_KEY)
      }

      if (config.value.storageMode === 'cookies' || config.value.storageMode === 'both') {
        setCookieValue(CONFIG_COOKIE_NAME, serialized, 365)
      } else {
        deleteCookieValue(CONFIG_COOKIE_NAME)
      }
    } catch {}
  }

  const persistGallery = () => {
    try {
      localStorage.setItem(CANVAS_GALLERY_KEY, JSON.stringify(gallery.value.slice(0, 12)))
    } catch {}
  }

  watch(
    config,
    () => {
      persistConfig()
    },
    { deep: true }
  )

  const selectedModel = computed<CanvasModelOption>(() => {
    return (
      CANVAS_MODELS.find(m => m.id === config.value.selectedModelId) || CANVAS_MODELS[0]
    )
  })

  const filledImageSlots = computed(() => {
    return imageSlots.value.filter(s => Boolean(s.dataUrl.trim()))
  })

  const hasActiveApiKeyForSelectedModel = computed<boolean>(() => {
    const m = selectedModel.value
    if (m.provider === 'gemini') return Boolean(config.value.geminiApiKey.trim())
    if (m.provider === 'openai') return Boolean(config.value.openaiApiKey.trim())
    if (m.provider === 'fal') return Boolean(config.value.falApiKey.trim())
    if (m.provider === 'hunyuan') {
      return Boolean(config.value.hunyuanApiKey.trim() || config.value.falApiKey.trim())
    }
    return false
  })

  const configuredProvidersCount = computed<number>(() => {
    let count = 0
    if (config.value.geminiApiKey.trim()) count++
    if (config.value.openaiApiKey.trim()) count++
    if (config.value.falApiKey.trim()) count++
    if (config.value.hunyuanApiKey.trim()) count++
    return count
  })

  const selectModel = (modelId: CanvasModelId) => {
    config.value.selectedModelId = modelId
  }

  const setSlotImageFile = (slotId: string, file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const slot = imageSlots.value.find(s => s.id === slotId)
      if (!slot) {
        reject(new Error('Slot não encontrado'))
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : ''
        slot.dataUrl = result
        slot.fileName = file.name
        slot.mimeType = file.type || 'image/png'
        resolve(result)
      }
      reader.onerror = () => reject(new Error('Falha ao ler imagem'))
      reader.readAsDataURL(file)
    })
  }

  const setSlotImageUrl = (slotId: string, url: string) => {
    const slot = imageSlots.value.find(s => s.id === slotId)
    if (!slot) return
    const clean = url.trim()
    if (!clean) return
    slot.dataUrl = clean
    slot.fileName = clean.split('/').pop()?.slice(0, 28) || 'url-reference.jpg'
    slot.mimeType = 'image/url'
    slot.urlInput = clean
  }

  const clearSlotImage = (slotId: string) => {
    const slot = imageSlots.value.find(s => s.id === slotId)
    if (!slot) return
    slot.dataUrl = ''
    slot.fileName = ''
    slot.mimeType = ''
    slot.urlInput = ''
  }

  const clearAllImageSlots = () => {
    for (const slot of imageSlots.value) {
      slot.dataUrl = ''
      slot.fileName = ''
      slot.mimeType = ''
      slot.urlInput = ''
    }
  }

  const buildCombinedImageDirective = (): string => {
    const active = filledImageSlots.value
    if (active.length === 0) return ''
    if (active.length === 1) {
      return active[0].directiveEn
    }
    return active.map((s, idx) => `(Image ${idx + 1}: ${s.directiveEn})`).join(', and ')
  }

  // Exportar JSON de Configuração
  const exportConfigToJson = (extraPayload?: Record<string, unknown>) => {
    const payload = {
      app: 'ArchStudio',
      exportedAt: new Date().toISOString(),
      config: config.value,
      ...extraPayload
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const dateStamp = new Date().toISOString().slice(0, 10)
    a.href = url
    a.download = `archstudio-config-${dateStamp}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Importar JSON de Configuração
  const importConfigFromJson = async (file: File): Promise<{
    restoredConfig: ArchApiConfig
    extraData?: Record<string, unknown>
  }> => {
    const text = await file.text()
    const parsed = JSON.parse(text)
    const rawCfg = parsed.config ? parsed.config : parsed
    const merged: ArchApiConfig = {
      ...createDefaultConfig(),
      ...rawCfg,
      updatedAt: new Date().toISOString()
    }
    config.value = merged
    persistConfig()
    return {
      restoredConfig: merged,
      extraData: parsed
    }
  }

  const resetApiConfig = () => {
    config.value = createDefaultConfig()
    deleteCookieValue(CONFIG_COOKIE_NAME)
    try {
      localStorage.removeItem(CONFIG_STORAGE_KEY)
    } catch {}
  }

  // Gerador Procedural SVG de Alta Resolução para Preview Arquitetônico / Ficha PBR / 3D Hunyuan
  // usado quando em modo de pré-visualização técnica ou sem chave de API ativa
  const createArchitecturalBlueprintPreviewDataUrl = (params: {
    prompt: string
    contextId: ArchContextId
    model: CanvasModelOption
    aspectRatio: string
    refImages: ReferenceImageSlot[]
  }): string => {
    const isTexture = params.contextId === 'texture-sheet'
    const is3D = params.model.id === '3d.hunyuan' || params.contextId === 'furniture-3d'
    const isFloorPlan = params.contextId === 'floor-plan'

    const title = isTexture
      ? 'PBR TEXTURE SPECIFICATION SHEET · 8K'
      : is3D
        ? '3D.HUNYUAN MESH & STUDIO ASSET PREVIEW'
        : isFloorPlan
          ? 'ARCHITECTURAL FLOOR PLAN 2D/3D PROJECTION'
          : `ARCHVIZ CANVAS RENDER · ${params.model.shortLabel.toUpperCase()}`

    const safePrompt = params.prompt
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    const line1 = safePrompt.slice(0, 78)
    const line2 = safePrompt.slice(78, 156)
    const line3 = safePrompt.slice(156, 234)
    const line4 = safePrompt.slice(234, 312)

    const accentHex = is3D
      ? '#F47760'
      : isTexture
        ? '#D8B99A'
        : isFloorPlan
          ? '#91B5C8'
          : '#C98268'

    const centerGraphic = isTexture
      ? `
        <!-- Swatch Flat-Lay + 3D Sphere + PBR Maps -->
        <rect x="65" y="105" width="240" height="240" rx="10" fill="#D8D0C3" stroke="#282824" stroke-width="2.5"/>
        <path d="M65 155 Q185 140 305 165 M65 215 Q190 235 305 205 M65 280 Q175 265 305 295" stroke="#77766F" stroke-width="1.5" fill="none" stroke-dasharray="6,3"/>
        <circle cx="430" cy="185" r="76" fill="${accentHex}" stroke="#282824" stroke-width="2.5"/>
        <ellipse cx="408" cy="160" rx="26" ry="16" fill="#FAF9F6" opacity="0.65" transform="rotate(-25 408 160)"/>
        <rect x="345" y="285" width="52" height="52" rx="6" fill="#D8B99A" stroke="#282824" stroke-width="2"/>
        <rect x="405" y="285" width="52" height="52" rx="6" fill="#91B5C8" stroke="#282824" stroke-width="2"/>
        <rect x="465" y="285" width="52" height="52" rx="6" fill="#77766F" stroke="#282824" stroke-width="2"/>
        <text x="371" y="352" font-family="JetBrains Mono, monospace" font-size="9" text-anchor="middle" fill="#282824">ALBEDO</text>
        <text x="431" y="352" font-family="JetBrains Mono, monospace" font-size="9" text-anchor="middle" fill="#282824">NORMAL</text>
        <text x="491" y="352" font-family="JetBrains Mono, monospace" font-size="9" text-anchor="middle" fill="#282824">ROUGH</text>
      `
      : is3D
        ? `
        <!-- 3D Hunyuan Wireframe Cube & Sculptural Chair Mesh -->
        <polygon points="300,95 450,165 450,310 300,380 150,310 150,165" fill="#FAF9F6" stroke="#282824" stroke-width="2.5"/>
        <line x1="150" y1="165" x2="300" y2="235" stroke="#282824" stroke-width="2"/>
        <line x1="450" y1="165" x2="300" y2="235" stroke="#282824" stroke-width="2"/>
        <line x1="300" y1="235" x2="300" y2="380" stroke="#282824" stroke-width="2"/>
        <polygon points="300,135 395,180 395,280 300,325 205,280 205,180" fill="${accentHex}" fill-opacity="0.35" stroke="#282824" stroke-width="2" stroke-dasharray="5,3"/>
        <circle cx="300" cy="235" r="6" fill="${accentHex}" stroke="#282824" stroke-width="2"/>
        <text x="300" y="405" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" text-anchor="middle" fill="#282824">3D.HUNYUAN WATERTIGHT MESH TOPOLOGY · GLB</text>
      `
        : `
        <!-- Architectural Perspective Frame -->
        <rect x="75" y="110" width="450" height="255" rx="10" fill="#FAF9F6" stroke="#282824" stroke-width="2.5"/>
        <polygon points="120,310 240,165 460,165 460,310" fill="${accentHex}" fill-opacity="0.28" stroke="#282824" stroke-width="2"/>
        <rect x="155" y="205" width="135" height="105" fill="#FAF9F6" stroke="#282824" stroke-width="2"/>
        <rect x="305" y="185" width="125" height="125" fill="#91B5C8" fill-opacity="0.32" stroke="#282824" stroke-width="2"/>
        <line x1="75" y1="310" x2="525" y2="310" stroke="#282824" stroke-width="2.5"/>
        <circle cx="465" cy="142" r="16" fill="#D8B99A" stroke="#282824" stroke-width="2"/>
      `

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 540" width="100%" height="100%">
      <defs>
        <pattern id="g" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#D8D0C3" stroke-width="0.9"/>
        </pattern>
      </defs>
      <rect width="600" height="540" fill="#F5F1E9"/>
      <rect width="600" height="540" fill="url(#g)"/>
      <rect x="24" y="24" width="552" height="492" rx="14" fill="#FAF9F6" fill-opacity="0.92" stroke="#282824" stroke-width="3"/>
      <rect x="24" y="24" width="552" height="52" rx="14" fill="${accentHex}" stroke="#282824" stroke-width="3"/>
      <text x="46" y="55" font-family="JetBrains Mono, monospace" font-size="13" font-weight="700" fill="#282824">${title}</text>
      <text x="554" y="55" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" text-anchor="end" fill="#282824">${params.aspectRatio} · ${params.refImages.length} IMG REF</text>
      ${centerGraphic}
      <rect x="46" y="420" width="508" height="76" rx="8" fill="#F5F1E9" stroke="#282824" stroke-width="1.75"/>
      <text x="60" y="440" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#282824">${line1}</text>
      <text x="60" y="456" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#282824">${line2}</text>
      <text x="60" y="472" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#77766F">${line3}</text>
      <text x="60" y="488" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#77766F">${line4}</text>
    </svg>`

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  }

  // Executa geração real na API selecionada ou gera Prancha de Simulação se sem API Key (ou se solicitado)
  const generateOnCanvas = async (params: {
    prompt: string
    contextId: ArchContextId
    forceSimulation?: boolean
  }): Promise<CanvasGeneratedItem | null> => {
    const cleanPrompt = params.prompt.trim()
    if (!cleanPrompt) {
      generationError.value = 'Preencha ou selecione um exemplo de prompt antes de gerar no Canvas.'
      return null
    }

    isGenerating.value = true
    generationError.value = null
    const model = selectedModel.value
    const effectivePrompt =
      model.promptSuffix && !cleanPrompt.toLowerCase().includes('3d.hunyuan')
        ? `${cleanPrompt} ${model.promptSuffix}`
        : cleanPrompt

    try {
      let generatedImageUrl = ''
      let generatedMeshGlbUrl: string | undefined = undefined
      let isSimulated = false

      if (params.forceSimulation || !hasActiveApiKeyForSelectedModel.value) {
        generationStatusText.value = `Compilando prancha técnica no Canvas (${model.shortLabel})...`
        await new Promise(r => setTimeout(r, 650))
        generatedImageUrl = createArchitecturalBlueprintPreviewDataUrl({
          prompt: effectivePrompt,
          contextId: params.contextId,
          model,
          aspectRatio: config.value.aspectRatio,
          refImages: filledImageSlots.value
        })
        isSimulated = true
      } else if (model.provider === 'gemini') {
        generationStatusText.value = 'Enviando prompt e referências para Google Gemini / Imagen...'
        const key = config.value.geminiApiKey.trim()
        const modelName = config.value.geminiModelName.trim() || 'gemini-2.0-flash-exp-image-generation'
        const parts: Array<Record<string, unknown>> = [{ text: effectivePrompt }]

        for (const slot of filledImageSlots.value) {
          if (slot.dataUrl.startsWith('data:')) {
            const [meta, base64Data] = slot.dataUrl.split(',')
            const mimeMatch = meta.match(/data:([^;]+);/)
            if (base64Data) {
              parts.push({
                inlineData: {
                  mimeType: mimeMatch ? mimeMatch[1] : 'image/png',
                  data: base64Data
                }
              })
            }
          }
        }

        const resp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(key)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts }],
              generationConfig: {
                responseModalities: ['TEXT', 'IMAGE']
              }
            })
          }
        )

        if (!resp.ok) {
          const errText = await resp.text()
          throw new Error(`Erro Gemini API (${resp.status}): ${errText.slice(0, 180)}`)
        }
        const data = await resp.json()
        const candidateParts = data?.candidates?.[0]?.content?.parts || []
        const imgPart = candidateParts.find((p: Record<string, any>) => p.inlineData?.data)
        if (!imgPart) {
          throw new Error('A API Gemini respondeu sem imagem inline. Verifique o modelo configurado.')
        }
        generatedImageUrl = `data:${imgPart.inlineData.mimeType || 'image/png'};base64,${imgPart.inlineData.data}`
      } else if (model.provider === 'openai') {
        generationStatusText.value = 'Gerando imagem na OpenAI (GPT-Image-1 / DALL-E)...'
        const key = config.value.openaiApiKey.trim()
        const sizeMap: Record<string, string> = {
          '1:1': '1024x1024',
          '16:9': '1536x1024',
          '4:5': '1024x1536',
          '9:16': '1024x1536'
        }
        const resp = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`
          },
          body: JSON.stringify({
            model: config.value.openaiModelName.trim() || 'gpt-image-1',
            prompt: effectivePrompt,
            n: 1,
            size: sizeMap[config.value.aspectRatio] || '1024x1024'
          })
        })
        if (!resp.ok) {
          const errText = await resp.text()
          throw new Error(`Erro OpenAI API (${resp.status}): ${errText.slice(0, 180)}`)
        }
        const data = await resp.json()
        const item = data?.data?.[0]
        if (item?.b64_json) {
          generatedImageUrl = `data:image/png;base64,${item.b64_json}`
        } else if (item?.url) {
          generatedImageUrl = item.url
        } else {
          throw new Error('Resposta inesperada da OpenAI Images API.')
        }
      } else if (model.provider === 'fal') {
        generationStatusText.value = 'Renderizando no Flux 1.1 Pro Ultra (Fal.ai)...'
        const key = config.value.falApiKey.trim()
        const endpoint =
          config.value.falFluxEndpoint.trim() || 'https://fal.run/fal-ai/flux-pro/v1.1-ultra'
        const firstImage = filledImageSlots.value[0]?.dataUrl
        const bodyPayload: Record<string, unknown> = {
          prompt: effectivePrompt,
          aspect_ratio: config.value.aspectRatio
        }
        if (firstImage) {
          bodyPayload.image_url = firstImage
        }
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Key ${key}`
          },
          body: JSON.stringify(bodyPayload)
        })
        if (!resp.ok) {
          const errText = await resp.text()
          throw new Error(`Erro Fal.ai (${resp.status}): ${errText.slice(0, 180)}`)
        }
        const data = await resp.json()
        generatedImageUrl = data?.images?.[0]?.url || data?.image?.url || ''
        if (!generatedImageUrl) {
          throw new Error('Nenhuma URL de imagem retornada pelo endpoint Fal.ai.')
        }
      } else if (model.provider === 'hunyuan') {
        generationStatusText.value = 'Processando ativo 3D no 3d.hunyuan (Hunyuan 3D)...'
        const key = (config.value.hunyuanApiKey || config.value.falApiKey).trim()
        const endpoint =
          config.value.hunyuanEndpointUrl.trim() || 'https://fal.run/fal-ai/hunyuan3d-v2'
        const refImg = filledImageSlots.value[0]?.dataUrl

        const bodyPayload: Record<string, unknown> = {
          prompt: effectivePrompt
        }
        if (refImg) {
          bodyPayload.input_image_url = refImg
          bodyPayload.image_url = refImg
        }

        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Key ${key}`
          },
          body: JSON.stringify(bodyPayload)
        })
        if (!resp.ok) {
          const errText = await resp.text()
          throw new Error(`Erro 3d.hunyuan API (${resp.status}): ${errText.slice(0, 180)}`)
        }
        const data = await resp.json()
        generatedMeshGlbUrl =
          data?.model_mesh?.url || data?.mesh?.url || data?.glb_url || undefined
        generatedImageUrl =
          data?.preview_image?.url ||
          data?.images?.[0]?.url ||
          refImg ||
          createArchitecturalBlueprintPreviewDataUrl({
            prompt: effectivePrompt,
            contextId: params.contextId,
            model,
            aspectRatio: config.value.aspectRatio,
            refImages: filledImageSlots.value
          })
      }

      const newItem: CanvasGeneratedItem = {
        id: `canvas-${Date.now()}`,
        modelId: model.id,
        modelLabel: model.label,
        contextId: params.contextId,
        prompt: effectivePrompt,
        imageUrl: generatedImageUrl,
        meshGlbUrl: generatedMeshGlbUrl,
        aspectRatio: config.value.aspectRatio,
        createdAt: new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        isSimulated,
        inputImagesCount: filledImageSlots.value.length
      }

      gallery.value.unshift(newItem)
      activeCanvasItem.value = newItem
      persistGallery()
      return newItem
    } catch (err: any) {
      generationError.value =
        err instanceof Error ? err.message : 'Falha ao gerar imagem no Canvas.'
      return null
    } finally {
      isGenerating.value = false
      generationStatusText.value = ''
    }
  }

  const deleteCanvasItem = (id: string) => {
    gallery.value = gallery.value.filter(item => item.id !== id)
    if (activeCanvasItem.value?.id === id) {
      activeCanvasItem.value = gallery.value[0] || null
    }
    persistGallery()
  }

  // =========================================================================
  // 1. ANALISAR REFERÊNCIA NO CANVAS (Decodifica móveis, materiais, composição e luz)
  // =========================================================================
  const analyzeReferenceImages = async (
    contextId: ArchContextId
  ): Promise<DecodedReferenceResult | null> => {
    isAnalyzingReference.value = true
    generationError.value = null

    try {
      const activeSlots = filledImageSlots.value
      const geminiKey = config.value.geminiApiKey.trim()
      const openaiKey = config.value.openaiApiKey.trim()

      const systemInstruction = `You are a senior architectural visualization (ArchViz) prompt engineer. Analyze the attached reference image(s) and decode their furniture, materials, spatial composition, and lighting into a JSON object with exact English architectural prompt blocks:
{
  "style": "Phase 1 main architectural subject, typology, and setting",
  "materials": "Phase 2 surface materials, stones, woods, metals, and textiles",
  "environment": "Phase 3 spatial composition, architectural framing, or landscaping",
  "foreground": "Phase 4 foreground furniture, decor objects, and depth elements",
  "lighting": "Phase 5 natural and artificial lighting, color temperature, and shadows",
  "mood": "Phase 5 atmospheric adjectives",
  "technical": "Phase 6 lens, render engine quality, no text, aspect ratio",
  "imageRef": "Directive on how to reference the attached image(s)",
  "summaryPt": "Resumo técnico curto em português do que foi decodificado (móveis, materiais, composição e iluminação)"
}
Return ONLY valid JSON.`

      if (geminiKey && activeSlots.some(s => s.dataUrl.startsWith('data:'))) {
        const parts: Array<Record<string, unknown>> = [{ text: systemInstruction }]
        for (const slot of activeSlots) {
          if (slot.dataUrl.startsWith('data:')) {
            const [meta, base64Data] = slot.dataUrl.split(',')
            const mimeMatch = meta.match(/data:([^;]+);/)
            if (base64Data) {
              parts.push({
                inlineData: {
                  mimeType: mimeMatch ? mimeMatch[1] : 'image/png',
                  data: base64Data
                }
              })
            }
          }
        }

        const resp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(geminiKey)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts }],
              generationConfig: { responseMimeType: 'application/json' }
            })
          }
        )

        if (resp.ok) {
          const data = await resp.json()
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
          const cleaned = rawText.replace(/```json|```/g, '').trim()
          const parsed = JSON.parse(cleaned)
          const result: DecodedReferenceResult = {
            style: parsed.style || '',
            materials: parsed.materials || '',
            environment: parsed.environment || '',
            foreground: parsed.foreground || '',
            lighting: parsed.lighting || '',
            mood: parsed.mood || 'curated, tactile, and architecture-focused',
            technical:
              parsed.technical ||
              `Ultra-realistic architectural photography, Corona Renderer, 35mm lens, no text, ${config.value.aspectRatio}`,
            imageRef: parsed.imageRef || buildCombinedImageDirective(),
            summaryPt:
              parsed.summaryPt ||
              'Móveis, materiais, composição espacial e iluminação decodificados via Gemini Vision.',
            isSimulated: false
          }
          lastDecodedReference.value = result
          return result
        }
      } else if (openaiKey && activeSlots.length > 0) {
        const userContent: Array<Record<string, unknown>> = [{ type: 'text', text: systemInstruction }]
        for (const slot of activeSlots) {
          if (slot.dataUrl) {
            userContent.push({
              type: 'image_url',
              image_url: { url: slot.dataUrl }
            })
          }
        }

        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            response_format: { type: 'json_object' },
            messages: [{ role: 'user', content: userContent }]
          })
        })

        if (resp.ok) {
          const data = await resp.json()
          const rawText = data?.choices?.[0]?.message?.content || '{}'
          const parsed = JSON.parse(rawText)
          const result: DecodedReferenceResult = {
            style: parsed.style || '',
            materials: parsed.materials || '',
            environment: parsed.environment || '',
            foreground: parsed.foreground || '',
            lighting: parsed.lighting || '',
            mood: parsed.mood || 'curated, tactile, and architecture-focused',
            technical:
              parsed.technical ||
              `Ultra-realistic architectural photography, Corona Renderer, 35mm lens, no text, ${config.value.aspectRatio}`,
            imageRef: parsed.imageRef || buildCombinedImageDirective(),
            summaryPt:
              parsed.summaryPt ||
              'Móveis, materiais, composição e iluminação decodificados via OpenAI Vision.',
            isSimulated: false
          }
          lastDecodedReference.value = result
          return result
        }
      }

      // Decodificação Contextual Inteligente Client-Side (quando sem API key ou URL externa)
      await new Promise(r => setTimeout(r, 550))
      const isInterior =
        contextId === 'interior' || contextId === 'interior-design' || contextId === 'lighting'
      const slotNames = activeSlots.map(s => s.fileName || s.badge).join(' + ') || 'Referência Padrão'

      const fallbackDecoded: DecodedReferenceResult = isInterior
        ? {
            style:
              'contemporary architectural interior living space with balanced proportions and clean horizontal lines decoded from reference',
            materials:
              'honed Roman Travertine stone flooring, brushed Freijó timber wall panels, warm limewash plaster walls, and ivory bouclé upholstery',
            environment:
              'floor-to-ceiling minimalist glazing, bespoke built-in architectural joinery, and seamless indoor-outdoor visual continuity',
            foreground:
              'low-profile modular bouclé sofa, monolithic natural stone coffee table, sculptural lounge armchair, and hand-woven wool area rug',
            lighting:
              'soft natural lateral daylight filtered through sheer linen curtains balanced with warm 2700K recessed LED cove lighting and gentle shadow falloff',
            mood: 'warm, tactile, sophisticated, and architecture-focused',
            technical: `Ultra-realistic interior architectural photography, Corona Renderer, 35mm editorial lens, strictly preserve 100% of original architecture, no text, ${config.value.aspectRatio}`,
            imageRef:
              buildCombinedImageDirective() ||
              'strictly following the exact architectural geometry, furniture layout, material palette, and lighting mood decoded from the attached reference image',
            summaryPt: `Decodificado (${slotNames}): Sofá bouclé + mesa monolítica em travertino (Móveis), madeira Freijó e cal limewash (Materiais), esquadrias piso-teto (Composição) e luz natural filtrada + sanca 2700K (Iluminação).`,
            isSimulated: true
          }
        : {
            style:
              'refined contemporary architectural volume with cantilevered horizontal slabs integrated into natural topography',
            materials:
              'board-formed exposed architectural concrete, natural Cumaru timber louvers, expansive floor-to-ceiling extra-clear glass, and dark anodized aluminum frames',
            environment:
              'layered native landscaping, mature trees, natural stone retaining walls, and organic architectural integration',
            foreground:
              'calm reflecting water mirror in the foreground with natural shoreline stones and architectural stepping slabs',
            lighting:
              'warm late-afternoon golden-hour sunlight casting long soft architectural shadows paired with warm 2700K interior glow',
            mood: 'peaceful, monumental, natural, and architecture-focused',
            technical: `Ultra-realistic architectural visualization, soft global illumination, 24mm tilt-shift lens, strictly preserve 100% of original architecture, no text, ${config.value.aspectRatio}`,
            imageRef:
              buildCombinedImageDirective() ||
              'strictly following the exact architectural massing, façade materials, composition, and lighting mood decoded from the attached reference image',
            summaryPt: `Decodificado (${slotNames}): Volumetria em balanço (Composição), concreto ripado + brises Cumaru + vidro extra-clear (Materiais), espelho d’água e pisantes (1º Plano) e luz Golden Hour + 2700K interno (Iluminação).`,
            isSimulated: true
          }

      lastDecodedReference.value = fallbackDecoded
      return fallbackDecoded
    } catch (err: any) {
      generationError.value =
        err instanceof Error ? err.message : 'Erro ao analisar imagem de referência.'
      return null
    } finally {
      isAnalyzingReference.value = false
    }
  }

  // =========================================================================
  // 2. ENGENHARIA REVERSA DE ESTILO (Extrai "Pilares Visuais" do Autor)
  // =========================================================================
  const extractAuthorStyleProfile = async (params: {
    authorName?: string
    portfolioDataUrls?: string[]
  }): Promise<AuthorStyleProfile | null> => {
    isReverseEngineering.value = true
    generationError.value = null

    try {
      const cleanName = params.authorName?.trim() || 'Perfil Autoral do Arquiteto'
      const candidateImages =
        params.portfolioDataUrls && params.portfolioDataUrls.length > 0
          ? params.portfolioDataUrls
          : filledImageSlots.value.map(s => s.dataUrl).filter(Boolean)

      const geminiKey = config.value.geminiApiKey.trim()

      if (geminiKey && candidateImages.some(u => u.startsWith('data:'))) {
        const promptText = `Analyze these architectural portfolio images from "${cleanName}". Perform a Reverse Style Engineering analysis of the architect's signature geometry, color palette, material choices, and lighting design. Return ONLY valid JSON:
{
  "geometryPillarPt": "Descrição em PT-BR da geometria e volumetria recorrente do autor",
  "colorPalettePillarPt": "Descrição em PT-BR da paleta cromática do autor",
  "materialsPillarPt": "Descrição em PT-BR dos materiais de assinatura do autor",
  "designChoicesPillarPt": "Descrição em PT-BR das escolhas de mobiliário e iluminação do autor",
  "visualPillarsPromptEn": "Concise English directive summarizing the architect's visual pillars to inject into new prompts",
  "quickBlocks": {
    "style": "English Phase 1 style block matching the author",
    "materials": "English Phase 2 materials block matching the author",
    "environment": "English Phase 3 environment/joinery block matching the author",
    "foreground": "English Phase 4 furniture/foreground block matching the author",
    "lighting": "English Phase 5 lighting block matching the author",
    "mood": "English Phase 5 mood block matching the author",
    "technical": "English Phase 6 technical block"
  }
}`
        const parts: Array<Record<string, unknown>> = [{ text: promptText }]
        for (const imgUrl of candidateImages.slice(0, 3)) {
          if (imgUrl.startsWith('data:')) {
            const [meta, base64Data] = imgUrl.split(',')
            const mimeMatch = meta.match(/data:([^;]+);/)
            if (base64Data) {
              parts.push({
                inlineData: {
                  mimeType: mimeMatch ? mimeMatch[1] : 'image/png',
                  data: base64Data
                }
              })
            }
          }
        }

        const resp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(geminiKey)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts }],
              generationConfig: { responseMimeType: 'application/json' }
            })
          }
        )

        if (resp.ok) {
          const data = await resp.json()
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
          const parsed = JSON.parse(rawText.replace(/```json|```/g, '').trim())
          const profile: AuthorStyleProfile = {
            id: `author-${Date.now()}`,
            authorName: cleanName,
            createdAt: new Date().toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }),
            geometryPillarPt:
              parsed.geometryPillarPt ||
              'Planos horizontais puros, vãos livres generosos e marcenaria mimetizada piso-teto.',
            colorPalettePillarPt:
              parsed.colorPalettePillarPt ||
              'Tons minerais quentes (areia, travertino cru, off-white cal) com acentos terrosos e madeira mel.',
            materialsPillarPt:
              parsed.materialsPillarPt ||
              'Concreto ripado aparente, madeira Freijó/Cumaru natural, pedra travertino bruta e linho/bouclé.',
            designChoicesPillarPt:
              parsed.designChoicesPillarPt ||
              'Mobiliário baixo modernista brasileiro, iluminação indireta 2700K em sancas e ausência de excesso decorativo.',
            visualPillarsPromptEn:
              parsed.visualPillarsPromptEn ||
              'authored contemporary Brazilian architectural style with pure horizontal lines, warm mineral travertine and Freijó timber palette, low-profile modernist furniture, and warm 2700K indirect lighting',
            quickBlocks: parsed.quickBlocks || {
              style:
                'authored contemporary architectural space featuring pure geometric lines, generous open spans, and warm Brazilian modernist sensibility',
              materials:
                'honed Roman Travertine stone, natural Freijó hardwood millwork, warm off-white limewash walls, and raw linen bouclé textiles',
              environment:
                'floor-to-ceiling flush architectural joinery, seamless indoor-outdoor framing, and uncluttered spatial rhythm',
              foreground:
                'low-profile sculptural modernist sofa, monolithic stone coffee table, and curated artisanal ceramics',
              lighting:
                'soft natural lateral daylight balanced with warm 2700K concealed linear LED coves and grazing wall light',
              mood: 'warm, timeless, authored, tactile, and architecture-focused',
              technical:
                'Photorealistic architectural photography, Corona Renderer, 35mm editorial lens, strictly preserve 100% of original architecture, do not look like CGI, no text, 4:5'
            }
          }
          authorStyleProfile.value = profile
          try {
            localStorage.setItem(AUTHOR_STYLE_KEY, JSON.stringify(profile))
          } catch {}
          return profile
        }
      }

      await new Promise(r => setTimeout(r, 600))
      const fallbackProfile: AuthorStyleProfile = {
        id: `author-${Date.now()}`,
        authorName: cleanName,
        createdAt: new Date().toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        geometryPillarPt:
          'Ortogonalidade limpa com volumes horizontais em balanço, juntas secas negativas e marcenaria piso-teto integrada.',
        colorPalettePillarPt:
          'Base monocromática mineral (Alabastro #FAF9F6, Travertino #D8D0C3, Grafite #282824) aquecida por tons terrosos e madeira dourada.',
        materialsPillarPt:
          'Concreto aparente ripado, madeira Freijó/Cumaru oleada, travertino romano bruto sem resina e estofaria em bouclé/linho cru.',
        designChoicesPillarPt:
          'Mobiliário de baixo perfil assinado (Modernismo Brasileiro), iluminação 2700K oculta em sancas/marcenaria e ventilação cruzada.',
        visualPillarsPromptEn:
          'strictly following the architect visual pillars: pure orthogonal geometry with shadow-gap joints, warm mineral palette (raw travertine, oiled Freijó timber, off-white limewash), low-profile Brazilian modernist furniture, and warm 2700K indirect architectural lighting',
        quickBlocks: {
          style:
            'authored contemporary architectural space following the architect signature visual pillars of pure orthogonal geometry and warm Brazilian modernism',
          materials:
            'raw unfilled Roman Travertine stone, oiled Brazilian Freijó hardwood joinery, warm off-white limewash walls, and ivory bouclé upholstery',
          environment:
            'floor-to-ceiling flush timber millwork with shadow-gap joints, expansive frameless glazing, and clean spatial circulation',
          foreground:
            'low-profile Brazilian modernist lounge furniture, monolithic travertine table, and hand-loomed natural wool rug',
          lighting:
            'soft diffused natural daylight paired with warm 2700K concealed architectural LED coves and subtle wall-grazing light',
          mood: 'authored, warm, tactile, timeless, and architecture-focused',
          technical:
            'Photorealistic architectural photography, Corona Renderer, 35mm lens, strictly preserve 100% of original architecture, do not look like CGI, no text, 4:5'
        }
      }

      authorStyleProfile.value = fallbackProfile
      try {
        localStorage.setItem(AUTHOR_STYLE_KEY, JSON.stringify(fallbackProfile))
      } catch {}
      return fallbackProfile
    } catch (err: any) {
      generationError.value =
        err instanceof Error ? err.message : 'Erro na Engenharia Reversa de Estilo.'
      return null
    } finally {
      isReverseEngineering.value = false
    }
  }

  const clearAuthorStyleProfile = () => {
    authorStyleProfile.value = null
    try {
      localStorage.removeItem(AUTHOR_STYLE_KEY)
    } catch {}
  }

  // =========================================================================
  // 3. TESTES EM LOTE / BATCH TESTING (Disparo simultâneo em múltiplos motores)
  // =========================================================================
  const toggleBatchModel = (modelId: CanvasModelId) => {
    const idx = batchSelectedModels.value.indexOf(modelId)
    if (idx >= 0) {
      if (batchSelectedModels.value.length > 1) {
        batchSelectedModels.value.splice(idx, 1)
      }
    } else {
      batchSelectedModels.value.push(modelId)
    }
  }

  const generateBatchOnCanvas = async (params: {
    prompt: string
    contextId: ArchContextId
    forceSimulation?: boolean
  }): Promise<CanvasGeneratedItem[]> => {
    const cleanPrompt = params.prompt.trim()
    if (!cleanPrompt) {
      generationError.value = 'Preencha um prompt antes de iniciar o Teste em Lote (Batch Testing).'
      return []
    }

    isBatchGenerating.value = true
    isGenerating.value = true
    generationError.value = null
    const batchGroupId = `batch-${Date.now()}`
    const targetModels = CANVAS_MODELS.filter(m => batchSelectedModels.value.includes(m.id))
    generationStatusText.value = `Disparando Batch Testing simultâneo em ${targetModels.map(m => m.shortLabel).join(' + ')}...`

    try {
      const tasks = targetModels.map(async (model): Promise<CanvasGeneratedItem> => {
        const effectivePrompt =
          model.promptSuffix && !cleanPrompt.toLowerCase().includes('3d.hunyuan')
            ? `${cleanPrompt} ${model.promptSuffix}`
            : cleanPrompt

        const hasKeyForThisModel =
          model.provider === 'gemini'
            ? Boolean(config.value.geminiApiKey.trim())
            : model.provider === 'openai'
              ? Boolean(config.value.openaiApiKey.trim())
              : model.provider === 'fal'
                ? Boolean(config.value.falApiKey.trim())
                : Boolean(config.value.hunyuanApiKey.trim() || config.value.falApiKey.trim())

        let imageUrl = ''
        let isSimulated = false

        if (params.forceSimulation || !hasKeyForThisModel) {
          await new Promise(r => setTimeout(r, 450))
          imageUrl = createArchitecturalBlueprintPreviewDataUrl({
            prompt: `[BATCH · ${model.shortLabel.toUpperCase()}] ${effectivePrompt}`,
            contextId: params.contextId,
            model,
            aspectRatio: config.value.aspectRatio,
            refImages: filledImageSlots.value
          })
          isSimulated = true
        } else {
          // Usa o gerador unitário para o modelo quando a chave está presente, com fallback seguro
          try {
            const previousModel = config.value.selectedModelId
            config.value.selectedModelId = model.id
            const single = await generateOnCanvas({
              prompt: effectivePrompt,
              contextId: params.contextId,
              forceSimulation: false
            })
            config.value.selectedModelId = previousModel
            if (single) {
              single.batchGroupId = batchGroupId
              return single
            }
          } catch {}
          imageUrl = createArchitecturalBlueprintPreviewDataUrl({
            prompt: `[BATCH · ${model.shortLabel.toUpperCase()}] ${effectivePrompt}`,
            contextId: params.contextId,
            model,
            aspectRatio: config.value.aspectRatio,
            refImages: filledImageSlots.value
          })
          isSimulated = true
        }

        return {
          id: `canvas-${model.id}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          modelId: model.id,
          modelLabel: model.label,
          contextId: params.contextId,
          prompt: effectivePrompt,
          imageUrl,
          aspectRatio: config.value.aspectRatio,
          createdAt: new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          isSimulated,
          inputImagesCount: filledImageSlots.value.length,
          batchGroupId
        }
      })

      const results = await Promise.all(tasks)
      batchResults.value = results
      for (const item of [...results].reverse()) {
        if (!gallery.value.some(g => g.id === item.id)) {
          gallery.value.unshift(item)
        }
      }
      if (results[0]) {
        activeCanvasItem.value = results[0]
      }
      persistGallery()
      return results
    } finally {
      isBatchGenerating.value = false
      isGenerating.value = false
      generationStatusText.value = ''
    }
  }

  return {
    config,
    imageSlots,
    filledImageSlots,
    gallery,
    activeCanvasItem,
    isGenerating,
    generationStatusText,
    generationError,
    isConfigModalOpen,
    selectedModel,
    hasActiveApiKeyForSelectedModel,
    configuredProvidersCount,
    selectModel,
    setSlotImageFile,
    setSlotImageUrl,
    clearSlotImage,
    clearAllImageSlots,
    buildCombinedImageDirective,
    exportConfigToJson,
    importConfigFromJson,
    resetApiConfig,
    generateOnCanvas,
    deleteCanvasItem,
    isAnalyzingReference,
    lastDecodedReference,
    analyzeReferenceImages,
    isReverseEngineering,
    authorStyleProfile,
    extractAuthorStyleProfile,
    clearAuthorStyleProfile,
    batchSelectedModels,
    batchResults,
    isBatchGenerating,
    toggleBatchModel,
    generateBatchOnCanvas
  }
}
