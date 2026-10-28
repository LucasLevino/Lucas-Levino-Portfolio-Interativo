<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ArchIcon from './ArchIcon.vue'

defineProps<{
  isDark: boolean
}>()

const emit = defineEmits<{
  (
    e: 'sync-floorplan',
    payload: {
      imageRef: string
      style: string
      materials: string
      environment: string
      foreground: string
      lighting: string
      technical: string
    }
  ): void
}>()

type ProjectionType = 'isometric-45' | 'topdown-90' | 'exploded-axon' | 'eye-level-pin'
type WallCutHeight = 'full-2.8m' | 'half-1.4m' | 'low-0.8m'
type WallPocheStyle = 'white' | 'charcoal' | 'concrete' | 'balsa'
type CameraCorner = 'SW' | 'SE' | 'NW' | 'NE'
type AttachedPlanMode = 'strict-walls' | 'plan-plus-style' | 'sketch-plan' | 'none'

interface BlueprintRoom {
  id: string
  labelPt: string
  code: string
  measure: string
  promptEn: string
  floorEn: string
  furnitureEn: string
  rect: { x: number; y: number; w: number; h: number }
}

const ROOMS: BlueprintRoom[] = [
  {
    id: 'living',
    labelPt: 'Living & Jantar',
    code: 'Z-01',
    measure: '42,50 m²',
    promptEn: 'integrated open-concept living and dining area',
    floorEn: 'large-format honed travertine stone in the social living zone',
    furnitureEn: 'modular L-shaped bouclé sofa, dining table for eight, and textured area rug',
    rect: { x: 24, y: 118, w: 186, h: 120 }
  },
  {
    id: 'kitchen',
    labelPt: 'Cozinha Gourmet',
    code: 'Z-02',
    measure: '24,80 m²',
    promptEn: 'gourmet kitchen with central stone island',
    floorEn: 'seamless microcement flooring in the kitchen',
    furnitureEn: 'central monolithic island with barstools and built-in cabinetry',
    rect: { x: 210, y: 118, w: 126, h: 120 }
  },
  {
    id: 'master',
    labelPt: 'Suíte Master',
    code: 'Z-03',
    measure: '28,40 m²',
    promptEn: 'master bedroom suite with walk-in closet',
    floorEn: 'warm wide-plank European oak flooring in the master suite',
    furnitureEn: 'king-size platform bed with upholstered headboard, nightstands, and wardrobe',
    rect: { x: 24, y: 30, w: 156, h: 88 }
  },
  {
    id: 'bath',
    labelPt: 'Banheiro Spa',
    code: 'Z-04',
    measure: '11,20 m²',
    promptEn: 'spa bathroom with freestanding tub and walk-in shower',
    floorEn: 'non-slip natural stone tiles in the wet bathroom zone',
    furnitureEn: 'freestanding soaking tub, double vanity, and glass shower enclosure',
    rect: { x: 180, y: 30, w: 78, h: 88 }
  },
  {
    id: 'office',
    labelPt: 'Estúdio Técnico',
    code: 'Z-05',
    measure: '12,60 m²',
    promptEn: 'dedicated architectural home office study',
    floorEn: 'herringbone oak parquet in the study',
    furnitureEn: 'minimalist timber desk, ergonomic chair, and built-in bookshelf',
    rect: { x: 258, y: 30, w: 78, h: 88 }
  },
  {
    id: 'terrace',
    labelPt: 'Varanda & Espelho D’Água',
    code: 'Z-06',
    measure: '38,00 m²',
    promptEn: 'outdoor gourmet veranda and swimming pool deck',
    floorEn: 'slatted Cumaru timber decking on the outdoor terrace',
    furnitureEn: 'outdoor lounge sunbeds, landscaping planters, and calm reflecting pool',
    rect: { x: 336, y: 30, w: 120, h: 208 }
  }
]

const activeTab = ref<'blueprint' | 'camera-pin'>('blueprint')
const projection = ref<ProjectionType>('isometric-45')
const wallHeight = ref<WallCutHeight>('half-1.4m')
const wallPoche = ref<WallPocheStyle>('white')
const cameraCorner = ref<CameraCorner>('SW')
const attachedPlanMode = ref<AttachedPlanMode>('strict-walls')
const selectedRoomIds = ref<string[]>(['living', 'kitchen', 'master', 'bath', 'terrace'])

