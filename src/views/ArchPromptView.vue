<script setup lang="ts">
import { ref, computed } from 'vue'
import { CURATED_PRESETS, type FieldAccent } from '../data/archprompt'
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
const highlightPhases = ref(true)
const historyFilter = ref<'all' | 'favorites'>('all')

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

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(finalPrompt.value)
    isCopied.value = true
    saveToHistory(false)
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
}

const handleCopyHistoryItem = async (item: PromptHistoryItem) => {
  try {
    await navigator.clipboard.writeText(item.prompt)
    copiedHistoryId.value = item.id
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
    setTimeout(() => textarea.focus(), 300)
  }
}

const getSegmentHighlightClass = (accent?: FieldAccent) => {
  if (!highlightPhases.value) {
    return isDark.value
      ? 'text-indigo-300 underline decoration-indigo-500/40 underline-offset-4'
      : 'text-indigo-700 underline decoration-indigo-500/40 underline-offset-4'
  }
  const darkMap: Record<string, string> = {
    blue: 'bg-blue-500/15 text-blue-300 border-b border-blue-500/40 px-1 rounded',
    orange: 'bg-orange-500/15 text-orange-300 border-b border-orange-500/40 px-1 rounded',
    emerald: 'bg-emerald-500/15 text-emerald-300 border-b border-emerald-500/40 px-1 rounded',
    cyan: 'bg-cyan-500/15 text-cyan-300 border-b border-cyan-500/40 px-1 rounded',
    amber: 'bg-amber-500/15 text-amber-300 border-b border-amber-500/40 px-1 rounded',
    pink: 'bg-pink-500/15 text-pink-300 border-b border-pink-500/40 px-1 rounded',
    purple: 'bg-purple-500/15 text-purple-300 border-b border-purple-500/40 px-1 rounded',
    indigo: 'bg-indigo-500/15 text-indigo-300 border-b border-indigo-500/40 px-1 rounded'
  }
  const lightMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800 border-b border-blue-300 px-1 rounded',
    orange: 'bg-orange-100 text-orange-800 border-b border-orange-300 px-1 rounded',
    emerald: 'bg-emerald-100 text-emerald-800 border-b border-emerald-300 px-1 rounded',
    cyan: 'bg-cyan-100 text-cyan-800 border-b border-cyan-300 px-1 rounded',
    amber: 'bg-amber-100 text-amber-800 border-b border-amber-300 px-1 rounded',
    pink: 'bg-pink-100 text-pink-800 border-b border-pink-300 px-1 rounded',
    purple: 'bg-purple-100 text-purple-800 border-b border-purple-300 px-1 rounded',
    indigo: 'bg-indigo-100 text-indigo-800 border-b border-indigo-300 px-1 rounded'
  }
  const map = isDark.value ? darkMap : lightMap
  return map[accent || 'indigo'] || map.indigo
}
</script>

