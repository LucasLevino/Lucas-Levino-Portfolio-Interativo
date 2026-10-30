<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { GUIDE_PHASES, GUIDE_ADVANCED_WORKFLOWS } from '../../data/archprompt'
import ArchIcon from './ArchIcon.vue'

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
        class="fixed inset-0 z-50 flex items-center justify-end bg-[#282824]/65"
        @click="emit('close')"
      >
        <aside
          role="dialog"
          aria-modal="true"
          aria-labelledby="guide-dialog-title"
          class="relative flex h-full w-full max-w-3xl flex-col overflow-hidden border-l-[2px] font-arch-sans"
          :class="
            isDark
              ? 'bg-[#161614] border-[#77766F] text-[#FAF9F6]'
              : 'bg-[#F5F1E9] border-[#282824] text-[#282824]'
          "
          @click.stop
        >
          <!-- Header do Drawer Editorial -->
          <header
            class="flex items-center justify-between border-b-[1.75px] px-6 py-5 shrink-0"
            :class="isDark ? 'border-[#77766F]/40 bg-[#1F1F1C]' : 'border-[#282824] bg-[#FAF9F6]'"
          >
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="rounded-[8px] border-[1.5px] px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wide"
                  :class="
                    isDark
                      ? 'border-[#C98268] bg-[#C98268]/20 text-[#FAF9F6]'
                      : 'border-[#282824] bg-[#C98268] text-[#282824] shadow-[2px_2px_0px_#282824]'
                  "
                >
                  Caderno Metodológico · 6 Fases
                </span>
                <span class="text-xs font-mono" :class="isDark ? 'text-[#D8D0C3]/75' : 'text-[#77766F]'">
                  MACRO → MÉDIO → MICRO → TÉCNICO
                </span>
              </div>
              <h2
                id="guide-dialog-title"
                class="mt-2 font-display text-xl md:text-2xl font-semibold tracking-tight"
                :class="isDark ? 'text-[#FAF9F6]' : 'text-[#282824]'"
              >
                Engenharia de Prompts para Arquitetura Contemporânea
              </h2>
            </div>

            <button
              ref="closeButtonRef"
              type="button"
              @click="emit('close')"
              class="arch-btn-icon h-9 w-9 inline-flex items-center justify-center"
              aria-label="Fechar guia metodológico"
            >
              <ArchIcon name="close" :size="18" />
            </button>
          </header>

          <!-- Corpo com Scroll -->
          <div class="flex-1 overflow-y-auto p-6 space-y-8">
            <!-- Prompt de Referência Desconstruído -->
            <section
              class="rounded-[14px] border-[1.75px] p-5"
              :class="
                isDark
                  ? 'bg-[#1F1F1C] border-[#77766F]/50 shadow-[4px_4px_0px_#000000]'
                  : 'bg-[#FAF9F6] border-[#282824] shadow-[4px_4px_0px_#282824]'
              "
            >
              <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h3 class="font-display text-base md:text-lg font-semibold">
                    Prompt de Referência Desconstruído
                  </h3>
                  <p class="text-xs mt-0.5" :class="isDark ? 'text-[#D8D0C3]/75' : 'text-[#77766F]'">
                    Cada segmento cumpre uma função espacial, material e luminotécnica.
                  </p>
                </div>

                <button
                  type="button"
                  @click="handleApplyAndClose"
                  class="arch-btn-primary inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold"
                >
                  <ArchIcon name="layers" :size="14" />
                  <span>Aplicar Exemplo no Estúdio</span>
                </button>
              </div>

              <div
                class="rounded-[10px] border-[1.5px] p-4 font-mono text-xs md:text-sm leading-relaxed space-y-2.5"
                :class="
                  isDark
                    ? 'bg-[#161614] border-[#77766F]/40 text-[#E8E8E3]'
                    : 'bg-[#F5F1E9] border-[#282824] text-[#282824]'
                "
              >
                <p>
                  <span class="font-bold underline decoration-[#C98268] decoration-2">[01 MACRO]</span>
                  Render the architecture as a refined contemporary luxury residence in a natural forest hillside setting,
                  <span class="font-bold underline decoration-[#C98268] decoration-2">[02 MÉDIO]</span>
                  using warm off-white masonry, natural timber, large floor-to-ceiling glass, and dark metal frames.
                  <span class="font-bold underline decoration-[#C98268] decoration-2">[03 MICRO]</span>
                  Surround the house with mature pine trees, layered grasses, shrubs, and subtle planting.
                  <span class="font-bold underline decoration-[#C98268] decoration-2">[04 1º PLANO]</span>
                  Add a calm natural pond in the foreground with realistic reflections, soft ripples, shoreline stones, and a subtle human figure at 70-85% translucent opacity with photographic motion blur.
                  <span class="font-bold underline decoration-[#C98268] decoration-2">[05 LUZ &amp; CLIMA]</span>
                  Use warm late-afternoon golden-hour light filtering through the trees, with soft cinematic shadows and subtle interior glow. Keep the scene peaceful, luxurious, natural, and architecture-focused.
                  <span class="font-bold underline decoration-[#C98268] decoration-2">[06 TÉCNICO &amp; SEGURANÇA]</span>
                  Ultra-realistic architectural visualization, soft global illumination, detailed vegetation, preserve 100% of original architecture, no text, 1:1. Do not look like a 3D render, CGI, VFX, video game, or digital art.
                </p>
                <div
                  class="rounded-[8px] border border-dashed px-3 py-2 text-[11px]"
                  :class="
                    isDark
                      ? 'border-[#A5B4A0]/50 bg-[#1F1F1C] text-[#D8D0C3]'
                      : 'border-[#282824]/50 bg-[#FAF9F6] text-[#282824]'
                  "
                >
                  <strong class="uppercase">[BLOCO SEPARADO · DIRETRIZ DE IMAGEM ANEXADA]</strong>
                  Reference image directive: use Image 1 (Slot 1) strictly as Geometry Master and Image 3 (Slot 3) as Texture Source with strict Footprint Lock.
                </div>
              </div>
            </section>

            <!-- 1. A Anatomia do Prompt -->
            <section class="space-y-4">
              <div>
                <h3 class="font-display text-lg font-semibold">
                  1. Anatomia das 6 Fases Arquitetônicas
                </h3>
                <p
                  class="text-sm mt-1 max-w-prose leading-relaxed"
                  :class="isDark ? 'text-[#E8E8E3]/80' : 'text-[#77766F]'"
                >
                  Modelos de difusão atribuem maior peso semântico aos tokens iniciais. Por isso, a narrativa parte da escala <strong>Macro</strong> (sujeito e implantação), passa pela escala <strong>Média</strong> (materialidade) e <strong>Micro</strong> (paisagismo e primeiro plano), e finaliza com iluminação, travas de preservação e o sufixo Anti-CGI na <strong>Fase 06</strong>.
                </p>
              </div>

              <div class="grid grid-cols-1 gap-4">
                <article
                  v-for="item in GUIDE_PHASES"
                  :key="item.phase"
                  class="rounded-[12px] border-[1.75px] p-4"
                  :class="
                    isDark
                      ? 'bg-[#1F1F1C] border-[#77766F]/40'
                      : 'bg-[#FAF9F6] border-[#282824] shadow-[3px_3px_0px_#282824]'
                  "
                >
                  <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div class="flex items-center gap-2.5">
                      <span
                        class="inline-flex h-7 w-7 items-center justify-center rounded-[8px] border-[1.5px] font-mono text-xs font-semibold tabular-nums"
                        :class="
                          isDark
                            ? 'bg-[#C98268]/25 text-[#FAF9F6] border-[#D8B99A]'
                            : 'bg-[#C98268] text-[#282824] border-[#282824] shadow-[2px_2px_0px_#282824]'
                        "
                      >
                        0{{ item.phase }}
                      </span>
                      <h4 class="font-display font-semibold text-sm md:text-base">
                        {{ item.title }}
                      </h4>
                    </div>

                    <span
                      class="rounded-[6px] border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide"
                      :class="
                        isDark
                          ? 'border-[#77766F]/40 bg-[#161614] text-[#D8D0C3]'
                          : 'border-[#282824]/40 bg-[#E8E8E3] text-[#282824]'
                      "
                    >
                      {{ item.tag }}
                    </span>
                  </div>

                  <p
                    class="my-2.5 rounded-[8px] border px-3 py-2 font-mono text-xs"
                    :class="
                      isDark
                        ? 'bg-[#161614] border-[#77766F]/40 text-[#E8E8E3]'
                        : 'bg-[#F5F1E9] border-[#282824]/40 text-[#282824]'
                    "
                  >
                    {{ item.originalText }}
                  </p>

                  <dl class="mt-3 space-y-2 text-xs leading-relaxed">
                    <div class="flex flex-col sm:flex-row sm:gap-2">
                      <dt class="font-semibold shrink-0">Função visual:</dt>
                      <dd :class="isDark ? 'text-[#E8E8E3]/80' : 'text-[#77766F]'">
                        {{ item.whatItDoes }}
                      </dd>
                    </div>
                    <div class="flex flex-col sm:flex-row sm:gap-2">
                      <dt class="font-semibold shrink-0">Posicionamento:</dt>
                      <dd :class="isDark ? 'text-[#E8E8E3]/80' : 'text-[#77766F]'">
                        {{ item.placement }}
                      </dd>
                    </div>
                  </dl>
                </article>
              </div>
            </section>

            <!-- 2. Workflows Avançados, Intervenções Cirúrgicas & Segurança -->
            <section class="space-y-4">
              <div>
                <h3 class="font-display text-lg font-semibold">
                  2. Workflows Avançados, Intervenções Cirúrgicas &amp; Travas de Segurança
                </h3>
                <p
                  class="text-sm mt-1 max-w-prose leading-relaxed"
                  :class="isDark ? 'text-[#E8E8E3]/80' : 'text-[#77766F]'"
                >
                  Recursos especializados do ArchStudio para decodificar imagens de clientes, extrair os pilares visuais do escritório, realizar demolições virtuais, substituir materiais cirurgicamente e comparar múltiplos motores de IA lado a lado.
                </p>
              </div>

              <div class="grid grid-cols-1 gap-3.5">
                <article
                  v-for="wf in GUIDE_ADVANCED_WORKFLOWS"
                  :key="wf.id"
                  class="rounded-[12px] border-[1.75px] p-4 space-y-2"
                  :class="
                    isDark
                      ? 'bg-[#1F1F1C] border-[#77766F]/40'
                      : 'bg-[#FAF9F6] border-[#282824] shadow-[3px_3px_0px_#282824]'
                  "
                >
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <h4 class="font-display font-semibold text-sm md:text-base">
                      {{ wf.title }}
                    </h4>
                    <span
                      class="rounded-[6px] border border-[#282824] bg-[#D8B99A] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-[#282824]"
                    >
                      {{ wf.badge }}
                    </span>
                  </div>

                  <p class="text-xs leading-relaxed" :class="isDark ? 'text-[#E8E8E3]/85' : 'text-[#77766F]'">
                    {{ wf.summary }}
                  </p>

                  <p class="text-xs leading-relaxed">
                    <strong>Como usar:</strong>
                    <span :class="isDark ? 'text-[#D8D0C3]' : 'text-[#282824]'"> {{ wf.howToUse }}</span>
                  </p>

                  <div
                    class="rounded-[8px] border px-3 py-1.5 font-mono text-[11px]"
                    :class="
                      isDark
                        ? 'bg-[#161614] border-[#77766F]/40 text-[#A5B4A0]'
                        : 'bg-[#F5F1E9] border-[#282824]/30 text-[#282824]'
                    "
                  >
                    {{ wf.promptRuleEn }}
                  </div>
                </article>
              </div>
            </section>

            <!-- 3. Papel dos 3 Slots Multimodais & Testes em Lote -->
            <section
              class="rounded-[14px] border-[1.75px] p-5 space-y-3"
              :class="
                isDark
                  ? 'bg-[#1F1F1C] border-[#77766F]/50'
                  : 'bg-[#FAF9F6] border-[#282824] shadow-[3px_3px_0px_#282824]'
              "
            >
              <h3 class="font-display text-base md:text-lg font-semibold">
                3. Papel dos 3 Slots de Imagem &amp; Testes em Lote (Batch Testing)
              </h3>
              <ul class="space-y-1.5 text-xs leading-relaxed" :class="isDark ? 'text-[#E8E8E3]/85' : 'text-[#282824]'">
                <li>
                  <strong>IMG 01 · Base / Geometria (Geometry Master):</strong> Croqui, print do SketchUp/Revit, planta baixa ou foto de levantamento. Atua como trava estrutural de perspectiva e volumetria.
                </li>
                <li>
                  <strong>IMG 02 · Estilo / Luz (Atmosphere Reference):</strong> Referência de clima luminotécnico (Golden Hour, Blue Hour, sanca 2700K) e direção artística.
                </li>
                <li>
                  <strong>IMG 03 · Material / Objeto 3D (Texture Source):</strong> Amostra de revestimento para <em>Re-Skin Cirúrgico</em> com <em>Footprint Lock</em> ou referência de peça de mobiliário para o <code>3d.hunyuan</code>.
                </li>
                <li>
                  <strong>⚡ Testes em Lote (Batch Testing):</strong> No módulo Canvas, selecione múltiplos motores (<code>gemini.imagen</code>, <code>gpt-image-1</code>, <code>flux.pro</code>, <code>3d.hunyuan</code>) e clique em <strong>Disparar Lote</strong> para comparar lado a lado a fidelidade de luz e materiais.
                </li>
              </ul>
            </section>
          </div>

          <!-- Footer do Drawer -->
          <footer
            class="flex items-center justify-between border-t-[1.75px] px-6 py-4 shrink-0"
            :class="isDark ? 'border-[#77766F]/40 bg-[#1F1F1C]' : 'border-[#282824] bg-[#FAF9F6]'"
          >
            <span class="text-xs" :class="isDark ? 'text-[#D8D0C3]' : 'text-[#77766F]'">
              Alterne entre <strong>7 Blocos (Rápido)</strong> e <strong>12 Blocos (Granular)</strong> no cabeçalho.
            </span>
            <button
              type="button"
              @click="emit('close')"
              class="arch-btn-secondary px-4 py-2 text-xs font-semibold"
            >
              Fechar Caderno
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