const pinMode = ref<'camera' | 'target'>('camera')
const cameraPin = ref<{ x: number; y: number }>({ x: 25, y: 78 })
const targetPin = ref<{ x: number; y: number }>({ x: 65, y: 38 })

const toggleRoom = (id: string) => {
  const idx = selectedRoomIds.value.indexOf(id)
  if (idx >= 0) {
    if (selectedRoomIds.value.length > 1) {
      selectedRoomIds.value.splice(idx, 1)
    }
  } else {
    selectedRoomIds.value.push(id)
  }
}

const isRoomSelected = (id: string) => selectedRoomIds.value.includes(id)

const handleGridClick = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
  const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)
  if (pinMode.value === 'camera') {
    cameraPin.value = { x, y }
    pinMode.value = 'target'
  } else {
    targetPin.value = { x, y }
    pinMode.value = 'camera'
  }
}

const getQuadrantLabel = (pos: { x: number; y: number }): string => {
  const vert = pos.y < 38 ? 'upper (North)' : pos.y > 62 ? 'lower (South)' : 'central'
  const horiz = pos.x < 38 ? 'left (West)' : pos.x > 62 ? 'right (East)' : 'center'
  return `${vert}-${horiz} zone (${pos.x}% X, ${pos.y}% Y)`
}

const buildAndEmitFloorPlanPrompt = () => {
  const selectedRooms = ROOMS.filter(r => selectedRoomIds.value.includes(r.id))

  const projectionMap: Record<ProjectionType, string> = {
    'isometric-45': `3D isometric 45-degree cutaway floor plan viewed from the ${cameraCorner.value} corner`,
    'topdown-90': 'top-down 90-degree orthographic humanized architectural floor plan',
    'exploded-axon': `exploded axonometric 3D architectural floor plan viewed from the ${cameraCorner.value} angle`,
    'eye-level-pin': `eye-level 3D interior perspective generated from the floor plan layout, with the camera positioned at the ${getQuadrantLabel(cameraPin.value)} looking toward the ${getQuadrantLabel(targetPin.value)}`
  }

  const wallHeightMap: Record<WallCutHeight, string> = {
    'full-2.8m': 'with full-height 2.8m extruded walls and cutaway roof',
    'half-1.4m': 'with clean 1.4m half-height cutaway walls for unobstructed interior visibility',
    'low-0.8m': 'with low 0.8m architectural section walls showcasing full furniture layouts'
  }

  const wallPocheMap: Record<WallPocheStyle, string> = {
    white: 'crisp white architectural cut-wall tops (white poché)',
    charcoal: 'solid matte charcoal architectural cut-wall tops',
    concrete: 'raw exposed concrete cut-wall sections',
    balsa: 'physical scale-model balsa wood and matte museum board walls'
  }

  const attachedPlanMap: Record<AttachedPlanMode, string> = {
    'strict-walls':
      'strictly following the exact wall geometry, room proportions, doors, and window openings from the attached floor plan image',
    'plan-plus-style':
      'extruding the exact wall layout and room proportions from the first attached floor plan image while applying the materials and color palette from the second attached reference image',
    'sketch-plan':
      'interpreting the attached hand-drawn floor plan sketch into a precise, proportionally accurate architectural layout',
    none: ''
  }

  const imageRef = attachedPlanMap[attachedPlanMode.value]
  const style = `${projectionMap[projection.value]} ${wallHeightMap[wallHeight.value]}`
  const materials = [...selectedRooms.map(r => r.floorEn), wallPocheMap[wallPoche.value]].join(', ')
  const environment = selectedRooms.map(r => r.promptEn).join(', ')
  const foreground = selectedRooms.map(r => r.furnitureEn).join('; ')
  const lighting =
    projection.value === 'topdown-90'
      ? 'soft 45-degree directional sunlight casting clean volumetric drop shadows inside each room for depth perception'
      : 'warm late-afternoon directional sunlight at 45 degrees with soft ambient occlusion along wall-floor corners and subtle 2700K interior recessed glow'
  const technical =
    'Ultra-detailed architectural floor plan visualization, V-Ray and Corona Renderer, razor-sharp edges, accurate scale proportions, no text labels, no dimension numbers, no watermarks, 1:1'

  emit('sync-floorplan', {
    imageRef,
    style,
    materials,
    environment,
    foreground,
    lighting,
    technical
  })
}