<template>
  <div
    class="h-screen w-screen overflow-y-auto font-sans selection:bg-indigo-500/30 transition-colors duration-200"
    :class="isDark ? 'bg-zinc-950 text-zinc-200' : 'bg-zinc-50 text-zinc-800'"
  >
    <div class="max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8 space-y-6">
      <!-- Top Navigation / Studio Bar -->
      <header
        class="border-b pb-6 transition-colors"
        :class="isDark ? 'border-zinc-800/90' : 'border-zinc-200'"
      >
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <!-- Brand & Subtitle -->
          <div>
            <div class="flex items-center gap-3 flex-wrap">
              <a
                href="/"
                @click.prevent="emit('navigate-home')"
                class="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors"
                :class="
                  isDark
                    ? 'border-zinc-800 bg-zinc-900/70 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 shadow-2xs'
                "
                title="Voltar para o portfólio de Lucas Levino"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <span>Lucas Levino</span>
              </a>

              <span
                class="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold"
                :class="
                  isDark
                    ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                "
              >
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Template Mode: {{ mode === 'quick' ? 'Strict (7 Blocos)' : 'Granular (12 Blocos)' }}
              </span>
            </div>

            <h1
              class="mt-3 text-2xl md:text-4xl font-bold tracking-tight flex items-center gap-3"
              :class="isDark ? 'text-white' : 'text-zinc-900'"
            >
              <!-- Sparkles Icon -->
              <svg class="text-indigo-500 shrink-0" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                <path d="M20 3v4" /><path d="M22 5h-4" /><path d="M4 17v2" /><path d="M5 18H3" />
              </svg>
              <span>ArchiPrompt Studio</span>
            </h1>
            <p
              class="mt-1.5 max-w-2xl text-sm md:text-base"
              :class="isDark ? 'text-zinc-400' : 'text-zinc-600'"
            >
              Construa prompts arquitetônicos fotorrealistas seguindo a metodologia de 6 fases (do Macro ao Micro). Combine tags em inglês, selecione frases curadas ou personalize livremente.
            </p>
          </div>

          <!-- Right Controls: Mode Switcher + Guide Button + Theme Toggle -->
          <div class="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            <!-- Seletor de Modo: Rápido vs Avançado -->
            <div
              class="inline-flex rounded-xl border p-1"
              :class="
                isDark
                  ? 'bg-zinc-900 border-zinc-800'
                  : 'bg-zinc-200/70 border-zinc-300/80'
              "
            >
              <button
                type="button"
                @click="switchMode('quick')"
                class="rounded-lg px-3 py-1.5 text-xs font-bold transition-all"
                :class="
                  mode === 'quick'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isDark
                      ? 'text-zinc-400 hover:text-zinc-200'
                      : 'text-zinc-600 hover:text-zinc-900'
                "
              >
                ⚡ Rápido (7)
              </button>
              <button
                type="button"
                @click="switchMode('advanced')"
                class="rounded-lg px-3 py-1.5 text-xs font-bold transition-all"
                :class="
                  mode === 'advanced'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isDark
                      ? 'text-zinc-400 hover:text-zinc-200'
                      : 'text-zinc-600 hover:text-zinc-900'
                "
              >
                🎛️ Avançado (12)
              </button>
            </div>

            <!-- Botão Guia de Anatomia -->
            <button
              type="button"
              @click="isGuideOpen = true"
              class="inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors"
              :class="
                isDark
                  ? 'bg-zinc-900 border-zinc-700/80 text-zinc-200 hover:bg-zinc-800 hover:border-indigo-500/50'
                  : 'bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-100 shadow-2xs'
              "
            >
              <svg class="text-indigo-400" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span>Guia de Anatomia (6 Fases)</span>
            </button>

            <!-- Toggle Dark / Light Mode -->
            <button
              type="button"
              @click="toggleTheme"
              class="inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors"
              :class="
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-amber-400'
                  : 'bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-100 hover:text-indigo-600 shadow-2xs'
              "
              :title="isDark ? 'Mudar para Modo Claro' : 'Mudar para Modo Dark Studio'"
              aria-label="Alternar tema claro ou escuro"
            >
              <!-- Sun icon when dark -->
              <svg v-if="isDark" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" /><path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" /><path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
              </svg>
              <!-- Moon icon when light -->
              <svg v-else viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Barra de Ações Rápidas & Presets Curados -->
        <div
          class="mt-5 flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-2xl border p-3.5"
          :class="
            isDark
              ? 'bg-zinc-900/50 border-zinc-800/80'
              : 'bg-white border-zinc-200/90 shadow-2xs'
          "
        >
          <!-- Presets Curados -->
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="text-xs font-bold uppercase tracking-wider mr-1"
              :class="isDark ? 'text-zinc-400' : 'text-zinc-500'"
            >
              Cenários Prontos:
            </span>
            <button
              v-for="preset in CURATED_PRESETS"
              :key="preset.id"
              type="button"
              @click="loadPreset(preset)"
              class="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all"
              :class="
                activePresetId === preset.id
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                  : isDark
                    ? 'bg-zinc-950/80 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100'
              "
              :title="preset.description"
            >
              <span>{{ preset.name }}</span>
              <span
                class="rounded px-1.5 py-0.2 text-[10px]"
                :class="
                  activePresetId === preset.id
                    ? 'bg-white/20 text-white'
                    : isDark
                      ? 'bg-zinc-800 text-zinc-400'
                      : 'bg-zinc-200 text-zinc-600'
                "
              >
                {{ preset.badge }}
              </span>
            </button>
          </div>

          <!-- Botões de Ação Rápida: Exemplo, Aleatório, Limpar -->
          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              @click="loadReferenceExample"
              class="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors"
              :class="
                isDark
                  ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20'
                  : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              "
              title="Preencher com o exemplo oficial do Guia de Prompts"
            >
              <span>⭐ Exemplo do Guia</span>
            </button>

            <button
              type="button"
              @click="surpriseMe"
              class="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors"
              :class="
                isDark
                  ? 'border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20'
                  : 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100'
              "
              title="Gerar uma combinação arquitetônica aleatória em todos os campos"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="12" height="12" x="2" y="10" rx="2" ry="2" />
                <path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6" />
                <path d="M6 18h.01" /><path d="M10 14h.01" /><path d="M15 6h.01" /><path d="M18 9h.01" />
              </svg>
              <span>Surpreenda-me</span>
            </button>

            <button
              type="button"
              @click="clearAll"
              class="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors"
              :class="
                isDark
                  ? 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-red-500/40 hover:text-red-400'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-red-300 hover:text-red-600'
              "
              title="Limpar todos os campos"
            >
              <span>Limpar Tudo</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Main Grid: Form Builder (Left) + Preview & History (Right) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Coluna Esquerda: Construtor de Variáveis -->
        <div class="lg:col-span-7 space-y-4">
          <!-- Barra de Progresso das Fases -->
          <div
            class="flex items-center justify-between rounded-2xl border px-4 py-3"
            :class="
              isDark
                ? 'bg-zinc-900/40 border-zinc-800'
                : 'bg-white border-zinc-200 shadow-2xs'
            "
          >
            <div class="flex items-center gap-3">
              <span
                class="text-xs font-bold uppercase tracking-wider"
                :class="isDark ? 'text-zinc-300' : 'text-zinc-700'"
              >
                Progresso da Estrutura
              </span>
              <span
                class="rounded-md px-2 py-0.5 text-xs font-semibold"
                :class="
                  completionStats.isReady
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                "
              >
                {{ completionStats.filled }} / {{ completionStats.total }} blocos preenchidos
              </span>
            </div>

            <div class="w-32 md:w-44 h-2 rounded-full overflow-hidden" :class="isDark ? 'bg-zinc-800' : 'bg-zinc-200'">
              <div
                class="h-full transition-all duration-300 rounded-full"
                :class="completionStats.isReady ? 'bg-emerald-500' : 'bg-indigo-500'"
                :style="{ width: `${completionStats.percentage}%` }"
              ></div>
            </div>
          </div>

          <!-- Lista de Campos Dinâmicos -->
          <div class="space-y-4">
            <ArchPromptField
              v-for="field in currentFields"
              :key="`${mode}-${field.id}`"
              :config="field"
              :model-value="getFieldValue(field.id)"
              :is-dark="isDark"
              :is-chip-active="(chipVal: string) => isChipSelected(field.id, chipVal)"
              @update:model-value="(val: string) => setFieldValue(field.id, val)"
              @toggle-chip="(chipVal: string) => toggleChip(field.id, chipVal)"
            />
          </div>
        </div>

        <!-- Coluna Direita: Visualização em Tempo Real, Edição & Histórico -->
        <div class="lg:col-span-5 lg:sticky lg:top-6 space-y-6">
          <!-- Card Principal de Preview -->
          <div
            class="rounded-2xl border shadow-2xl overflow-hidden flex flex-col"
            :class="
              isDark
                ? 'bg-zinc-900 border-zinc-700/60'
                : 'bg-white border-zinc-200'
            "
          >
            <!-- Header do Preview -->
            <div
              class="border-b px-5 py-3.5 flex flex-wrap items-center justify-between gap-2"
              :class="
                isDark
                  ? 'bg-zinc-800/50 border-zinc-700/50'
                  : 'bg-zinc-50 border-zinc-200'
              "
            >
              <div class="flex items-center gap-2.5">
                <h2
                  class="text-xs font-bold uppercase tracking-wider"
                  :class="isDark ? 'text-zinc-200' : 'text-zinc-800'"
                >
                  Prompt Gerado
                </h2>
                <span
                  v-if="completionStats.isReady"
                  class="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-semibold text-emerald-400"
                >
                  ✓ Pronto
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1 rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[11px] font-semibold text-amber-400"
                >
                  {{ completionStats.pending }} pendente{{ completionStats.pending > 1 ? 's' : '' }}
                </span>
              </div>

              <!-- Controles do Preview: Destacar Fases e Edição Direta -->
              <div class="flex items-center gap-1.5">
                <button
                  v-if="!isManualEdit"
                  type="button"
                  @click="highlightPhases = !highlightPhases"
                  class="rounded-lg border px-2 py-1 text-[11px] font-medium transition-colors"
                  :class="
                    highlightPhases
                      ? 'border-indigo-500/40 bg-indigo-500/15 text-indigo-300'
                      : isDark
                        ? 'border-zinc-700 text-zinc-400 hover:text-zinc-200'
                        : 'border-zinc-300 text-zinc-600 hover:text-zinc-900'
                  "
                  title="Colorir cada variável de acordo com a fase do Guia"
                >
                  🎨 Cores por Fase
                </button>

                <button
                  v-if="!isManualEdit"
                  type="button"
                  @click="enableManualEdit"
                  class="rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors"
                  :class="
                    isDark
                      ? 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                      : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100'
                  "
                  title="Editar manualmente o texto final do prompt"
                >
                  ✏️ Editar Texto
                </button>

                <button
                  v-else
                  type="button"
                  @click="resetManualEdit"
                  class="rounded-lg border border-amber-500/40 bg-amber-500/15 px-2.5 py-1 text-[11px] font-semibold text-amber-300 hover:bg-amber-500/25 transition-colors"
                  title="Voltar à sincronização automática com o formulário"
                >
                  🔄 Sincronizar Template
                </button>
              </div>
            </div>

            <!-- Corpo do Prompt Final -->
            <div class="p-6 relative flex-grow min-h-[260px] flex flex-col justify-between">
              <!-- Marca d'água decorativa (QuoteIcon do prompt_generator.jsx) -->
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                class="pointer-events-none absolute top-4 right-4 w-24 h-24 transform rotate-12 opacity-10"
                :class="isDark ? 'text-zinc-500' : 'text-zinc-400'"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>

              <!-- Modo Edição Manual Direta -->
              <div v-if="isManualEdit" class="relative z-10 space-y-2">
                <label class="block text-xs font-semibold text-amber-400">
                  Modo de Edição Livre Ativo — Edite o texto final diretamente abaixo:
                </label>
                <textarea
                  v-model="manualPromptText"
                  rows="8"
                  class="w-full rounded-xl border p-3.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  :class="
                    isDark
                      ? 'bg-zinc-950/90 border-zinc-700 text-zinc-100'
                      : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                  "
                />
              </div>

              <!-- Modo Visualização Dinâmica Interativa -->
              <p
                v-else
                class="relative z-10 text-base leading-relaxed whitespace-pre-wrap font-medium"
                :class="isDark ? 'text-zinc-200' : 'text-zinc-800'"
              >
                <template v-for="(seg, idx) in promptSegments" :key="idx">
                  <span v-if="seg.type === 'static'">{{ seg.text }}</span>
                  <button
                    v-else-if="seg.isPlaceholder"
                    type="button"
                    @click="scrollToField(seg.fieldId)"
                    class="inline-block text-amber-500/90 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded mx-0.5 animate-pulse hover:bg-amber-500/20 transition-colors text-sm font-semibold"
                    :title="`Clique para preencher: ${seg.label}`"
                  >
                    {{ seg.text }}
                  </button>
                  <span
                    v-else
                    @click="scrollToField(seg.fieldId)"
                    class="cursor-pointer transition-colors"
                    :class="getSegmentHighlightClass(seg.accent)"
                    :title="`Fase ${seg.phase} (${seg.label}) — Clique para editar este bloco`"
                  >
                    {{ seg.text }}
                  </span>
                </template>
              </p>

              <!-- Rodapé de Metadados do Preview -->
              <div
                class="relative z-10 mt-6 pt-3 border-t flex items-center justify-between text-[11px]"
                :class="
                  isDark
                    ? 'border-zinc-800/80 text-zinc-500'
                    : 'border-zinc-200 text-zinc-500'
                "
              >
                <span>{{ wordCount }} palavras · {{ finalPrompt.length }} caracteres</span>
                <span>Clique em qualquer bloco colorido para focar</span>
              </div>
            </div>

            <!-- Botões de Ação (Copiar & Favoritar) -->
            <div
              class="p-4 border-t flex items-center gap-2.5"
              :class="
                isDark
                  ? 'bg-zinc-950/60 border-zinc-800'
                  : 'bg-zinc-50 border-zinc-200'
              "
            >
              <button
                type="button"
                @click="handleCopy"
                class="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold transition-all duration-200"
                :class="
                  isCopied
                    ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)]'
                    : 'bg-indigo-600 text-white shadow-[0_0_20px_-5px_rgba(79,70,229,0.4)] hover:bg-indigo-500 hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.6)]'
                "
              >
                <!-- Check Icon -->
                <svg v-if="isCopied" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <!-- Copy Icon -->
                <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                <span>{{ isCopied ? 'Prompt Copiado!' : 'Copiar para Uso' }}</span>
              </button>

              <button
                type="button"
                @click="handleSaveFavorite"
                class="flex items-center justify-center gap-1.5 py-3.5 px-4 rounded-xl border font-semibold text-xs transition-colors"
                :class="
                  isDark
                    ? 'border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-amber-500/50 hover:text-amber-400'
                    : 'border-zinc-300 bg-white text-zinc-700 hover:border-amber-400 hover:text-amber-600'
                "
                title="Salvar nos Favoritos"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span class="hidden sm:inline">Favoritar</span>
              </button>
            </div>
          </div>

          <!-- Painel de Histórico Local & Favoritos -->
          <div
            class="rounded-2xl border overflow-hidden"
            :class="
              isDark
                ? 'bg-zinc-900/60 border-zinc-800'
                : 'bg-white border-zinc-200 shadow-xs'
            "
          >
            <div
              class="flex items-center justify-between border-b px-4 py-3"
              :class="isDark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-zinc-50'"
            >
              <div class="flex items-center gap-2">
                <svg class="text-indigo-400" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M12 7v5l4 2" />
                </svg>
                <h3
                  class="text-xs font-bold uppercase tracking-wider"
                  :class="isDark ? 'text-zinc-200' : 'text-zinc-800'"
                >
                  Histórico & Favoritos
                </h3>
              </div>

              <div class="flex items-center gap-1">
                <button
                  type="button"
                  @click="historyFilter = 'all'"
                  class="rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors"
                  :class="
                    historyFilter === 'all'
                      ? 'bg-indigo-600 text-white'
                      : isDark
                        ? 'text-zinc-400 hover:text-zinc-200'
                        : 'text-zinc-600 hover:text-zinc-900'
                  "
                >
                  Recentes ({{ history.length }})
                </button>
                <button
                  type="button"
                  @click="historyFilter = 'favorites'"
                  class="rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors"
                  :class="
                    historyFilter === 'favorites'
                      ? 'bg-amber-500 text-zinc-950'
                      : isDark
                        ? 'text-zinc-400 hover:text-zinc-200'
                        : 'text-zinc-600 hover:text-zinc-900'
                  "
                >
                  ★ Favoritos ({{ favoritesCount }})
                </button>
              </div>
            </div>

            <div class="max-h-72 overflow-y-auto divide-y" :class="isDark ? 'divide-zinc-800/70' : 'divide-zinc-100'">
              <div
                v-if="filteredHistory.length === 0"
                class="p-6 text-center text-xs"
                :class="isDark ? 'text-zinc-500' : 'text-zinc-400'"
              >
                {{
                  historyFilter === 'favorites'
                    ? 'Nenhum prompt favoritado ainda. Clique em "Favoritar" para salvar seus melhores prompts.'
                    : 'Seus prompts copiados ou favoritados aparecerão salvos aqui automaticamente.'
                }}
              </div>

              <div
                v-for="item in filteredHistory"
                :key="item.id"
                class="p-3.5 transition-colors"
                :class="isDark ? 'hover:bg-zinc-800/40' : 'hover:bg-zinc-50'"
              >
                <div class="flex items-center justify-between gap-2 mb-1">
                  <div class="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      @click="toggleFavorite(item.id)"
                      class="shrink-0 transition-colors"
                      :class="item.isFavorite ? 'text-amber-400' : 'text-zinc-500 hover:text-amber-400'"
                      title="Alternar favorito"
                    >
                      ★
                    </button>
                    <span
                      class="text-xs font-bold truncate"
                      :class="isDark ? 'text-zinc-200' : 'text-zinc-800'"
                    >
                      {{ item.title }}
                    </span>
                    <span
                      class="rounded px-1.5 py-0.2 text-[10px] font-medium shrink-0"
                      :class="isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-600'"
                    >
                      {{ item.mode === 'quick' ? '7 blocos' : '12 blocos' }}
                    </span>
                  </div>
                  <span class="text-[10px] shrink-0" :class="isDark ? 'text-zinc-500' : 'text-zinc-400'">
                    {{ item.createdAt }}
                  </span>
                </div>

                <p
                  class="text-xs line-clamp-2 leading-relaxed mb-2.5"
                  :class="isDark ? 'text-zinc-400' : 'text-zinc-600'"
                >
                  {{ item.prompt }}
                </p>

                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    @click="restoreHistoryItem(item)"
                    class="rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors"
                    :class="
                      isDark
                        ? 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:border-indigo-500 hover:text-indigo-300'
                        : 'border-zinc-200 bg-zinc-100 text-zinc-700 hover:border-indigo-300 hover:text-indigo-700'
                    "
                  >
                    Carregar no Studio
                  </button>
                  <button
                    type="button"
                    @click="handleCopyHistoryItem(item)"
                    class="rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors"
                    :class="
                      copiedHistoryId === item.id
                        ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                        : isDark
                          ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                          : 'border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                    "
                  >
                    {{ copiedHistoryId === item.id ? '✓ Copiado' : 'Copiar' }}
                  </button>
                  <button
                    type="button"
                    @click="deleteHistoryItem(item.id)"
                    class="ml-auto text-[11px] text-zinc-500 hover:text-red-400 transition-colors px-1.5 py-1"
                    title="Remover do histórico"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal / Drawer do Guia de Engenharia de Prompts -->
    <ArchPromptGuideModal
      :is-open="isGuideOpen"
      :is-dark="isDark"
      @close="isGuideOpen = false"
      @apply-reference="loadReferenceExample"
    />
  </div>
</template>
