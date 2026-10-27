<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { GUIDE_PHASES } from '../../data/archprompt'

const props = defineProps<{
  isOpen: boolean
  isDark: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'apply-reference'): void
}>()

const closeButtonRef = ref<HTMLButtonElement | null>(null)

const handleApplyAndClose = () => {
  emit('apply-reference')
  emit('close')
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

watch(
  () => props.isOpen,
  async open => {
    if (open) {
      await nextTick()
      closeButtonRef.value?.focus()
    }
  }
)

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="guide-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-end bg-black/70"
        @click="emit('close')"
      >
        <aside
          role="dialog"
          aria-modal="true"
          aria-labelledby="guide-dialog-title"
          class="relative flex h-full w-full max-w-3xl flex-col overflow-hidden border-l shadow-xl font-arch-sans"
          :class="
            isDark
              ? 'bg-stone-950 border-stone-800 text-stone-200'
              : 'bg-[#FAF8F5] border-stone-300 text-stone-800'
          "
          @click.stop
        >
          <!-- Header do Drawer -->
          <header
            class="flex items-center justify-between border-b px-6 py-5 shrink-0"
            :class="isDark ? 'border-stone-800 bg-stone-900' : 'border-stone-200 bg-white'"
          >
            <div>
              <div class="flex items-center gap-2">
                <span
                  class="rounded-md border px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide"
                  :class="
                    isDark
                      ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                      : 'border-amber-700/30 bg-amber-50 text-amber-800'
                  "
                >
                  Metodologia de 6 Fases
                </span>
                <span class="text-xs font-mono" :class="isDark ? 'text-stone-400' : 'text-stone-600'">
                  MACRO → MÉDIO → MICRO → TÉCNICO
                </span>
              </div>
              <h2
                id="guide-dialog-title"
                class="mt-1.5 font-display text-xl md:text-2xl font-bold tracking-tight"
                :class="isDark ? 'text-stone-100' : 'text-stone-900'"
              >
                Engenharia de Prompts para Visualização Arquitetônica
              </h2>
            </div>

            <button
              ref="closeButtonRef"
              type="button"
              @click="emit('close')"
              class="rounded-md p-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              :class="
                isDark
                  ? 'text-stone-400 hover:bg-stone-800 hover:text-stone-100'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              "
              aria-label="Fechar guia metodológico"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </header>

          <!-- Corpo com Scroll -->
          <div class="flex-1 overflow-y-auto p-6 space-y-8">
            <!-- Prompt de Referência Desconstruído -->
            <section
              class="rounded-lg border p-5"
              :class="
                isDark
                  ? 'bg-stone-900 border-stone-800'
                  : 'bg-white border-stone-200 shadow-2xs'
              "
            >
              <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h3
                    class="font-display text-base font-bold"
                    :class="isDark ? 'text-stone-100' : 'text-stone-900'"
                  >
                    Prompt de Referência Desconstruído
                  </h3>
                  <p class="text-xs mt-0.5" :class="isDark ? 'text-stone-400' : 'text-stone-600'">
                    Cada segmento cumpre uma função espacial e técnica na geração da imagem.
                  </p>
                </div>

                <button
                  type="button"
                  @click="handleApplyAndClose"
                  class="inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  :class="
                    isDark
                      ? 'bg-amber-500 text-stone-950 hover:bg-amber-400'
                      : 'bg-amber-700 text-white hover:bg-amber-800'
                  "
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>Preencher com este exemplo</span>
                </button>
              </div>

              <div
                class="rounded-md border p-4 font-mono text-xs md:text-sm leading-relaxed space-y-2"
                :class="
                  isDark
                    ? 'bg-stone-950 border-stone-800 text-stone-200'
                    : 'bg-stone-50 border-stone-200 text-stone-800'
                "
              >
                <p>
                  <span class="font-bold" :class="isDark ? 'text-amber-400' : 'text-amber-800'">[01 MACRO]</span>
                  Render the architecture as a refined contemporary luxury residence in a natural forest hillside setting,
                  <span class="font-bold" :class="isDark ? 'text-amber-400' : 'text-amber-800'">[02 MÉDIO]</span>
                  using warm off-white masonry, natural timber, large floor-to-ceiling glass, and dark metal frames.
                  <span class="font-bold" :class="isDark ? 'text-amber-400' : 'text-amber-800'">[03 MICRO]</span>
                  Surround the house with mature pine trees, layered grasses, shrubs, and subtle planting.
                  <span class="font-bold" :class="isDark ? 'text-amber-400' : 'text-amber-800'">[04 1º PLANO]</span>
                  Add a calm natural pond in the foreground with realistic reflections, soft ripples, shoreline stones, and a small rustic wooden rowboat.
                  <span class="font-bold" :class="isDark ? 'text-amber-400' : 'text-amber-800'">[05 LUZ & CLIMA]</span>
                  Use warm late-afternoon golden-hour light filtering through the trees, with soft cinematic shadows and subtle interior glow. Keep the scene peaceful, luxurious, natural, and architecture-focused.
                  <span class="font-bold" :class="isDark ? 'text-amber-400' : 'text-amber-800'">[06 TÉCNICO]</span>
                  Ultra-realistic architectural visualization, soft global illumination, detailed vegetation, no text, 1:1.
                </p>
              </div>
            </section>

            <!-- 1. A Anatomia do Prompt -->
            <section class="space-y-4">
              <div>
                <h3
                  class="font-display text-lg font-bold"
                  :class="isDark ? 'text-stone-100' : 'text-stone-900'"
                >
                  1. Anatomia das 6 Fases
                </h3>
                <p
                  class="text-sm mt-1 max-w-prose leading-relaxed"
                  :class="isDark ? 'text-stone-300' : 'text-stone-700'"
                >
                  Modelos de difusão atribuem maior peso semântico aos tokens iniciais. Por isso, a narrativa parte da escala <strong>Macro</strong> (sujeito e implantação), passa pela escala <strong>Média</strong> (materiais) e <strong>Micro</strong> (paisagismo e primeiro plano), e finaliza com iluminação e parâmetros técnicos.
                </p>
              </div>

              <div class="grid grid-cols-1 gap-4">
                <article
                  v-for="item in GUIDE_PHASES"
                  :key="item.phase"
                  class="rounded-lg border p-4"
                  :class="
                    isDark
                      ? 'bg-stone-900/70 border-stone-800'
                      : 'bg-white border-stone-200 shadow-2xs'
                  "
                >
                  <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div class="flex items-center gap-2.5">
                      <span
                        class="inline-flex h-6 w-6 items-center justify-center rounded font-mono text-xs font-semibold tabular-nums"
                        :class="
                          isDark
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        "
                      >
                        0{{ item.phase }}
                      </span>
                      <h4
                        class="font-display font-bold text-sm md:text-base"
                        :class="isDark ? 'text-stone-100' : 'text-stone-900'"
                      >
                        {{ item.title }}
                      </h4>
                    </div>

                    <span
                      class="rounded-md border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide"
                      :class="
                        isDark
                          ? 'border-stone-700 bg-stone-950 text-stone-300'
                          : 'border-stone-200 bg-stone-100 text-stone-700'
                      "
                    >
                      {{ item.tag }}
                    </span>
                  </div>

                  <p
                    class="my-2.5 rounded-md border px-3 py-2 font-mono text-xs"
                    :class="
                      isDark
                        ? 'bg-stone-950 border-stone-800 text-stone-300'
                        : 'bg-stone-50 border-stone-200 text-stone-800'
                    "
                  >
                    {{ item.originalText }}
                  </p>

                  <dl class="mt-3 space-y-2 text-xs leading-relaxed">
                    <div class="flex flex-col sm:flex-row sm:gap-2">
                      <dt class="font-semibold shrink-0" :class="isDark ? 'text-amber-400' : 'text-amber-800'">
                        Função visual:
                      </dt>
                      <dd :class="isDark ? 'text-stone-300' : 'text-stone-700'">
                        {{ item.whatItDoes }}
                      </dd>
                    </div>
                    <div class="flex flex-col sm:flex-row sm:gap-2">
                      <dt class="font-semibold shrink-0" :class="isDark ? 'text-stone-200' : 'text-stone-900'">
                        Posicionamento:
                      </dt>
                      <dd :class="isDark ? 'text-stone-400' : 'text-stone-600'">
                        {{ item.placement }}
                      </dd>
                    </div>
                  </dl>
                </article>
              </div>
            </section>

            <!-- 2. Ordem Sequencial de Construção -->
            <section
              class="rounded-lg border p-5 space-y-3"
              :class="
                isDark
                  ? 'bg-stone-900/70 border-stone-800'
                  : 'bg-white border-stone-200 shadow-2xs'
              "
            >
              <h3
                class="font-display text-base font-bold"
                :class="isDark ? 'text-stone-100' : 'text-stone-900'"
              >
                2. Sequência de Blocos do Template
              </h3>
              <ol class="space-y-2.5 text-xs list-decimal list-inside leading-relaxed" :class="isDark ? 'text-stone-300' : 'text-stone-700'">
                <li>
                  <strong>Ação + Tipologia + Estilo + Bioma:</strong>
                  <code class="ml-1 rounded px-1.5 py-0.5 font-mono" :class="isDark ? 'bg-stone-950 text-amber-300' : 'bg-stone-100 text-amber-900'">Render the architecture as a [estilo] [tipologia] in a [bioma] setting</code>
                </li>
                <li>
                  <strong>Materiais Principais e Texturas:</strong>
                  <code class="ml-1 rounded px-1.5 py-0.5 font-mono" :class="isDark ? 'bg-stone-950 text-amber-300' : 'bg-stone-100 text-amber-900'">using [material 1], [material 2], and [material 3].</code>
                </li>
                <li>
                  <strong>Paisagismo (Background e Midground):</strong>
                  <code class="ml-1 rounded px-1.5 py-0.5 font-mono" :class="isDark ? 'bg-stone-950 text-amber-300' : 'bg-stone-100 text-amber-900'">Surround the house with [vegetação e terreno].</code>
                </li>
                <li>
                  <strong>Composição Frontal (Foreground):</strong>
                  <code class="ml-1 rounded px-1.5 py-0.5 font-mono" :class="isDark ? 'bg-stone-950 text-amber-300' : 'bg-stone-100 text-amber-900'">Add a [água, reflexos, calçamento ou escala] in the foreground.</code>
                </li>
                <li>
                  <strong>Iluminação, Sombras e Clima:</strong>
                  <code class="ml-1 rounded px-1.5 py-0.5 font-mono" :class="isDark ? 'bg-stone-950 text-amber-300' : 'bg-stone-100 text-amber-900'">Use [luz e horário] with [sombras]. Keep the scene [atmosfera].</code>
                </li>
                <li>
                  <strong>Keywords Técnicas e Proporção:</strong>
                  <code class="ml-1 rounded px-1.5 py-0.5 font-mono" :class="isDark ? 'bg-stone-950 text-amber-300' : 'bg-stone-100 text-amber-900'">[estilo de render], [restrições], [aspect ratio].</code>
                </li>
              </ol>
            </section>
          </div>

          <!-- Footer do Drawer -->
          <footer
            class="flex items-center justify-between border-t px-6 py-4 shrink-0"
            :class="isDark ? 'border-stone-800 bg-stone-900' : 'border-stone-200 bg-white'"
          >
            <span class="text-xs" :class="isDark ? 'text-stone-400' : 'text-stone-600'">
              Alterne entre <strong>7 Blocos (Rápido)</strong> e <strong>12 Blocos (Granular)</strong> na barra superior.
            </span>
            <button
              type="button"
              @click="emit('close')"
              class="rounded-md border px-4 py-2 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              :class="
                isDark
                  ? 'border-stone-700 bg-stone-800 text-stone-100 hover:bg-stone-700'
                  : 'border-stone-300 bg-stone-900 text-white hover:bg-stone-800'
              "
            >
              Fechar guia
            </button>
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.guide-fade-enter-active {
  transition: opacity 0.2s ease-out;
}
.guide-fade-leave-active {
  transition: opacity 0.15s ease-in;
}
.guide-fade-enter-from,
.guide-fade-leave-to {
  opacity: 0;
}
</style>
