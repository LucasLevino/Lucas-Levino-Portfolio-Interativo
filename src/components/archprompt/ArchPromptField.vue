<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ArchFieldConfig } from '../../data/archprompt'

const props = defineProps<{
  config: ArchFieldConfig
  modelValue: string
  isDark: boolean
  isChipActive: (chipValue: string) => boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'toggle-chip', chipValue: string): void
}>()

const isOpen = ref(false)
const isFocused = ref(false)
const showAllPresets = ref(false)

const filteredOptions = computed(() => {
  const query = props.modelValue.trim().toLowerCase()
  if (!query || showAllPresets.value) {
    return props.config.options
  }
  const matches = props.config.options.filter(
    opt =>
      opt.value.toLowerCase().includes(query) ||
      opt.labelPt.toLowerCase().includes(query)
  )
  return matches.length > 0 ? matches : props.config.options
})

const handleTextareaInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement
  showAllPresets.value = false
  emit('update:modelValue', target.value)
}

const toggleDropdown = () => {
  showAllPresets.value = true
  isOpen.value = !isOpen.value
}

const selectPreset = (val: string) => {
  emit('update:modelValue', val)
  isOpen.value = false
}

const clearField = () => {
  emit('update:modelValue', '')
}

const accentStyles = computed(() => {
  const map: Record<string, { icon: string; badge: string; chipActive: string }> = {
    blue: {
      icon: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      badge: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      chipActive: 'bg-blue-500/20 border-blue-500 text-blue-300 dark-chip-active'
    },
    orange: {
      icon: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
      badge: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
      chipActive: 'bg-orange-500/20 border-orange-500 text-orange-300'
    },
    emerald: {
      icon: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      chipActive: 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
    },
    cyan: {
      icon: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      badge: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      chipActive: 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
    },
    amber: {
      icon: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      chipActive: 'bg-amber-500/20 border-amber-500 text-amber-300'
    },
    pink: {
      icon: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
      badge: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
      chipActive: 'bg-pink-500/20 border-pink-500 text-pink-300'
    },
    purple: {
      icon: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      badge: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      chipActive: 'bg-purple-500/20 border-purple-500 text-purple-300'
    },
    indigo: {
      icon: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      badge: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      chipActive: 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
    }
  }
  return map[props.config.accent] || map.indigo
})
</script>

