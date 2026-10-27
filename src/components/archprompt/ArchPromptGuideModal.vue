<script setup lang="ts">
import { GUIDE_PHASES } from '../../data/archprompt'

defineProps<{
  isOpen: boolean
  isDark: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'apply-reference'): void
}>()

const handleApplyAndClose = () => {
  emit('apply-reference')
  emit('close')
}

const phaseColorMap: Record<string, string> = {
  blue: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  orange: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
  emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
  amber: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  purple: 'border-purple-500/30 bg-purple-500/10 text-purple-400'
}
</script>

<template>
  <Teleport to="body">
    <Transition name="guide-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-xs"
        @click="emit('close')"
      >
        <aside
          class="relative flex h-full w-full max-w-3xl flex-col overflow-hidden border-l shadow-2xl"
          :class="
            isDark
              ? 'bg-zinc-950 border-zinc-800 text-zinc-200'
              : 'bg-white border-zinc-200 text-zinc-800'
          "
          @click.stop
        >
          <!-- Header do Drawer -->
          <header
            class="flex items-center justify-between border-b px-6 py-5 shrink-0"
            :class="isDark ? 'border-zinc-800 bg-zinc-900/60' : 'border-zinc-200 bg-zinc-50'"
          >
            <div>
              <div class="flex items-center gap-2">
                <span class="rounded-md bg-indigo-500/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-indigo-400 border border-indigo-500/30">
                  Metodologia Oficial
                </span>
                <span class="text-xs" :class="isDark ? 'text-zinc-400' : 'text-zinc-500'">
                  Do Macro ao Micro + Técnico
                </span>
              </div>
              <h2
                class="mt-1 text-xl font-bold tracking-tight"
                :class="isDark ? 'text-white' : 'text-zinc-900'"
              >
                Guia de Engenharia de Prompts para Visualização Arquitetônica
              </h2>
            </div>

            <button
              type="button"
              @click="emit('close')"
              class="rounded-xl p-2 transition-colors"
              :class="
                isDark
                  ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  : 'text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900'
              "
              aria-label="Fechar Guia"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </header>

          <!-- Corpo com Scroll -->
          <div class="flex-1 overflow-y-auto p-6 space-y-8">
            <!-- Prompt de Referência Colorido -->
            <section
              class="rounded-2xl border p-5"
              :class="
                isDark
                  ? 'bg-zinc-900/60 border-zinc-800'
                  : 'bg-zinc-50 border-zinc-200'
              "
            >
              <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                <h3 class="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Prompt de Referência Desconstruído (6 Fases)
                </h3>
                <button
                  type="button"
                  @click="handleApplyAndClose"
                  class="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Carregar este exemplo no Gerador
                </button>
              </div>

              <p class="text-sm leading-relaxed font-medium space-x-1">
                <span class="rounded px-1.5 py-0.5 bg-blue-500/15 text-blue-300 border border-blue-500/30" title="Fase 1: Sujeito e Contexto">
                  Render the architecture as a refined contemporary luxury residence in a natural forest hillside setting,
                </span>
                <span class="rounded px-1.5 py-0.5 bg-orange-500/15 text-orange-300 border border-orange-500/30" title="Fase 2: Materialidade">
                  using warm off-white masonry, natural timber, large floor-to-ceiling glass, and dark metal frames.
                </span>
                <span class="rounded px-1.5 py-0.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" title="Fase 3: Paisagismo">
                  Surround the house with mature pine trees, layered grasses, shrubs, and subtle planting.
                </span>
                <span class="rounded px-1.5 py-0.5 bg-cyan-500/15 text-cyan-300 border border-cyan-500/30" title="Fase 4: Primeiro Plano">
                  Add a calm natural pond in the foreground with realistic reflections, soft ripples, shoreline stones, and a small rustic wooden rowboat.
                </span>
                <span class="rounded px-1.5 py-0.5 bg-amber-500/15 text-amber-300 border border-amber-500/30" title="Fase 5: Iluminação e Atmosfera">
                  Use warm late-afternoon golden-hour light filtering through the trees, with soft cinematic shadows and subtle interior glow. Keep the scene peaceful, luxurious, natural, and architecture-focused.
                </span>
                <span class="rounded px-1.5 py-0.5 bg-purple-500/15 text-purple-300 border border-purple-500/30" title="Fase 6: Parâmetros Técnicos">
                  Ultra-realistic architectural visualization, soft global illumination, detailed vegetation, no text, 1:1.
                </span>
              </p>
            </section>

            <!-- 1. A Anatomia do Prompt -->
            <section class="space-y-4">
              <div>
                <h3
                  class="text-lg font-bold"
                  :class="isDark ? 'text-white' : 'text-zinc-900'"
                >
                  1. A Anatomia do Prompt (Desconstrução)
                </h3>
                <p
                  class="text-sm mt-1"
                  :class="isDark ? 'text-zinc-400' : 'text-zinc-600'"
                >
                  Um prompt de sucesso não é um amontoado de palavras, mas uma narrativa visual estruturada em ordem lógica de importância para a IA (do <strong>Macro</strong> para o <strong>Micro</strong>, finalizando com o <strong>Técnico</strong>).
                </p>
              </div>

              <div class="grid grid-cols-1 gap-4">
                <div
                  v-for="item in GUIDE_PHASES"
                  :key="item.phase"
                  class="rounded-xl border p-4 transition-colors"
                  :class="
                    isDark
                      ? 'bg-zinc-900/40 border-zinc-800'
                      : 'bg-white border-zinc-200 shadow-2xs'
                  "
                >
                  <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h4
                      class="font-bold text-sm"
                      :class="isDark ? 'text-zinc-100' : 'text-zinc-900'"
                    >
                      {{ item.title }}
                    </h4>
                    <span
                      class="rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                      :class="phaseColorMap[item.accent]"
                    >
                      {{ item.tag }}
                    </span>
                  </div>

                  <blockquote
                    class="my-2 border-l-2 border-indigo-500 pl-3 italic text-xs"
                    :class="isDark ? 'text-zinc-300' : 'text-zinc-700'"
                  >
                    {{ item.originalText }}
                  </blockquote>

                  <div class="mt-3 space-y-1.5 text-xs">
                    <p :class="isDark ? 'text-zinc-300' : 'text-zinc-700'">
                      <strong class="text-indigo-400">O que faz:</strong> {{ item.whatItDoes }}
                    </p>
                    <p :class="isDark ? 'text-zinc-400' : 'text-zinc-600'">
                      <strong class="text-emerald-400">Onde colocar:</strong> {{ item.placement }}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- 2. Ordem Exata de Blocos -->
            <section
              class="rounded-2xl border p-5 space-y-3"
              :class="
                isDark
                  ? 'bg-zinc-900/40 border-zinc-800'
                  : 'bg-zinc-50 border-zinc-200'
              "
            >
              <h3
                class="text-base font-bold"
                :class="isDark ? 'text-white' : 'text-zinc-900'"
              >
                2. Metodologia: Os 6 Blocos Sequenciais
              </h3>
              <ol class="space-y-2 text-xs list-decimal list-inside" :class="isDark ? 'text-zinc-300' : 'text-zinc-700'">
                <li>
                  <strong>Ação + Tipo de Construção + Estilo Arquitetônico + Bioma:</strong>
                  <code class="ml-1 rounded bg-indigo-500/10 px-1.5 py-0.5 text-indigo-300">Render a [prédio] in a [estilo] style, located in a [ambiente].</code>
                </li>
                <li>
                  <strong>Materiais Principais + Cores/Texturas:</strong>
                  <code class="ml-1 rounded bg-indigo-500/10 px-1.5 py-0.5 text-indigo-300">using [material 1], [material 2], and [material 3].</code>
                </li>
                <li>
                  <strong>Paisagismo (Background e Midground):</strong>
                  <code class="ml-1 rounded bg-indigo-500/10 px-1.5 py-0.5 text-indigo-300">Surround the building with [plantas/árvores/terreno].</code>
                </li>
                <li>
                  <strong>Composição Frontal (Foreground):</strong>
                  <code class="ml-1 rounded bg-indigo-500/10 px-1.5 py-0.5 text-indigo-300">In the foreground, add [água, reflexos, rua, objetos de escala].</code>
                </li>
                <li>
                  <strong>Iluminação + Sombras + Atmosfera:</strong>
                  <code class="ml-1 rounded bg-indigo-500/10 px-1.5 py-0.5 text-indigo-300">Use [luz e horário] with [sombras/clima]. Keep the scene [adjetivos].</code>
                </li>
                <li>
                  <strong>Keywords Técnicas (Modificadores Finais):</strong>
                  <code class="ml-1 rounded bg-indigo-500/10 px-1.5 py-0.5 text-indigo-300">[estilo visual], [motor de render], [qualidade], [aspect ratio].</code>
                </li>
              </ol>
            </section>
          </div>

          <!-- Footer do Drawer -->
          <footer
            class="flex items-center justify-between border-t px-6 py-4 shrink-0"
            :class="isDark ? 'border-zinc-800 bg-zinc-900/60' : 'border-zinc-200 bg-zinc-50'"
          >
            <span class="text-xs" :class="isDark ? 'text-zinc-400' : 'text-zinc-500'">
              Use os modos <strong>Rápido (7 blocos)</strong> ou <strong>Avançado (12 blocos)</strong> para aplicar esta metodologia.
            </span>
            <button
              type="button"
              @click="emit('close')"
              class="rounded-xl bg-zinc-800 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700 transition-colors"
            >
              Entendi, voltar ao Studio
            </button>
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.guide-fade-enter-active,
.guide-fade-leave-active {
  transition: opacity 0.25s ease;
}
.guide-fade-enter-from,
.guide-fade-leave-to {
  opacity: 0;
}
</style>
