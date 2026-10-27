<script setup lang="ts">
import { ref, computed } from 'vue'
import { CURATED_PRESETS } from '../data/archprompt'
import { useArchPrompt, type PromptHistoryItem } from '../composables/useArchPrompt'
import ArchPromptField from '../components/archprompt/ArchPromptField.vue'
import ArchPromptGuideModal from '../components/archprompt/ArchPromptGuideModal.vue'

const emit = defineEmits<{
  (e: 'navigate-home'): void
}>()

const {
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

// Helper for two-column pairing in Advanced Mode to break vertical monotony
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
    class="h-screen w-screen overflow-y-auto font-arch-sans selection:bg-amber-500/25 transition-colors duration-150"
    :class="isDark ? 'bg-stone-950 text-stone-200' : 'bg-[#FAF8F5] text-stone-800'"
  >
    <!-- Live Region para Leitores de Tela (WCAG 4.1.3) -->
    <div role="status" aria-live="polite" class="sr-only">
      {{ liveAnnouncement }}
    </div>

    <!-- Top Studio Navbar (Solid Surface, Zero Glassmorphism Slop) -->
    <header
      class="sticky top-0 z-30 border-b transition-colors duration-150"
      :class="
        isDark
          ? 'bg-stone-950 border-stone-800'
          : 'bg-[#FAF8F5] border-stone-200'
      "
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <!-- Left: Brand Identity & Portfolio Return Link -->
        <div class="flex items-center gap-3 min-w-0">
          <a
            href="/"
            @click.prevent="emit('navigate-home')"
            class="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            :class="
              isDark
                ? 'border-stone-800 bg-stone-900 text-stone-300 hover:border-stone-700 hover:text-stone-100'
                : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400 hover:text-stone-900'
            "
            title="Voltar ao portfólio principal de Lucas Levino"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span>Lucas Levino</span>
          </a>

          <span class="hidden sm:inline-block h-4 w-px" :class="isDark ? 'bg-stone-800' : 'bg-stone-300'" aria-hidden="true"></span>

          <div class="flex items-center gap-2 truncate">
            <span
              class="font-mono text-xs font-semibold uppercase tracking-wider"
              :class="isDark ? 'text-amber-400' : 'text-amber-800'"
            >
              ARCHPROMPT
            </span>
            <span class="text-xs hidden md:inline" :class="isDark ? 'text-stone-400' : 'text-stone-600'">
              Especificação de Prompts para ArchViz
            </span>
          </div>
        </div>

        <!-- Right: Mode Segmented Control, Methodology Guide & Theme Toggle -->
        <nav aria-label="Controles do estúdio" class="flex items-center gap-2">
          <!-- Seletor de Modo (7 vs 12 Blocos) -->
          <div
            role="group"
            aria-label="Modo de detalhamento do template"
            class="inline-flex rounded-md border p-0.5"
            :class="
              isDark
                ? 'bg-stone-900 border-stone-800'
                : 'bg-stone-200/70 border-stone-300'
            "
          >
            <button
              type="button"
              :aria-pressed="mode === 'quick'"
              @click="switchMode('quick')"
              class="rounded px-2.5 py-1 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              :class="
                mode === 'quick'
                  ? isDark
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-amber-700 text-white'
                  : isDark
                    ? 'text-stone-400 hover:text-stone-200'
                    : 'text-stone-700 hover:text-stone-900'
              "
            >
              7 Blocos
            </button>
            <button
              type="button"
              :aria-pressed="mode === 'advanced'"
              @click="switchMode('advanced')"
              class="rounded px-2.5 py-1 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              :class="
                mode === 'advanced'
                  ? isDark
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-amber-700 text-white'
                  : isDark
                    ? 'text-stone-400 hover:text-stone-200'
                    : 'text-stone-700 hover:text-stone-900'
              "
            >
              12 Blocos
            </button>
          </div>

          <!-- Botão Guia Metodológico -->
          <button
            type="button"
            @click="isGuideOpen = true"
            class="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            :class="
              isDark
                ? 'bg-stone-900 border-stone-700 text-stone-200 hover:bg-stone-800 hover:border-amber-500/50'
                : 'bg-white border-stone-300 text-stone-800 hover:bg-stone-100 shadow-2xs'
            "
          >
            <svg
              aria-hidden="true"
              class="shrink-0"
              :class="isDark ? 'text-amber-400' : 'text-amber-700'"
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <span class="hidden sm:inline">Guia das 6 Fases</span>
            <span class="sm:hidden">Guia</span>
          </button>

          <!-- Alternar Tema Escuro / Claro -->
          <button
            type="button"
            @click="toggleTheme"
            class="inline-flex h-8 w-8 items-center justify-center rounded-md border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            :class="
              isDark
                ? 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800 hover:text-amber-400'
                : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100 hover:text-amber-700 shadow-2xs'
            "
            :aria-label="isDark ? 'Ativar modo claro (Papel Arquitetônico)' : 'Ativar modo escuro (Obsidian Studio)'"
            :title="isDark ? 'Modo Claro' : 'Modo Escuro'"
          >
            <svg v-if="isDark" aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" /><path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" /><path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
            </svg>
            <svg v-else aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          </button>
        </nav>
      </div>
    </header>

    <!-- Conteúdo Principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
      <!-- Seção 1: Cabeçalho Assimétrico de Especificação + Cenários Curados -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-6 border-b" :class="isDark ? 'border-stone-800' : 'border-stone-200'">
        <div class="lg:col-span-7 space-y-3">
          <p
            class="font-mono text-xs uppercase tracking-wider"
            :class="isDark ? 'text-amber-400' : 'text-amber-800'"
          >
            SISTEMA DE COMPOSIÇÃO · DO MACRO AO MICRO
          </p>
          <h1
            class="font-display font-bold tracking-tight leading-tight text-[clamp(1.75rem,1.4rem+1.5vw,2.75rem)]"
            :class="isDark ? 'text-stone-100' : 'text-stone-900'"
          >
            ArchiPrompt Studio
          </h1>
          <p
            class="text-sm md:text-base leading-relaxed max-w-prose"
            :class="isDark ? 'text-stone-300' : 'text-stone-700'"
          >
            Estruture prompts técnicos em inglês para visualização arquitetônica em 6 fases ordenadas por peso semântico: sujeito e implantação, materialidade, paisagismo, primeiro plano, luz e parâmetros de render.
          </p>
        </div>

        <!-- Painel de Ações Rápidas (Sem Emojis, Ícones SVG Monocromáticos) -->
        <div class="lg:col-span-5 flex flex-wrap lg:justify-end gap-2">
          <button
            type="button"
            @click="loadReferenceExample"
            class="inline-flex items-center gap-2 rounded-md border px-3.5 py-2 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            :class="
              isDark
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                : 'border-amber-700/30 bg-amber-50 text-amber-900 hover:bg-amber-100'
            "
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" x2="8" y1="13" y2="13" />
              <line x1="16" x2="8" y1="17" y2="17" />
            </svg>
            <span>Carregar Exemplo do Guia</span>
          </button>

          <button
            type="button"
            @click="surpriseMe"
            class="inline-flex items-center gap-2 rounded-md border px-3.5 py-2 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            :class="
              isDark
                ? 'border-stone-700 bg-stone-900 text-stone-200 hover:bg-stone-800 hover:border-stone-600'
                : 'border-stone-300 bg-white text-stone-800 hover:bg-stone-100 shadow-2xs'
            "
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" x2="21" y1="20" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" x2="21" y1="15" y2="21" />
              <line x1="4" x2="9" y1="4" y2="9" />
            </svg>
            <span>Gerar Combinação Aleatória</span>
          </button>

          <button
            type="button"
            @click="clearAll"
            class="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            :class="
              isDark
                ? 'border-stone-800 bg-stone-950 text-stone-400 hover:border-red-500/40 hover:text-red-400'
                : 'border-stone-300 bg-stone-100 text-stone-700 hover:border-red-300 hover:text-red-700'
            "
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            <span>Limpar</span>
          </button>
        </div>
      </section>

      <!-- Seção 2: Matriz de Projetos de Referência (4 Colunas Assimétricas ao Topo) -->
      <section aria-labelledby="presets-heading" class="space-y-2.5">
        <div class="flex items-center justify-between">
          <h2
            id="presets-heading"
            class="font-mono text-xs font-semibold uppercase tracking-wider"
            :class="isDark ? 'text-stone-400' : 'text-stone-600'"
          >
            Projetos Base Pré-Configurados (4 Tipologias)
          </h2>
          <span class="text-xs" :class="isDark ? 'text-stone-400' : 'text-stone-600'">
            Selecione uma tipologia para preencher todas as fases e personalizar
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            v-for="preset in CURATED_PRESETS"
            :key="preset.id"
            type="button"
            :aria-pressed="activePresetId === preset.id"
            @click="loadPreset(preset)"
            class="text-left rounded-lg border p-3.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            :class="
              activePresetId === preset.id
                ? isDark
                  ? 'bg-amber-500/10 border-amber-500 text-stone-100'
                  : 'bg-amber-50 border-amber-700 text-stone-900'
                : isDark
                  ? 'bg-stone-900/60 border-stone-800 text-stone-300 hover:border-stone-700 hover:bg-stone-900'
                  : 'bg-white border-stone-200 text-stone-800 hover:border-stone-300 shadow-2xs'
            "
          >
            <div class="flex items-center justify-between gap-2 mb-1">
              <span
                class="font-mono text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded"
                :class="
                  activePresetId === preset.id
                    ? isDark
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-amber-700 text-white'
                    : isDark
                      ? 'bg-stone-800 text-stone-300'
                      : 'bg-stone-100 text-stone-700'
                "
              >
                {{ preset.badge }}
              </span>
              <svg
                v-if="activePresetId === preset.id"
                aria-hidden="true"
                class="shrink-0"
                :class="isDark ? 'text-amber-400' : 'text-amber-700'"
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p class="font-display text-sm font-semibold leading-snug" :class="isDark ? 'text-stone-100' : 'text-stone-900'">
              {{ preset.name }}
            </p>
            <p class="mt-1 text-xs line-clamp-2 leading-relaxed" :class="isDark ? 'text-stone-400' : 'text-stone-600'">
              {{ preset.description }}
            </p>
          </button>
        </div>
      </section>

      <!-- Seção 3: Grid Assimétrico Principal (7 Colunas Construtor / 5 Colunas Blueprint Preview) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Coluna Esquerda (7 cols): Construtor de Especificação -->
        <section aria-labelledby="builder-heading" class="lg:col-span-7 space-y-4">
          <!-- Barra de Status de Preenchimento -->
          <div
            class="flex items-center justify-between rounded-lg border px-4 py-3"
            :class="
              isDark
                ? 'bg-stone-900 border-stone-800'
                : 'bg-white border-stone-200 shadow-2xs'
            "
          >
            <div class="flex items-center gap-3">
              <h2
                id="builder-heading"
                class="font-display text-sm font-bold"
                :class="isDark ? 'text-stone-100' : 'text-stone-900'"
              >
                Variáveis da Cena
              </h2>
              <span
                class="rounded-md border px-2 py-0.5 font-mono text-xs font-medium tabular-nums"
                :class="
                  completionStats.isReady
                    ? isDark
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                      : 'border-emerald-600/30 bg-emerald-50 text-emerald-800'
                    : isDark
                      ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                      : 'border-amber-700/30 bg-amber-50 text-amber-900'
                "
              >
                {{ completionStats.filled }} de {{ completionStats.total }} preenchidos ({{ completionStats.percentage }}%)
              </span>
            </div>

            <div
              class="w-28 sm:w-40 h-2 rounded-full overflow-hidden"
              :class="isDark ? 'bg-stone-800' : 'bg-stone-200'"
              role="progressbar"
              :aria-valuenow="completionStats.percentage"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Progresso de preenchimento dos blocos do prompt"
            >
              <div
                class="h-full transition-all duration-150 rounded-full"
                :class="
                  completionStats.isReady
                    ? 'bg-emerald-500'
                    : isDark
                      ? 'bg-amber-500'
                      : 'bg-amber-700'
                "
                :style="{ width: `${completionStats.percentage}%` }"
              ></div>
            </div>
          </div>

          <!-- Grid de Campos (Misto de largura total e 2 colunas no modo avançado para quebrar monotonia) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="(field, index) in currentFields"
              :key="`${mode}-${field.id}`"
              :class="isHalfWidthField(field.id) ? 'md:col-span-1' : 'md:col-span-2'"
            >
              <ArchPromptField
                :config="field"
                :model-value="getFieldValue(field.id)"
                :is-dark="isDark"
                :is-featured="index === 0"
                :is-chip-active="(chipVal: string) => isChipSelected(field.id, chipVal)"
                @update:model-value="(val: string) => setFieldValue(field.id, val)"
                @toggle-chip="(chipVal: string) => toggleChip(field.id, chipVal)"
              />
            </div>
          </div>
        </section>

        <!-- Coluna Direita (5 cols): Preview Técnico & Histórico Local -->
        <aside aria-labelledby="preview-heading" class="lg:col-span-5 lg:sticky lg:top-22 space-y-6">
          <!-- Card do Prompt Gerado -->
          <div
            class="rounded-lg border shadow-md overflow-hidden flex flex-col"
            :class="
              isDark
                ? 'bg-stone-900 border-stone-700'
                : 'bg-white border-stone-300'
            "
          >
            <!-- Header do Preview -->
            <div
              class="border-b px-5 py-3.5 flex flex-wrap items-center justify-between gap-2"
              :class="
                isDark
                  ? 'bg-stone-950/60 border-stone-800'
                  : 'bg-stone-100/80 border-stone-200'
              "
            >
              <div class="flex items-center gap-2.5">
                <h2
                  id="preview-heading"
                  class="font-display text-sm font-bold"
                  :class="isDark ? 'text-stone-100' : 'text-stone-900'"
                >
                  Prompt Compilado
                </h2>
                <span
                  v-if="completionStats.isReady"
                  class="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[11px] font-medium"
                  :class="
                    isDark
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                      : 'border-emerald-600/30 bg-emerald-50 text-emerald-800'
                  "
                >
                  Pronto
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[11px] font-medium tabular-nums"
                  :class="
                    isDark
                      ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                      : 'border-amber-700/30 bg-amber-50 text-amber-900'
                  "
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
                  class="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  :class="
                    highlightVariables
                      ? isDark
                        ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                        : 'border-amber-700/40 bg-amber-50 text-amber-900'
                      : isDark
                        ? 'border-stone-700 text-stone-400 hover:text-stone-200'
                        : 'border-stone-300 text-stone-700 hover:text-stone-900'
                  "
                >
                  <span>Grifar Variáveis</span>
                </button>

                <button
                  v-if="!isManualEdit"
                  type="button"
                  @click="enableManualEdit"
                  class="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  :class="
                    isDark
                      ? 'border-stone-700 bg-stone-800 text-stone-200 hover:bg-stone-700'
                      : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-100'
                  "
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  </svg>
                  <span>Editar Texto</span>
                </button>

                <button
                  v-else
                  type="button"
                  @click="resetManualEdit"
                  class="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  :class="
                    isDark
                      ? 'border-amber-500/40 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25'
                      : 'border-amber-700/40 bg-amber-50 text-amber-900 hover:bg-amber-100'
                  "
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M8 16H3v5" />
                  </svg>
                  <span>Sincronizar Template</span>
                </button>
              </div>
            </div>

            <!-- Corpo do Prompt Compilado -->
            <div class="p-5 md:p-6 relative flex-grow min-h-[250px] flex flex-col justify-between">
              <!-- Modo Edição Manual -->
              <div v-if="isManualEdit" class="space-y-2">
                <label
                  for="manual-prompt-editor"
                  class="block text-xs font-semibold"
                  :class="isDark ? 'text-amber-400' : 'text-amber-800'"
                >
                  Edição direta do texto final (sincronização automática pausada):
                </label>
                <textarea
                  id="manual-prompt-editor"
                  v-model="manualPromptText"
                  rows="8"
                  class="w-full rounded-md border p-3 font-mono text-xs md:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"
                  :class="
                    isDark
                      ? 'bg-stone-950 border-stone-700 text-stone-100'
                      : 'bg-stone-50 border-stone-300 text-stone-900'
                  "
                />
              </div>

              <!-- Modo Blueprint Interativo (Todos os tokens clicáveis são <button> reais) -->
              <div
                v-else
                class="font-mono text-xs md:text-sm leading-relaxed whitespace-pre-wrap"
                :class="isDark ? 'text-stone-200' : 'text-stone-800'"
              >
                <template v-for="(seg, idx) in promptSegments" :key="idx">
                  <span v-if="seg.type === 'static'">{{ seg.text }}</span>

                  <button
                    v-else-if="seg.isPlaceholder"
                    type="button"
                    @click="scrollToField(seg.fieldId)"
                    class="inline rounded border px-1.5 py-0.5 mx-0.5 font-mono text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                    :class="
                      isDark
                        ? 'border-amber-500/40 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25'
                        : 'border-amber-700/40 bg-amber-100 text-amber-900 hover:bg-amber-200'
                    "
                    :aria-label="`Campo pendente ${seg.label}. Clique para preencher.`"
                  >
                    {{ seg.text }}
                  </button>

                  <button
                    v-else
                    type="button"
                    @click="scrollToField(seg.fieldId)"
                    class="inline text-left rounded px-1 py-0.2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                    :class="
                      highlightVariables
                        ? isDark
                          ? 'bg-stone-800 text-amber-200 border-b border-amber-500/50 hover:bg-stone-700'
                          : 'bg-amber-50 text-amber-950 border-b border-amber-700/40 hover:bg-amber-100'
                        : 'underline decoration-stone-500/50 underline-offset-4 hover:decoration-amber-500'
                    "
                    :aria-label="`Editar variável da Fase ${seg.phase}: ${seg.label}`"
                    :title="`Fase 0${seg.phase} (${seg.label}) — Clique para editar`"
                  >
                    {{ seg.text }}
                  </button>
                </template>
              </div>

              <!-- Metadados Técnicos do Prompt -->
              <div
                class="mt-6 pt-3 border-t flex items-center justify-between font-mono text-[11px] tabular-nums"
                :class="
                  isDark
                    ? 'border-stone-800 text-stone-400'
                    : 'border-stone-200 text-stone-600'
                "
              >
                <span>{{ wordCount }} palavras · {{ finalPrompt.length }} caracteres</span>
                <span>Clique em um termo para focar</span>
              </div>
            </div>

            <!-- Barra de Ação Principal (Copiar & Favoritar) -->
            <div
              class="p-4 border-t flex items-center gap-2.5"
              :class="
                isDark
                  ? 'bg-stone-950/80 border-stone-800'
                  : 'bg-stone-50 border-stone-200'
              "
            >
              <button
                type="button"
                @click="handleCopy"
                class="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                :class="
                  isCopied
                    ? 'bg-emerald-600 text-white'
                    : isDark
                      ? 'bg-amber-500 text-stone-950 hover:bg-amber-400'
                      : 'bg-amber-700 text-white hover:bg-amber-800'
                "
              >
                <svg v-if="isCopied" aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <svg v-else aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                <span>{{ isCopied ? 'Prompt Copiado!' : 'Copiar Prompt em Inglês' }}</span>
              </button>

              <button
                type="button"
                @click="handleSaveFavorite"
                class="inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-md border text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                :class="
                  isDark
                    ? 'border-stone-700 bg-stone-900 text-stone-200 hover:border-amber-500/50 hover:text-amber-300'
                    : 'border-stone-300 bg-white text-stone-800 hover:border-amber-700 hover:text-amber-800'
                "
                title="Salvar este prompt nos Favoritos"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>Favoritar</span>
              </button>
            </div>
          </div>

          <!-- Card de Histórico Local & Favoritos -->
          <section
            aria-labelledby="history-heading"
            class="rounded-lg border overflow-hidden"
            :class="
              isDark
                ? 'bg-stone-900/70 border-stone-800'
                : 'bg-white border-stone-200 shadow-2xs'
            "
          >
            <div
              class="flex items-center justify-between border-b px-4 py-3"
              :class="isDark ? 'border-stone-800 bg-stone-900' : 'border-stone-200 bg-stone-50'"
            >
              <div class="flex items-center gap-2">
                <svg
                  aria-hidden="true"
                  :class="isDark ? 'text-amber-400' : 'text-amber-700'"
                  viewBox="0 0 24 24"
                  width="15"
                  height="15"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M12 7v5l4 2" />
                </svg>
                <h3
                  id="history-heading"
                  class="font-display text-xs font-bold uppercase tracking-wider"
                  :class="isDark ? 'text-stone-200' : 'text-stone-800'"
                >
                  Biblioteca Local
                </h3>
              </div>

              <div class="flex items-center gap-1" role="group" aria-label="Filtrar histórico">
                <button
                  type="button"
                  :aria-pressed="historyFilter === 'all'"
                  @click="historyFilter = 'all'"
                  class="rounded-md px-2.5 py-1 font-mono text-xs font-medium tabular-nums transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  :class="
                    historyFilter === 'all'
                      ? isDark
                        ? 'bg-stone-800 text-stone-100'
                        : 'bg-stone-200 text-stone-900'
                      : isDark
                        ? 'text-stone-400 hover:text-stone-200'
                        : 'text-stone-600 hover:text-stone-900'
                  "
                >
                  Recentes ({{ history.length }})
                </button>
                <button
                  type="button"
                  :aria-pressed="historyFilter === 'favorites'"
                  @click="historyFilter = 'favorites'"
                  class="inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-mono text-xs font-medium tabular-nums transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  :class="
                    historyFilter === 'favorites'
                      ? isDark
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-amber-100 text-amber-900'
                      : isDark
                        ? 'text-stone-400 hover:text-stone-200'
                        : 'text-stone-600 hover:text-stone-900'
                  "
                >
                  <span>Favoritos ({{ favoritesCount }})</span>
                </button>
              </div>
            </div>

            <div v-if="filteredHistory.length === 0" class="p-6 text-center text-xs" :class="isDark ? 'text-stone-400' : 'text-stone-600'">
              {{
                historyFilter === 'favorites'
                  ? 'Nenhum prompt marcado como favorito. Clique em "Favoritar" acima para guardar suas melhores composições.'
                  : 'Prompts copiados são registrados automaticamente no navegador.'
              }}
            </div>

            <ul
              v-else
              class="max-h-64 overflow-y-auto divide-y"
              :class="isDark ? 'divide-stone-800' : 'divide-stone-200'"
            >
              <li
                v-for="item in filteredHistory"
                :key="item.id"
                class="p-3.5 transition-colors duration-150"
                :class="isDark ? 'hover:bg-stone-800/40' : 'hover:bg-stone-50'"
              >
                <div class="flex items-center justify-between gap-2 mb-1">
                  <div class="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      :aria-label="item.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
                      :aria-pressed="item.isFavorite"
                      @click="toggleFavorite(item.id)"
                      class="shrink-0 rounded p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                      :class="
                        item.isFavorite
                          ? isDark
                            ? 'text-amber-400'
                            : 'text-amber-700'
                          : isDark
                            ? 'text-stone-500 hover:text-amber-400'
                            : 'text-stone-400 hover:text-amber-700'
                      "
                    >
                      <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" :fill="item.isFavorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>

                    <span
                      class="text-xs font-semibold truncate"
                      :class="isDark ? 'text-stone-200' : 'text-stone-900'"
                    >
                      {{ item.title }}
                    </span>

                    <span
                      class="rounded px-1.5 py-0.2 font-mono text-[10px] shrink-0"
                      :class="isDark ? 'bg-stone-800 text-stone-300' : 'bg-stone-200 text-stone-700'"
                    >
                      {{ item.mode === 'quick' ? '7 blocos' : '12 blocos' }}
                    </span>
                  </div>

                  <span class="font-mono text-[10px] tabular-nums shrink-0" :class="isDark ? 'text-stone-400' : 'text-stone-600'">
                    {{ item.createdAt }}
                  </span>
                </div>

                <p
                  class="font-mono text-xs line-clamp-2 leading-relaxed mb-2.5"
                  :class="isDark ? 'text-stone-400' : 'text-stone-600'"
                >
                  {{ item.prompt }}
                </p>

                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    @click="restoreHistoryItem(item)"
                    class="rounded-md border px-2.5 py-1 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                    :class="
                      isDark
                        ? 'border-stone-700 bg-stone-800 text-stone-200 hover:border-amber-500/50 hover:text-amber-300'
                        : 'border-stone-300 bg-stone-100 text-stone-800 hover:border-amber-700 hover:text-amber-900'
                    "
                  >
                    Restaurar variáveis
                  </button>

                  <button
                    type="button"
                    @click="handleCopyHistoryItem(item)"
                    class="rounded-md border px-2.5 py-1 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                    :class="
                      copiedHistoryId === item.id
                        ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-400'
                        : isDark
                          ? 'border-stone-700 text-stone-300 hover:bg-stone-800'
                          : 'border-stone-300 text-stone-700 hover:bg-stone-100'
                    "
                  >
                    {{ copiedHistoryId === item.id ? 'Copiado' : 'Copiar' }}
                  </button>

                  <button
                    type="button"
                    @click="deleteHistoryItem(item.id)"
                    class="ml-auto rounded-md px-2 py-1 text-xs transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    :class="isDark ? 'text-stone-400 hover:text-red-400' : 'text-stone-600 hover:text-red-700'"
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

    <!-- Footer Minimalista (Apenas Links Reais) -->
    <footer
      class="border-t py-6 mt-12"
      :class="isDark ? 'border-stone-800 text-stone-400' : 'border-stone-200 text-stone-600'"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p>ArchiPrompt Studio · Metodologia estruturada em 6 fases para visualização arquitetônica.</p>
        <nav aria-label="Links institucionais" class="flex items-center gap-5">
          <button
            type="button"
            @click="isGuideOpen = true"
            class="hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
          >
            Documentação das 6 Fases
          </button>
          <a
            href="/"
            @click.prevent="emit('navigate-home')"
            class="hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
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
