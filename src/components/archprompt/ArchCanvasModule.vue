<script setup lang="ts">
import { ref } from 'vue'
import type { ArchContextId } from '../../data/archprompt'
import {
  useArchCanvas,
  CANVAS_MODELS,
  type CanvasModelId
} from '../../composables/useArchCanvas'
import ArchIcon from './ArchIcon.vue'

const props = defineProps<{
  isDark: boolean
  activeContextId: ArchContextId
  finalPrompt: string
  accentHex: string
}>()

const emit = defineEmits<{
  (e: 'sync-image-directive', directive: string): void
  (
    e: 'apply-decoded-blocks',
    payload: {
      style: string
      materials: string
      environment: string
      foreground: string
      lighting: string
      mood: string
      technical: string
      imageRef?: string
    }
  ): void
  (e: 'open-config-modal'): void
  (e: 'notify', message: string): void
}>()

const {
  config,
  imageSlots,
  filledImageSlots,
  gallery,
  activeCanvasItem,
  isGenerating,
  generationStatusText,
  generationError,
  selectedModel,
  hasActiveApiKeyForSelectedModel,
  isAnalyzingReference,
  lastDecodedReference,
  isReverseEngineering,
  authorStyleProfile,
  batchSelectedModels,
  batchResults,
  isBatchGenerating,
  selectModel,
  setSlotImageFile,
  setSlotImageUrl,
  clearSlotImage,
  clearAllImageSlots,
  buildCombinedImageDirective,
  exportConfigToJson,
  importConfigFromJson,
  analyzeReferenceImages,
  extractAuthorStyleProfile,
  clearAuthorStyleProfile,
  toggleBatchModel,
  generateBatchOnCanvas,
  generateOnCanvas,
  deleteCanvasItem
} = useArchCanvas()

const activeSlotIdForUrl = ref<string | null>(null)
const dragOverSlotId = ref<string | null>(null)
const showImageInputs = ref<boolean>(false)
const showStyleReversePanel = ref<boolean>(false)
const showCanvasModule = ref<boolean>(false)
const showBatchPanel = ref<boolean>(false)
const showInlineQuickConfig = ref<boolean>(false)
const compareWithInput = ref<boolean>(false)
const quickJsonInputRef = ref<HTMLInputElement | null>(null)
const authorNameInput = ref<string>(authorStyleProfile.value?.authorName || 'Estúdio Autoral')
const portfolioUploadedUrls = ref<string[]>([])

const handleSelectModel = (modelId: CanvasModelId) => {
  selectModel(modelId)
  const model = CANVAS_MODELS.find(m => m.id === modelId)
  if (model) {
    emit('notify', `Modelo selecionado no Canvas: ${model.shortLabel}`)
  }
}

const syncDirectivesToPrompt = () => {
  const directive = buildCombinedImageDirective()
  emit('sync-image-directive', directive)
}

const handleSlotFileChange = async (slotId: string, e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    await setSlotImageFile(slotId, file)
    if (config.value.autoSyncImageDirective) {
      syncDirectivesToPrompt()
    }
    emit('notify', `Imagem "${file.name}" anexada ao ${slotId.toUpperCase()}.`)
  } catch {
    emit('notify', 'Erro ao carregar arquivo de imagem.')
  } finally {
    input.value = ''
  }
}

const handleSlotDrop = async (slotId: string, e: DragEvent) => {
  dragOverSlotId.value = null
  const file = e.dataTransfer?.files?.[0]
  if (!file || !file.type.startsWith('image/')) {
    emit('notify', 'Arraste um arquivo de imagem válido (PNG, JPG, WEBP).')
    return
  }
  await setSlotImageFile(slotId, file)
  if (config.value.autoSyncImageDirective) {
    syncDirectivesToPrompt()
  }
  emit('notify', `Imagem "${file.name}" carregada para geração no Canvas.`)
}

const handlePasteOnSlot = async (slotId: string, e: ClipboardEvent) => {
  const items = e.clipboardData?.items
  if (!items) return
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) {
        e.preventDefault()
        await setSlotImageFile(slotId, file)
        if (config.value.autoSyncImageDirective) {
          syncDirectivesToPrompt()
        }
        emit('notify', 'Imagem colada da área de transferência!')
        return
      }
    }
  }
}

const handleApplyUrl = (slotId: string, url: string) => {
  if (!url.trim()) return
  setSlotImageUrl(slotId, url)
  activeSlotIdForUrl.value = null
  if (config.value.autoSyncImageDirective) {
    syncDirectivesToPrompt()
  }
  emit('notify', 'URL de imagem vinculada ao slot de referência.')
}

const handleRemoveSlot = (slotId: string) => {
  clearSlotImage(slotId)
  if (config.value.autoSyncImageDirective) {
    syncDirectivesToPrompt()
  }
}

const handleClearAllSlots = () => {
  clearAllImageSlots()
  if (config.value.autoSyncImageDirective) {
    syncDirectivesToPrompt()
  }
  emit('notify', 'Todos os campos de imagem foram limpos.')
}

const handleTriggerGenerate = async (forceSimulation = false) => {
  const res = await generateOnCanvas({
    prompt: props.finalPrompt,
    contextId: props.activeContextId,
    forceSimulation
  })
  if (res) {
    emit(
      'notify',
      res.isSimulated
        ? `Prancha de preview gerada no Canvas (${res.modelLabel}). Configure sua API Key para render real.`
        : `Imagem gerada com sucesso via ${res.modelLabel}!`
    )
  }
}

