<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ArchIcon from './ArchIcon.vue'

defineProps<{
  isDark: boolean
}>()

const emit = defineEmits<{
  (
    e: 'sync-texture-sheet',
    payload: {
      imageRef: string
      style: string
      materials: string
      environment: string
      foreground: string
      lighting: string
      mood: string
      technical: string
    }
  ): void
}>()

type SheetLayoutType = 'pbr-board' | 'seamless-tile' | 'finish-comparison' | 'sample-slab'
type RoughnessPreset = 'honed-matte' | 'raw-chiseled' | 'brushed-satin' | 'polished-gloss'
type ModulationType = 'seamless-continuous' | 'slabs-1.5mm' | 'slatted-30mm' | 'herringbone'
type PhysicalScale = '100x100cm' | '120x120cm' | '50x50cm' | '25x25cm-macro'

interface MaterialPresetSpec {
  id: string
  code: string
  namePt: string
  categoryPt: string
  swatches: [string, string, string]
  materialsEn: string
  pbrNotesEn: string
}

const MATERIAL_SPECS: MaterialPresetSpec[] = [
  {
    id: 'travertino',
    code: 'MAT-01',
    namePt: 'Travertino Romano Bruto',
    categoryPt: 'Pedra Natural',
    swatches: ['#D8D0C3', '#C5B8A5', '#8C8275'],
    materialsEn:
      'raw unfilled Roman Travertine stone with organic porous cavities, warm ivory-sand mineral strata, and directional vein-cut layers',
    pbrNotesEn: 'deep normal-map pore cavities and natural mineral travertine height displacement'
  },
  {
    id: 'freijo',
    code: 'MAT-02',
    namePt: 'Madeira Freijó Natural',
    categoryPt: 'Madeira Nobre',
    swatches: ['#C99468', '#A67249', '#5E3D24'],
    materialsEn:
      'quarter-sawn Brazilian Freijó hardwood with warm golden-honey heartwood, fine straight open-pore wood grain, and natural oil finish',
    pbrNotesEn: 'anisotropic wood fiber specular reflection and fine open-pore normal relief'
  },
  {
    id: 'concreto',
    code: 'MAT-03',
    namePt: 'Concreto Aparente Ripado',
    categoryPt: 'Mineral / Estrutural',
    swatches: ['#C2C0B8', '#96948C', '#5A5954'],
    materialsEn:
      'architectural board-formed exposed concrete with subtle pine wood grain imprints, authentic air-pocket pinholes, and tie-rod cone marks',
    pbrNotesEn: 'board-formed timber imprint relief and micro-pitted cementitious roughness'
  },
  {
    id: 'calacatta',
    code: 'MAT-04',
    namePt: 'Mármore Calacatta Viola',
    categoryPt: 'Rocha Metamórfica',
    swatches: ['#F5F2EB', '#8A525A', '#4A2C32'],
    materialsEn:
      'honed Calacatta Viola marble with creamy alabaster clasts and dramatic brecciated burgundy-violet mineral veining',
    pbrNotesEn: 'subtle subsurface scattering in white calcite clasts and crisp vein transitions'
  },
  {
    id: 'boucle',
    code: 'MAT-05',
    namePt: 'Tecido Bouclé & Linho Cru',
    categoryPt: 'Têxtil Arquitetônico',
    swatches: ['#EFECE6', '#D8D0C3', '#9E9689'],
    materialsEn:
      'heavyweight ivory architectural bouclé upholstery fabric with looped wool yarn knots, multi-tonal warm cream fibers, and tactile weave',
    pbrNotesEn: 'soft fabric sheen, high micro-displacement yarn loops, and woven ambient occlusion'
  },
  {
    id: 'terracota',
    code: 'MAT-06',
    namePt: 'Terracota Artesanal',
    categoryPt: 'Cerâmica Natural',
    swatches: ['#C98268', '#B0654A', '#7A422E'],
    materialsEn:
      'handcrafted kiln-fired architectural terracotta clay with warm earthy pigment variations and fine mineral sand speckles',
    pbrNotesEn: 'matte porous clay roughness and organic hand-molded surface undulation'
  }
]

const layoutType = ref<SheetLayoutType>('pbr-board')
const activeMaterialId = ref<string>('travertino')
const roughness = ref<RoughnessPreset>('honed-matte')
const modulation = ref<ModulationType>('seamless-continuous')
const physicalScale = ref<PhysicalScale>('100x100cm')
const includePbrChannelsInset = ref<boolean>(true)
const refImageMode = ref<'extract-from-photo' | 'none'>('extract-from-photo')

