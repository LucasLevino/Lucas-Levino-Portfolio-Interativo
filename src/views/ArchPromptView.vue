<script setup lang="ts">
import { ref, computed } from 'vue'
import { ARCH_CONTEXTS, type ArchContextId } from '../data/archprompt'
import { useArchPrompt, type PromptHistoryItem } from '../composables/useArchPrompt'
import ArchIcon from '../components/archprompt/ArchIcon.vue'
import ArchPromptField from '../components/archprompt/ArchPromptField.vue'
import ArchPromptGuideModal from '../components/archprompt/ArchPromptGuideModal.vue'
import ArchFloorPlanInteractive from '../components/archprompt/ArchFloorPlanInteractive.vue'

const emit = defineEmits<{
  (e: 'navigate-home'): void
}>()

const CONTEXT_ACCENT_MAP: Record<ArchContextId, { hex: string; softBg: string }> = {
  exterior: { hex: '#C98268', softBg: 'rgba(201, 130, 104, 0.18)' },
  interior: { hex: '#D8B99A', softBg: 'rgba(216, 185, 154, 0.24)' },
  'interior-design': { hex: '#C7B4E8', softBg: 'rgba(199, 180, 232, 0.22)' },
  lighting: { hex: '#D8B99A', softBg: 'rgba(216, 185, 154, 0.24)' },
  environment: { hex: '#A5B4A0', softBg: 'rgba(165, 180, 160, 0.22)' },
  furniture: { hex: '#C98268', softBg: 'rgba(201, 130, 104, 0.18)' },
  'furniture-3d': { hex: '#F47760', softBg: 'rgba(244, 119, 96, 0.18)' },
  'floor-plan': { hex: '#91B5C8', softBg: 'rgba(145, 181, 200, 0.22)' }
}

const {
  activeContextId,
  activeContext,
  contextPresets,
  selectContext,
  mode,
  currentFields,
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

const isCopied = ref(false)
const copiedHistoryId = ref<string | null>(null)
const isGuideOpen = ref(false)
const highlightVariables = ref(true)
const historyFilter = ref<'all' | 'favorites'>('all')
const liveAnnouncement = ref('')

const currentAccent = computed(() => {
  return CONTEXT_ACCENT_MAP[activeContextId.value] || CONTEXT_ACCENT_MAP.exterior
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

const announce = (msg: string) => {
  liveAnnouncement.value = msg
}

const handleSelectContext = (ctxId: typeof activeContextId.value) => {
  selectContext(ctxId)
  announce(`Contexto alterado para ${activeContext.value.label}.`)
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

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(finalPrompt.value)
    isCopied.value = true
    saveToHistory(false)
    announce('Prompt copiado para a área de transferência e salvo no histórico.')
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
  announce('Prompt adicionado aos favoritos.')
}

const handleCopyHistoryItem = async (item: PromptHistoryItem) => {
  try {
    await navigator.clipboard.writeText(item.prompt)
    copiedHistoryId.value = item.id
    announce(`Prompt ${item.title} copiado.`)
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
  const el = document.getElementById(`arch-field-${fieldId}`)
  const textarea = document.getElementById(`textarea-${fieldId}`) as HTMLTextAreaElement | null
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  if (textarea) {
    setTimeout(() => textarea.focus(), 200)
  }
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

    <!-- Top Studio Navbar -->
    <header
      class="sticky top-0 z-30 border-b-[1.75px] transition-colors duration-150"
      :class="
        isDark
          ? 'bg-[#161614]/95 border-[#77766F]/40 backdrop-blur-xs'
          : 'bg-[#FAF9F6] border-[#282824]'
      "
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3 min-w-0">
          <a
            href="/"
            @click.prevent="emit('navigate-home')"
            class="arch-btn-secondary inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold"
            title="Voltar ao portfólio principal de Lucas Levino"
          >
            <ArchIcon name="arrow-left" :size="14" />
            <span>Lucas Levino</span>
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
              ARCHPROMPT
            </span>
            <span class="text-xs hidden md:inline" :class="isDark ? 'text-[#D8D0C3]' : 'text-[#77766F]'">
              Contexto ativo: <strong :class="isDark ? 'text-[#FAF9F6]' : 'text-[#282824]'">{{ activeContext.label }}</strong>
            </span>
          </div>
        </div>

        <nav aria-label="Controles do estúdio" class="flex items-center gap-2">
          <!-- Seletor de Modo (7 vs 12 Blocos) -->
          <div
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
              Rápido (7 Blocos)
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
              Avançado (12 Blocos)
            </button>
          </div>

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

    <!-- Conteúdo Principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
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
            ArchiPrompt Studio
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

      <!-- Seção 2: Seletor de Contexto Arquitetônico (8 Contextos) -->
      <section aria-labelledby="context-selector-heading" class="space-y-2.5">
        <div class="flex items-center justify-between">
          <h2
            id="context-selector-heading"
            class="font-mono text-xs font-semibold uppercase tracking-wider"
          >
            1. Selecione o Contexto da Cena (Adapta o Template e as Sugestões)
          </h2>
          <span class="font-mono text-xs hidden sm:inline" :class="isDark ? 'text-[#D8D0C3]' : 'text-[#77766F]'">
            8 contextos especializados
          </span>
        </div>

        <div
          role="tablist"
          aria-label="Contextos arquitetônicos"
          class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5"
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
        <!-- Coluna Esquerda (7 cols): Construtor de Especificação + Sistema Interativo de Plantas Baixas -->
        <section aria-labelledby="builder-heading" class="lg:col-span-7 space-y-4">
          <ArchFloorPlanInteractive
            v-if="activeContextId === 'floor-plan'"
            :is-dark="isDark"
            @sync-floorplan="handleSyncFloorPlan"
          />

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

          <!-- Grid de Campos (Incluindo o Bloco REF de Imagem(ns) de Referência Enviada(s) com o Prompt) -->
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
                :is-featured="field.id === 'imageRef' || field.id === 'style' || field.id === 'archStyle'"
                :is-chip-active="(chipVal: string) => isChipSelected(field.id, chipVal)"
                @update:model-value="(val: string) => setFieldValue(field.id, val)"
                @toggle-chip="(chipVal: string) => toggleChip(field.id, chipVal)"
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

              <!-- Parágrafo Contínuo com <span> inline -->
              <p
                v-else
                class="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words font-medium"
                :class="isDark ? 'text-[#FAF9F6]' : 'text-[#282824]'"
              >
                <template v-for="(seg, idx) in promptSegments" :key="idx">
                  <span v-if="seg.type === 'static'">{{ seg.text }}</span>

                  <span
                    v-else-if="seg.isPlaceholder && seg.isOptional"
                    role="button"
                    tabindex="0"
                    @click="scrollToField(seg.fieldId)"
                    @keydown.enter.prevent="scrollToField(seg.fieldId)"
                    @keydown.space.prevent="scrollToField(seg.fieldId)"
                    class="cursor-pointer rounded-[6px] border border-dashed border-[#282824]/60 bg-[#F5F1E9] px-1.5 py-0.5 mx-0.5 font-mono text-[11px] font-medium text-[#77766F] hover:border-[#282824] hover:text-[#282824] transition-colors"
                    title="Opcional: Clique se você for anexar uma ou mais imagens junto com o prompt na IA"
                  >{{ seg.text }}</span>

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
        <p>ArchiPrompt Studio · 8 contextos especializados, diretrizes de imagem de referência e sistema de plantas baixas.</p>
        <nav aria-label="Links institucionais" class="flex items-center gap-5 font-semibold">
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
  </div>
</template>
