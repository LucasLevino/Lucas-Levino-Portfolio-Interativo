<script setup lang="ts">
import { ref, computed } from 'vue'
import { ARCH_CONTEXTS, type QuickFieldId } from '../data/archprompt'
import {
  ARCH_ACCENT_TOKENS,
  CONTEXT_PREDOMINANT_ACCENT,
  ARCH_PROJECTS,
  type ArchProjectCardData,
  type ArchReferenceItem
} from '../data/archDesignSystem'
import { useArchPrompt, type PromptHistoryItem } from '../composables/useArchPrompt'
import { useArchCanvas, CANVAS_MODELS, type CanvasModelId } from '../composables/useArchCanvas'
import ArchIcon from '../components/archprompt/ArchIcon.vue'
import ArchPromptField from '../components/archprompt/ArchPromptField.vue'
import ArchPromptGuideModal from '../components/archprompt/ArchPromptGuideModal.vue'
import ArchFloorPlanInteractive from '../components/archprompt/ArchFloorPlanInteractive.vue'
import ArchTextureSheetInteractive from '../components/archprompt/ArchTextureSheetInteractive.vue'
import ArchCanvasModule from '../components/archprompt/ArchCanvasModule.vue'
import ArchConfigModal from '../components/archprompt/ArchConfigModal.vue'
import ArchReferenceGallery from '../components/archprompt/ArchReferenceGallery.vue'

const emit = defineEmits<{
  (e: 'navigate-home'): void
}>()

export type StudioViewTab = 'studio' | 'catalog'

const activeViewTab = ref<StudioViewTab>('studio')
const showProjectsCatalog = ref<boolean>(true)
const activeProjectId = ref<string>('proj-01')
const toastMessage = ref<string | null>(null)

const {
  activeContextId,
  activeContext,
  contextPresets,
  selectContext,
  mode,
  imageRef,
  currentFields,
  referenceImageField,
  isDark,
  toggleTheme,
  isManualEdit,
  manualPromptText,
  activePresetId,
  promptSegments,
  finalPrompt,
  completionStats,
  history,
  getFieldValue,
  setFieldValue,
  isChipSelected,
  toggleChip,
  enableManualEdit,
  resetManualEdit,
  switchMode,
  loadPreset,
  loadReferenceExample,
  surpriseMe,
  clearAll,
  saveToHistory,
  toggleFavorite,
  deleteHistoryItem,
  restoreHistoryItem
} = useArchPrompt()

const showImageRefSection = ref(false)

const isCopied = ref(false)
const copiedHistoryId = ref<string | null>(null)
const isGuideOpen = ref(false)
const highlightVariables = ref(true)
const historyFilter = ref<'all' | 'favorites'>('all')
const liveAnnouncement = ref('')

const {
  config: canvasConfig,
  isConfigModalOpen,
  configuredProvidersCount,
  selectModel: selectCanvasModel
} = useArchCanvas()

const currentAccent = computed(() => {
  if (activeViewTab.value === 'catalog') {
    return ARCH_ACCENT_TOKENS.sage
  }
  const key = CONTEXT_PREDOMINANT_ACCENT[activeContextId.value] || 'terracotta'
  return ARCH_ACCENT_TOKENS[key]
})

const filteredHistory = computed(() => {
  if (historyFilter.value === 'favorites') {
    return history.value.filter(h => h.isFavorite)
  }
  return history.value
})

const favoritesCount = computed(() => history.value.filter(h => h.isFavorite).length)

const wordCount = computed(() => {
  const clean = finalPrompt.value.trim()
  if (!clean) return 0
  return clean.split(/\s+/).length
})

const triggerToast = (msg: string) => {
  toastMessage.value = msg
  liveAnnouncement.value = msg
  setTimeout(() => {
    if (toastMessage.value === msg) {
      toastMessage.value = null
    }
  }, 3000)
}

const handleSelectContext = (ctxId: typeof activeContextId.value) => {
  selectContext(ctxId)
  liveAnnouncement.value = `Contexto alterado para ${activeContext.value.label}.`
}

const handleLoadProjectCard = (project: ArchProjectCardData) => {
  activeProjectId.value = project.id
  selectContext(project.contextId)
  if (mode.value !== 'quick') {
    switchMode('quick')
  }
  setFieldValue('imageRef', project.imageRef || '')
  const fields: QuickFieldId[] = [
    'style',
    'materials',
    'environment',
    'foreground',
    'lighting',
    'mood',
    'technical'
  ]
  for (const f of fields) {
    setFieldValue(f, project.quickPrompt[f])
  }
  activeViewTab.value = 'studio'
  triggerToast(`Projeto "${project.title}" carregado no gerador.`)
}

const handleApplyReferenceItem = (item: ArchReferenceItem) => {
  selectContext(item.contextId)
  if (mode.value !== 'quick') {
    switchMode('quick')
  }
  setFieldValue('imageRef', item.imageRef || '')
  const fields: QuickFieldId[] = [
    'style',
    'materials',
    'environment',
    'foreground',
    'lighting',
    'mood',
    'technical'
  ]
  for (const f of fields) {
    setFieldValue(f, item.quickPrompt[f])
  }
  activeViewTab.value = 'studio'
  triggerToast(`Referência "${item.title}" aplicada ao gerador de prompts.`)
}

const handleSyncFloorPlan = (payload: {
  imageRef: string
  style: string
  materials: string
  environment: string
  foreground: string
  lighting: string
  technical: string
}) => {
  setFieldValue('imageRef', payload.imageRef)
  setFieldValue('style', payload.style)
  setFieldValue('materials', payload.materials)
  setFieldValue('environment', payload.environment)
  setFieldValue('foreground', payload.foreground)
  setFieldValue('lighting', payload.lighting)
  setFieldValue('mood', 'clear, organized, and architecturally legible')
  setFieldValue('technical', payload.technical)
}

const handleSyncTextureSheet = (payload: {
  imageRef: string
  style: string
  materials: string
  environment: string
  foreground: string
  lighting: string
  mood: string
  technical: string
}) => {
  setFieldValue('imageRef', payload.imageRef)
  setFieldValue('style', payload.style)
  setFieldValue('materials', payload.materials)
  setFieldValue('environment', payload.environment)
  setFieldValue('foreground', payload.foreground)
  setFieldValue('lighting', payload.lighting)
  setFieldValue('mood', payload.mood)
  setFieldValue('technical', payload.technical)
}

const handleSyncImageDirective = (directive: string) => {
  setFieldValue('imageRef', directive)
  if (directive) {
    triggerToast('Diretriz das imagens do Canvas sincronizada com o prompt!')
  }
}

