<script setup lang="ts">
import { ref, computed } from 'vue'
import { ARCH_REFERENCE_GALLERY, type ArchReferenceItem } from '../../data/archDesignSystem'
import ArchIcon from './ArchIcon.vue'

defineProps<{
  isDark: boolean
}>()

const emit = defineEmits<{
  (e: 'apply-reference-item', item: ArchReferenceItem): void
}>()

const selectedCategory = ref<string>('Todas')
const searchQuery = ref<string>('')
const savedIds = ref<string[]>(['ref-01', 'ref-02'])
const onlySaved = ref<boolean>(false)
const inspectedItem = ref<ArchReferenceItem | null>(null)

const categories = ['Todas', 'Fachada & Volume', 'Interiores', 'Materiais & Luz', 'Implantação']

const toggleSaved = (id: string) => {
  const idx = savedIds.value.indexOf(id)
  if (idx >= 0) {
    savedIds.value.splice(idx, 1)
  } else {
    savedIds.value.push(id)
  }
}

const isSaved = (id: string) => savedIds.value.includes(id)

const filteredReferences = computed(() => {
  return ARCH_REFERENCE_GALLERY.filter(item => {
    if (onlySaved.value && !savedIds.value.includes(item.id)) return false
    if (selectedCategory.value !== 'Todas' && item.category !== selectedCategory.value) return false
    const q = searchQuery.value.trim().toLowerCase()
    if (!q) return true
    return (
      item.title.toLowerCase().includes(q) ||
      item.primaryMaterial.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q)
    )
  })
})

const resetFilters = () => {
  selectedCategory.value = 'Todas'
  searchQuery.value = ''
  onlySaved.value = false
}
</script>