const handleDownloadCanvasImage = () => {
  if (!activeCanvasItem.value) return
  const a = document.createElement('a')
  a.href = activeCanvasItem.value.imageUrl
  const ext = activeCanvasItem.value.imageUrl.startsWith('data:image/svg') ? 'svg' : 'png'
  a.download = `archstudio-${activeCanvasItem.value.modelId}-${Date.now()}.${ext}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const handleQuickJsonImport = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    await importConfigFromJson(file)
    emit('notify', `Configuração "${file.name}" carregada com sucesso!`)
  } catch {
    emit('notify', 'Arquivo .JSON inválido.')
  } finally {
    input.value = ''
  }
}

const handleAnalyzeReference = async () => {
  if (filledImageSlots.value.length === 0) {
    emit('notify', 'Anexe pelo menos 1 imagem nos slots abaixo antes de clicar em Analisar Referência.')
    showImageInputs.value = true
    return
  }

  const decoded = await analyzeReferenceImages(props.activeContextId)
  if (decoded) {
    const directive = buildCombinedImageDirective()
    emit('apply-decoded-blocks', {
      style: decoded.style,
      materials: decoded.materials,
      environment: decoded.environment,
      foreground: decoded.foreground,
      lighting: decoded.lighting,
      mood: decoded.mood,
      technical: decoded.technical,
      imageRef: directive
    })
    emit('notify', 'Imagem decodificada! Os blocos de Estilo, Materiais, Luz e Técnica foram preenchidos.')
  }
}

const handleApplySurgicalReskinWorkflow = () => {
  const slot1 = imageSlots.value.find(s => s.id === 'img-1')
  const slot3 = imageSlots.value.find(s => s.id === 'img-3')
  if (slot1) {
    slot1.directiveEn =
      'use Slot 1 strictly as the master architectural geometry, preserving 100% of the structural footprint, volume, and element dimensions'
  }
  if (slot3) {
    slot3.directiveEn =
      'extract the exact material texture, surface grain, and reflectance from Slot 3 and apply it surgically onto the target surface without altering any spatial footprint'
  }
  const combinedDirective = buildCombinedImageDirective()
  emit('apply-decoded-blocks', {
    style:
      'surgical material re-skin study maintaining the exact existing architectural design, proportions, and layout',
    materials:
      'surgical replacement of the target finish using the exact material sample from Slot 3 with physically accurate roughness, micro-relief, and seamless UV alignment',
    environment:
      'strictly preserve all surrounding architectural context, walls, openings, and ceiling details untouched',
    foreground:
      'footprint lock active: do not move, resize, add, or remove any existing furniture or structural elements',
    lighting:
      'protect the original lighting project: maintain the exact existing light sources, color temperature, and contact shadows',
    mood: 'clinical architectural material study with authentic real-world physical behavior',
    technical:
      '100% preservation of original architecture and proportions, surgical material swap only, do not look like a 3D render, CGI, VFX, video game, or digital art',
    imageRef:
      combinedDirective ||
      'use Image 1 strictly as Geometry Master and Image 3 as Material/Texture Source with strict Footprint Lock'
  })
  emit('notify', 'Workflow Re-Skin Cirúrgico ativado (Slot 1 Geometria + Slot 3 Textura + Footprint Lock)!')
}

const handleApplyVirtualStagingWorkflow = () => {
  const profile = authorStyleProfile.value
  const directive =
    'perform a virtual demolition first (stripping away outdated furniture and clutter down to the clean shell while keeping structural walls and windows intact), then execute a complete Virtual Staging with the author architectural style'
  const slot1 = imageSlots.value.find(s => s.id === 'img-1')
  if (slot1) {
    slot1.directiveEn = directive
  }
  emit('apply-decoded-blocks', {
    style: profile
      ? `${profile.quickBlocks.style} (${profile.authorName} signature virtual staging)`
      : 'contemporary warm minimalism virtual staging with bespoke architectural joinery and curated designer furniture',
    materials: profile
      ? profile.quickBlocks.materials
      : 'natural freijó wood millwork, honed travertine stone, brushed bronze accents, and organic bouclé upholstery',
    environment:
      'renovated architectural shell after virtual demolition preserving the exact structural walls, ceiling height, and window openings of the original photo',
    foreground: profile
      ? profile.quickBlocks.foreground
      : 'ergonomically arranged designer furniture layout respecting circulation paths, spatial depth, and architectural focal points',
    lighting:
      'balanced natural daylight entering through the original windows combined with warm 2700K architectural cove and accent lighting',
    mood: 'high-end architectural transformation ready for client presentation, tactile and welcoming',
    technical:
      'two-stage Virtual Demolition + Virtual Staging workflow, strict structural preservation of walls/openings, photorealistic ArchViz photography',
    imageRef: buildCombinedImageDirective() || directive
  })
  emit('notify', 'Workflow Virtual Staging (Demolição Virtual + Reforma Autoral) aplicado aos blocos!')
}

const handlePortfolioFilesUpload = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const files = input.files
  if (!files || files.length === 0) return
  const loaded: string[] = []
  const slotIds = ['img-1', 'img-2', 'img-3']
  let idx = 0
  for (const file of Array.from(files).slice(0, 6)) {
    if (!file.type.startsWith('image/')) continue
    if (idx < slotIds.length) {
      await setSlotImageFile(slotIds[idx]!, file)
      idx++
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result || ''))
      reader.onerror = () => reject(new Error('Erro ao ler imagem'))
      reader.readAsDataURL(file)
    })
    loaded.push(dataUrl)
  }
  portfolioUploadedUrls.value = [...portfolioUploadedUrls.value, ...loaded].slice(0, 6)
  input.value = ''
  emit('notify', `${loaded.length} foto(s) de projetos anteriores carregadas para Engenharia Reversa.`)
}

const handleExtractAuthorStyle = async () => {
  const res = await extractAuthorStyleProfile({
    authorName: authorNameInput.value,
    portfolioDataUrls: portfolioUploadedUrls.value
  })
  if (res) {
    emit(
      'notify',
      `Pilares Visuais de "${res.authorName}" extraídos com sucesso! Você já pode aplicá-los ao prompt.`
    )
  }
}

const handleApplyAuthorProfileToBlocks = () => {
  const p = authorStyleProfile.value
  if (!p) return
  emit('apply-decoded-blocks', {
    style: p.quickBlocks.style,
    materials: p.quickBlocks.materials,
    environment: p.quickBlocks.environment,
    foreground: p.quickBlocks.foreground,
    lighting: p.quickBlocks.lighting,
    mood: p.quickBlocks.mood,
    technical: `${p.quickBlocks.technical}, ${p.visualPillarsPromptEn}`
  })
  emit('notify', `Pilares Visuais de "${p.authorName}" aplicados nos blocos do prompt!`)
}

const handleTriggerBatchGenerate = async (forceSimulation = false) => {
  const results = await generateBatchOnCanvas({
    prompt: props.finalPrompt,
    contextId: props.activeContextId,
    forceSimulation
  })
  if (results.length > 0) {
    emit('notify', `Teste em Lote concluído em ${results.length} motores de IA simultaneamente!`)
  }
}
</script>

<template>
  <div class="space-y-3">
    <!-- ==================================================================== -->
    <!-- MÓDULO 1 (ACIMA DO CANVAS): CAMPOS DE INPUT DE IMAGENS (OPCIONAL)    -->
    <!-- ==================================================================== -->
    <section
      aria-labelledby="image-inputs-heading"
      class="rounded-[14px] border-[1.75px] overflow-hidden"
      :class="
        isDark
          ? 'bg-[#1F1F1C] border-[#77766F]/50 shadow-[3px_3px_0px_#000000]'
          : 'bg-[#FAF9F6] border-[#282824] shadow-[3px_3px_0px_#282824]'
      "
    >
      <div
        class="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 cursor-pointer select-none"
        :class="[
          showImageInputs ? 'border-b-[1.5px]' : '',
          isDark ? 'border-[#77766F]/40 bg-[#161614]' : 'border-[#282824] bg-[#F5F1E9]'
        ]"
        @click="showImageInputs = !showImageInputs"
      >
        <div class="flex items-center gap-2">
          <ArchIcon name="image" :size="14" />
          <h3 id="image-inputs-heading" class="font-display text-xs font-semibold uppercase tracking-wider">
            Inputs de Imagens
          </h3>
          <span
            class="rounded-[5px] border border-[#282824]/40 px-1.5 py-0.2 font-mono text-[9px] uppercase"
            :class="isDark ? 'bg-[#282824] text-[#D8D0C3]' : 'bg-[#E8E8E3] text-[#77766F]'"
          >
            Opcional
          </span>
          <span
            v-if="filledImageSlots.length > 0"
            class="rounded-[6px] border border-[#282824] bg-[#A5B4A0] px-1.5 py-0.2 font-mono text-[10px] font-semibold text-[#282824]"
          >
            {{ filledImageSlots.length }}/3 ativas
          </span>
        </div>

        <div class="flex items-center gap-1.5" @click.stop>
          <button
            v-if="filledImageSlots.length > 0"
            type="button"
            :disabled="isAnalyzingReference"
            @click="handleAnalyzeReference"
            class="rounded-[6px] border border-[#282824] bg-[#C98268] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#282824] shadow-[1.5px_1.5px_0px_#282824] hover:opacity-95 disabled:opacity-50"
            title="Decodificar imagem enviada com IA e preencher automaticamente todos os blocos do prompt"
          >
            {{ isAnalyzingReference ? 'Analisando...' : 'Analisar Referência' }}
          </button>
          <button
            v-if="filledImageSlots.length > 0"
            type="button"
            @click="syncDirectivesToPrompt"
            class="rounded-[6px] border border-[#282824] bg-[#FAF9F6] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#282824] hover:bg-[#E8E8E3]"
            title="Aplicar diretrizes das imagens anexadas ao prompt compilado"
          >
            Sincronizar no Prompt
          </button>
          <button
            v-if="filledImageSlots.length > 0"
            type="button"
            @click="handleClearAllSlots"
            class="rounded px-1.5 py-0.5 font-mono text-[10px] text-[#F47760] hover:underline"
          >
            Limpar
          </button>
          <button
            type="button"
            @click="showImageInputs = !showImageInputs"
            class="inline-flex items-center gap-1 rounded-[6px] border border-[#282824]/30 px-2 py-0.5 font-mono text-[10px] font-semibold"
            :class="isDark ? 'text-[#D8D0C3] hover:text-[#FAF9F6]' : 'text-[#77766F] hover:text-[#282824]'"
            :aria-expanded="showImageInputs"
          >
            <span>{{ showImageInputs ? 'Ocultar' : 'Anexar' }}</span>
            <ArchIcon
              name="chevron-down"
              :size="13"
              class="transform transition-transform"
              :class="showImageInputs ? 'rotate-180' : ''"
            />
          </button>
        </div>
      </div>

      <div v-if="showImageInputs" class="p-4 space-y-3">
        <p class="text-[11px] leading-relaxed" :class="isDark ? 'text-[#D8D0C3]' : 'text-[#77766F]'">
          Anexe até 3 imagens de referência (croqui/planta, referência de luz ou amostra de textura/móvel 3D). Você pode <strong>arrastar</strong>, <strong>clicar para enviar</strong>, <strong>colar (Ctrl+V)</strong> ou usar <strong>URL</strong>.
        </p>

        <!-- Barra de Workflows Inteligentes: Analisar Referência + Re-Skin Cirúrgico + Virtual Staging + Engenharia Reversa -->
        <div
          class="rounded-[10px] border-[1.5px] p-2.5 space-y-2"
          :class="isDark ? 'border-[#77766F]/40 bg-[#161614]' : 'border-[#282824] bg-[#F5F1E9]'"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="font-mono text-[10px] font-semibold uppercase tracking-wider" :class="isDark ? 'text-[#D8D0C3]' : 'text-[#282824]'">
              Workflows de Decodificação &amp; Intervenção Cirúrgica:
            </span>
            <button
              type="button"
              @click="showStyleReversePanel = !showStyleReversePanel"
              class="font-mono text-[10px] font-semibold underline underline-offset-2"
              :class="isDark ? 'text-[#D8B99A]' : 'text-[#282824]'"
            >
              {{ showStyleReversePanel ? 'Fechar Engenharia Reversa' : 'Engenharia Reversa de Estilo (Autor)' }}
            </button>
          </div>

          <div class="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              :disabled="isAnalyzingReference"
              @click="handleAnalyzeReference"
              class="rounded-[7px] border-[1.5px] border-[#282824] bg-[#C98268] px-2.5 py-1 font-mono text-[10px] font-semibold text-[#282824] shadow-[1.5px_1.5px_0px_#282824] hover:opacity-95 disabled:opacity-50"
            >
              {{ isAnalyzingReference ? 'Decodificando Imagem...' : '🔍 Analisar Referência (Preencher Blocos)' }}
            </button>

            <button
              type="button"
              @click="handleApplySurgicalReskinWorkflow"
              class="rounded-[7px] border-[1.5px] border-[#282824] bg-[#D8B99A] px-2.5 py-1 font-mono text-[10px] font-semibold text-[#282824] shadow-[1.5px_1.5px_0px_#282824] hover:opacity-95"
              title="Slot 1 como Mestre de Geometria + Slot 3 como Fonte de Textura + Footprint Lock"
            >
              🧱 Re-Skin Cirúrgico (Slot 1 + Slot 3 + Footprint Lock)
            </button>

            <button
              type="button"
              @click="handleApplyVirtualStagingWorkflow"
              class="rounded-[7px] border-[1.5px] border-[#282824] bg-[#A5B4A0] px-2.5 py-1 font-mono text-[10px] font-semibold text-[#282824] shadow-[1.5px_1.5px_0px_#282824] hover:opacity-95"
              title="Demolição Virtual (limpeza do espaço) seguida de Virtual Staging com o estilo do arquiteto"
            >
              🛋️ Virtual Staging (Demolição + Estilo Autoral)
            </button>
          </div>

          <!-- Resultado da Decodificação ("Analisar Referência") -->
          <div
            v-if="lastDecodedReference"
            class="mt-2 rounded-[8px] border border-[#282824]/40 p-2.5 text-[11px] space-y-1"
            :class="isDark ? 'bg-[#1F1F1C] text-[#FAF9F6]' : 'bg-[#FAF9F6] text-[#282824]'"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="font-mono text-[10px] font-bold uppercase text-[#C98268]">
                ✓ Referência Decodificada em Blocos
              </span>
              <button
                type="button"
                @click="lastDecodedReference = null"
                class="font-mono text-[9px] text-[#77766F] hover:underline"
              >
                Ocultar
              </button>
            </div>
            <p class="text-[11px] leading-snug">{{ lastDecodedReference.summaryPt }}</p>
          </div>

          <!-- Painel de Engenharia Reversa de Estilo ("Pilares Visuais do Autor") -->
          <div
            v-if="showStyleReversePanel"
            class="mt-2 rounded-[9px] border-[1.5px] p-3 space-y-2.5"
            :class="isDark ? 'border-[#D8B99A]/60 bg-[#1F1F1C]' : 'border-[#282824] bg-[#FAF9F6]'"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 class="font-display text-xs font-semibold">
                  Engenharia Reversa de Estilo (Pilares Visuais do Autor)
                </h4>
                <p class="text-[10px] text-[#77766F]">
                  Envie fotos de projetos anteriores (ou use os slots abaixo) para extrair Geometria, Paleta de Cores, Materiais e Escolhas de Design do escritório.
                </p>
              </div>
              <span
                v-if="authorStyleProfile"
                class="rounded border border-[#282824] bg-[#A5B4A0] px-1.5 py-0.5 font-mono text-[9px] font-semibold text-[#282824]"
              >
                Perfil Ativo: {{ authorStyleProfile.authorName }}
              </span>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <input
                v-model="authorNameInput"
                type="text"
                placeholder="Nome do Estúdio / Arquiteto"
                class="arch-input flex-1 min-w-[160px] px-2.5 py-1 font-mono text-[11px]"
              />
              <label
                for="portfolio-style-upload"
                class="arch-btn-secondary cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold"
              >
                <ArchIcon name="upload" :size="12" />
                <span>Fotos do Portfólio ({{ portfolioUploadedUrls.length }})</span>
              </label>
              <input
                id="portfolio-style-upload"
                type="file"
                accept="image/*"
                multiple
                class="hidden"
                @change="handlePortfolioFilesUpload"
              />
              <button
                type="button"
                :disabled="isReverseEngineering"
                @click="handleExtractAuthorStyle"
                class="arch-btn-primary px-2.5 py-1 text-[11px] font-semibold disabled:opacity-50"
              >
                {{ isReverseEngineering ? 'Extraindo Pilares...' : 'Extrair Pilares Visuais' }}
              </button>
            </div>

            <div
              v-if="authorStyleProfile"
              class="rounded-[8px] border border-[#282824]/30 p-2.5 space-y-1.5 text-[11px]"
              :class="isDark ? 'bg-[#161614]' : 'bg-[#F5F1E9]'"
            >
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[10px]">
                <div><strong>1. Geometria:</strong> {{ authorStyleProfile.geometryPillarPt }}</div>
                <div><strong>2. Paleta:</strong> {{ authorStyleProfile.colorPalettePillarPt }}</div>
                <div><strong>3. Materiais:</strong> {{ authorStyleProfile.materialsPillarPt }}</div>
                <div><strong>4. Design:</strong> {{ authorStyleProfile.designChoicesPillarPt }}</div>
              </div>
              <div class="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-[#282824]/15">
                <div class="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    @click="handleApplyAuthorProfileToBlocks"
                    class="rounded-[6px] border border-[#282824] bg-[#C98268] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#282824]"
                  >
                    Aplicar Pilares ao Prompt
                  </button>
                  <button
                    type="button"
                    @click="handleApplyVirtualStagingWorkflow"
                    class="rounded-[6px] border border-[#282824] bg-[#A5B4A0] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#282824]"
                  >
                    Virtual Staging c/ Este Estilo
                  </button>
                </div>
                <button
                  type="button"
                  @click="clearAuthorStyleProfile"
                  class="font-mono text-[10px] text-[#F47760] hover:underline"
                >
                  Limpar Perfil
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-2.5">
          <div
            v-for="slot in imageSlots"
            :key="slot.id"
            tabindex="0"
            @dragover.prevent="dragOverSlotId = slot.id"
            @dragleave.prevent="dragOverSlotId = null"
            @drop.prevent="e => handleSlotDrop(slot.id, e)"
            @paste="e => handlePasteOnSlot(slot.id, e)"
            class="rounded-[10px] border-[1.5px] p-2.5 transition-all focus:outline-none"
            :class="
              dragOverSlotId === slot.id
                ? 'border-[#C98268] bg-[#C98268]/15'
                : slot.dataUrl
                  ? isDark
                    ? 'border-[#A5B4A0]/70 bg-[#161614]'
                    : 'border-[#282824] bg-[#F5F1E9] shadow-[2px_2px_0px_#282824]'
                  : isDark
                    ? 'border-dashed border-[#77766F]/50 bg-[#161614]/60 hover:border-[#D8D0C3]'
                    : 'border-dashed border-[#282824]/50 bg-[#FAF9F6] hover:bg-[#F5F1E9]'
            "
          >
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2.5 min-w-0">
                <!-- Miniatura ou Ícone -->
                <div
                  class="h-11 w-11 shrink-0 rounded-[8px] border border-[#282824] overflow-hidden flex items-center justify-center"
                  :class="isDark ? 'bg-[#282824]' : 'bg-[#E8E8E3]'"
                >
                  <img
                    v-if="slot.dataUrl"
                    :src="slot.dataUrl"
                    :alt="slot.label"
                    class="h-full w-full object-cover"
                  />
                  <ArchIcon v-else name="upload" :size="15" class="text-[#77766F]" />
                </div>

                <div class="min-w-0">
                  <div class="flex items-center gap-1.5">
                    <span
                      class="rounded border border-[#282824]/40 px-1.5 py-0.2 font-mono text-[9px] font-semibold uppercase"
                      :class="isDark ? 'bg-[#282824] text-[#D8D0C3]' : 'bg-[#E8E8E3] text-[#282824]'"
                    >
                      {{ slot.badge }}
                    </span>
                    <span class="font-display text-xs font-semibold truncate">
                      {{ slot.label }}
                    </span>
                  </div>
                  <p class="font-mono text-[10px] truncate mt-0.5 text-[#77766F]">
                    {{ slot.fileName ? `Arquivo: ${slot.fileName}` : slot.placeholder }}
                  </p>
                </div>
              </div>

              <!-- Botões do Slot -->
              <div class="flex items-center gap-1 shrink-0">
                <label
                  :for="`file-input-${slot.id}`"
                  class="arch-btn-secondary cursor-pointer inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold"
                >
                  <ArchIcon name="upload" :size="12" />
                  <span>{{ slot.dataUrl ? 'Trocar' : 'Subir' }}</span>
                </label>
                <input
                  :id="`file-input-${slot.id}`"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="e => handleSlotFileChange(slot.id, e)"
                />

                <button
                  type="button"
                  @click="activeSlotIdForUrl = activeSlotIdForUrl === slot.id ? null : slot.id"
                  class="arch-btn-secondary px-2 py-1 font-mono text-[10px] font-semibold"
                  title="Inserir imagem via URL"
                >
                  URL
                </button>

                <button
                  v-if="slot.dataUrl"
                  type="button"
                  @click="handleRemoveSlot(slot.id)"
                  class="rounded p-1 text-[#77766F] hover:text-[#F47760]"
                  aria-label="Remover imagem"
                >
                  <ArchIcon name="trash" :size="13" />
                </button>
              </div>
            </div>

            <!-- Campo de URL Expansível -->
            <div v-if="activeSlotIdForUrl === slot.id" class="mt-2 pt-2 border-t border-[#282824]/15 flex gap-1.5">
              <input
                v-model="slot.urlInput"
                type="url"
                placeholder="https://exemplo.com/referencia-arquitetura.jpg"
                class="arch-input flex-1 px-2.5 py-1 font-mono text-[11px]"
                @keydown.enter.prevent="handleApplyUrl(slot.id, slot.urlInput)"
              />
              <button
                type="button"
                @click="handleApplyUrl(slot.id, slot.urlInput)"
                class="arch-btn-primary px-2.5 py-1 text-[11px] font-semibold"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================================================================== -->
    <!-- MÓDULO 2: CANVAS OPCIONAL (GERAÇÃO DE IMAGEM & ATIVOS 3D.HUNYUAN)    -->
    <!-- ==================================================================== -->
    <section
      aria-labelledby="canvas-module-heading"
      class="rounded-[14px] border-[1.75px] overflow-hidden"
      :class="
        isDark
          ? 'bg-[#1F1F1C] border-[#77766F]/50 shadow-[3px_3px_0px_#000000]'
          : 'bg-[#FAF9F6] border-[#282824] shadow-[3px_3px_0px_#282824]'
      "
    >
      <!-- Header do Canvas (Colapsável por padrão, mantendo o Gerador de Prompts como produto principal) -->
      <div
        class="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 cursor-pointer select-none"
        :class="[
          showCanvasModule ? 'border-b-[1.5px]' : '',
          isDark ? 'bg-[#161614] border-[#77766F]/40' : 'bg-[#F5F1E9] border-[#282824]'
        ]"
        @click="showCanvasModule = !showCanvasModule"
      >
        <div class="flex items-center gap-2">
          <ArchIcon :name="selectedModel.is3D ? 'furniture-3d' : 'canvas'" :size="14" />
          <h3 id="canvas-module-heading" class="font-display text-xs font-semibold uppercase tracking-wider">
            Canvas
          </h3>
          <span
            class="rounded-[5px] border border-[#282824]/40 px-1.5 py-0.2 font-mono text-[9px] uppercase"
            :class="isDark ? 'bg-[#282824] text-[#D8D0C3]' : 'bg-[#E8E8E3] text-[#77766F]'"
          >
            Opcional
          </span>
          <span
            class="rounded-[5px] border border-[#282824] px-1.5 py-0.2 font-mono text-[10px] font-semibold text-[#282824]"
            :style="{ backgroundColor: selectedModel.is3D ? '#F47760' : accentHex }"
          >
            {{ selectedModel.shortLabel }}
          </span>
        </div>

        <!-- Botões Rápidos de Configuração & Expandir -->
        <div class="flex items-center gap-1.5" @click.stop>
          <input
            ref="quickJsonInputRef"
            type="file"
            accept=".json,application/json"
            class="hidden"
            @change="handleQuickJsonImport"
          />

          <button
            type="button"
            @click="emit('open-config-modal')"
            class="rounded-[6px] border border-[#282824]/40 px-2 py-0.5 font-mono text-[10px] font-semibold inline-flex items-center gap-1"
            :class="isDark ? 'bg-[#282824] text-[#FAF9F6]' : 'bg-[#FAF9F6] text-[#282824] hover:bg-[#E8E8E3]'"
            title="Configurar chaves de API (LocalStorage / Cookies) ou Baixar/Subir .JSON"
          >
            <ArchIcon name="key" :size="11" />
            <span>Config / .JSON</span>
          </button>

          <button
            type="button"
            @click="showCanvasModule = !showCanvasModule"
            class="inline-flex items-center gap-1 rounded-[6px] border border-[#282824]/30 px-2 py-0.5 font-mono text-[10px] font-semibold"
            :class="isDark ? 'text-[#D8D0C3] hover:text-[#FAF9F6]' : 'text-[#77766F] hover:text-[#282824]'"
            :aria-expanded="showCanvasModule"
          >
            <span>{{ showCanvasModule ? 'Recolher' : 'Abrir Canvas' }}</span>
            <ArchIcon
              name="chevron-down"
              :size="13"
              class="transform transition-transform"
              :class="showCanvasModule ? 'rotate-180' : ''"
            />
          </button>
        </div>
      </div>

      <div v-if="showCanvasModule" class="p-4 space-y-4">
        <!-- Barra de portabilidade .JSON rápida dentro do Canvas expandido -->
        <div
          class="flex flex-wrap items-center justify-between gap-2 rounded-[8px] border px-2.5 py-1.5 text-[11px]"
          :class="isDark ? 'border-[#77766F]/30 bg-[#161614]' : 'border-[#282824]/20 bg-[#F5F1E9]'"
        >
          <span class="font-mono text-[10px]" :class="isDark ? 'text-[#D8D0C3]' : 'text-[#77766F]'">
            {{ hasActiveApiKeyForSelectedModel ? 'Chave API configurada ✓' : 'Sem API Key (usando Preview Técnico)' }}
          </span>
          <div class="flex items-center gap-1.5">
            <button
              type="button"
              @click="quickJsonInputRef?.click()"
              class="inline-flex items-center gap-1 font-mono text-[10px] font-semibold underline underline-offset-2"
            >
              <ArchIcon name="upload" :size="10" />
              <span>Subir .JSON</span>
            </button>
            <span>·</span>
            <button
              type="button"
              @click="exportConfigToJson()"
              class="inline-flex items-center gap-1 font-mono text-[10px] font-semibold underline underline-offset-2"
            >
              <ArchIcon name="download" :size="10" />
              <span>Baixar .JSON</span>
            </button>
          </div>
        </div>
        <!-- Seletor de Modelos (Botões de Seleção incluindo 3d.hunyuan) -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="font-mono text-[11px] font-semibold uppercase" :class="isDark ? 'text-[#D8D0C3]' : 'text-[#77766F]'">
              Modelo de Geração (2D ArchViz / PBR / 3D Asset):
            </span>
            <button
              type="button"
              @click="showInlineQuickConfig = !showInlineQuickConfig"
              class="font-mono text-[10px] underline underline-offset-2"
              :class="isDark ? 'text-[#D8B99A]' : 'text-[#282824]'"
            >
              {{ showInlineQuickConfig ? 'Ocultar chave rápida' : 'Inserir API Key rápida' }}
            </button>
          </div>

          <div
            role="radiogroup"
            aria-label="Selecionar modelo de geração do Canvas"
            class="grid grid-cols-2 gap-2"
          >
            <button
              v-for="model in CANVAS_MODELS"
              :key="model.id"
              type="button"
              role="radio"
              :aria-checked="config.selectedModelId === model.id"
              @click="handleSelectModel(model.id)"
              class="flex flex-col justify-between rounded-[10px] border-[1.5px] p-2.5 text-left transition-all"
              :style="
                config.selectedModelId === model.id && !isDark
                  ? {
                      backgroundColor: model.is3D ? '#F47760' : accentHex,
                      borderColor: '#282824',
                      color: '#282824'
                    }
                  : undefined
              "
              :class="
                config.selectedModelId === model.id
                  ? isDark
                    ? 'bg-[#282824] border-[#FAF9F6] text-[#FAF9F6] shadow-[2.5px_2.5px_0px_#000000]'
                    : 'shadow-[2.5px_2.5px_0px_#282824] -translate-y-[0.5px]'
                  : isDark
                    ? 'bg-[#161614] border-[#77766F]/50 text-[#D8D0C3] hover:border-[#FAF9F6]'
                    : 'bg-[#F5F1E9] border-[#282824]/70 text-[#282824] hover:bg-[#E8E8E3]'
              "
            >
              <div class="flex items-center justify-between gap-1 w-full">
                <span class="font-mono text-xs font-bold truncate">
                  {{ model.shortLabel }}
                </span>
                <span
                  class="rounded px-1.5 py-0.2 font-mono text-[9px] font-semibold border border-[#282824]/40 shrink-0"
                  :class="
                    model.is3D
                      ? 'bg-[#FAF9F6] text-[#282824]'
                      : isDark
                        ? 'bg-[#1F1F1C] text-[#D8D0C3]'
                        : 'bg-[#FAF9F6] text-[#282824]'
                  "
                >
                  {{ model.badge }}
                </span>
              </div>
              <p
                class="text-[10px] truncate mt-1"
                :class="
                  config.selectedModelId === model.id && !isDark
                    ? 'text-[#282824]/85 font-medium'
                    : 'text-[#77766F]'
                "
              >
                {{ model.label }}
              </p>
            </button>
          </div>

          <p class="text-[11px] leading-snug" :class="isDark ? 'text-[#D8D0C3]/80' : 'text-[#77766F]'">
            {{ selectedModel.description }}
          </p>
        </div>

        <!-- Gaveta Rápida de API Key Inline -->
        <div
          v-if="showInlineQuickConfig"
          class="rounded-[10px] border-[1.5px] p-3 space-y-2"
          :class="isDark ? 'bg-[#161614] border-[#77766F]/50' : 'bg-[#F5F1E9] border-[#282824]'"
        >
          <div class="flex items-center justify-between text-[11px] font-mono">
            <span>Chave para {{ selectedModel.shortLabel }} ({{ config.storageMode }}):</span>
            <button
              type="button"
              @click="emit('open-config-modal')"
              class="underline font-semibold"
            >
              Abrir Painel Completo (.JSON)
            </button>
          </div>

          <input
            v-if="selectedModel.provider === 'gemini'"
            v-model="config.geminiApiKey"
            type="password"
            placeholder="Cole sua Google Gemini API Key (AIzaSy...)"
            class="arch-input w-full px-2.5 py-1.5 font-mono text-xs"
          />
          <input
            v-else-if="selectedModel.provider === 'openai'"
            v-model="config.openaiApiKey"
            type="password"
            placeholder="Cole sua OpenAI API Key (sk-...)"
            class="arch-input w-full px-2.5 py-1.5 font-mono text-xs"
          />
          <input
            v-else-if="selectedModel.provider === 'fal'"
            v-model="config.falApiKey"
            type="password"
            placeholder="Cole sua Fal.ai Key para Flux Pro"
            class="arch-input w-full px-2.5 py-1.5 font-mono text-xs"
          />
          <input
            v-else
            v-model="config.hunyuanApiKey"
            type="password"
            placeholder="Cole sua 3d.hunyuan / Fal.ai Key"
            class="arch-input w-full px-2.5 py-1.5 font-mono text-xs"
          />
        </div>

        <!-- Proporção + Botões de Geração + Testes em Lote -->
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-1.5">
            <div class="inline-flex items-center gap-1 rounded-[8px] border-[1.5px] p-0.5" :class="isDark ? 'border-[#77766F]/50 bg-[#161614]' : 'border-[#282824] bg-[#F5F1E9]'">
              <button
                v-for="ratio in (['1:1', '16:9', '4:5', '9:16'] as const)"
                :key="ratio"
                type="button"
                @click="config.aspectRatio = ratio"
                class="rounded-[5px] px-2 py-0.5 font-mono text-[10px] font-semibold transition-all"
                :class="
                  config.aspectRatio === ratio
                    ? 'bg-[#282824] text-[#FAF9F6]'
                    : 'text-[#77766F] hover:text-[#282824]'
                "
              >
                {{ ratio }}
              </button>
            </div>

            <button
              type="button"
              @click="showBatchPanel = !showBatchPanel"
              class="rounded-[8px] border-[1.5px] px-2.5 py-1 font-mono text-[10px] font-semibold transition-all"
              :class="
                showBatchPanel
                  ? 'border-[#282824] bg-[#C98268] text-[#282824] shadow-[1.5px_1.5px_0px_#282824]'
                  : isDark
                    ? 'border-[#77766F]/50 bg-[#161614] text-[#D8D0C3]'
                    : 'border-[#282824] bg-[#F5F1E9] text-[#282824]'
              "
              title="Disparar o mesmo prompt em múltiplos motores simultaneamente para comparar iluminação e consistência"
            >
              ⚡ Testes em Lote ({{ batchSelectedModels.length }})
            </button>
          </div>

          <div class="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
            <button
              type="button"
              :disabled="isGenerating || isBatchGenerating"
              @click="handleTriggerGenerate(true)"
              class="arch-btn-secondary px-2.5 py-2 text-xs font-semibold disabled:opacity-50"
              title="Gerar prancha técnica simulada no Canvas sem consumir créditos de API"
            >
              Preview Técnico
            </button>

            <button
              type="button"
              :disabled="isGenerating || isBatchGenerating"
              @click="handleTriggerGenerate(false)"
              class="arch-btn-primary inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold disabled:opacity-50"
              :style="selectedModel.is3D ? { backgroundColor: '#F47760' } : undefined"
            >
              <ArchIcon :name="selectedModel.is3D ? 'furniture-3d' : 'canvas'" :size="14" />
              <span>
                {{
                  isGenerating
                    ? 'Gerando...'
                    : selectedModel.is3D
                      ? 'Gerar no 3d.hunyuan'
                      : `Gerar (${selectedModel.shortLabel})`
                }}
              </span>
            </button>
          </div>
        </div>

        <!-- Painel de Testes em Lote (Batch Testing em Múltiplos Motores Simultâneos) -->
        <div
          v-if="showBatchPanel"
          class="rounded-[10px] border-[1.5px] p-3 space-y-2.5"
          :class="isDark ? 'border-[#C98268]/60 bg-[#161614]' : 'border-[#282824] bg-[#F5F1E9] shadow-[2px_2px_0px_#282824]'"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 class="font-display text-xs font-semibold">
                Testes em Lote (Comparação Multi-Motor Simultânea)
              </h4>
              <p class="text-[10px] text-[#77766F]">
                Selecione os motores abaixo para disparar o mesmo prompt compilado em paralelo e comparar luz, materiais e consistência lado a lado.
              </p>
            </div>
            <div class="flex items-center gap-1.5">
              <button
                type="button"
                :disabled="isBatchGenerating"
                @click="handleTriggerBatchGenerate(true)"
                class="arch-btn-secondary px-2.5 py-1 font-mono text-[10px] font-semibold disabled:opacity-50"
              >
                Preview Lote
              </button>
              <button
                type="button"
                :disabled="isBatchGenerating"
                @click="handleTriggerBatchGenerate(false)"
                class="rounded-[7px] border-[1.5px] border-[#282824] bg-[#C98268] px-2.5 py-1 font-mono text-[10px] font-semibold text-[#282824] shadow-[1.5px_1.5px_0px_#282824] disabled:opacity-50"
              >
                {{ isBatchGenerating ? 'Renderizando Lote...' : `Disparar Lote (${batchSelectedModels.length} IAs)` }}
              </button>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-1.5">
            <button
              v-for="model in CANVAS_MODELS"
              :key="`batch-${model.id}`"
              type="button"
              @click="toggleBatchModel(model.id)"
              class="rounded-[6px] border px-2 py-0.5 font-mono text-[10px] font-semibold transition-all"
              :class="
                batchSelectedModels.includes(model.id)
                  ? 'border-[#282824] bg-[#A5B4A0] text-[#282824]'
                  : isDark
                    ? 'border-[#77766F]/40 bg-[#1F1F1C] text-[#77766F]'
                    : 'border-[#282824]/40 bg-[#FAF9F6] text-[#77766F]'
              "
            >
              {{ batchSelectedModels.includes(model.id) ? '✓ ' : '+ ' }}{{ model.shortLabel }}
            </button>
          </div>

          <!-- Grade de Comparação Lado a Lado do Lote -->
          <div
            v-if="batchResults.length > 1"
            class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-[#282824]/15"
          >
            <div
              v-for="bItem in batchResults"
              :key="`batch-res-${bItem.id}`"
              @click="activeCanvasItem = bItem"
              class="cursor-pointer rounded-[8px] border-[1.5px] overflow-hidden transition-all"
              :class="
                activeCanvasItem?.id === bItem.id
                  ? 'border-[#C98268] ring-2 ring-[#C98268]/60'
                  : isDark
                    ? 'border-[#77766F]/40 bg-[#1F1F1C]'
                    : 'border-[#282824] bg-[#FAF9F6]'
              "
            >
              <div class="aspect-square bg-[#161614] overflow-hidden">
                <img :src="bItem.imageUrl" :alt="bItem.modelLabel" class="h-full w-full object-cover" />
              </div>
              <div class="px-2 py-1 flex items-center justify-between text-[9px] font-mono">
                <span class="font-bold truncate">{{ bItem.modelId }}</span>
                <span class="text-[#77766F]">{{ bItem.isSimulated ? 'Preview' : 'API Real' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Mensagem de Erro da API -->
        <div
          v-if="generationError"
          class="rounded-[10px] border-[1.5px] border-[#F47760] bg-[#F47760]/15 px-3 py-2 text-xs text-[#282824] flex items-start justify-between gap-2"
          :class="isDark ? 'text-[#FAF9F6]' : 'text-[#282824]'"
        >
          <span>{{ generationError }}</span>
          <button
            type="button"
            @click="generationError = null"
            class="font-mono text-[10px] underline shrink-0"
          >
            Fechar
          </button>
        </div>

        <!-- Viewport do Canvas -->
        <div
          class="relative rounded-[12px] border-[1.75px] overflow-hidden min-h-[240px] flex flex-col items-center justify-center"
          :class="isDark ? 'bg-[#161614] border-[#77766F]/50' : 'bg-[#F5F1E9] border-[#282824]'"
        >
          <!-- Estado Carregando -->
          <div v-if="isGenerating" class="p-8 text-center space-y-2">
            <div
              class="mx-auto h-9 w-9 rounded-full border-2 border-[#282824] border-t-transparent animate-spin"
              :class="isDark ? 'border-[#FAF9F6] border-t-transparent' : ''"
            ></div>
            <p class="font-mono text-xs font-semibold">
              {{ generationStatusText || 'Renderizando no Canvas...' }}
            </p>
          </div>

          <!-- Resultado Ativo no Canvas -->
          <div v-else-if="activeCanvasItem" class="w-full">
            <div class="relative aspect-square w-full bg-[#161614] overflow-hidden">
              <img
                :src="
                  compareWithInput && filledImageSlots[0]?.dataUrl
                    ? filledImageSlots[0].dataUrl
                    : activeCanvasItem.imageUrl
                "
                :alt="activeCanvasItem.prompt"
                class="w-full h-full object-contain"
              />

              <div class="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5">
                <span
                  class="rounded-[6px] border border-[#282824] bg-[#FAF9F6] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#282824] shadow-[1.5px_1.5px_0px_#282824]"
                >
                  {{ compareWithInput ? 'IMG REFERÊNCIA (INPUT)' : activeCanvasItem.modelId }}
                </span>
                <span
                  v-if="activeCanvasItem.isSimulated && !compareWithInput"
                  class="rounded-[6px] border border-[#282824] bg-[#D8B99A] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#282824]"
                >
                  Prancha Preview
                </span>
              </div>
            </div>

            <!-- Barra de Ferramentas da Imagem Gerada -->
            <div
              class="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 border-t-[1.5px]"
              :class="isDark ? 'bg-[#1F1F1C] border-[#77766F]/40' : 'bg-[#FAF9F6] border-[#282824]'"
            >
              <div class="flex items-center gap-1.5">
                <button
                  v-if="filledImageSlots[0]?.dataUrl"
                  type="button"
                  @click="compareWithInput = !compareWithInput"
                  class="arch-btn-secondary px-2.5 py-1 text-[11px] font-semibold"
                >
                  {{ compareWithInput ? 'Ver Render Gerado' : 'Comparar c/ Input' }}
                </button>

                <a
                  v-if="activeCanvasItem.meshGlbUrl"
                  :href="activeCanvasItem.meshGlbUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="rounded-[8px] border-[1.5px] border-[#282824] bg-[#F47760] px-2.5 py-1 font-mono text-[11px] font-semibold text-[#282824] shadow-[1.5px_1.5px_0px_#282824]"
                >
                  Baixar Malha 3D (.GLB)
                </a>
              </div>

              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  @click="handleDownloadCanvasImage"
                  class="arch-btn-secondary inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold"
                >
                  <ArchIcon name="download" :size="12" />
                  <span>Baixar</span>
                </button>
                <button
                  type="button"
                  @click="deleteCanvasItem(activeCanvasItem.id)"
                  class="rounded p-1 text-[#77766F] hover:text-[#F47760]"
                  aria-label="Excluir do Canvas"
                >
                  <ArchIcon name="trash" :size="13" />
                </button>
              </div>
            </div>
          </div>

          <!-- Estado Vazio Inicial -->
          <div v-else class="p-6 text-center space-y-2">
            <div
              class="mx-auto h-10 w-10 rounded-[10px] border-[1.5px] border-[#282824] flex items-center justify-center"
              :style="{ backgroundColor: selectedModel.is3D ? '#F47760' : accentHex }"
            >
              <ArchIcon :name="selectedModel.is3D ? 'furniture-3d' : 'canvas'" :size="18" class="text-[#282824]" />
            </div>
            <p class="font-display text-xs md:text-sm font-semibold">
              Canvas Pronto para Renderizar ({{ selectedModel.shortLabel }})
            </p>
            <p class="text-[11px] max-w-xs mx-auto" :class="isDark ? 'text-[#D8D0C3]/75' : 'text-[#77766F]'">
              Clique em <strong>Gerar</strong> acima para criar a visualização a partir do prompt compilado e das imagens anexadas.
            </p>
          </div>
        </div>

        <!-- Tira de Histórico Visual do Canvas -->
        <div v-if="gallery.length > 1" class="space-y-1.5">
          <span class="font-mono text-[10px] uppercase text-[#77766F]">
            Gerações recentes no Canvas ({{ gallery.length }}):
          </span>
          <div class="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              v-for="item in gallery"
              :key="item.id"
              type="button"
              @click="activeCanvasItem = item"
              class="relative h-14 w-14 shrink-0 rounded-[8px] border-[1.5px] overflow-hidden transition-all"
              :class="
                activeCanvasItem?.id === item.id
                  ? 'border-[#282824] ring-2 ring-[#C98268]'
                  : 'border-[#77766F]/40 opacity-75 hover:opacity-100'
              "
            >
              <img :src="item.imageUrl" :alt="item.modelLabel" class="h-full w-full object-cover" />
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
