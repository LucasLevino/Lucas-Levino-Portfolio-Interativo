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
}

const CONFIG_STORAGE_KEY = 'lucaslevino_archprompt_config_v1'
const CONFIG_COOKIE_NAME = 'archprompt_config_v1'
const CANVAS_GALLERY_KEY = 'lucaslevino_archprompt_canvas_gallery_v1'

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

// Singleton state so Config Modal, Image Inputs, 3D Context Bar, and Canvas Module stay in sync
const config = ref<ArchApiConfig>(loadInitialConfig())
const imageSlots = ref<ReferenceImageSlot[]>(createDefaultImageSlots())
const gallery = ref<CanvasGeneratedItem[]>(loadInitialGallery())
const activeCanvasItem = ref<CanvasGeneratedItem | null>(gallery.value[0] || null)
const isGenerating = ref(false)
const generationStatusText = ref('')
const generationError = ref<string | null>(null)
const isConfigModalOpen = ref(false)

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
    deleteCanvasItem
  }
}