<template>
  <section aria-labelledby="gallery-heading" class="space-y-8">
    <!-- Cabeçalho do Catálogo de Referências Arquitetônicas -->
    <div
      class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-6 border-b-[1.75px]"
      :class="isDark ? 'border-[#77766F]/40' : 'border-[#282824]'"
    >
      <div class="lg:col-span-7 space-y-2">
        <div class="flex flex-wrap items-center gap-2 font-mono text-xs">
          <span
            class="inline-flex items-center gap-1.5 rounded-[8px] border-[1.5px] border-[#282824] bg-[#A5B4A0] px-2.5 py-0.5 font-semibold text-[#282824] shadow-[2px_2px_0px_#282824]"
          >
            <ArchIcon name="image" :size="13" />
            <span>CATÁLOGO DE REFERÊNCIAS ARQUITETÔNICAS</span>
          </span>
          <span :class="isDark ? 'text-[#D8D0C3]' : 'text-[#77766F]'">
            CURADORIA DE MATÉRIA, LUZ NATURAL & PROPORÇÃO
          </span>
        </div>

        <h1
          id="gallery-heading"
          class="font-display font-semibold tracking-tight leading-tight text-[clamp(1.65rem,1.35rem+1.4vw,2.5rem)]"
        >
          Catálogo de Referências & Repertório Visual
        </h1>
        <p
          class="text-sm md:text-base leading-relaxed max-w-2xl"
          :class="isDark ? 'text-[#E8E8E3]/80' : 'text-[#77766F]'"
        >
          Explore composições arquitetônicas curadas com paleta mineral, cotas espaciais e orientação solar. Com um clique em <strong>Usar no Gerador</strong>, todas as variáveis e a diretriz de imagem de referência são carregadas no estúdio.
        </p>
      </div>

      <!-- Barra de Busca & Favoritos -->
      <div class="lg:col-span-5 flex flex-col sm:flex-row items-stretch sm:items-center lg:justify-end gap-2.5">
        <div class="relative flex-1 sm:max-w-xs">
          <ArchIcon
            name="search"
            :size="16"
            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77766F] pointer-events-none"
          />
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Buscar material, obra ou local..."
            aria-label="Buscar referências arquitetônicas"
            class="arch-input w-full min-h-[42px] pl-10 pr-3.5 py-2 text-xs md:text-sm"
          />
        </div>

        <button
          type="button"
          :aria-pressed="onlySaved"
          @click="onlySaved = !onlySaved"
          class="inline-flex items-center justify-center gap-2 rounded-[10px] border-[1.5px] min-h-[42px] px-3.5 py-2 text-xs font-semibold transition-all"
          :class="
            onlySaved
              ? 'border-[#282824] bg-[#A5B4A0] text-[#282824] shadow-[2.5px_2.5px_0px_#282824]'
              : isDark
                ? 'border-[#77766F] bg-[#1F1F1C] text-[#FAF9F6]'
                : 'border-[#282824] bg-[#FAF9F6] text-[#282824] shadow-[2.5px_2.5px_0px_#282824] hover:bg-[#F5F1E9]'
          "
        >
          <ArchIcon name="bookmark" :size="15" />
          <span>Salvos ({{ savedIds.length }})</span>
        </button>
      </div>
    </div>

    <!-- Barra de Filtros de Categoria -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filtrar catálogo por tipologia">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          role="tab"
          :aria-selected="selectedCategory === cat"
          @click="selectedCategory = cat"
          class="rounded-[10px] border-[1.5px] px-3.5 py-1.5 text-xs font-semibold transition-all"
          :class="
            selectedCategory === cat
              ? 'border-[#282824] bg-[#A5B4A0] text-[#282824] shadow-[2.5px_2.5px_0px_#282824] -translate-y-[0.5px]'
              : isDark
                ? 'border-[#77766F]/50 bg-[#1F1F1C] text-[#D8D0C3] hover:border-[#FAF9F6]'
                : 'border-[#282824] bg-[#FAF9F6] text-[#282824] hover:bg-[#E8E8E3]'
          "
        >
          {{ cat }}
        </button>
      </div>

      <span class="font-mono text-xs" :class="isDark ? 'text-[#D8D0C3]' : 'text-[#77766F]'">
        {{ filteredReferences.length }} DE {{ ARCH_REFERENCE_GALLERY.length }} REFERÊNCIAS
      </span>
    </div>

    <!-- Estado Vazio -->
    <div
      v-if="filteredReferences.length === 0"
      class="arch-ambient-gradient rounded-[16px] border-[1.75px] border-[#282824] p-10 text-center text-[#282824] shadow-[4px_4px_0px_#282824] max-w-xl mx-auto space-y-3"
    >
      <h2 class="font-display text-xl font-semibold">
        Nenhuma referência encontrada para "{{ searchQuery }}"
      </h2>
      <p class="text-xs md:text-sm text-[#282824]/80">
        Limpe os filtros ativos para restaurar todas as referências fotográficas e paletas de materiais.
      </p>
      <button
        type="button"
        @click="resetFilters"
        class="arch-btn-secondary inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold"
      >
        <span>Restaurar Catálogo Completo</span>
      </button>
    </div>

    <!-- Grid de Cards do Catálogo -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="item in filteredReferences"
        :key="item.id"
        class="rounded-[14px] border-[1.75px] flex flex-col justify-between overflow-hidden transition-transform duration-150 hover:-translate-y-[1px]"
        :class="
          isDark
            ? 'bg-[#1F1F1C] border-[#77766F]/60 shadow-[4px_4px_0px_#000000]'
            : 'bg-[#FAF9F6] border-[#282824] shadow-[4px_4px_0px_#282824]'
        "
      >
        <div>
          <!-- Moldura Fotográfica com Margem Editorial -->
          <div class="p-3.5 pb-0">
            <div class="relative rounded-[10px] border-[1.5px] border-[#282824] overflow-hidden bg-[#E8E8E3] aspect-[4/3]">
              <img
                :src="item.photoUrl"
                :alt="item.title"
                loading="lazy"
                class="w-full h-full object-cover"
              />

              <span
                class="absolute top-2.5 left-2.5 rounded-[6px] border-[1.5px] border-[#282824] bg-[#FAF9F6] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#282824] shadow-[2px_2px_0px_#282824]"
              >
                {{ item.code }}
              </span>

              <button
                type="button"
                @click="toggleSaved(item.id)"
                :aria-label="isSaved(item.id) ? 'Remover referência dos salvos' : 'Salvar referência'"
                :aria-pressed="isSaved(item.id)"
                class="absolute top-2.5 right-2.5 h-8 w-8 rounded-[8px] border-[1.5px] border-[#282824] inline-flex items-center justify-center transition-all shadow-[2px_2px_0px_#282824]"
                :class="
                  isSaved(item.id)
                    ? 'bg-[#A5B4A0] text-[#282824]'
                    : 'bg-[#FAF9F6] text-[#282824] hover:bg-[#F5F1E9]'
                "
              >
                <ArchIcon name="bookmark" :size="15" />
              </button>
            </div>

            <div class="mt-2 flex items-center justify-between font-mono text-[10px]" :class="isDark ? 'text-[#D8D0C3]/75' : 'text-[#77766F]'">
              <span>{{ item.photographerCredit }}</span>
              <span>{{ item.coordinates }}</span>
            </div>
          </div>

          <!-- Corpo Editorial e Dados Técnicos -->
          <div class="p-5 pt-3.5 space-y-3.5">
            <div>
              <div class="flex items-center justify-between gap-2 mb-1">
                <span class="font-mono text-[10px] font-semibold uppercase tracking-wider" :class="isDark ? 'text-[#A5B4A0]' : 'text-[#77766F]'">
                  {{ item.category }} · {{ item.editorialIssue }}
                </span>
              </div>
              <h2 class="font-display text-lg font-semibold leading-snug">
                {{ item.title }}
              </h2>
              <p class="mt-1.5 text-xs leading-relaxed" :class="isDark ? 'text-[#E8E8E3]/80' : 'text-[#77766F]'">
                {{ item.curatorialNote }}
              </p>
            </div>

            <!-- Quadro de Cotas & Medidas -->
            <div
              class="rounded-[10px] border-[1.5px] p-2.5 grid grid-cols-2 gap-2 font-mono text-[11px]"
              :class="
                isDark
                  ? 'bg-[#161614] border-[#77766F]/40 text-[#E8E8E3]'
                  : 'bg-[#F5F1E9] border-[#282824]/40 text-[#282824]'
              "
            >
              <div>
                <span class="block text-[9px] uppercase text-[#77766F]">Área & Vão</span>
                <strong class="font-semibold">{{ item.areaMeasure }}</strong>
              </div>
              <div>
                <span class="block text-[9px] uppercase text-[#77766F]">Cota Vertical</span>
                <strong class="font-semibold">{{ item.ceilingHeight }}</strong>
              </div>
              <div class="col-span-2 pt-1 border-t border-[#282824]/15 dark:border-[#77766F]/25 flex items-center justify-between">
                <span class="text-[10px] text-[#77766F]">Insolação:</span>
                <span>{{ item.solarOrientation }}</span>
              </div>
            </div>

            <!-- Amostras de Materiais Naturais -->
            <div class="space-y-1.5">
              <span class="block font-mono text-[10px] uppercase" :class="isDark ? 'text-[#D8D0C3]' : 'text-[#77766F]'">
                Paleta Mineral: {{ item.primaryMaterial }}
              </span>
              <div class="flex flex-wrap items-center gap-2">
                <span
                  v-for="swatch in item.materialSwatches"
                  :key="swatch.label"
                  class="inline-flex items-center gap-1.5 rounded-[6px] border border-[#282824] px-2 py-0.5 font-mono text-[10px]"
                  :class="isDark ? 'bg-[#161614] text-[#FAF9F6]' : 'bg-[#FAF9F6] text-[#282824]'"
                >
                  <span
                    class="h-2.5 w-2.5 rounded-full border border-[#282824]"
                    :style="{ backgroundColor: swatch.hex }"
                  ></span>
                  <span>{{ swatch.label }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Rodapé de Ações do Card -->
        <div
          class="px-5 py-3.5 border-t-[1.5px] flex items-center justify-between gap-2"
          :class="isDark ? 'border-[#77766F]/30 bg-[#161614]' : 'border-[#282824]/20 bg-[#F5F1E9]'"
        >
          <button
            type="button"
            @click="inspectedItem = item"
            class="arch-btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
          >
            <ArchIcon name="ruler" :size="14" />
            <span>Ficha Técnica</span>
          </button>

          <button
            type="button"
            @click="emit('apply-reference-item', item)"
            class="inline-flex items-center gap-1.5 rounded-[10px] border-[1.5px] border-[#282824] bg-[#A5B4A0] px-3.5 py-1.5 text-xs font-semibold text-[#282824] shadow-[2.5px_2.5px_0px_#282824] hover:-translate-y-[0.5px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#282824] transition-all"
          >
            <ArchIcon name="layers" :size="14" />
            <span>Usar no Gerador</span>
          </button>
        </div>
      </article>
    </div>

    <!-- Modal de Inspeção Arquitetônica da Referência -->
    <Teleport to="body">
      <div
        v-if="inspectedItem"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#282824]/70"
        @click="inspectedItem = null"
      >
        <div
          role="dialog"
          aria-modal="true"
          :aria-labelledby="`ref-modal-${inspectedItem.id}`"
          class="w-full max-w-2xl rounded-[16px] border-[2px] border-[#282824] bg-[#FAF9F6] text-[#282824] shadow-[5px_5px_0px_#282824] overflow-hidden font-arch-sans"
          @click.stop
        >
          <div class="flex items-center justify-between border-b-[1.75px] border-[#282824] bg-[#F5F1E9] px-6 py-4">
            <div class="flex items-center gap-2.5">
              <span class="rounded-[6px] border-[1.5px] border-[#282824] bg-[#A5B4A0] px-2 py-0.5 font-mono text-xs font-semibold">
                {{ inspectedItem.code }}
              </span>
              <span class="font-mono text-xs text-[#77766F]">
                {{ inspectedItem.location }} · {{ inspectedItem.coordinates }}
              </span>
            </div>
            <button
              type="button"
              @click="inspectedItem = null"
              class="arch-btn-icon h-8 w-8 inline-flex items-center justify-center"
              aria-label="Fechar ficha técnica"
            >
              <ArchIcon name="close" :size="16" />
            </button>
          </div>

          <div class="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            <div class="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
              <div class="sm:col-span-5 rounded-[10px] border-[1.5px] border-[#282824] overflow-hidden aspect-[4/3]">
                <img :src="inspectedItem.photoUrl" :alt="inspectedItem.title" class="w-full h-full object-cover" />
              </div>
              <div class="sm:col-span-7 space-y-2.5">
                <span class="font-mono text-[11px] uppercase text-[#77766F]">{{ inspectedItem.editorialIssue }}</span>
                <h3 :id="`ref-modal-${inspectedItem.id}`" class="font-display text-xl font-semibold">
                  {{ inspectedItem.title }}
                </h3>
                <p class="text-xs leading-relaxed text-[#77766F]">
                  {{ inspectedItem.curatorialNote }}
                </p>
                <div class="pt-1 font-mono text-xs space-y-1">
                  <div><strong>Dimensões:</strong> {{ inspectedItem.areaMeasure }} ({{ inspectedItem.ceilingHeight }})</div>
                  <div><strong>Orientação:</strong> {{ inspectedItem.solarOrientation }}</div>
                  <div><strong>Material Base:</strong> {{ inspectedItem.primaryMaterial }}</div>
                </div>
              </div>
            </div>

            <div class="rounded-[12px] border-[1.5px] border-[#282824] bg-[#F5F1E9] p-4 space-y-2.5">
              <span class="font-mono text-[11px] font-semibold uppercase text-[#77766F]">
                PROMPT DE RENDERIZAÇÃO DESTA REFERÊNCIA:
              </span>
              <p class="font-mono text-xs leading-relaxed text-[#282824]">
                Render the architecture as a {{ inspectedItem.quickPrompt.style }}, using {{ inspectedItem.quickPrompt.materials }}. Surround with {{ inspectedItem.quickPrompt.environment }}. Add {{ inspectedItem.quickPrompt.foreground }}. Use {{ inspectedItem.quickPrompt.lighting }}. Keep the scene {{ inspectedItem.quickPrompt.mood }}. {{ inspectedItem.quickPrompt.technical }}.
              </p>
              <div
                v-if="inspectedItem.imageRef"
                class="rounded-[8px] border border-[#282824]/30 bg-[#FAF9F6] px-3 py-2 font-mono text-[11px] text-[#282824]"
              >
                <strong class="uppercase text-[10px] text-[#77766F] block mb-0.5">Diretriz de Imagem (Separada do Render):</strong>
                Reference image directive: {{ inspectedItem.imageRef }}.
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 border-t-[1.75px] border-[#282824] bg-[#F5F1E9] px-6 py-4">
            <button
              type="button"
              @click="inspectedItem = null"
              class="arch-btn-secondary px-4 py-2 text-xs font-semibold"
            >
              Fechar
            </button>
            <button
              type="button"
              @click="emit('apply-reference-item', inspectedItem); inspectedItem = null"
              class="inline-flex items-center gap-2 rounded-[10px] border-[1.75px] border-[#282824] bg-[#A5B4A0] px-4 py-2 text-xs font-semibold text-[#282824] shadow-[3px_3px_0px_#282824]"
            >
              <ArchIcon name="layers" :size="15" />
              <span>Carregar no Gerador de Prompts</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>