<template>
  <div
    :id="`arch-field-${config.id}`"
    class="rounded-2xl border p-4 md:p-5 transition-all duration-200"
    :class="[
      isDark
        ? 'bg-zinc-900/50 border-zinc-800/90 hover:border-zinc-700/80'
        : 'bg-white border-zinc-200/90 hover:border-zinc-300 shadow-xs'
    ]"
  >
    <!-- Header do Campo -->
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-start gap-3">
        <!-- Ícone da Fase -->
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border mt-0.5"
          :class="accentStyles.icon"
        >
          <!-- Home -->
          <svg v-if="config.icon === 'home'" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <!-- Building -->
          <svg v-else-if="config.icon === 'building'" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
            <path d="M9 22v-4h6v4" />
            <path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" />
            <path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" />
            <path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" />
          </svg>
          <!-- Compass -->
          <svg v-else-if="config.icon === 'compass'" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
          <!-- Box -->
          <svg v-else-if="config.icon === 'box'" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
          </svg>
          <!-- Trees -->
          <svg v-else-if="config.icon === 'trees'" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z" />
            <path d="M7 16v6" />
            <path d="M13 19v3" />
            <path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5" />
          </svg>
          <!-- Layers -->
          <svg v-else-if="config.icon === 'layers'" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
            <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
            <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
          </svg>
          <!-- Sun -->
          <svg v-else-if="config.icon === 'sun'" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" /><path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" /><path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
          </svg>
          <!-- Palette -->
          <svg v-else-if="config.icon === 'palette'" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
          </svg>
          <!-- Ratio -->
          <svg v-else-if="config.icon === 'ratio'" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M6 9h2v2" /><path d="M18 15h-2v-2" />
          </svg>
          <!-- Sliders -->
          <svg v-else-if="config.icon === 'sliders'" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" x2="4" y1="21" y2="14" /><line x1="4" x2="4" y1="10" y2="3" />
            <line x1="12" x2="12" y1="21" y2="12" /><line x1="12" x2="12" y1="8" y2="3" />
            <line x1="20" x2="20" y1="21" y2="16" /><line x1="20" x2="20" y1="12" y2="3" />
            <line x1="2" x2="6" y1="14" y2="14" /><line x1="10" x2="14" y1="8" y2="8" />
            <line x1="18" x2="22" y1="16" y2="16" />
          </svg>
          <!-- Sparkles / Settings Default -->
          <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v4" /><path d="m16.2 7.8 2.9-2.9" /><path d="M18 12h4" />
            <path d="m16.2 16.2 2.9 2.9" /><path d="M12 18v4" /><path d="m4.9 19.1 2.9-2.9" />
            <path d="M2 12h4" /><path d="m4.9 4.9 2.9 2.9" />
          </svg>
        </div>

        <div>
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              :class="accentStyles.badge"
            >
              {{ config.phaseTitle }}
            </span>
            <label
              :for="`textarea-${config.id}`"
              class="text-sm font-bold uppercase tracking-wider"
              :class="isDark ? 'text-zinc-100' : 'text-zinc-900'"
            >
              {{ config.label }}
            </label>
            <span
              class="text-xs font-medium"
              :class="isDark ? 'text-zinc-400' : 'text-zinc-500'"
            >
              — {{ config.labelPt }}
            </span>
          </div>
          <p
            class="mt-1 text-xs leading-relaxed"
            :class="isDark ? 'text-zinc-400' : 'text-zinc-600'"
          >
            {{ config.description }}
          </p>
        </div>
      </div>

      <!-- Indicador Preenchido / Limpar -->
      <div class="flex items-center gap-1.5 shrink-0">
        <button
          v-if="modelValue.trim()"
          type="button"
          @click="clearField"
          class="rounded-lg px-2 py-1 text-xs font-medium transition-colors"
          :class="
            isDark
              ? 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800'
          "
          title="Limpar este campo"
        >
          Limpar
        </button>
        <span
          v-if="modelValue.trim()"
          class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400"
          title="Campo preenchido"
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      </div>
    </div>

    <!-- Dica rápida do Guia -->
    <div
      class="mt-3 flex items-center gap-2 rounded-lg px-3 py-1.5 text-[11px]"
      :class="
        isDark
          ? 'bg-zinc-950/60 text-zinc-400 border border-zinc-800/70'
          : 'bg-zinc-50 text-zinc-600 border border-zinc-200/70'
      "
    >
      <span class="text-indigo-400 font-semibold shrink-0">💡 Dica do Guia:</span>
      <span>{{ config.guideTip }}</span>
    </div>

    <!-- Barra de Chips / Tags Combináveis -->
    <div class="mt-3">
      <div class="flex items-center justify-between mb-1.5">
        <span
          class="text-[11px] font-semibold uppercase tracking-wider"
          :class="isDark ? 'text-zinc-500' : 'text-zinc-500'"
        >
          {{ config.singleSelectChip ? 'Seleção Rápida (1 clique):' : 'Tags Combináveis (clique para adicionar/remover):' }}
        </span>
      </div>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="chip in config.chips"
          :key="chip.value"
          type="button"
          @click="emit('toggle-chip', chip.value)"
          class="group inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all duration-150"
          :class="
            isChipActive(chip.value)
              ? isDark
                ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200 shadow-xs'
                : 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
              : isDark
                ? 'bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100'
          "
          :title="`Inserir em inglês: ${chip.value}`"
        >
          <svg
            v-if="isChipActive(chip.value)"
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="shrink-0"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span v-else class="text-[10px] opacity-50 group-hover:opacity-100">+</span>
          <span>{{ chip.label }}</span>
        </button>
      </div>
    </div>

    <!-- Textarea com Autocomplete de Frases Completas -->
    <div class="relative mt-3 w-full">
      <div
        class="relative rounded-xl border transition-all duration-200"
        :class="[
          isDark ? 'bg-zinc-950/70' : 'bg-zinc-50/70',
          isFocused
            ? 'border-indigo-500 ring-2 ring-indigo-500/20'
            : isDark
              ? 'border-zinc-800'
              : 'border-zinc-300'
        ]"
      >
        <textarea
          :id="`textarea-${config.id}`"
          :value="modelValue"
          @input="handleTextareaInput"
          @focus="isFocused = true"
          @blur="isFocused = false"
          :placeholder="config.placeholder"
          rows="2"
          class="w-full min-h-[58px] p-3 pr-24 text-sm bg-transparent focus:outline-none resize-y leading-relaxed"
          :class="
            isDark
              ? 'text-zinc-200 placeholder:text-zinc-600'
              : 'text-zinc-800 placeholder:text-zinc-400'
          "
        />

        <!-- Botão de abrir Presets de Frases -->
        <button
          type="button"
          @click="toggleDropdown"
          class="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-medium transition-colors"
          :class="
            isDark
              ? 'bg-zinc-900 border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 hover:text-white'
              : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 shadow-2xs'
          "
          title="Ver frases prontas em inglês"
        >
          <span>Frases</span>
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="transform transition-transform duration-200"
            :class="isOpen ? 'rotate-180' : ''"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      <!-- Dropdown de Sugestões de Frases Completas -->
      <div v-if="isOpen">
        <div class="fixed inset-0 z-30" @click="isOpen = false"></div>

        <div
          class="absolute z-40 w-full mt-2 rounded-xl border shadow-2xl max-h-64 overflow-y-auto"
          :class="
            isDark
              ? 'bg-zinc-900 border-zinc-700 text-zinc-200'
              : 'bg-white border-zinc-200 text-zinc-800'
          "
        >
          <div
            class="sticky top-0 z-10 flex items-center justify-between px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider border-b"
            :class="
              isDark
                ? 'bg-zinc-900/95 border-zinc-800 text-zinc-400'
                : 'bg-zinc-50/95 border-zinc-200 text-zinc-500'
            "
          >
            <span>Sugestões de Frases Completas (Inglês)</span>
            <button
              type="button"
              @click="isOpen = false"
              class="text-xs hover:underline"
            >
              Fechar
            </button>
          </div>

          <ul v-if="filteredOptions.length > 0" class="divide-y" :class="isDark ? 'divide-zinc-800/60' : 'divide-zinc-100'">
            <li
              v-for="(option, index) in filteredOptions"
              :key="index"
              @click="selectPreset(option.value)"
              class="px-4 py-2.5 cursor-pointer transition-colors group"
              :class="
                isDark
                  ? 'hover:bg-indigo-600/20'
                  : 'hover:bg-indigo-50'
              "
            >
              <div
                class="text-sm font-medium group-hover:text-indigo-400 transition-colors"
                :class="isDark ? 'text-zinc-200' : 'text-zinc-900'"
              >
                {{ option.value }}
              </div>
              <div
                class="text-xs mt-0.5"
                :class="isDark ? 'text-zinc-400' : 'text-zinc-500'"
              >
                🇧🇷 {{ option.labelPt }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