const handleSelect3dModelInBuilder = (modelId: CanvasModelId) => {
  selectCanvasModel(modelId)
  if (modelId === '3d.hunyuan') {
    const hunyuanPreset = contextPresets.value.find(p => p.id === 'hunyuan-3d-mesh-asset')
    if (hunyuanPreset) {
      loadPreset(hunyuanPreset)
    } else {
      const currentTech = getFieldValue('technical')
      if (!currentTech.toLowerCase().includes('3d.hunyuan')) {
        setFieldValue(
          'technical',
          `${currentTech ? currentTech + ', ' : ''}3d.hunyuan ready asset, watertight 3D mesh topology, clean isolated silhouette, neutral studio lighting, 1:1`
        )
      }
    }
    triggerToast('Modelo "3d.hunyuan" selecionado e prompt otimizado para geração de ativo 3D!')
  } else {
    triggerToast(`Modelo alterado para ${modelId}.`)
  }
}

const handleOpenTextureSheetSection = () => {
  selectContext('texture-sheet')
  loadReferenceExample()
  triggerToast('Seção "Criar Ficha de Textura" ativada com prompt especializado PBR.')
}

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(finalPrompt.value)
    isCopied.value = true
    saveToHistory(false)
    triggerToast('Prompt copiado para a área de transferência e salvo no histórico.')
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Falha ao copiar texto:', err)
  }
}

const handleSaveFavorite = () => {
  saveToHistory(true)
  historyFilter.value = 'favorites'
  triggerToast('Prompt salvo nos Favoritos.')
}

const handleCopyHistoryItem = async (item: PromptHistoryItem) => {
  try {
    await navigator.clipboard.writeText(item.prompt)
    copiedHistoryId.value = item.id
    triggerToast(`Prompt "${item.title}" copiado.`)
    setTimeout(() => {
      if (copiedHistoryId.value === item.id) {
        copiedHistoryId.value = null
      }
    }, 1800)
  } catch (err) {
    console.error('Falha ao copiar item do histórico:', err)
  }
}

const scrollToField = (fieldId?: string) => {
  if (!fieldId) return
  if (fieldId === 'imageRef') {
    showImageRefSection.value = true
  }
  setTimeout(() => {
    const el = document.getElementById(`arch-field-${fieldId}`)
    const textarea = document.getElementById(`textarea-${fieldId}`) as HTMLTextAreaElement | null
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    if (textarea) {
      setTimeout(() => textarea.focus(), 180)
    }
  }, 40)
}

const isHalfWidthField = (fieldId: string): boolean => {
  if (mode.value !== 'advanced') return false
  return [
    'buildingType',
    'location',
    'lighting',
    'lightingDetail',
    'extraCommands',
    'aspectRatio'
  ].includes(fieldId)
}
</script>