const activeMaterial = computed<MaterialPresetSpec>(() => {
  return MATERIAL_SPECS.find(m => m.id === activeMaterialId.value) || MATERIAL_SPECS[0]
})

const buildAndEmitTexturePrompt = () => {
  const mat = activeMaterial.value

  const layoutMap: Record<SheetLayoutType, string> = {
    'pbr-board':
      'architectural PBR material specification sheet and technical texture board featuring a flat-lay seamless surface swatch, a 3D shader calibration sphere, and a 45-degree macro relief detail view',
    'seamless-tile':
      'orthographic 90-degree top-down seamless tileable architectural texture swatch with zero perspective distortion and uniform edge-to-edge continuity',
    'finish-comparison':
      'architectural material sample board comparing four surface finishes side-by-side: raw split-face, honed matte, brushed open-pore, and polished',
    'sample-slab':
      'physical architectural sample card on a minimalist drafting table showing a cut material slab with exposed edge thickness, scale bar, and color swatches'
  }

  const roughnessMap: Record<RoughnessPreset, string> = {
    'honed-matte': 'matte honed surface finish (Roughness 0.65) with soft diffused specular response',
    'raw-chiseled': 'deep tactile raw chiseled relief (Roughness 0.85) with pronounced height displacement',
    'brushed-satin': 'anisotropic brushed satin finish (Roughness 0.42) with directional micro-texture',
    'polished-gloss': 'mirror-polished architectural finish (Roughness 0.12) with crisp reflections'
  }

  const modulationMap: Record<ModulationType, string> = {
    'seamless-continuous': `continuous seamless surface modulation representing a ${physicalScale.value} real-world physical scale with zero visible repetition`,
    'slabs-1.5mm': `rectified architectural slabs representing a ${physicalScale.value} area with ultra-thin 1.5mm hairline shadow-gap joints`,
    'slatted-30mm': `vertical slatted architectural modulation (${physicalScale.value} scale) with 30mm slat width and 15mm recessed shadow gaps`,
    herringbone: `precision 45-degree herringbone and chevron modulation (${physicalScale.value} real-world scale) with tight craft joinery`
  }

  const pbrChannelsSuffix = includePbrChannelsInset.value
    ? ', accompanied by technical PBR channel callouts (BaseColor Albedo, Normal Map, Roughness Map, and Height Displacement)'
    : ''

  const imageRef =
    refImageMode.value === 'extract-from-photo'
      ? 'extracting and recreating the exact surface material, grain, color albedo, and tactile micro-relief from the attached reference image into a clean seamless PBR specification sheet'
      : ''

  const style = layoutMap[layoutType.value]
  const materials = mat.materialsEn
  const environment = modulationMap[modulation.value]
  const foreground = `physically accurate PBR surface behavior with ${roughnessMap[roughness.value]}, ${mat.pbrNotesEn}${pbrChannelsSuffix}`
  const lighting =
    layoutType.value === 'seamless-tile'
      ? 'perfectly even flat-field cross-polarized D65 5500K diffuse lighting with zero vignetting and zero specular hotspots for seamless 3D tiling'
      : 'calibrated D65 5500K neutral studio illumination paired with a subtle 30-degree grazing light to reveal surface micro-topography without color cast'
  const mood = 'color-accurate, tactile, physically authentic, and specification-ready'
  const technical =
    '8K PBR material scan, Substance 3D Designer and Quixel Megascans quality, 100mm macro prime lens, zero barrel distortion, razor-sharp focus, no text, 1:1'

  emit('sync-texture-sheet', {
    imageRef,
    style,
    materials,
    environment,
    foreground,
    lighting,
    mood,
    technical
  })
}

watch(
  [layoutType, activeMaterialId, roughness, modulation, physicalScale, includePbrChannelsInset, refImageMode],
  () => {
    buildAndEmitTexturePrompt()
  },
  { immediate: true }
)
</script>

