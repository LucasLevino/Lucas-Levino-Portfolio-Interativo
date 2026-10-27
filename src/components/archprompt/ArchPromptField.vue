<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ArchFieldConfig } from '../../data/archprompt'

const props = defineProps<{
  config: ArchFieldConfig
  modelValue: string
  isDark: boolean
  isFeatured?: boolean
  isChipActive: (chipValue: string) => boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'toggle-chip', chipValue: string): void
}>()

const isOpen = ref(false)
const isFocused = ref(false)
const showAllPresets = ref(false)

const listboxId = computed(() => `preset-listbox-${props.config.id}`)
const phaseNumberFormatted = computed(() => `0${props.config.phase}`)
const isFilled = computed(() => Boolean(props.modelValue.trim()))

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
</script>

<template>
  <article
    :id="`arch-field-${config.id}`"
    class="rounded-lg border transition-colors duration-150"
    :class="[
      isFeatured ? 'p-5 md:p-6' : 'p-4 md:p-5',
      isDark
        ? isFeatured
          ? 'bg-stone-900 border-amber-500/40 shadow-sm'
          : 'bg-stone-900/70 border-stone-800 hover:border-stone-700'
        : isFeatured
          ? 'bg-white border-amber-600/40 shadow-sm'
          : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
    ]"
    @keydown.escape="isOpen = false"
  >
    <!-- Header do Bloco -->
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-start gap-3">
        <!-- Índice Técnico Monocromático (Monospace + Ícone SVG sem caixa colorida arco-íris) -->
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border font-mono text-xs font-medium tabular-nums mt-0.5"
          :class="
            isFilled
              ? isDark
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                : 'border-amber-600/40 bg-amber-50 text-amber-800'
              : isDark
                ? 'border-stone-800 bg-stone-950 text-stone-400'
                : 'border-stone-200 bg-stone-100 text-stone-600'
          "
          aria-hidden="true"
        >
          {{ phaseNumberFormatted }}
        </div>

        <div>
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide"
              :class="
                isDark
                  ? 'border-stone-800 bg-stone-950 text-stone-300'
                  : 'border-stone-200 bg-stone-100 text-stone-700'
              "
            >
              {{ config.phaseTitle }}
            </span>

            <label
              :for="`textarea-${config.id}`"
              class="font-display font-semibold tracking-tight"
              :class="[
                isFeatured ? 'text-base md:text-lg' : 'text-sm md:text-base',
                isDark ? 'text-stone-100' : 'text-stone-900'
              ]"
            >
              {{ config.label }}
            </label>

            <span
              class="text-xs font-medium"
              :class="isDark ? 'text-stone-400' : 'text-stone-600'"
            >
              · {{ config.labelPt }}
            </span>
          </div>

          <p
            class="mt-1 text-xs md:text-sm leading-relaxed max-w-prose"
            :class="isDark ? 'text-stone-300' : 'text-stone-700'"
          >
            {{ config.description }}
          </p>
        </div>
      </div>

      <!-- Status / Ação Limpar -->
      <div class="flex items-center gap-2 shrink-0">
        <button
          v-if="isFilled"
          type="button"
          @click="clearField"
          class="rounded-md px-2 py-1 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          :class="
            isDark
              ? 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          "
        >
          Limpar
        </button>

        <span
          v-if="isFilled"
          class="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[11px] font-medium"
          :class="
            isDark
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-emerald-600/30 bg-emerald-50 text-emerald-800'
          "
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>OK</span>
        </span>
      </div>
    </div>

    <!-- Nota Metodológica do Guia (Sem Emoji) -->
    <div
      class="mt-3 flex items-start gap-2 rounded-md border px-3 py-2 text-xs leading-relaxed"
      :class="
        isDark
          ? 'bg-stone-950/80 border-stone-800/90 text-stone-300'
          : 'bg-stone-50 border-stone-200/90 text-stone-700'
      "
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="15"
        height="15"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="mt-0.5 shrink-0"
        :class="isDark ? 'text-amber-400' : 'text-amber-700'"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
      <span>
        <strong class="font-semibold" :class="isDark ? 'text-stone-200' : 'text-stone-900'">Diretriz técnica:</strong>
        {{ config.guideTip }}
      </span>
    </div>

    <!-- Barra de Tags / Chips Combináveis -->
    <div class="mt-3.5" role="group" :aria-label="`Sugestões rápidas para ${config.label}`">
      <div class="flex items-center justify-between mb-1.5">
        <span
          class="text-xs font-medium"
          :class="isDark ? 'text-stone-400' : 'text-stone-600'"
        >
          {{
            config.singleSelectChip
              ? 'Seleção direta (1 opção):'
              : 'Termos técnicos combináveis (clique para adicionar ou remover):'
          }}
        </span>
      </div>

      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="chip in config.chips"
          :key="chip.value"
          type="button"
          :aria-pressed="isChipActive(chip.value)"
          @click="emit('toggle-chip', chip.value)"
          class="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          :class="
            isChipActive(chip.value)
              ? isDark
                ? 'bg-amber-500/15 border-amber-500 text-amber-200'
                : 'bg-amber-700 border-amber-700 text-white'
              : isDark
                ? 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-600 hover:text-stone-100'
                : 'bg-stone-50 border-stone-300/80 text-stone-700 hover:border-stone-400 hover:bg-stone-100'
          "
          :title="`Termo em inglês: ${chip.value}`"
        >
          <svg
            v-if="isChipActive(chip.value)"
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="shrink-0"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <svg
            v-else
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="11"
            height="11"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="shrink-0 opacity-60"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          <span>{{ chip.label }}</span>
        </button>
      </div>
    </div>

    <!-- Textarea com Combobox de Frases Curadas -->
    <div class="relative mt-3.5 w-full">
      <div
        class="relative rounded-md border transition-colors duration-150"
        :class="[
          isDark ? 'bg-stone-950' : 'bg-stone-50/60',
          isFocused
            ? isDark
              ? 'border-amber-500 ring-1 ring-amber-500/30'
              : 'border-amber-700 ring-1 ring-amber-700/30'
            : isDark
              ? 'border-stone-800'
              : 'border-stone-300'
        ]"
      >
        <textarea
          :id="`textarea-${config.id}`"
          :value="modelValue"
          @input="handleTextareaInput"
          @focus="isFocused = true"
          @blur="isFocused = false"
          :placeholder="config.placeholder"
          :aria-describedby="`desc-${config.id}`"
          rows="2"
          class="w-full min-h-[58px] p-3 pr-28 text-sm bg-transparent focus:outline-none resize-y leading-relaxed font-mono"
          :class="
            isDark
              ? 'text-stone-100 placeholder:text-stone-500'
              : 'text-stone-900 placeholder:text-stone-400'
          "
        />

        <!-- Botão de abrir Presets de Frases Completas -->
        <button
          type="button"
          :aria-expanded="isOpen"
          :aria-controls="listboxId"
          aria-haspopup="listbox"
          @click="toggleDropdown"
          class="absolute right-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          :class="
            isDark
              ? 'bg-stone-900 border-stone-700 text-stone-200 hover:bg-stone-800 hover:text-white'
              : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100 hover:text-stone-900 shadow-2xs'
          "
        >
          <span>Frases</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="transform transition-transform duration-150"
            :class="isOpen ? 'rotate-180' : ''"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      <span :id="`desc-${config.id}`" class="sr-only">
        {{ config.description }} Digite em inglês ou selecione tags e frases prontas.
      </span>

      <!-- Dropdown de Sugestões (WAI-ARIA Listbox) -->
      <div v-if="isOpen">
        <div class="fixed inset-0 z-30" @click="isOpen = false" aria-hidden="true"></div>

        <div
          class="absolute z-40 w-full mt-1.5 rounded-lg border shadow-lg max-h-64 overflow-y-auto"
          :class="
            isDark
              ? 'bg-stone-900 border-stone-700 text-stone-100'
              : 'bg-white border-stone-300 text-stone-900'
          "
        >
          <div
            class="sticky top-0 z-10 flex items-center justify-between px-3.5 py-2 text-xs font-medium border-b"
            :class="
              isDark
                ? 'bg-stone-900 border-stone-800 text-stone-400'
                : 'bg-stone-50 border-stone-200 text-stone-600'
            "
          >
            <span>Frases técnicas prontas (Inglês + Tradução PT)</span>
            <button
              type="button"
              @click="isOpen = false"
              class="rounded px-1.5 py-0.5 text-xs font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              Fechar (Esc)
            </button>
          </div>

          <ul
            :id="listboxId"
            role="listbox"
            :aria-label="`Frases prontas para ${config.label}`"
            class="divide-y"
            :class="isDark ? 'divide-stone-800' : 'divide-stone-200'"
          >
            <li
              v-for="(option, index) in filteredOptions"
              :key="index"
              role="option"
              tabindex="0"
              :aria-selected="modelValue === option.value"
              @click="selectPreset(option.value)"
              @keydown.enter.prevent="selectPreset(option.value)"
              @keydown.space.prevent="selectPreset(option.value)"
              class="px-4 py-2.5 cursor-pointer transition-colors duration-150 focus:outline-none"
              :class="
                isDark
                  ? 'hover:bg-stone-800 focus:bg-stone-800'
                  : 'hover:bg-amber-50/70 focus:bg-amber-50/70'
              "
            >
              <div
                class="font-mono text-xs md:text-sm font-medium"
                :class="isDark ? 'text-stone-100' : 'text-stone-900'"
              >
                {{ option.value }}
              </div>
              <div
                class="text-xs mt-1 flex items-center gap-1.5"
                :class="isDark ? 'text-stone-400' : 'text-stone-600'"
              >
                <span
                  class="inline-block rounded px-1 py-0.2 font-mono text-[10px] uppercase"
                  :class="isDark ? 'bg-stone-800 text-stone-300' : 'bg-stone-200 text-stone-700'"
                >
                  PT
                </span>
                <span>{{ option.labelPt }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </article>
</template>