<template>
  <div
    class="h-screen w-screen overflow-y-auto font-arch-sans transition-colors duration-200 selection:bg-[#C98268]/30"
    :style="{
      '--ds-active-accent': currentAccent.hex,
      '--ds-active-accent-soft': currentAccent.softBg
    }"
    :class="isDark ? 'bg-[#161614] text-[#FAF9F6]' : 'bg-[#F5F1E9] text-[#282824]'"
  >
    <!-- Live Region para Leitores de Tela (WCAG 4.1.3) -->
    <div role="status" aria-live="polite" class="sr-only">
      {{ liveAnnouncement }}
    </div>

    <!-- Notificação Flutuante -->
    <Transition name="toast-slide">
      <div
        v-if="toastMessage"
        role="status"
        class="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-[12px] border-[1.75px] border-[#282824] bg-[#FAF9F6] px-4 py-3 text-xs font-medium text-[#282824] shadow-[4px_4px_0px_#282824]"
      >
        <span
          class="h-3 w-3 rounded-full border border-[#282824] shrink-0"
          :style="{ backgroundColor: currentAccent.hex }"
        ></span>
        <span>{{ toastMessage }}</span>
        <button
          type="button"
          @click="toastMessage = null"
          class="ml-1 rounded p-0.5 text-[#77766F] hover:text-[#282824]"
          aria-label="Fechar notificação"
        >
          <ArchIcon name="close" :size="14" />
        </button>
      </div>
    </Transition>

    <!-- Top Studio Navbar -->
    <header
      class="sticky top-0 z-30 border-b-[1.75px] transition-colors duration-150"
      :class="
        isDark
          ? 'bg-[#161614]/95 border-[#77766F]/40 backdrop-blur-xs'
          : 'bg-[#FAF9F6] border-[#282824]'
      "
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-2 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <a
            href="/"
            @click.prevent="emit('navigate-home')"
            class="arch-btn-secondary inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold"
            title="Voltar ao portfólio principal de Lucas Levino"
          >
            <ArchIcon name="arrow-left" :size="14" />
            <span class="hidden sm:inline">Lucas Levino</span>
          </a>

          <span
            class="hidden sm:inline-block h-4 w-px"
            :class="isDark ? 'bg-[#77766F]/40' : 'bg-[#282824]/25'"
            aria-hidden="true"
          ></span>

          <div class="flex items-center gap-2 truncate">
            <span
              class="rounded-[6px] border border-[#282824] px-2 py-0.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#282824]"
              :style="{ backgroundColor: currentAccent.hex }"
            >
              ARCHSTUDIO
            </span>
            <span class="text-xs hidden lg:inline" :class="isDark ? 'text-[#D8D0C3]' : 'text-[#77766F]'">
              Contexto: <strong :class="isDark ? 'text-[#FAF9F6]' : 'text-[#282824]'">{{ activeContext.label }}</strong>
            </span>
          </div>
        </div>

        <nav aria-label="Navegação do estúdio" class="flex flex-wrap items-center gap-2">
          <!-- Alternador: Estúdio de Prompts vs Catálogo de Referências -->
          <div
            role="tablist"
            aria-label="Visão do ArchStudio"
            class="inline-flex rounded-[10px] border-[1.5px] p-0.5 gap-0.5"
            :class="isDark ? 'bg-[#1F1F1C] border-[#77766F]/50' : 'bg-[#F5F1E9] border-[#282824]'"
          >
            <button
              type="button"
              role="tab"
              :aria-selected="activeViewTab === 'studio'"
              @click="activeViewTab = 'studio'"
              class="inline-flex items-center gap-1.5 rounded-[7px] px-3 py-1 text-xs font-semibold transition-all duration-120"
              :style="
                activeViewTab === 'studio'
                  ? { backgroundColor: currentAccent.hex, color: '#282824' }
                  : undefined
              "
              :class="
                activeViewTab === 'studio'
                  ? 'border border-[#282824] shadow-[1.5px_1.5px_0px_#282824]'
                  : isDark
                    ? 'text-[#D8D0C3] hover:text-[#FAF9F6]'
                    : 'text-[#77766F] hover:text-[#282824]'
              "
            >
              <ArchIcon name="floor-plan" :size="14" />
              <span>Estúdio de Prompts</span>
            </button>

            <button
              type="button"
              role="tab"
              :aria-selected="activeViewTab === 'catalog'"
              @click="activeViewTab = 'catalog'"
              class="inline-flex items-center gap-1.5 rounded-[7px] px-3 py-1 text-xs font-semibold transition-all duration-120"
              :style="
                activeViewTab === 'catalog'
                  ? { backgroundColor: currentAccent.hex, color: '#282824' }
                  : undefined
              "
              :class="
                activeViewTab === 'catalog'
                  ? 'border border-[#282824] shadow-[1.5px_1.5px_0px_#282824]'
                  : isDark
                    ? 'text-[#D8D0C3] hover:text-[#FAF9F6]'
                    : 'text-[#77766F] hover:text-[#282824]'
              "
            >
              <ArchIcon name="image" :size="14" />
              <span>Catálogo de Referências</span>
            </button>
          </div>

          <!-- Seletor de Modo (7 vs 12 Blocos) visível no Estúdio -->
          <div
            v-if="activeViewTab === 'studio'"
            role="group"
            aria-label="Modo de detalhamento do template"
            class="inline-flex rounded-[10px] border-[1.5px] p-0.5"
            :class="
              isDark
                ? 'bg-[#1F1F1C] border-[#77766F]/50'
                : 'bg-[#F5F1E9] border-[#282824]'
            "
          >
            <button
              type="button"
              :aria-pressed="mode === 'quick'"
              @click="switchMode('quick')"
              class="rounded-[7px] px-2.5 py-1 text-xs font-semibold transition-all duration-120"
              :style="
                mode === 'quick'
                  ? { backgroundColor: currentAccent.hex, color: '#282824' }
                  : undefined
              "
              :class="
                mode === 'quick'
                  ? 'border border-[#282824] shadow-[1.5px_1.5px_0px_#282824]'
                  : isDark
                    ? 'text-[#D8D0C3] hover:text-[#FAF9F6]'
                    : 'text-[#77766F] hover:text-[#282824]'
              "
            >
              7 Blocos
            </button>
            <button
              type="button"
              :aria-pressed="mode === 'advanced'"
              @click="switchMode('advanced')"
              class="rounded-[7px] px-2.5 py-1 text-xs font-semibold transition-all duration-120"
              :style="
                mode === 'advanced'
                  ? { backgroundColor: currentAccent.hex, color: '#282824' }
                  : undefined
              "
              :class="
                mode === 'advanced'
                  ? 'border border-[#282824] shadow-[1.5px_1.5px_0px_#282824]'
                  : isDark
                    ? 'text-[#D8D0C3] hover:text-[#FAF9F6]'
                    : 'text-[#77766F] hover:text-[#282824]'
              "
            >
              12 Blocos
            </button>
          </div>

          <!-- Botão Configuração de APIs & JSON -->
          <button
            type="button"
            @click="isConfigModalOpen = true"
            class="arch-btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
            title="Configurar Chaves de API (LocalStorage / Cookies) e Baixar/Subir .JSON"
          >
            <ArchIcon name="key" :size="14" />
            <span class="hidden sm:inline">Config APIs (.JSON)</span>
            <span class="sm:hidden">APIs</span>
            <span
              class="rounded-[5px] border border-[#282824] px-1.5 py-0.2 font-mono text-[10px] font-bold text-[#282824]"
              :style="{ backgroundColor: configuredProvidersCount > 0 ? '#A5B4A0' : '#D8B99A' }"
            >
              {{ configuredProvidersCount }}
            </span>
          </button>

          <!-- Botão Guia Metodológico -->
          <button
            type="button"
            @click="isGuideOpen = true"
            class="arch-btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
          >
            <ArchIcon name="book" :size="14" />
            <span class="hidden sm:inline">Guia das 6 Fases</span>
            <span class="sm:hidden">Guia</span>
          </button>

          <!-- Alternar Tema Escuro / Claro -->
          <button
            type="button"
            @click="toggleTheme"
            class="arch-btn-icon h-8 w-8 inline-flex items-center justify-center"
            :aria-label="isDark ? 'Ativar modo claro' : 'Ativar modo escuro'"
          >
            <ArchIcon :name="isDark ? 'sun' : 'settings'" :size="15" />
          </button>
        </nav>
      </div>
    </header>

    <!-- ABA CATÁLOGO DE REFERÊNCIAS ARQUITETÔNICAS -->
    <main
      v-if="activeViewTab === 'catalog'"
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8"
    >
      <ArchReferenceGallery
        :is-dark="isDark"
        @apply-reference-item="handleApplyReferenceItem"
      />
    </main>

    <!-- ABA ESTÚDIO DE PROMPTS + CATÁLOGO RÁPIDO DE PROJETOS -->
    <main v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
      <!-- Seção 1: Cabeçalho Assimétrico & Ações -->
      <section
        class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-5 border-b-[1.75px]"
        :class="isDark ? 'border-[#77766F]/40' : 'border-[#282824]'"
      >
        <div class="lg:col-span-7 space-y-2">
          <p
            class="font-mono text-xs font-semibold uppercase tracking-wider"
            :class="isDark ? 'text-[#D8B99A]' : 'text-[#77766F]'"
          >
            GERADOR DINÂMICO DE PROMPTS ARQUITETÔNICOS · {{ activeContext.badge.toUpperCase() }}
          </p>
          <h1
            class="font-display font-semibold tracking-tight leading-tight text-[clamp(1.65rem,1.35rem+1.4vw,2.5rem)]"
          >
            ArchStudio
          </h1>
          <p
            class="text-sm md:text-base leading-relaxed max-w-prose"
            :class="isDark ? 'text-[#E8E8E3]/80' : 'text-[#77766F]'"
          >
            {{ activeContext.subtitle }}. Escolha a especialidade abaixo, indique se enviará imagens de referência junto com o prompt e personalize os parâmetros de renderização.
          </p>
        </div>

        <!-- Painel de Ações Rápidas -->
        <div class="lg:col-span-5 flex flex-wrap lg:justify-end gap-2">
          <button
            type="button"
            @click="handleOpenTextureSheetSection"
            class="arch-btn-secondary inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold"
            :style="
              activeContextId === 'texture-sheet'
                ? { backgroundColor: '#D8B99A', color: '#282824' }
                : undefined
            "
          >
            <ArchIcon name="texture-sheet" :size="14" />
            <span>Criar Ficha de Textura</span>
          </button>

          <button
            type="button"
            @click="loadReferenceExample"
            class="arch-btn-primary inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold"
          >
            <ArchIcon name="layers" :size="14" />
            <span>Preencher Exemplo ({{ activeContext.label }})</span>
          </button>

          <button
            type="button"
            @click="surpriseMe"
            class="arch-btn-secondary inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold"
          >
            <ArchIcon name="shuffle" :size="14" />
            <span>Surpreenda-me</span>
          </button>

          <button
            type="button"
            @click="clearAll"
            class="arch-btn-tertiary inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold"
          >
            <span>Limpar</span>
          </button>
        </div>
      </section>

      <!-- Catálogo Rápido de Projetos & Estudos Arquitetônicos -->
      <section aria-labelledby="projects-catalog-heading" class="space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <ArchIcon name="folder" :size="16" />
            <h2 id="projects-catalog-heading" class="font-display text-base md:text-lg font-semibold">
              Projetos de Referência Prontos para Carregar
            </h2>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="activeViewTab = 'catalog'"
              class="arch-btn-secondary inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold"
            >
              <ArchIcon name="image" :size="13" />
              <span>Abrir Catálogo Completo (6 Obras)</span>
            </button>
            <button
              type="button"
              @click="showProjectsCatalog = !showProjectsCatalog"
              class="arch-btn-tertiary inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-semibold"
            >
              <span>{{ showProjectsCatalog ? 'Ocultar' : 'Mostrar' }}</span>
              <ArchIcon
                name="chevron-down"
                :size="13"
                class="transform transition-transform"
                :class="showProjectsCatalog ? 'rotate-180' : ''"
              />
            </button>
          </div>
        </div>

        <div v-if="showProjectsCatalog" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <article
            v-for="proj in ARCH_PROJECTS"
            :key="proj.id"
            class="rounded-[14px] border-[1.75px] flex flex-col justify-between overflow-hidden transition-all"
            :class="
              isDark
                ? activeProjectId === proj.id
                  ? 'bg-[#1F1F1C] border-[#D8B99A] shadow-[4px_4px_0px_#000000]'
                  : 'bg-[#1F1F1C] border-[#77766F]/50'
                : activeProjectId === proj.id
                  ? 'bg-[#FAF9F6] border-[#282824] shadow-[4px_4px_0px_#282824]'
                  : 'bg-[#FAF9F6] border-[#282824] shadow-[3px_3px_0px_#282824]'
            "
          >
            <div>
              <div class="p-3 pb-0">
                <div class="relative rounded-[10px] border-[1.5px] border-[#282824] overflow-hidden aspect-[16/9] bg-[#E8E8E3]">
                  <img
                    :src="proj.photoUrl"
                    :alt="proj.title"
                    loading="lazy"
                    class="w-full h-full object-cover"
                  />
                  <span
                    class="absolute top-2 left-2 rounded-[6px] border border-[#282824] bg-[#FAF9F6] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#282824]"
                  >
                    {{ proj.code }}
                  </span>
                  <span
                    class="absolute bottom-2 right-2 rounded-[6px] border border-[#282824] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#282824]"
                    :style="{ backgroundColor: ARCH_ACCENT_TOKENS[proj.accentKey].hex }"
                  >
                    {{ proj.typology }}
                  </span>
                </div>
              </div>

              <div class="p-4 space-y-2">
                <div>
                  <h3 class="font-display text-base font-semibold leading-snug">
                    {{ proj.title }}
                  </h3>
                  <p class="font-mono text-[10px] text-[#77766F] mt-0.5">
                    {{ proj.location }} · {{ proj.areaSqm }} · {{ proj.scale }}
                  </p>
                </div>

                <p class="text-xs leading-relaxed line-clamp-2" :class="isDark ? 'text-[#E8E8E3]/80' : 'text-[#77766F]'">
                  {{ proj.subtitle }}
                </p>

                <div class="flex flex-wrap gap-1 pt-0.5">
                  <span
                    v-for="mat in proj.materials.slice(0, 3)"
                    :key="mat"
                    class="rounded-[5px] border border-[#282824]/40 px-1.5 py-0.5 font-mono text-[9px]"
                    :class="isDark ? 'bg-[#161614] text-[#D8D0C3]' : 'bg-[#F5F1E9] text-[#282824]'"
                  >
                    {{ mat }}
                  </span>
                </div>
              </div>
            </div>

            <div
              class="px-4 py-2.5 border-t-[1.5px] flex items-center justify-between gap-2"
              :class="isDark ? 'border-[#77766F]/30 bg-[#161614]' : 'border-[#282824]/15 bg-[#F5F1E9]'"
            >
              <span class="font-mono text-[10px] text-[#77766F]">
                {{ proj.stage }}
              </span>
              <button
                type="button"
                @click="handleLoadProjectCard(proj)"
                class="rounded-[8px] border-[1.5px] border-[#282824] px-3 py-1 text-[11px] font-semibold text-[#282824] shadow-[2px_2px_0px_#282824] active:translate-x-[1px] active:translate-y-[1px] transition-all"
                :style="{ backgroundColor: ARCH_ACCENT_TOKENS[proj.accentKey].hex }"
              >
                Carregar no Gerador
              </button>
            </div>
          </article>
        </div>
      </section>

      <!-- Seção 2: Seletor de Contexto Arquitetônico (9 Contextos) -->
      <section aria-labelledby="context-selector-heading" class="space-y-2.5">
        <div class="flex items-center justify-between">
          <h2
            id="context-selector-heading"
            class="font-mono text-xs font-semibold uppercase tracking-wider"
          >
            1. Selecione o Contexto da Cena (Adapta o Template e as Sugestões)
          </h2>
          <span class="font-mono text-xs hidden sm:inline" :class="isDark ? 'text-[#D8D0C3]' : 'text-[#77766F]'">
            9 contextos especializados (inclui Ficha de Textura PBR)
          </span>
        </div>

        <div
          role="tablist"
          aria-label="Contextos arquitetônicos"
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2.5"
        >
          <button
            v-for="ctx in ARCH_CONTEXTS"
            :key="ctx.id"
            type="button"
            role="tab"
            :aria-selected="activeContextId === ctx.id"
            @click="handleSelectContext(ctx.id)"
            class="flex flex-col items-start justify-between rounded-[12px] border-[1.75px] p-3 text-left transition-all duration-120 focus-visible:outline-none"
            :style="
              activeContextId === ctx.id && !isDark
                ? { backgroundColor: currentAccent.hex, borderColor: '#282824', color: '#282824' }
                : undefined
            "
            :class="
              activeContextId === ctx.id
                ? isDark
                  ? 'bg-[#282824] border-[#FAF9F6] text-[#FAF9F6] shadow-[3px_3px_0px_#000000]'
                  : 'shadow-[3px_3px_0px_#282824] -translate-y-[1px]'
                : isDark
                  ? 'bg-[#1F1F1C] border-[#77766F]/50 text-[#D8D0C3] hover:border-[#FAF9F6]'
                  : 'bg-[#FAF9F6] border-[#282824] text-[#282824] shadow-[2px_2px_0px_#282824] hover:bg-[#E8E8E3]'
            "
          >
            <div class="flex items-center justify-between w-full mb-2">
              <ArchIcon :name="ctx.icon" :size="18" :stroke-width="1.85" />
              <span
                v-if="activeContextId === ctx.id"
                class="h-2.5 w-2.5 rounded-full border border-[#282824] bg-[#FAF9F6]"
              ></span>
            </div>

            <div class="w-full">
              <p class="font-display text-xs md:text-sm font-semibold leading-snug">
                {{ ctx.label }}
              </p>
              <p
                class="mt-0.5 font-mono text-[10px] truncate"
                :class="
                  activeContextId === ctx.id && !isDark
                    ? 'text-[#282824]/80 font-medium'
                    : isDark
                      ? 'text-[#D8D0C3]/70'
                      : 'text-[#77766F]'
                "
              >
                {{ ctx.badge }}
              </p>
            </div>
          </button>
        </div>
      </section>

      <!-- Presets Rápidos do Contexto Selecionado -->
      <section v-if="contextPresets.length > 0" aria-label="Cenários prontos do contexto" class="flex flex-wrap items-center gap-2">
        <span class="font-mono text-xs font-semibold uppercase" :class="isDark ? 'text-[#D8D0C3]' : 'text-[#77766F]'">
          Presets de {{ activeContext.label }}:
        </span>
        <button
          v-for="preset in contextPresets"
          :key="preset.id"
          type="button"
          :aria-pressed="activePresetId === preset.id"
          @click="loadPreset(preset)"
          class="inline-flex items-center gap-2 rounded-[10px] border-[1.5px] px-3 py-1.5 text-xs font-semibold transition-all duration-120"
          :style="
            activePresetId === preset.id && !isDark
              ? { backgroundColor: currentAccent.hex, borderColor: '#282824', color: '#282824' }
              : undefined
          "
          :class="
            activePresetId === preset.id
              ? isDark
                ? 'bg-[#282824] border-[#FAF9F6] text-[#FAF9F6]'
                : 'shadow-[2.5px_2.5px_0px_#282824] -translate-y-[0.5px]'
              : isDark
                ? 'bg-[#1F1F1C] border-[#77766F]/50 text-[#D8D0C3] hover:border-[#FAF9F6]'
                : 'bg-[#FAF9F6] border-[#282824] text-[#282824] shadow-[2px_2px_0px_#282824] hover:bg-[#E8E8E3]'
          "
        >
          <span>{{ preset.name }}</span>
          <span
            class="rounded-[5px] border border-[#282824]/40 px-1.5 py-0.2 font-mono text-[10px]"
            :class="isDark ? 'bg-[#161614] text-[#D8D0C3]' : 'bg-[#FAF9F6] text-[#282824]'"
          >
            {{ preset.badge }}
          </span>
        </button>
      </section>

      <!-- Seção 3: Grid Assimétrico Principal (7 Colunas Construtor / 5 Colunas Preview Compilado) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Coluna Esquerda (7 cols): Construtor de Especificação + Sistemas Especializados -->
        <section aria-labelledby="builder-heading" class="lg:col-span-7 space-y-4">
          <ArchFloorPlanInteractive
            v-if="activeContextId === 'floor-plan'"
            :is-dark="isDark"
            @sync-floorplan="handleSyncFloorPlan"
          />

          <ArchTextureSheetInteractive
            v-if="activeContextId === 'texture-sheet'"
            :is-dark="isDark"
            @sync-texture-sheet="handleSyncTextureSheet"
          />

          <!-- Barra Compacta de Seleção de Modelo no Contexto 3D (Móveis / Objetos Arquitetônicos) com opção 3d.hunyuan -->
          <div
            v-if="activeContextId === 'furniture' || activeContextId === 'furniture-3d'"
            class="flex flex-wrap items-center justify-between gap-2 rounded-[12px] border-[1.5px] px-3.5 py-2.5"
            :class="
              isDark
                ? 'bg-[#1F1F1C] border-[#77766F]/50'
                : 'bg-[#FAF9F6] border-[#282824] shadow-[2.5px_2.5px_0px_#282824]'
            "
          >
            <div class="flex items-center gap-2">
              <ArchIcon name="furniture-3d" :size="14" />
              <span class="font-mono text-[11px] font-semibold uppercase">
                Modelo Alvo 3D (Opcional):
              </span>
            </div>

            <div class="flex flex-wrap items-center gap-1.5">
              <button
                v-for="model in CANVAS_MODELS"
                :key="`builder-3d-${model.id}`"
                type="button"
                :aria-pressed="canvasConfig.selectedModelId === model.id"
                @click="handleSelect3dModelInBuilder(model.id)"
                class="inline-flex items-center gap-1 rounded-[8px] border-[1.5px] px-2.5 py-1 font-mono text-[11px] font-semibold transition-all"
                :style="
                  canvasConfig.selectedModelId === model.id && !isDark
                    ? {
                        backgroundColor: model.id === '3d.hunyuan' ? '#F47760' : currentAccent.hex,
                        borderColor: '#282824',
                        color: '#282824'
                      }
                    : undefined
                "
                :class="
                  canvasConfig.selectedModelId === model.id
                    ? isDark
                      ? 'bg-[#282824] border-[#FAF9F6] text-[#FAF9F6]'
                      : 'shadow-[1.5px_1.5px_0px_#282824]'
                    : isDark
                      ? 'bg-[#161614] border-[#77766F]/50 text-[#D8D0C3] hover:border-[#FAF9F6]'
                      : 'bg-[#F5F1E9] border-[#282824]/60 text-[#282824] hover:bg-[#E8E8E3]'
                "
              >
                <span>{{ model.shortLabel }}</span>
                <span
                  v-if="model.id === '3d.hunyuan'"
                  class="rounded border border-[#282824]/50 bg-[#FAF9F6] px-1 text-[9px] font-bold text-[#282824]"
                >
                  3D
                </span>
              </button>
            </div>
          </div>

          <!-- Barra de Status de Preenchimento -->
          <div
            class="flex flex-wrap items-center justify-between gap-2 rounded-[12px] border-[1.75px] px-4 py-3"
            :class="
              isDark
                ? 'bg-[#1F1F1C] border-[#77766F]/50'
                : 'bg-[#FAF9F6] border-[#282824] shadow-[3px_3px_0px_#282824]'
            "
          >
            <div class="flex flex-wrap items-center gap-2.5">
              <h2 id="builder-heading" class="font-display text-sm md:text-base font-semibold">
                Variáveis ({{ activeContext.label }})
              </h2>
              <span
                class="rounded-[8px] border-[1.5px] border-[#282824] px-2 py-0.5 font-mono text-xs font-semibold tabular-nums text-[#282824]"
                :style="{ backgroundColor: completionStats.isReady ? '#A5B4A0' : currentAccent.hex }"
              >
                {{ completionStats.filled }}/{{ completionStats.total }} ({{ completionStats.percentage }}%)
              </span>
              <span
                v-if="completionStats.hasImageRef"
                class="rounded-[8px] border-[1.5px] border-[#282824] bg-[#A5B4A0] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#282824]"
              >
                + Imagem de Referência Ativa
              </span>
            </div>

            <div
              class="w-28 sm:w-40 h-2.5 rounded-full border border-[#282824] overflow-hidden"
              :class="isDark ? 'bg-[#161614]' : 'bg-[#E8E8E3]'"
              role="progressbar"
              :aria-valuenow="completionStats.percentage"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Progresso de preenchimento dos blocos do prompt"
            >
              <div
                class="h-full transition-all duration-150"
                :style="{
                  width: `${completionStats.percentage}%`,
                  backgroundColor: completionStats.isReady ? '#A5B4A0' : currentAccent.hex
                }"
              ></div>
            </div>
          </div>

          <!-- Grid de Campos de Renderização (Fases 01 a 06) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="field in currentFields"
              :key="`${activeContextId}-${mode}-${field.id}`"
              :class="isHalfWidthField(field.id) ? 'md:col-span-1' : 'md:col-span-2'"
            >
              <ArchPromptField
                :config="field"
                :model-value="getFieldValue(field.id)"
                :is-dark="isDark"
                :is-featured="field.id === 'style' || field.id === 'archStyle'"
                :is-chip-active="(chipVal: string) => isChipSelected(field.id, chipVal)"
                @update:model-value="(val: string) => setFieldValue(field.id, val)"
                @toggle-chip="(chipVal: string) => toggleChip(field.id, chipVal)"
              />
            </div>
          </div>

          <!-- Painel Separado e Colapsável: Diretriz de Imagem(ns) de Referência (Opcional) -->
          <div
            class="rounded-[14px] border-[1.75px] overflow-hidden"
            :class="
              isDark
                ? 'bg-[#1F1F1C] border-[#77766F]/50 shadow-[3px_3px_0px_#000000]'
                : 'bg-[#FAF9F6] border-[#282824] shadow-[3px_3px_0px_#282824]'
            "
          >
            <div
              class="flex flex-wrap items-center justify-between gap-2 px-4 py-3 cursor-pointer select-none"
              :class="[
                showImageRefSection || completionStats.hasImageRef ? 'border-b-[1.5px]' : '',
                isDark ? 'bg-[#161614] border-[#77766F]/40' : 'bg-[#F5F1E9] border-[#282824]'
              ]"
              @click="showImageRefSection = !showImageRefSection"
            >
              <div class="flex flex-wrap items-center gap-2">
                <ArchIcon name="image" :size="15" />
                <span class="font-display text-xs md:text-sm font-semibold">
                  Diretriz de Imagem(ns) Enviada(s) com o Prompt
                </span>
                <span
                  class="rounded-[5px] border border-[#282824]/40 px-1.5 py-0.2 font-mono text-[10px] uppercase"
                  :class="isDark ? 'bg-[#282824] text-[#D8D0C3]' : 'bg-[#E8E8E3] text-[#77766F]'"
                >
                  Separado do Render · Opcional
                </span>
                <span
                  v-if="completionStats.hasImageRef"
                  class="rounded-[6px] border border-[#282824] bg-[#A5B4A0] px-2 py-0.2 font-mono text-[10px] font-semibold text-[#282824]"
                >
                  Ativa
                </span>
              </div>

              <button
                type="button"
                @click.stop="showImageRefSection = !showImageRefSection"
                class="inline-flex items-center gap-1 rounded-[6px] border border-[#282824]/30 px-2.5 py-1 font-mono text-[10px] font-semibold"
                :class="isDark ? 'text-[#D8D0C3] hover:text-[#FAF9F6]' : 'text-[#77766F] hover:text-[#282824]'"
                :aria-expanded="showImageRefSection || completionStats.hasImageRef"
              >
                <span>{{ showImageRefSection || completionStats.hasImageRef ? 'Ocultar' : 'Configurar Diretriz' }}</span>
                <ArchIcon
                  name="chevron-down"
                  :size="13"
                  class="transform transition-transform"
                  :class="showImageRefSection || completionStats.hasImageRef ? 'rotate-180' : ''"
                />
              </button>
            </div>

            <div v-if="showImageRefSection || completionStats.hasImageRef" class="p-3 md:p-4">
              <ArchPromptField
                :config="referenceImageField"
                :model-value="getFieldValue('imageRef')"
                :is-dark="isDark"
                :is-featured="false"
                :is-chip-active="(chipVal: string) => isChipSelected('imageRef', chipVal)"
                @update:model-value="(val: string) => setFieldValue('imageRef', val)"
                @toggle-chip="(chipVal: string) => toggleChip('imageRef', chipVal)"
              />
            </div>
          </div>
        </section>

        <!-- Coluna Direita (5 cols): Preview Fluido & Biblioteca Local -->
        <aside aria-labelledby="preview-heading" class="lg:col-span-5 lg:sticky lg:top-22 space-y-6">
          <!-- Card do Prompt Compilado -->
          <div
            class="rounded-[14px] border-[2px] overflow-hidden flex flex-col"
            :class="
              isDark
                ? 'bg-[#1F1F1C] border-[#D8D0C3]/50 shadow-[5px_5px_0px_#000000]'
                : 'bg-[#FAF9F6] border-[#282824] shadow-[5px_5px_0px_#282824]'
            "
          >
            <!-- Header do Preview -->
            <div
              class="border-b-[1.75px] px-5 py-3.5 flex flex-wrap items-center justify-between gap-2"
              :class="
                isDark
                  ? 'bg-[#161614] border-[#77766F]/40'
                  : 'bg-[#E8E8E3] border-[#282824]'
              "
            >
              <div class="flex items-center gap-2">
                <h2 id="preview-heading" class="font-display text-sm md:text-base font-semibold">
                  Prompt Compilado ({{ activeContext.label }})
                </h2>
                <span
                  v-if="completionStats.isReady"
                  class="inline-flex items-center gap-1 rounded-[6px] border border-[#282824] bg-[#A5B4A0] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#282824]"
                >
                  Pronto ✓
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1 rounded-[6px] border border-[#282824] px-2 py-0.5 font-mono text-[10px] font-semibold tabular-nums text-[#282824]"
                  :style="{ backgroundColor: currentAccent.hex }"
                >
                  {{ completionStats.pending }} pendente{{ completionStats.pending > 1 ? 's' : '' }}
                </span>
              </div>

              <!-- Controles do Preview -->
              <div class="flex items-center gap-1.5">
                <button
                  v-if="!isManualEdit"
                  type="button"
                  :aria-pressed="highlightVariables"
                  @click="highlightVariables = !highlightVariables"
                  class="rounded-[8px] border-[1.5px] border-[#282824] px-2.5 py-1 text-xs font-semibold transition-all text-[#282824]"
                  :style="
                    highlightVariables
                      ? { backgroundColor: currentAccent.hex }
                      : { backgroundColor: '#FAF9F6' }
                  "
                >
                  <span>Grifar Variáveis</span>
                </button>

                <button
                  v-if="!isManualEdit"
                  type="button"
                  @click="enableManualEdit"
                  class="arch-btn-secondary inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold"
                >
                  <ArchIcon name="edit" :size="12" />
                  <span>Editar Texto</span>
                </button>

                <button
                  v-else
                  type="button"
                  @click="resetManualEdit"
                  class="arch-btn-primary inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold"
                >
                  <span>Sincronizar Template</span>
                </button>
              </div>
            </div>

            <!-- Corpo do Prompt Compilado (Fluxo Inline Contínuo Sem Quebra de Caixa!) -->
            <div class="p-5 md:p-6 relative flex-grow min-h-[250px] flex flex-col justify-between">
              <div v-if="isManualEdit" class="space-y-2">
                <label for="manual-prompt-editor" class="block font-mono text-xs font-semibold uppercase">
                  Edição direta do texto final:
                </label>
                <textarea
                  id="manual-prompt-editor"
                  v-model="manualPromptText"
                  rows="8"
                  class="arch-input w-full p-3 font-mono text-xs md:text-sm leading-relaxed"
                />
              </div>

              <!-- Parágrafo Contínuo do Render + Bloco Separado para Imagem de Referência -->
              <div v-else class="space-y-4">
                <p
                  class="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words font-medium"
                  :class="isDark ? 'text-[#FAF9F6]' : 'text-[#282824]'"
                >
                  <template v-for="(seg, idx) in promptSegments" :key="idx">
                    <span v-if="seg.type === 'static'">{{ seg.text }}</span>

                    <span
                      v-else-if="seg.isPlaceholder"
                      role="button"
                      tabindex="0"
                      @click="scrollToField(seg.fieldId)"
                      @keydown.enter.prevent="scrollToField(seg.fieldId)"
                      @keydown.space.prevent="scrollToField(seg.fieldId)"
                      class="cursor-pointer rounded-[6px] border border-[#282824] px-1.5 py-0.5 mx-0.5 font-mono text-xs font-semibold text-[#282824] transition-opacity hover:opacity-85"
                      :style="{ backgroundColor: currentAccent.hex }"
                      :title="`Clique para preencher: ${seg.label}`"
                    >{{ seg.text }}</span>

                    <span
                      v-else
                      role="button"
                      tabindex="0"
                      @click="scrollToField(seg.fieldId)"
                      @keydown.enter.prevent="scrollToField(seg.fieldId)"
                      @keydown.space.prevent="scrollToField(seg.fieldId)"
                      class="cursor-pointer transition-colors duration-120 rounded-[4px] px-0.5"
                      :style="
                        highlightVariables && !isDark
                          ? {
                              backgroundColor: currentAccent.softBg,
                              textDecorationColor: '#282824'
                            }
                          : undefined
                      "
                      :class="
                        highlightVariables
                          ? 'underline decoration-2 underline-offset-4 font-semibold'
                          : ''
                      "
                      :title="`${seg.label} — Clique para editar`"
                    >{{ seg.text }}</span>
                  </template>
                </p>

                <!-- Container Separado para Diretriz de Imagem de Referência (Não mistura no bloco do Render) -->
                <div
                  v-if="imageRef.trim()"
                  class="rounded-[10px] border-[1.5px] p-3 text-xs space-y-1.5"
                  :class="
                    isDark
                      ? 'bg-[#161614] border-[#A5B4A0]/60 text-[#FAF9F6]'
                      : 'bg-[#F5F1E9] border-[#282824] text-[#282824] shadow-[2px_2px_0px_#282824]'
                  "
                >
                  <div class="flex items-center justify-between gap-2">
                    <span class="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider">
                      <ArchIcon name="image" :size="12" />
                      <span>Diretriz de Imagem Anexada (Separado do Render)</span>
                    </span>
                    <div class="flex items-center gap-1.5">
                      <button
                        type="button"
                        @click="scrollToField('imageRef')"
                        class="rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold underline hover:opacity-80"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        @click="setFieldValue('imageRef', '')"
                        class="rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#F47760] hover:underline"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                  <p class="font-mono text-[11px] leading-relaxed opacity-90">
                    Reference image directive: {{ imageRef.trim() }}.
                  </p>
                </div>

                <div v-else class="pt-1">
                  <button
                    type="button"
                    @click="scrollToField('imageRef')"
                    class="inline-flex items-center gap-1.5 rounded-[8px] border border-dashed px-2.5 py-1.5 font-mono text-[11px] font-medium transition-colors"
                    :class="
                      isDark
                        ? 'border-[#77766F]/60 bg-[#161614] text-[#D8D0C3] hover:border-[#FAF9F6] hover:text-[#FAF9F6]'
                        : 'border-[#282824]/50 bg-[#F5F1E9] text-[#77766F] hover:border-[#282824] hover:text-[#282824]'
                    "
                  >
                    <ArchIcon name="image" :size="13" />
                    <span>+ Adicionar diretriz para imagem(ns) enviada(s) (Opcional)</span>
                  </button>
                </div>
              </div>

              <!-- Metadados Técnicos do Prompt -->
              <div
                class="mt-6 pt-3 border-t-[1.5px] flex items-center justify-between font-mono text-[11px] tabular-nums"
                :class="
                  isDark
                    ? 'border-[#77766F]/40 text-[#D8D0C3]'
                    : 'border-[#282824]/20 text-[#77766F]'
                "
              >
                <span>{{ wordCount }} palavras · {{ finalPrompt.length }} caracteres</span>
                <span>Clique em um trecho para focar</span>
              </div>
            </div>

            <!-- Barra de Ação Principal (Copiar & Favoritar) -->
            <div
              class="p-4 border-t-[1.75px] flex items-center gap-2.5"
              :class="
                isDark
                  ? 'bg-[#161614] border-[#77766F]/40'
                  : 'bg-[#F5F1E9] border-[#282824]'
              "
            >
              <button
                type="button"
                @click="handleCopy"
                class="arch-btn-primary flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold"
                :style="isCopied ? { backgroundColor: '#A5B4A0' } : undefined"
              >
                <ArchIcon :name="isCopied ? 'check' : 'copy'" :size="17" :stroke-width="2.1" />
                <span>{{ isCopied ? 'Prompt Copiado!' : 'Copiar Prompt em Inglês' }}</span>
              </button>

              <button
                type="button"
                @click="handleSaveFavorite"
                class="arch-btn-secondary inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 text-xs font-semibold"
                title="Salvar este prompt nos Favoritos"
              >
                <ArchIcon name="bookmark" :size="15" />
                <span>Favoritar</span>
              </button>
            </div>
          </div>

          <!-- Inputs de Imagens + Módulo "Canvas" (Acima de Biblioteca Local) -->
          <ArchCanvasModule
            :is-dark="isDark"
            :active-context-id="activeContextId"
            :final-prompt="finalPrompt"
            :accent-hex="currentAccent.hex"
            @sync-image-directive="handleSyncImageDirective"
            @open-config-modal="isConfigModalOpen = true"
            @notify="triggerToast"
          />

          <!-- Card de Histórico Local & Favoritos -->
          <section
            aria-labelledby="history-heading"
            class="rounded-[14px] border-[1.75px] overflow-hidden"
            :class="
              isDark
                ? 'bg-[#1F1F1C] border-[#77766F]/50 shadow-[4px_4px_0px_#000000]'
                : 'bg-[#FAF9F6] border-[#282824] shadow-[4px_4px_0px_#282824]'
            "
          >
            <div
              class="flex items-center justify-between border-b-[1.5px] px-4 py-3"
              :class="isDark ? 'border-[#77766F]/40 bg-[#161614]' : 'border-[#282824] bg-[#F5F1E9]'"
            >
              <div class="flex items-center gap-2">
                <ArchIcon name="folder" :size="15" />
                <h3 id="history-heading" class="font-display text-xs font-semibold uppercase tracking-wider">
                  Biblioteca Local
                </h3>
              </div>

              <div class="flex items-center gap-1" role="group" aria-label="Filtrar histórico">
                <button
                  type="button"
                  :aria-pressed="historyFilter === 'all'"
                  @click="historyFilter = 'all'"
                  class="rounded-[6px] border px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums transition-all"
                  :class="
                    historyFilter === 'all'
                      ? 'border-[#282824] bg-[#FAF9F6] text-[#282824] shadow-[1.5px_1.5px_0px_#282824]'
                      : 'border-transparent text-[#77766F]'
                  "
                >
                  Recentes ({{ history.length }})
                </button>
                <button
                  type="button"
                  :aria-pressed="historyFilter === 'favorites'"
                  @click="historyFilter = 'favorites'"
                  class="rounded-[6px] border px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums transition-all"
                  :style="
                    historyFilter === 'favorites'
                      ? { backgroundColor: currentAccent.hex, borderColor: '#282824', color: '#282824' }
                      : undefined
                  "
                  :class="
                    historyFilter === 'favorites'
                      ? 'shadow-[1.5px_1.5px_0px_#282824]'
                      : 'border-transparent text-[#77766F]'
                  "
                >
                  Favoritos ({{ favoritesCount }})
                </button>
              </div>
            </div>

            <div
              v-if="filteredHistory.length === 0"
              class="p-6 text-center text-xs"
              :class="isDark ? 'text-[#D8D0C3]' : 'arch-ambient-gradient text-[#282824]'"
            >
              {{
                historyFilter === 'favorites'
                  ? 'Nenhum prompt marcado como favorito. Clique em "Favoritar" acima para guardar suas melhores composições.'
                  : 'Prompts copiados são registrados automaticamente no navegador.'
              }}
            </div>

            <ul
              v-else
              class="max-h-64 overflow-y-auto divide-y"
              :class="isDark ? 'divide-[#282824]' : 'divide-[#282824]/15'"
            >
              <li
                v-for="item in filteredHistory"
                :key="item.id"
                class="p-3.5 transition-colors duration-120"
                :class="isDark ? 'hover:bg-[#282824]/60' : 'hover:bg-[#F5F1E9]'"
              >
                <div class="flex items-center justify-between gap-2 mb-1">
                  <div class="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      :aria-label="item.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
                      :aria-pressed="item.isFavorite"
                      @click="toggleFavorite(item.id)"
                      class="shrink-0 rounded p-0.5"
                    >
                      <ArchIcon name="bookmark" :size="14" />
                    </button>

                    <span class="font-display text-xs font-semibold truncate">
                      {{ item.title }}
                    </span>
                  </div>

                  <span class="font-mono text-[10px] tabular-nums shrink-0 text-[#77766F]">
                    {{ item.createdAt }}
                  </span>
                </div>

                <p class="font-mono text-xs line-clamp-2 leading-relaxed mb-2.5 text-[#77766F]">
                  {{ item.prompt }}
                </p>

                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    @click="restoreHistoryItem(item)"
                    class="arch-btn-secondary px-2.5 py-1 text-xs font-semibold"
                  >
                    Restaurar variáveis
                  </button>

                  <button
                    type="button"
                    @click="handleCopyHistoryItem(item)"
                    class="arch-btn-secondary px-2.5 py-1 text-xs font-semibold"
                  >
                    {{ copiedHistoryId === item.id ? 'Copiado ✓' : 'Copiar' }}
                  </button>

                  <button
                    type="button"
                    @click="deleteHistoryItem(item.id)"
                    class="ml-auto rounded px-2 py-1 text-xs font-medium text-[#77766F] hover:text-[#F47760]"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </main>

    <!-- Footer Minimalista -->
    <footer
      class="border-t-[1.75px] py-6 mt-12"
      :class="isDark ? 'border-[#77766F]/40 bg-[#161614] text-[#D8D0C3]' : 'border-[#282824] bg-[#FAF9F6] text-[#282824]'"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p>ArchStudio · 8 contextos especializados, catálogo de referências e sistema de plantas baixas.</p>
        <nav aria-label="Links institucionais" class="flex items-center gap-5 font-semibold">
          <button
            type="button"
            @click="activeViewTab = activeViewTab === 'catalog' ? 'studio' : 'catalog'"
            class="hover:underline underline-offset-4"
          >
            {{ activeViewTab === 'catalog' ? 'Voltar ao Estúdio' : 'Catálogo de Referências' }}
          </button>
          <button
            type="button"
            @click="isGuideOpen = true"
            class="hover:underline underline-offset-4"
          >
            Documentação das 6 Fases
          </button>
          <a
            href="/"
            @click.prevent="emit('navigate-home')"
            class="hover:underline underline-offset-4"
          >
            Portfólio Lucas Levino
          </a>
        </nav>
      </div>
    </footer>

    <!-- Modal / Drawer do Guia de Engenharia de Prompts -->
    <ArchPromptGuideModal
      :is-open="isGuideOpen"
      :is-dark="isDark"
      @close="isGuideOpen = false"
      @apply-reference="loadReferenceExample"
    />

    <!-- Modal de Configuração de Chaves de API (LocalStorage / Cookies / .JSON) -->
    <ArchConfigModal
      :is-open="isConfigModalOpen"
      :is-dark="isDark"
      @close="isConfigModalOpen = false"
      @notify="triggerToast"
    />
  </div>
</template>

<style scoped>
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.2s ease;
}
.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