<template>
  <section
    aria-labelledby="texture-sheet-studio-heading"
    class="rounded-[14px] border-[1.75px] p-5 md:p-6 space-y-5"
    :class="
      isDark
        ? 'bg-[#1F1F1C] border-[#D8B99A]/60 shadow-[4px_4px_0px_#000000]'
        : 'bg-[#FAF9F6] border-[#282824] shadow-[4px_4px_0px_#282824]'
    "
  >
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-[1.5px] pb-4"
      :class="isDark ? 'border-[#77766F]/30' : 'border-[#282824]/20'"
    >
      <div>
        <div class="flex flex-wrap items-center gap-2">
          <span
            class="inline-flex items-center gap-1.5 rounded-[8px] border-[1.5px] px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase"
            :class="
              isDark
                ? 'border-[#D8B99A] bg-[#D8B99A]/20 text-[#D8B99A]'
                : 'border-[#282824] bg-[#D8B99A] text-[#282824] shadow-[2px_2px_0px_#282824]'
            "
          >
            <ArchIcon name="texture-sheet" :size="13" />
            <span>Laboratório PBR & Seamless</span>
          </span>
          <span class="font-mono text-xs" :class="isDark ? 'text-[#D8D0C3]/75' : 'text-[#77766F]'">
            Calibrado D65 · 5500K · 8K
          </span>
        </div>
        <h3
          id="texture-sheet-studio-heading"
          class="mt-1.5 font-display text-base md:text-lg font-semibold"
          :class="isDark ? 'text-[#FAF9F6]' : 'text-[#282824]'"
        >
          Criar Ficha de Textura & Especificação de Materiais PBR
        </h3>
      </div>

      <label
        class="inline-flex items-center gap-2 rounded-[10px] border-[1.5px] px-3 py-1.5 text-xs font-semibold cursor-pointer select-none"
        :class="
          includePbrChannelsInset
            ? 'border-[#282824] bg-[#A5B4A0] text-[#282824] shadow-[2px_2px_0px_#282824]'
            : isDark
              ? 'border-[#77766F]/50 bg-[#161614] text-[#D8D0C3]'
              : 'border-[#282824] bg-[#F5F1E9] text-[#282824]'
        "
      >
        <input
          v-model="includePbrChannelsInset"
          type="checkbox"
          class="sr-only"
        />
        <ArchIcon :name="includePbrChannelsInset ? 'check' : 'plus'" :size="12" />
        <span>Incluir Mapas PBR (Albedo/Normal/Roughness)</span>
      </label>
    </div>

    <!-- Seletor Rápido de Matéria-Prima Base (6 Amostras Táteis) -->
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <span class="font-mono text-[11px] font-semibold uppercase" :class="isDark ? 'text-[#D8D0C3]' : 'text-[#77766F]'">
          1. Escolha a Matéria-Prima Base da Ficha:
        </span>
        <span class="font-mono text-[11px]" :class="isDark ? 'text-[#D8B99A]' : 'text-[#282824]'">
          {{ activeMaterial.code }} · {{ activeMaterial.namePt }}
        </span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <button
          v-for="mat in MATERIAL_SPECS"
          :key="mat.id"
          type="button"
          :aria-pressed="activeMaterialId === mat.id"
          @click="activeMaterialId = mat.id"
          class="rounded-[10px] border-[1.5px] p-2.5 text-left transition-all"
          :class="
            activeMaterialId === mat.id
              ? isDark
                ? 'border-[#D8B99A] bg-[#282824] text-[#FAF9F6] shadow-[2px_2px_0px_#000000]'
                : 'border-[#282824] bg-[#D8B99A]/45 text-[#282824] shadow-[2.5px_2.5px_0px_#282824] -translate-y-[0.5px]'
              : isDark
                ? 'border-[#77766F]/40 bg-[#161614] text-[#D8D0C3] hover:border-[#D8D0C3]'
                : 'border-[#282824]/60 bg-[#F5F1E9] text-[#282824] hover:bg-[#E8E8E3]'
          "
        >
          <div class="flex items-center gap-1 mb-1.5">
            <span
              v-for="(hex, idx) in mat.swatches"
              :key="idx"
              class="h-3.5 w-3.5 rounded-full border border-[#282824]"
              :style="{ backgroundColor: hex }"
            ></span>
          </div>
          <p class="font-display text-xs font-semibold leading-tight truncate">
            {{ mat.namePt }}
          </p>
          <p class="font-mono text-[10px] text-[#77766F] truncate mt-0.5">
            {{ mat.categoryPt }}
          </p>
        </button>
      </div>
    </div>

    <!-- Parâmetros Técnicos da Ficha (Formato, Rugosidade PBR, Paginação e Escala) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="space-y-1">
        <label class="block font-mono text-[11px] font-semibold uppercase" :class="isDark ? 'text-[#D8D0C3]' : 'text-[#77766F]'">
          2. Layout da Ficha
        </label>
        <select
          v-model="layoutType"
          class="w-full rounded-[10px] border-[1.5px] px-2.5 py-2 text-xs font-medium focus:outline-none"
          :class="
            isDark
              ? 'bg-[#161614] border-[#77766F]/50 text-[#FAF9F6]'
              : 'bg-[#F5F1E9] border-[#282824] text-[#282824]'
          "
        >
          <option value="pbr-board">Ficha PBR Completa (Swatch + Esfera 3D)</option>
          <option value="seamless-tile">Textura Seamless 1:1 Pura (90° Tileable)</option>
          <option value="finish-comparison">Comparativo 4 Acabamentos</option>
          <option value="sample-slab">Placa de Amostra Física c/ Borda</option>
        </select>
      </div>

      <div class="space-y-1">
        <label class="block font-mono text-[11px] font-semibold uppercase" :class="isDark ? 'text-[#D8D0C3]' : 'text-[#77766F]'">
          3. Acabamento & Roughness
        </label>
        <select
          v-model="roughness"
          class="w-full rounded-[10px] border-[1.5px] px-2.5 py-2 text-xs font-medium focus:outline-none"
          :class="
            isDark
              ? 'bg-[#161614] border-[#77766F]/50 text-[#FAF9F6]'
              : 'bg-[#F5F1E9] border-[#282824] text-[#282824]'
          "
        >
          <option value="honed-matte">Levigado Fosco (Roughness 0.65)</option>
          <option value="raw-chiseled">Bruto / Clivado (Roughness 0.85)</option>
          <option value="brushed-satin">Escovado Acetinado (Roughness 0.42)</option>
          <option value="polished-gloss">Polido Espelhado (Roughness 0.12)</option>
        </select>
      </div>

      <div class="space-y-1">
        <label class="block font-mono text-[11px] font-semibold uppercase" :class="isDark ? 'text-[#D8D0C3]' : 'text-[#77766F]'">
          4. Paginação / Junta
        </label>
        <select
          v-model="modulation"
          class="w-full rounded-[10px] border-[1.5px] px-2.5 py-2 text-xs font-medium focus:outline-none"
          :class="
            isDark
              ? 'bg-[#161614] border-[#77766F]/50 text-[#FAF9F6]'
              : 'bg-[#F5F1E9] border-[#282824] text-[#282824]'
          "
        >
          <option value="seamless-continuous">Contínua Sem Emendas (Seamless)</option>
          <option value="slabs-1.5mm">Placas Junta Seca 1.5mm</option>
          <option value="slatted-30mm">Painel Ripado 30mm + Junta</option>
          <option value="herringbone">Espinha de Peixe (Chevron 45°)</option>
        </select>
      </div>

      <div class="space-y-1">
        <label class="block font-mono text-[11px] font-semibold uppercase" :class="isDark ? 'text-[#D8D0C3]' : 'text-[#77766F]'">
          5. Escala Física Real
        </label>
        <select
          v-model="physicalScale"
          class="w-full rounded-[10px] border-[1.5px] px-2.5 py-2 text-xs font-medium focus:outline-none"
          :class="
            isDark
              ? 'bg-[#161614] border-[#77766F]/50 text-[#FAF9F6]'
              : 'bg-[#F5F1E9] border-[#282824] text-[#282824]'
          "
        >
          <option value="100x100cm">100cm × 100cm (Padrão 3D)</option>
          <option value="120x120cm">120cm × 120cm (Grande Formato)</option>
          <option value="50x50cm">50cm × 50cm (Detalhe Médio)</option>
          <option value="25x25cm-macro">25cm × 25cm (Macro Close-Up)</option>
        </select>
      </div>
    </div>

    <!-- Diagrama Técnico Interativo da Ficha de Textura -->
    <div
      class="rounded-[12px] border-[1.75px] p-3.5"
      :class="isDark ? 'bg-[#161614] border-[#77766F]/50' : 'bg-[#F5F1E9] border-[#282824]'"
    >
      <svg
        viewBox="0 0 520 175"
        class="w-full h-auto select-none"
        role="img"
        aria-label="Diagrama da Ficha Técnica de Textura PBR"
      >
        <!-- Swatch Principal Seamless -->
        <rect
          x="12"
          y="14"
          width="148"
          height="148"
          rx="8"
          :fill="activeMaterial.swatches[0]"
          stroke="#282824"
          stroke-width="2"
        />
        <!-- Linhas de paginação / veios simulados -->
        <template v-if="modulation === 'slatted-30mm'">
          <line v-for="i in 6" :key="i" :x1="12 + i * 21" y1="14" :x2="12 + i * 21" y2="162" stroke="#282824" stroke-width="1.5" />
        </template>
        <template v-else-if="modulation === 'slabs-1.5mm'">
          <line x1="86" y1="14" x2="86" y2="162" stroke="#282824" stroke-width="1.25" stroke-dasharray="3,2" />
          <line x1="12" y1="88" x2="160" y2="88" stroke="#282824" stroke-width="1.25" stroke-dasharray="3,2" />
        </template>
        <path
          d="M 22 48 Q 85 35 148 56 M 20 96 Q 92 112 150 88 M 24 134 Q 88 122 146 142"
          fill="none"
          :stroke="activeMaterial.swatches[1]"
          stroke-width="2"
        />
        <rect x="20" y="22" width="84" height="18" rx="4" fill="#FAF9F6" stroke="#282824" stroke-width="1.2" />
        <text x="62" y="34" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#282824">
          SWATCH {{ physicalScale }}
        </text>

        <!-- Esfera 3D Shader Preview -->
        <rect
          x="174"
          y="14"
          width="145"
          height="148"
          rx="8"
          :fill="isDark ? '#1F1F1C' : '#FAF9F6'"
          stroke="#282824"
          stroke-width="1.75"
        />
        <circle
          cx="246"
          cy="82"
          r="46"
          :fill="activeMaterial.swatches[1]"
          stroke="#282824"
          stroke-width="2"
        />
        <ellipse
          cx="230"
          cy="64"
          :rx="roughness === 'polished-gloss' ? 18 : 12"
          :ry="roughness === 'polished-gloss' ? 11 : 7"
          fill="#FAF9F6"
          :opacity="roughness === 'raw-chiseled' ? 0.35 : 0.75"
          transform="rotate(-25 230 64)"
        />
        <text
          x="246"
          y="148"
          text-anchor="middle"
          font-family="JetBrains Mono, monospace"
          font-size="8.5"
          font-weight="600"
          :fill="isDark ? '#FAF9F6' : '#282824'"
        >
          SHADER SPHERE 3D
        </text>

        <!-- 4 Canais PBR (Albedo, Normal, Roughness, Height) -->
        <g transform="translate(334, 14)">
          <rect x="0" y="0" width="82" height="68" rx="6" :fill="activeMaterial.swatches[0]" stroke="#282824" stroke-width="1.5" />
          <text x="41" y="58" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8" font-weight="700" fill="#282824">
            ALBEDO
          </text>

          <rect x="92" y="0" width="82" height="68" rx="6" fill="#8080FF" stroke="#282824" stroke-width="1.5" />
          <text x="133" y="58" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8" font-weight="700" fill="#282824">
            NORMAL MAP
          </text>

          <rect x="0" y="80" width="82" height="68" rx="6" fill="#9E9E9E" stroke="#282824" stroke-width="1.5" />
          <text x="41" y="138" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8" font-weight="700" fill="#282824">
            ROUGHNESS
          </text>

          <rect x="92" y="80" width="82" height="68" rx="6" fill="#D8D0C3" stroke="#282824" stroke-width="1.5" />
          <text x="133" y="138" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8" font-weight="700" fill="#282824">
            DISPLACEMENT
          </text>
        </g>
      </svg>
    </div>

    <!-- Rodapé de Sincronização -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t-[1.5px]"
      :class="isDark ? 'border-[#77766F]/30' : 'border-[#282824]/20'"
    >
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <span class="font-mono font-semibold" :class="isDark ? 'text-[#D8D0C3]' : 'text-[#282824]'">
          Imagem de amostra enviada no Canvas:
        </span>
        <select
          v-model="refImageMode"
          class="rounded-[8px] border-[1.5px] px-2.5 py-1.5 text-xs font-medium focus:outline-none"
          :class="
            isDark
              ? 'bg-[#161614] border-[#77766F]/50 text-[#FAF9F6]'
              : 'bg-[#F5F1E9] border-[#282824] text-[#282824]'
          "
        >
          <option value="extract-from-photo">Extrair textura/material da foto de referência enviada</option>
          <option value="none">Gerar ficha de textura 100% via descrição textual</option>
        </select>
      </div>

      <button
        type="button"
        @click="buildAndEmitTexturePrompt"
        class="rounded-[10px] border-[1.5px] border-[#282824] bg-[#D8B99A] px-3.5 py-1.5 text-xs font-semibold text-[#282824] shadow-[2.5px_2.5px_0px_#282824] active:translate-x-[1px] active:translate-y-[1px] transition-all shrink-0"
      >
        Atualizar Prompt de Ficha de Textura
      </button>
    </div>
  </section>
</template>
