<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ArchFieldConfig } from '../../data/archprompt'
import ArchIcon from './ArchIcon.vue'

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
const phaseNumberFormatted = computed(() =>
  props.config.phase === 0 ? 'REF' : `0${props.config.phase}`
)
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
    class="rounded-[14px] border-[1.75px] transition-all duration-150"
    :class="[
      isFeatured ? 'p-5 md:p-6' : 'p-4 md:p-5',
      isDark
        ? 'bg-[#1F1F1C] border-[#D8D0C3]/30 text-[#FAF9F6] shadow-[4px_4px_0px_#000000]'
        : isFeatured
          ? 'bg-[#FAF9F6] border-[#282824] shadow-[4px_4px_0px_#282824]'
          : 'bg-[#FAF9F6] border-[#282824] shadow-[3px_3px_0px_#282824]'
    ]"
    @keydown.escape="isOpen = false"
  >
    <!-- Header do Bloco -->
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-start gap-3">
        <!-- Índice Técnico Soft Neobrutalist -->
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border-[1.5px] font-mono text-xs font-semibold tabular-nums mt-0.5 transition-colors"
          :style="
            isFilled && !isDark
              ? { backgroundColor: 'var(--ds-active-accent)', borderColor: '#282824', color: '#282824' }
              : undefined
          "
          :class="
            isFilled
              ? isDark
                ? 'border-[#D8B99A] bg-[#C98268]/25 text-[#FAF9F6]'
                : 'shadow-[2px_2px_0px_#282824]'
              : isDark
                ? 'border-[#77766F]/40 bg-[#282824] text-[#D8D0C3]'
                : 'border-[#282824] bg-[#F5F1E9] text-[#282824]'
          "
          aria-hidden="true"
        >
          {{ phaseNumberFormatted }}
        </div>

        <div>
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="inline-flex items-center rounded-[8px] border px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider"
              :class="
                isDark
                  ? 'border-[#77766F]/40 bg-[#282824] text-[#D8D0C3]'
                  : 'border-[#282824]/40 bg-[#E8E8E3] text-[#282824]'
              "
            >
              {{ config.phaseTitle }}
            </span>

            <label
              :for="`textarea-${config.id}`"
              class="font-display font-semibold tracking-tight"
              :class="[
                isFeatured ? 'text-base md:text-lg' : 'text-sm md:text-base',
                isDark ? 'text-[#FAF9F6]' : 'text-[#282824]'
              ]"
            >
              {{ config.label }}
            </label>

            <span
              class="font-mono text-xs"
              :class="isDark ? 'text-[#D8D0C3]/70' : 'text-[#77766F]'"
            >
              · {{ config.labelPt }}
            </span>
          </div>

          <p
            class="mt-1 text-xs md:text-sm leading-relaxed max-w-prose"
            :class="isDark ? 'text-[#E8E8E3]/80' : 'text-[#77766F]'"
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
          class="rounded-[8px] px-2 py-1 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#282824]"
          :class="
            isDark
              ? 'text-[#D8D0C3] hover:bg-[#282824] hover:text-[#FAF9F6]'
              : 'text-[#77766F] hover:bg-[#E8E8E3] hover:text-[#282824]'
          "
        >
          Limpar
        </button>

        <span
          v-if="isFilled"
          class="inline-flex items-center gap-1 rounded-[8px] border-[1.5px] px-2 py-0.5 font-mono text-[11px] font-semibold"
          :class="
            isDark
              ? 'border-[#A5B4A0]/50 bg-[#A5B4A0]/20 text-[#A5B4A0]'
              : 'border-[#282824] bg-[#A5B4A0] text-[#282824]'
          "
        >
          <ArchIcon name="check" :size="12" :stroke-width="2.2" />
          <span>OK</span>
        </span>
      </div>
    </div>

    <!-- Nota Metodológica Editorial -->
    <div
      class="mt-3 flex items-start gap-2 rounded-[10px] border px-3 py-2 text-xs leading-relaxed"
      :class="
        isDark
          ? 'bg-[#282824]/70 border-[#77766F]/30 text-[#E8E8E3]'
          : 'bg-[#F5F1E9] border-[#282824]/30 text-[#282824]'
      "
    >
      <ArchIcon name="ruler" :size="15" class="mt-0.5 shrink-0 text-[#77766F]" />
      <span>
        <strong class="font-semibold">Cota metodológica:</strong>
        {{ config.guideTip }}
      </span>
    </div>

    <!-- Barra de Tags / Chips Combináveis -->
    <div class="mt-3.5" role="group" :aria-label="`Sugestões rápidas para ${config.label}`">
      <div class="flex items-center justify-between mb-1.5">
        <span
          class="font-mono text-[11px] uppercase tracking-wider font-medium"
          :class="isDark ? 'text-[#D8D0C3]/70' : 'text-[#77766F]'"
        >
          {{
            config.singleSelectChip
              ? 'Seleção direta (1 opção):'
              : 'Termos técnicos combináveis (clique para compor):'
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
          class="inline-flex items-center gap-1.5 rounded-[8px] border-[1.5px] px-2.5 py-1 text-xs font-medium transition-all duration-120 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#282824]"
          :style="
            isChipActive(chip.value) && !isDark
              ? { backgroundColor: 'var(--ds-active-accent)', borderColor: '#282824', color: '#282824' }
              : undefined
          "
          :class="
            isChipActive(chip.value)
              ? isDark
                ? 'bg-[#C98268]/30 border-[#D8B99A] text-[#FAF9F6]'
                : 'font-semibold shadow-[2px_2px_0px_#282824] -translate-y-[0.5px]'
              : isDark
                ? 'bg-[#282824] border-[#77766F]/40 text-[#E8E8E3] hover:border-[#D8D0C3]'
                : 'bg-[#F5F1E9] border-[#282824]/60 text-[#282824] hover:bg-[#E8E8E3] hover:border-[#282824]'
          "
          :title="`Termo em inglês: ${chip.value}`"
        >
          <ArchIcon
            :name="isChipActive(chip.value) ? 'check' : 'plus'"
            :size="11"
            :stroke-width="isChipActive(chip.value) ? 2.4 : 1.85"
          />
          <span>{{ chip.label }}</span>
        </button>
      </div>
    </div>

    <!-- Textarea com Combobox de Frases Curadas (Seção 8 — Campos de Formulário) -->
    <div class="relative mt-3.5 w-full">
      <div
        class="relative rounded-[10px] border-[1.5px] transition-all duration-150"
        :style="
          isFocused && !isDark
            ? { boxShadow: '3px 3px 0px var(--ds-active-accent)' }
            : undefined
        "
        :class="[
          isDark ? 'bg-[#161614]' : 'bg-[#FAF9F6]',
          isFocused
            ? isDark
              ? 'border-[#D8B99A]'
              : 'border-[#282824] bg-white'
            : isDark
              ? 'border-[#77766F]/50'
              : 'border-[#282824]'
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
          class="w-full min-h-[60px] p-3 pr-28 text-xs md:text-sm bg-transparent focus:outline-none resize-y leading-relaxed font-mono"
          :class="
            isDark
              ? 'text-[#FAF9F6] placeholder:text-[#77766F]'
              : 'text-[#282824] placeholder:text-[#77766F]'
          "
        />

        <!-- Botão de abrir Presets de Frases Completas -->
        <button
          type="button"
          :aria-expanded="isOpen"
          :aria-controls="listboxId"
          aria-haspopup="listbox"
          @click="toggleDropdown"
          class="absolute right-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-[8px] border-[1.5px] px-2.5 py-1 text-xs font-semibold transition-all duration-120 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#282824]"
          :class="
            isDark
              ? 'bg-[#282824] border-[#77766F] text-[#FAF9F6] hover:bg-[#383832]'
              : 'bg-[#F5F1E9] border-[#282824] text-[#282824] shadow-[2px_2px_0px_#282824] hover:bg-[#E8E8E3] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#282824]'
          "
        >
          <span>Frases</span>
          <ArchIcon
            name="chevron-down"
            :size="13"
            class="transform transition-transform duration-150"
            :class="isOpen ? 'rotate-180' : ''"
          />
        </button>
      </div>

      <span :id="`desc-${config.id}`" class="sr-only">
        {{ config.description }} Digite em inglês ou selecione tags e frases prontas.
      </span>

      <!-- Dropdown de Sugestões (WAI-ARIA Listbox) -->
      <div v-if="isOpen">
        <div class="fixed inset-0 z-30" @click="isOpen = false" aria-hidden="true"></div>

        <div
          class="absolute z-40 w-full mt-2 rounded-[12px] border-[1.75px] max-h-64 overflow-y-auto"
          :class="
            isDark
              ? 'bg-[#1F1F1C] border-[#D8D0C3]/40 text-[#FAF9F6] shadow-[4px_4px_0px_#000000]'
              : 'bg-[#FAF9F6] border-[#282824] text-[#282824] shadow-[4px_4px_0px_#282824]'
          "
        >
          <div
            class="sticky top-0 z-10 flex items-center justify-between px-3.5 py-2 text-xs font-mono border-b-[1.5px]"
            :class="
              isDark
                ? 'bg-[#282824] border-[#77766F]/40 text-[#D8D0C3]'
                : 'bg-[#F5F1E9] border-[#282824] text-[#282824]'
            "
          >
            <span>Repertório Técnico (EN + Tradução PT)</span>
            <button
              type="button"
              @click="isOpen = false"
              class="rounded px-1.5 py-0.5 text-xs font-semibold hover:underline focus-visible:outline-none"
            >
              Fechar (Esc)
            </button>
          </div>

          <ul
            :id="listboxId"
            role="listbox"
            :aria-label="`Frases prontas para ${config.label}`"
            class="divide-y"
            :class="isDark ? 'divide-[#282824]' : 'divide-[#282824]/15'"
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
              class="px-4 py-2.5 cursor-pointer transition-colors duration-120 focus:outline-none"
              :class="
                isDark
                  ? 'hover:bg-[#282824] focus:bg-[#282824]'
                  : 'hover:bg-[#F5F1E9] focus:bg-[#F5F1E9]'
              "
            >
              <div
                class="font-mono text-xs md:text-sm font-medium"
                :class="isDark ? 'text-[#FAF9F6]' : 'text-[#282824]'"
              >
                {{ option.value }}
              </div>
              <div
                class="text-xs mt-1 flex items-center gap-1.5"
                :class="isDark ? 'text-[#D8D0C3]/75' : 'text-[#77766F]'"
              >
                <span
                  class="inline-block rounded px-1.5 py-0.2 font-mono text-[10px] font-semibold uppercase border"
                  :class="
                    isDark
                      ? 'bg-[#282824] border-[#77766F]/40 text-[#D8D0C3]'
                      : 'bg-[#E8E8E3] border-[#282824]/30 text-[#282824]'
                  "
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
