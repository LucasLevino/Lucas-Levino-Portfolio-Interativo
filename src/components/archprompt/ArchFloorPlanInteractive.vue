<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  isDark: boolean
}>()

const emit = defineEmits<{
  (
    e: 'sync-floorplan',
    payload: {
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

interface BlueprintRoom {
  id: string
  labelPt: string
  code: string
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
    promptEn: 'integrated open-concept living and dining area',
    floorEn: 'large-format honed travertine stone in the social living zone',
    furnitureEn: 'modular L-shaped bouclé sofa, dining table for eight, and textured area rug',
    rect: { x: 20, y: 110, w: 190, h: 130 }
  },
  {
    id: 'kitchen',
    labelPt: 'Cozinha Gourmet',
    code: 'Z-02',
    promptEn: 'gourmet kitchen with central stone island',
    floorEn: 'seamless microcement flooring in the kitchen',
    furnitureEn: 'central monolithic island with barstools and built-in cabinetry',
    rect: { x: 210, y: 110, w: 130, h: 130 }
  },
  {
    id: 'master',
    labelPt: 'Suíte Master',
    code: 'Z-03',
    promptEn: 'master bedroom suite with walk-in closet',
    floorEn: 'warm wide-plank European oak flooring in the master suite',
    furnitureEn: 'king-size platform bed with upholstered headboard, nightstands, and wardrobe',
    rect: { x: 20, y: 20, w: 160, h: 90 }
  },
  {
    id: 'bath',
    labelPt: 'Banheiro Spa',
    code: 'Z-04',
    promptEn: 'spa bathroom with freestanding tub and walk-in shower',
    floorEn: 'non-slip natural stone tiles in the wet bathroom zone',
    furnitureEn: 'freestanding soaking tub, double vanity, and glass shower enclosure',
    rect: { x: 180, y: 20, w: 80, h: 90 }
  },
  {
    id: 'office',
    labelPt: 'Home Office',
    code: 'Z-05',
    promptEn: 'dedicated architectural home office study',
    floorEn: 'herringbone oak parquet in the study',
    furnitureEn: 'minimalist timber desk, ergonomic chair, and built-in bookshelf',
    rect: { x: 260, y: 20, w: 80, h: 90 }
  },
  {
    id: 'terrace',
    labelPt: 'Varanda & Piscina',
    code: 'Z-06',
    promptEn: 'outdoor gourmet veranda and swimming pool deck',
    floorEn: 'slatted Cumaru timber decking on the outdoor terrace',
    furnitureEn: 'outdoor lounge sunbeds, landscaping planters, and calm reflecting pool',
    rect: { x: 340, y: 20, w: 120, h: 220 }
  }
]

const activeTab = ref<'blueprint' | 'upload'>('blueprint')
const projection = ref<ProjectionType>('isometric-45')
const wallHeight = ref<WallCutHeight>('half-1.4m')
const wallPoche = ref<WallPocheStyle>('white')
const cameraCorner = ref<CameraCorner>('SW')
const strictReference = ref<boolean>(true)
const selectedRoomIds = ref<string[]>(['living', 'kitchen', 'master', 'bath', 'terrace'])

// Uploaded floor plan state + interactive camera pin
const uploadedPlanUrl = ref<string | null>(null)
const uploadedPlanName = ref<string>('')
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

const handleFileUpload = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploadedPlanName.value = file.name
  const reader = new FileReader()
  reader.onload = () => {
    uploadedPlanUrl.value = reader.result as string
  }
  reader.readAsDataURL(file)
}

const handleImageClick = (e: MouseEvent) => {
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
    'eye-level-pin': `eye-level 3D interior perspective generated directly from the floor plan layout, with the camera positioned at the ${getQuadrantLabel(cameraPin.value)} looking toward the ${getQuadrantLabel(targetPin.value)}`
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

  const refClause = strictReference.value
    ? ', strictly preserving the exact wall geometry, room proportions, doors, and window openings from the reference floor plan'
    : ''

  const style = `${projectionMap[projection.value]} ${wallHeightMap[wallHeight.value]}${refClause}`
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
    style,
    materials,
    environment,
    foreground,
    lighting,
    technical
  })
}