watch(
  [projection, wallHeight, wallPoche, cameraCorner, attachedPlanMode, selectedRoomIds, cameraPin, targetPin],
  () => {
    buildAndEmitFloorPlanPrompt()
  },
  { deep: true, immediate: true }
)

const viewConeAngle = computed(() => {
  const dx = targetPin.value.x - cameraPin.value.x
  const dy = targetPin.value.y - cameraPin.value.y
  return Math.atan2(dy, dx) * (180 / Math.PI)
})
</script>

<template>
  <section
    aria-labelledby="floorplan-studio-heading"
    class="rounded-[14px] border-[1.75px] p-5 md:p-6 space-y-5"
    :class="
      isDark
        ? 'bg-[#1F1F1C] border-[#91B5C8]/60 shadow-[4px_4px_0px_#000000]'
        : 'bg-[#FAF9F6] border-[#282824] shadow-[4px_4px_0px_#282824]'
    "
  >
    <!-- Header do Sistema Interativo de Plantas Baixas -->
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
                ? 'border-[#91B5C8] bg-[#91B5C8]/20 text-[#91B5C8]'
                : 'border-[#282824] bg-[#91B5C8] text-[#282824] shadow-[2px_2px_0px_#282824]'
            "
          >
            <ArchIcon name="floor-plan" :size="13" />
            <span>Mapeador 2D → 3D</span>
          </span>
          <span class="font-mono text-xs" :class="isDark ? 'text-[#D8D0C3]/75' : 'text-[#77766F]'">
            Sincronizado ao prompt
          </span>
        </div>
        <h3
          id="floorplan-studio-heading"
          class="mt-1.5 font-display text-base md:text-lg font-semibold"
          :class="isDark ? 'text-[#FAF9F6]' : 'text-[#282824]'"
        >
          Configurador de Planta Baixa & Câmera no Prompt
        </h3>
      </div>

      <!-- Alternar entre Zonas da Planta e Coordenadas de Câmera -->
      <div
        role="group"
        aria-label="Modo de configuração da planta baixa"
        class="inline-flex rounded-[10px] border-[1.5px] p-1 self-start"
        :class="isDark ? 'bg-[#282824] border-[#77766F]/50' : 'bg-[#F5F1E9] border-[#282824]'"
      >
        <button
          type="button"
          :aria-pressed="activeTab === 'blueprint'"
          @click="activeTab = 'blueprint'"
          class="rounded-[7px] px-3 py-1.5 text-xs font-semibold transition-all duration-120 focus-visible:outline-none"
          :class="
            activeTab === 'blueprint'
              ? 'bg-[#91B5C8] text-[#282824] border border-[#282824] shadow-[2px_2px_0px_#282824]'
              : isDark
                ? 'text-[#D8D0C3] hover:text-[#FAF9F6]'
                : 'text-[#77766F] hover:text-[#282824]'
          "
        >
          Zonas & Revestimentos
        </button>
        <button
          type="button"
          :aria-pressed="activeTab === 'camera-pin'"
          @click="activeTab = 'camera-pin'"
          class="rounded-[7px] px-3 py-1.5 text-xs font-semibold transition-all duration-120 focus-visible:outline-none"
          :class="
            activeTab === 'camera-pin'
              ? 'bg-[#91B5C8] text-[#282824] border border-[#282824] shadow-[2px_2px_0px_#282824]'
              : isDark
                ? 'text-[#D8D0C3] hover:text-[#FAF9F6]'
                : 'text-[#77766F] hover:text-[#282824]'
          "
        >
          Câmera na Planta Enviada
        </button>
      </div>
    </div>

    <!-- Controles Técnicos da Planta (Projeção, Altura da Parede, Poché) -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div class="space-y-1.5">
        <label class="block font-mono text-[11px] font-semibold uppercase" :class="isDark ? 'text-[#D8D0C3]' : 'text-[#77766F]'">
          1. Projeção
        </label>
        <select
          v-model="projection"
          class="w-full rounded-[10px] border-[1.5px] px-3 py-2 text-xs font-medium focus:outline-none"
          :class="
            isDark
              ? 'bg-[#161614] border-[#77766F]/50 text-[#FAF9F6]'
              : 'bg-[#F5F1E9] border-[#282824] text-[#282824]'
          "
        >
          <option value="isometric-45">Maquete 3D Isométrica (Corte 45°)</option>
          <option value="topdown-90">Planta Humanizada 2D (Top-Down 90°)</option>
          <option value="exploded-axon">Axonométrica Explodida 3D</option>
          <option value="eye-level-pin">Perspectiva Interna (Câmera Posicionada)</option>
        </select>
      </div>

      <div class="space-y-1.5">
        <label class="block font-mono text-[11px] font-semibold uppercase" :class="isDark ? 'text-[#D8D0C3]' : 'text-[#77766F]'">
          2. Cota de Corte (Cutaway)
        </label>
        <select
          v-model="wallHeight"
          class="w-full rounded-[10px] border-[1.5px] px-3 py-2 text-xs font-medium focus:outline-none"
          :class="
            isDark
              ? 'bg-[#161614] border-[#77766F]/50 text-[#FAF9F6]'
              : 'bg-[#F5F1E9] border-[#282824] text-[#282824]'
          "
        >
          <option value="half-1.4m">Meia-Parede h=1.40m (Visão Livre)</option>
          <option value="full-2.8m">Pé-Direito Total h=2.80m (Sem Laje)</option>
          <option value="low-0.8m">Corte Baixo h=0.80m (Mobiliário)</option>
        </select>
      </div>

      <div class="space-y-1.5">
        <label class="block font-mono text-[11px] font-semibold uppercase" :class="isDark ? 'text-[#D8D0C3]' : 'text-[#77766F]'">
          3. Acabamento da Parede Cortada
        </label>
        <select
          v-model="wallPoche"
          class="w-full rounded-[10px] border-[1.5px] px-3 py-2 text-xs font-medium focus:outline-none"
          :class="
            isDark
              ? 'bg-[#161614] border-[#77766F]/50 text-[#FAF9F6]'
              : 'bg-[#F5F1E9] border-[#282824] text-[#282824]'
          "
        >
          <option value="white">Branco Nítido (White Poché)</option>
          <option value="charcoal">Grafite Sólido (Charcoal Poché)</option>
          <option value="concrete">Concreto Aparente Seccionado</option>
          <option value="balsa">Maquete Física (Madeira Balsa)</option>
        </select>
      </div>
    </div>

    <!-- ABA 1: Blueprint Vetorial Interativo -->
    <div v-if="activeTab === 'blueprint'" class="space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-2 text-xs" :class="isDark ? 'text-[#E8E8E3]' : 'text-[#282824]'">
        <span>Clique nas zonas abaixo para incluir/remover ambientes e revestimentos no prompt:</span>
        <div class="flex items-center gap-1.5 font-mono">
          <span class="text-[#77766F]">Visada:</span>
          <button
            v-for="corner in (['SW', 'SE', 'NW', 'NE'] as CameraCorner[])"
            :key="corner"
            type="button"
            @click="cameraCorner = corner"
            class="rounded-[6px] border-[1.5px] px-2 py-0.5 text-[11px] font-semibold transition-all"
            :class="
              cameraCorner === corner
                ? 'border-[#282824] bg-[#91B5C8] text-[#282824] shadow-[2px_2px_0px_#282824]'
                : isDark
                  ? 'border-[#77766F]/40 bg-[#161614] text-[#D8D0C3]'
                  : 'border-[#282824]/50 bg-[#F5F1E9] text-[#282824] hover:bg-[#E8E8E3]'
            "
          >
            {{ corner }}
          </button>
        </div>
      </div>

      <div
        class="relative rounded-[12px] border-[1.75px] p-3 overflow-hidden"
        :class="isDark ? 'bg-[#161614] border-[#77766F]/50' : 'bg-[#F5F1E9] border-[#282824]'"
      >
        <svg
          viewBox="0 0 480 265"
          class="w-full h-auto select-none"
          role="group"
          aria-label="Mapa interativo de ambientes da planta baixa"
        >
          <defs>
            <pattern id="arch-blueprint-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                :stroke="isDark ? '#282824' : '#D8D0C3'"
                stroke-width="0.75"
              />
            </pattern>
          </defs>
          <rect width="480" height="265" fill="url(#arch-blueprint-grid)" />

          <g :stroke="isDark ? '#77766F' : '#282824'" stroke-width="1">
            <line x1="24" y1="16" x2="456" y2="16" stroke-dasharray="3,2" />
            <line x1="24" y1="11" x2="24" y2="21" />
            <line x1="180" y1="12" x2="180" y2="20" />
            <line x1="336" y1="12" x2="336" y2="20" />
            <line x1="456" y1="11" x2="456" y2="21" />
          </g>
          <text
            x="240"
            y="12"
            text-anchor="middle"
            font-family="JetBrains Mono, monospace"
            font-size="8.5"
            font-weight="600"
            :fill="isDark ? '#D8D0C3' : '#282824'"
          >
            ├──────── EIXO A-D · 18,40m ────────┤
          </text>

          <g
            v-for="room in ROOMS"
            :key="room.id"
            class="cursor-pointer"
            role="button"
            tabindex="0"
            :aria-pressed="isRoomSelected(room.id)"
            :aria-label="`Alternar ambiente ${room.labelPt}`"
            @click="toggleRoom(room.id)"
            @keydown.enter.prevent="toggleRoom(room.id)"
            @keydown.space.prevent="toggleRoom(room.id)"
          >
            <rect
              :x="room.rect.x"
              :y="room.rect.y"
              :width="room.rect.w"
              :height="room.rect.h"
              :fill="
                isRoomSelected(room.id)
                  ? isDark
                    ? 'rgba(145, 181, 200, 0.22)'
                    : 'rgba(145, 181, 200, 0.34)'
                  : isDark
                    ? 'rgba(31, 31, 28, 0.9)'
                    : 'rgba(250, 249, 246, 0.92)'
              "
              :stroke="
                isRoomSelected(room.id)
                  ? isDark
                    ? '#91B5C8'
                    : '#282824'
                  : '#77766F'
              "
              :stroke-width="isRoomSelected(room.id) ? '2.25' : '1.25'"
            />

            <text
              :x="room.rect.x + 10"
              :y="room.rect.y + 20"
              font-family="JetBrains Mono, monospace"
              font-size="9.5"
              font-weight="600"
              :fill="isRoomSelected(room.id) ? (isDark ? '#91B5C8' : '#282824') : '#77766F'"
            >
              {{ room.code }} · {{ room.measure }} {{ isRoomSelected(room.id) ? '●' : '○' }}
            </text>

            <text
              :x="room.rect.x + 10"
              :y="room.rect.y + 38"
              font-family="Fraunces, Georgia, serif"
              font-size="11.5"
              font-weight="600"
              :fill="isDark ? '#FAF9F6' : '#282824'"
            >
              {{ room.labelPt }}
            </text>
          </g>

          <text
            x="456"
            y="256"
            text-anchor="end"
            font-family="JetBrains Mono, monospace"
            font-size="9"
            font-weight="600"
            :fill="isDark ? '#FAF9F6' : '#282824'"
          >
            NORTE ↑ 0°
          </text>
        </svg>
      </div>
    </div>

    <!-- ABA 2: Posicionador de Câmera no Quadrante da Planta Enviada (Sem input file!) -->
    <div v-else class="space-y-3">
      <p class="text-xs" :class="isDark ? 'text-[#E8E8E3]' : 'text-[#282824]'">
        Clique no quadrante abaixo para descrever no prompt onde a <strong>Câmera (CAM)</strong> e o <strong>Alvo do Olhar (ALVO)</strong> devem ficar dentro da imagem de planta baixa que você enviar para a IA:
      </p>

      <div
        class="relative rounded-[12px] border-[1.75px] overflow-hidden select-none cursor-crosshair min-h-[210px] flex items-center justify-center arch-technical-grid"
        :class="isDark ? 'bg-[#161614] border-[#77766F]/50' : 'bg-[#F5F1E9] border-[#282824]'"
        @click="handleGridClick"
      >
        <div class="p-6 text-center pointer-events-none space-y-1">
          <p class="font-mono text-xs font-semibold" :class="isDark ? 'text-[#FAF9F6]' : 'text-[#282824]'">
            Câmera: {{ getQuadrantLabel(cameraPin) }} → Olhando para: {{ getQuadrantLabel(targetPin) }}
          </p>
          <p class="text-xs" :class="isDark ? 'text-[#D8D0C3]/70' : 'text-[#77766F]'">
            Clique na malha para reposicionar os pontos e gerar a coordenada espacial no prompt.
          </p>
        </div>

        <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line
            :x1="cameraPin.x"
            :y1="cameraPin.y"
            :x2="targetPin.x"
            :y2="targetPin.y"
            stroke="#F47760"
            stroke-width="0.9"
            stroke-dasharray="2,1.5"
          />
        </svg>

        <div
          class="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1 rounded-[6px] border border-[#282824] bg-[#F47760] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#282824] shadow-[2px_2px_0px_#282824]"
          :style="{ left: `${cameraPin.x}%`, top: `${cameraPin.y}%` }"
        >
          <span>CAM ({{ Math.round(viewConeAngle) }}°)</span>
        </div>

        <div
          class="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-[6px] border border-[#282824] bg-[#A5B4A0] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#282824] shadow-[2px_2px_0px_#282824]"
          :style="{ left: `${targetPin.x}%`, top: `${targetPin.y}%` }"
        >
          ALVO
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span class="font-mono" :class="isDark ? 'text-[#D8D0C3]' : 'text-[#77766F]'">
          Próximo clique posiciona: <strong>{{ pinMode === 'camera' ? 'Pino da Câmera (CAM)' : 'Ponto Alvo do Olhar (ALVO)' }}</strong>
        </span>
        <button
          type="button"
          @click="projection = 'eye-level-pin'"
          class="rounded-[8px] border-[1.5px] px-3 py-1 text-xs font-semibold transition-all"
          :class="
            projection === 'eye-level-pin'
              ? 'border-[#282824] bg-[#A5B4A0] text-[#282824] shadow-[2px_2px_0px_#282824]'
              : isDark
                ? 'border-[#77766F] bg-[#282824] text-[#FAF9F6]'
                : 'border-[#282824] bg-[#FAF9F6] text-[#282824] hover:bg-[#F5F1E9]'
          "
        >
          Usar Coordenadas de Câmera no Prompt
        </button>
      </div>
    </div>

    <!-- Rodapé: Como referenciar a imagem da planta enviada junto com o prompt -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t-[1.5px]"
      :class="isDark ? 'border-[#77766F]/30' : 'border-[#282824]/20'"
    >
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <span class="font-mono font-semibold" :class="isDark ? 'text-[#D8D0C3]' : 'text-[#282824]'">
          Diretriz para a planta enviada junto ao prompt:
        </span>
        <select
          v-model="attachedPlanMode"
          class="rounded-[8px] border-[1.5px] px-2.5 py-1.5 text-xs font-medium focus:outline-none"
          :class="
            isDark
              ? 'bg-[#161614] border-[#77766F]/50 text-[#FAF9F6]'
              : 'bg-[#F5F1E9] border-[#282824] text-[#282824]'
          "
        >
          <option value="strict-walls">Seguir paredes, portas e janelas exatas da planta anexa</option>
          <option value="plan-plus-style">Imagem 1 (Planta Baixa) + Imagem 2 (Referência de Estilo)</option>
          <option value="sketch-plan">Converter croqui/rascunho de planta anexo em layout preciso</option>
          <option value="none">Sem imagem de planta anexa (gerar layout do zero)</option>
        </select>
      </div>

      <button
        type="button"
        @click="buildAndEmitFloorPlanPrompt"
        class="rounded-[10px] border-[1.5px] px-3.5 py-1.5 text-xs font-semibold transition-all shrink-0"
        :class="
          isDark
            ? 'border-[#91B5C8] bg-[#91B5C8] text-[#282824]'
            : 'border-[#282824] bg-[#91B5C8] text-[#282824] shadow-[2.5px_2.5px_0px_#282824] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#282824]'
        "
      >
        Sincronizar com o Prompt
      </button>
    </div>
  </section>
</template>