// Automatically sync whenever any interactive floor plan setting changes
watch(
  [projection, wallHeight, wallPoche, cameraCorner, strictReference, selectedRoomIds, cameraPin, targetPin],
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
    class="rounded-lg border p-5 space-y-5"
    :class="
      isDark
        ? 'bg-stone-900 border-amber-500/40 shadow-sm'
        : 'bg-white border-amber-700/40 shadow-sm'
    "
  >
    <!-- Header do Sistema Interativo de Plantas Baixas -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4" :class="isDark ? 'border-stone-800' : 'border-stone-200'">
      <div>
        <div class="flex items-center gap-2">
          <span
            class="rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold uppercase"
            :class="
              isDark
                ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                : 'border-amber-700/30 bg-amber-50 text-amber-900'
            "
          >
            Mapeador Interativo 2D → 3D
          </span>
          <span class="font-mono text-xs" :class="isDark ? 'text-stone-400' : 'text-stone-600'">
            Sincronizado em tempo real com o prompt
          </span>
        </div>
        <h3
          id="floorplan-studio-heading"
          class="mt-1 font-display text-base md:text-lg font-bold"
          :class="isDark ? 'text-stone-100' : 'text-stone-900'"
        >
          Sistema de Interação com Plantas Baixas
        </h3>
      </div>

      <!-- Alternar entre Blueprint Interativo e Upload de Planta Própria -->
      <div
        role="group"
        aria-label="Modo de interação com planta baixa"
        class="inline-flex rounded-md border p-0.5 self-start"
        :class="isDark ? 'bg-stone-950 border-stone-800' : 'bg-stone-100 border-stone-300'"
      >
        <button
          type="button"
          :aria-pressed="activeTab === 'blueprint'"
          @click="activeTab = 'blueprint'"
          class="rounded px-3 py-1.5 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          :class="
            activeTab === 'blueprint'
              ? isDark
                ? 'bg-amber-500 text-stone-950'
                : 'bg-amber-700 text-white'
              : isDark
                ? 'text-stone-400 hover:text-stone-200'
                : 'text-stone-700 hover:text-stone-900'
          "
        >
          Planta Interativa (Zonas)
        </button>
        <button
          type="button"
          :aria-pressed="activeTab === 'upload'"
          @click="activeTab = 'upload'"
          class="rounded px-3 py-1.5 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          :class="
            activeTab === 'upload'
              ? isDark
                ? 'bg-amber-500 text-stone-950'
                : 'bg-amber-700 text-white'
              : isDark
                ? 'text-stone-400 hover:text-stone-200'
                : 'text-stone-700 hover:text-stone-900'
          "
        >
          Anexar Planta + Posicionar Câmera
        </button>
      </div>
    </div>

    <!-- Controles Técnicos da Planta (Projeção, Altura da Parede, Poché) -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <!-- 1. Projeção -->
      <div class="space-y-1.5">
        <label class="block font-mono text-[11px] font-semibold uppercase" :class="isDark ? 'text-stone-400' : 'text-stone-600'">
          1. Tipo de Projeção
        </label>
        <select
          v-model="projection"
          class="w-full rounded-md border px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
          :class="
            isDark
              ? 'bg-stone-950 border-stone-800 text-stone-100'
              : 'bg-stone-50 border-stone-300 text-stone-900'
          "
        >
          <option value="isometric-45">Maquete 3D Isométrica (Corte 45°)</option>
          <option value="topdown-90">Planta Humanizada 2D (Top-Down 90°)</option>
          <option value="exploded-axon">Axonométrica Explodida 3D</option>
          <option value="eye-level-pin">Perspectiva Interna (A partir do Pino)</option>
        </select>
      </div>

      <!-- 2. Altura do Corte das Paredes -->
      <div class="space-y-1.5">
        <label class="block font-mono text-[11px] font-semibold uppercase" :class="isDark ? 'text-stone-400' : 'text-stone-600'">
          2. Altura das Paredes (Cutaway)
        </label>
        <select
          v-model="wallHeight"
          class="w-full rounded-md border px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
          :class="
            isDark
              ? 'bg-stone-950 border-stone-800 text-stone-100'
              : 'bg-stone-50 border-stone-300 text-stone-900'
          "
        >
          <option value="half-1.4m">Meia-Parede 1.40m (Visão Interna Livre)</option>
          <option value="full-2.8m">Pé-Direito Total 2.80m (Sem Teto)</option>
          <option value="low-0.8m">Corte Baixo 0.80m (Destaque Mobiliário)</option>
        </select>
      </div>

      <!-- 3. Topo da Parede Seccionada (Poché) -->
      <div class="space-y-1.5">
        <label class="block font-mono text-[11px] font-semibold uppercase" :class="isDark ? 'text-stone-400' : 'text-stone-600'">
          3. Acabamento da Parede Cortada
        </label>
        <select
          v-model="wallPoche"
          class="w-full rounded-md border px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
          :class="
            isDark
              ? 'bg-stone-950 border-stone-800 text-stone-100'
              : 'bg-stone-50 border-stone-300 text-stone-900'
          "
        >
          <option value="white">Branco Nítido (White Poché)</option>
          <option value="charcoal">Grafite Escuro (Charcoal Poché)</option>
          <option value="concrete">Concreto Aparente Seccionado</option>
          <option value="balsa">Maquete Física (Madeira Balsa)</option>
        </select>
      </div>
    </div>

    <!-- ABA 1: Blueprint Vetorial Interativo (Clicar nos Cômodos e Ângulo Isométrico) -->
    <div v-if="activeTab === 'blueprint'" class="space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-2 text-xs" :class="isDark ? 'text-stone-300' : 'text-stone-700'">
        <span>Clique nos ambientes na planta abaixo para ativar/desativar zonas e pisos no prompt:</span>
        <div class="flex items-center gap-1.5 font-mono">
          <span>Ângulo Isométrico:</span>
          <button
            v-for="corner in (['SW', 'SE', 'NW', 'NE'] as CameraCorner[])"
            :key="corner"
            type="button"
            @click="cameraCorner = corner"
            class="rounded border px-2 py-0.5 text-[11px] font-semibold transition-colors"
            :class="
              cameraCorner === corner
                ? isDark
                  ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                  : 'border-amber-700 bg-amber-700 text-white'
                : isDark
                  ? 'border-stone-700 bg-stone-950 text-stone-400 hover:text-stone-200'
                  : 'border-stone-300 bg-stone-100 text-stone-700 hover:text-stone-900'
            "
          >
            {{ corner }}
          </button>
        </div>
      </div>

      <!-- Canvas SVG da Planta Baixa Interativa -->
      <div
        class="relative rounded-md border p-3 overflow-hidden"
        :class="isDark ? 'bg-stone-950 border-stone-800' : 'bg-stone-100/80 border-stone-300'"
      >
        <svg
          viewBox="0 0 480 260"
          class="w-full h-auto select-none"
          role="group"
          aria-label="Mapa interativo de ambientes da planta baixa"
        >
          <!-- Grid técnico de fundo -->
          <defs>
            <pattern id="arch-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                :stroke="isDark ? '#292524' : '#d6d3d1'"
                stroke-width="0.6"
              />
            </pattern>
          </defs>
          <rect width="480" height="260" fill="url(#arch-grid)" />

          <!-- Ambientes Clicáveis -->
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
                    ? 'rgba(245, 158, 11, 0.16)'
                    : 'rgba(180, 83, 9, 0.14)'
                  : isDark
                    ? 'rgba(28, 25, 23, 0.85)'
                    : 'rgba(255, 255, 255, 0.85)'
              "
              :stroke="
                isRoomSelected(room.id)
                  ? isDark
                    ? '#f59e0b'
                    : '#b45309'
                  : isDark
                    ? '#57534e'
                    : '#a8a29e'
              "
              stroke-width="2.5"
            />

            <!-- Código Técnico da Zona -->
            <text
              :x="room.rect.x + 10"
              :y="room.rect.y + 20"
              font-family="JetBrains Mono, monospace"
              font-size="10"
              font-weight="600"
              :fill="isRoomSelected(room.id) ? (isDark ? '#fbbf24' : '#92400e') : isDark ? '#78716c' : '#78716c'"
            >
              {{ room.code }} {{ isRoomSelected(room.id) ? '✓' : '' }}
            </text>

            <!-- Nome do Cômodo -->
            <text
              :x="room.rect.x + 10"
              :y="room.rect.y + 38"
              font-family="Plus Jakarta Sans, sans-serif"
              font-size="11.5"
              font-weight="700"
              :fill="isDark ? '#f5f5f4' : '#1c1917'"
            >
              {{ room.labelPt }}
            </text>
          </g>
        </svg>
      </div>
    </div>

    <!-- ABA 2: Upload de Planta Baixa Própria + Posicionador de Câmera -->
    <div v-else class="space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <p class="text-xs" :class="isDark ? 'text-stone-300' : 'text-stone-700'">
          Carregue sua planta baixa (PNG/JPG) e clique sobre a imagem para posicionar o <strong>Pino da Câmera</strong> e a <strong>Direção do Olhar</strong>:
        </p>

        <label
          class="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors"
          :class="
            isDark
              ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
              : 'border-amber-700/30 bg-amber-50 text-amber-900 hover:bg-amber-100'
          "
        >
          <input type="file" accept="image/*" class="sr-only" @change="handleFileUpload" />
          <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
          </svg>
          <span>{{ uploadedPlanUrl ? 'Trocar Planta Baixa' : 'Selecionar Imagem da Planta' }}</span>
        </label>
      </div>

      <!-- Área Interativa da Planta Carregada (ou Canvas de Demonstração) -->
      <div
        class="relative rounded-md border overflow-hidden select-none cursor-crosshair min-h-[220px] flex items-center justify-center"
        :class="isDark ? 'bg-stone-950 border-stone-800' : 'bg-stone-100 border-stone-300'"
        @click="handleImageClick"
      >
        <img
          v-if="uploadedPlanUrl"
          :src="uploadedPlanUrl"
          :alt="`Planta baixa carregada: ${uploadedPlanName}`"
          class="max-h-72 w-full object-contain pointer-events-none"
        />

        <div v-else class="p-8 text-center pointer-events-none space-y-1">
          <p class="font-mono text-xs font-semibold" :class="isDark ? 'text-stone-300' : 'text-stone-700'">
            Clique em qualquer ponto deste quadro para posicionar a Câmera ({{ cameraPin.x }}%, {{ cameraPin.y }}%) e o Alvo ({{ targetPin.x }}%, {{ targetPin.y }}%)
          </p>
          <p class="text-xs" :class="isDark ? 'text-stone-500' : 'text-stone-500'">
            Ou clique em "Selecionar Imagem da Planta" acima para visualizar seu arquivo DWG/PDF exportado em imagem.
          </p>
        </div>

        <!-- Linha Direcional & Pino de Câmera -->
        <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line
            :x1="cameraPin.x"
            :y1="cameraPin.y"
            :x2="targetPin.x"
            :y2="targetPin.y"
            stroke="#f59e0b"
            stroke-width="0.8"
            stroke-dasharray="2,1.5"
          />
        </svg>

        <!-- Marcador Câmera -->
        <div
          class="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1 rounded bg-amber-500 px-1.5 py-0.5 font-mono text-[10px] font-bold text-stone-950 shadow"
          :style="{ left: `${cameraPin.x}%`, top: `${cameraPin.y}%` }"
        >
          <span>CAM ({{ Math.round(viewConeAngle) }}°)</span>
        </div>

        <!-- Marcador Alvo -->
        <div
          class="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded border border-emerald-400 bg-emerald-950/90 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-300 shadow"
          :style="{ left: `${targetPin.x}%`, top: `${targetPin.y}%` }"
        >
          ALVO
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span class="font-mono" :class="isDark ? 'text-stone-400' : 'text-stone-600'">
          Próximo clique posiciona: <strong>{{ pinMode === 'camera' ? 'Pino da Câmera (CAM)' : 'Ponto Alvo do Olhar (ALVO)' }}</strong>
        </span>
        <button
          type="button"
          @click="projection = 'eye-level-pin'"
          class="rounded border px-2.5 py-1 text-xs font-semibold transition-colors"
          :class="
            projection === 'eye-level-pin'
              ? isDark
                ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                : 'border-emerald-700 bg-emerald-50 text-emerald-900'
              : isDark
                ? 'border-stone-700 bg-stone-800 text-stone-200 hover:bg-stone-700'
                : 'border-stone-300 bg-white text-stone-800 hover:bg-stone-100'
          "
        >
          Usar Câmera Posicionada no Prompt
        </button>
      </div>
    </div>

    <!-- Rodapé de Fidelidade Estrita à Planta -->
    <div class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t" :class="isDark ? 'border-stone-800' : 'border-stone-200'">
      <label class="inline-flex items-center gap-2 text-xs cursor-pointer select-none">
        <input
          type="checkbox"
          v-model="strictReference"
          class="h-4 w-4 rounded border-stone-400 text-amber-600 focus:ring-amber-500"
        />
        <span :class="isDark ? 'text-stone-200' : 'text-stone-800'">
          Incluir trava de fidelidade estrita às paredes, portas e janelas da planta de referência
        </span>
      </label>

      <button
        type="button"
        @click="buildAndEmitFloorPlanPrompt"
        class="rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors"
        :class="
          isDark
            ? 'border-amber-500/40 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25'
            : 'border-amber-700 bg-amber-700 text-white hover:bg-amber-800'
        "
      >
        Atualizar Variáveis da Planta
      </button>
    </div>
  </section>
</template>
