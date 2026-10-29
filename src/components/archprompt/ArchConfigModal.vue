<script setup lang="ts">
import { ref } from 'vue'
import { useArchCanvas, type StoragePersistenceMode } from '../../composables/useArchCanvas'
import ArchIcon from './ArchIcon.vue'

defineProps<{
  isOpen: boolean
  isDark: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'notify', message: string): void
}>()

const {
  config,
  configuredProvidersCount,
  exportConfigToJson,
  importConfigFromJson,
  resetApiConfig
} = useArchCanvas()

const showKeys = ref<Record<string, boolean>>({
  gemini: false,
  openai: false,
  fal: false,
  hunyuan: false
})

const isDraggingJson = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const toggleKeyVisibility = (key: string) => {
  showKeys.value[key] = !showKeys.value[key]
}

const setStorageMode = (mode: StoragePersistenceMode) => {
  config.value.storageMode = mode
  emit(
    'notify',
    `Persistência alterada para: ${
      mode === 'both' ? 'LocalStorage + Cookies' : mode === 'cookies' ? 'Cookies' : 'LocalStorage'
    }.`
  )
}

const handleExportJson = () => {
  exportConfigToJson()
  emit('notify', 'Arquivo archstudio-config.json baixado com sucesso.')
}

const triggerFileSelect = () => {
  fileInputRef.value?.click()
}

const processJsonFile = async (file: File) => {
  if (!file.name.toLowerCase().endsWith('.json')) {
    emit('notify', 'Selecione um arquivo válido com extensão .json.')
    return
  }
  try {
    await importConfigFromJson(file)
    emit('notify', `Configuração "${file.name}" importada e salva com sucesso!`)
  } catch (err) {
    emit('notify', 'Erro ao ler o arquivo .json. Verifique a formatação.')
  }
}

const handleFileChange = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    await processJsonFile(file)
    input.value = ''
  }
}

const handleDropJson = async (e: DragEvent) => {
  isDraggingJson.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) {
    await processJsonFile(file)
  }
}

const handleReset = () => {
  resetApiConfig()
  emit('notify', 'Chaves de API e configurações locais limpas.')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="arch-config-modal-title"
      @keydown.escape="emit('close')"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        @click="emit('close')"
        aria-hidden="true"
      ></div>

      <!-- Modal Surface -->
      <div
        class="relative z-10 w-full max-w-2xl rounded-[16px] border-[2px] overflow-hidden my-8"
        :class="
          isDark
            ? 'bg-[#1F1F1C] border-[#FAF9F6] text-[#FAF9F6] shadow-[6px_6px_0px_#000000]'
            : 'bg-[#FAF9F6] border-[#282824] text-[#282824] shadow-[6px_6px_0px_#282824]'
        "
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between gap-3 border-b-[1.75px] px-5 py-4"
          :class="isDark ? 'bg-[#161614] border-[#77766F]/40' : 'bg-[#E8E8E3] border-[#282824]'"
        >
          <div class="flex items-center gap-2.5">
            <span
              class="inline-flex h-8 w-8 items-center justify-center rounded-[8px] border-[1.5px] border-[#282824] bg-[#D8B99A] text-[#282824]"
            >
              <ArchIcon name="key" :size="16" />
            </span>
            <div>
              <h2 id="arch-config-modal-title" class="font-display text-base md:text-lg font-semibold">
                Configurações de API & Backup (.JSON)
              </h2>
              <p class="font-mono text-[11px]" :class="isDark ? 'text-[#D8D0C3]' : 'text-[#77766F]'">
                {{ configuredProvidersCount }} provedor(es) configurado(s) · Salvo localmente no navegador
              </p>
            </div>
          </div>

          <button
            type="button"
            @click="emit('close')"
            class="arch-btn-icon h-8 w-8 inline-flex items-center justify-center"
            aria-label="Fechar configurações"
          >
            <ArchIcon name="close" :size="16" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-5 md:p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          <!-- Seção 1: Importar / Exportar Arquivo .JSON -->
          <div
            class="rounded-[12px] border-[1.75px] p-4 space-y-3"
            :class="
              isDraggingJson
                ? 'border-[#C98268] bg-[#C98268]/15'
                : isDark
                  ? 'bg-[#161614] border-[#77766F]/50'
                  : 'bg-[#F5F1E9] border-[#282824]'
            "
            @dragover.prevent="isDraggingJson = true"
            @dragleave.prevent="isDraggingJson = false"
            @drop.prevent="handleDropJson"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span class="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#C98268]">
                  Portabilidade de Chaves & Setup
                </span>
                <h3 class="font-display text-sm font-semibold">
                  Salvar ou Subir Configuração via Arquivo .JSON
                </h3>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <input
                  ref="fileInputRef"
                  type="file"
                  accept=".json,application/json"
                  class="hidden"
                  @change="handleFileChange"
                />

                <button
                  type="button"
                  @click="triggerFileSelect"
                  class="arch-btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
                >
                  <ArchIcon name="upload" :size="14" />
                  <span>Subir .JSON</span>
                </button>

                <button
                  type="button"
                  @click="handleExportJson"
                  class="arch-btn-primary inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
                >
                  <ArchIcon name="download" :size="14" />
                  <span>Baixar Config (.JSON)</span>
                </button>
              </div>
            </div>

            <p class="text-xs leading-relaxed" :class="isDark ? 'text-[#D8D0C3]' : 'text-[#77766F]'">
              Como o estúdio roda 100% client-side sem servidor intermediário, suas chaves nunca saem do seu computador. Você pode arrastar um arquivo <code>.json</code> para cá para restaurar todas as chaves de API instantaneamente.
            </p>
          </div>

          <!-- Seção 2: Modo de Armazenamento no Navegador (LocalStorage vs Cookies) -->
          <div class="space-y-2">
            <label class="block font-mono text-xs font-semibold uppercase">
              Onde salvar no navegador:
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                @click="setStorageMode('both')"
                class="rounded-[10px] border-[1.5px] p-2.5 text-left text-xs font-semibold transition-all"
                :class="
                  config.storageMode === 'both'
                    ? 'border-[#282824] bg-[#A5B4A0] text-[#282824] shadow-[2px_2px_0px_#282824]'
                    : isDark
                      ? 'border-[#77766F]/40 bg-[#161614] text-[#D8D0C3]'
                      : 'border-[#282824]/60 bg-[#FAF9F6] text-[#282824]'
                "
              >
                <div class="flex items-center justify-between">
                  <span>LocalStorage + Cookie</span>
                  <ArchIcon v-if="config.storageMode === 'both'" name="check" :size="13" />
                </div>
                <p class="font-mono text-[10px] opacity-80 mt-0.5">Recomendado (Redundante)</p>
              </button>

              <button
                type="button"
                @click="setStorageMode('localStorage')"
                class="rounded-[10px] border-[1.5px] p-2.5 text-left text-xs font-semibold transition-all"
                :class="
                  config.storageMode === 'localStorage'
                    ? 'border-[#282824] bg-[#A5B4A0] text-[#282824] shadow-[2px_2px_0px_#282824]'
                    : isDark
                      ? 'border-[#77766F]/40 bg-[#161614] text-[#D8D0C3]'
                      : 'border-[#282824]/60 bg-[#FAF9F6] text-[#282824]'
                "
              >
                <div class="flex items-center justify-between">
                  <span>Apenas LocalStorage</span>
                  <ArchIcon v-if="config.storageMode === 'localStorage'" name="check" :size="13" />
                </div>
                <p class="font-mono text-[10px] opacity-80 mt-0.5">Persistência padrão web</p>
              </button>

              <button
                type="button"
                @click="setStorageMode('cookies')"
                class="rounded-[10px] border-[1.5px] p-2.5 text-left text-xs font-semibold transition-all"
                :class="
                  config.storageMode === 'cookies'
                    ? 'border-[#282824] bg-[#A5B4A0] text-[#282824] shadow-[2px_2px_0px_#282824]'
                    : isDark
                      ? 'border-[#77766F]/40 bg-[#161614] text-[#D8D0C3]'
                      : 'border-[#282824]/60 bg-[#FAF9F6] text-[#282824]'
                "
              >
                <div class="flex items-center justify-between">
                  <span>Apenas Cookies (1 Ano)</span>
                  <ArchIcon v-if="config.storageMode === 'cookies'" name="check" :size="13" />
                </div>
                <p class="font-mono text-[10px] opacity-80 mt-0.5">SameSite=Strict Cookie</p>
              </button>
            </div>
          </div>

          <!-- Seção 3: Campos de API Keys por Modelo -->
          <div class="space-y-4">
            <!-- 1. Google Gemini / Imagen -->
            <div
              class="rounded-[12px] border-[1.5px] p-4 space-y-2.5"
              :class="isDark ? 'bg-[#161614] border-[#77766F]/40' : 'bg-white border-[#282824]'"
            >
              <div class="flex items-center justify-between">
                <label for="cfg-gemini-key" class="font-display text-sm font-semibold">
                  1. Google Gemini / Imagen API Key
                </label>
                <span class="rounded border border-[#282824]/40 px-2 py-0.5 font-mono text-[10px]">
                  gemini.imagen
                </span>
              </div>
              <div class="flex gap-2">
                <input
                  id="cfg-gemini-key"
                  v-model="config.geminiApiKey"
                  :type="showKeys.gemini ? 'text' : 'password'"
                  placeholder="AIzaSy..."
                  class="arch-input flex-1 px-3 py-2 font-mono text-xs"
                />
                <button
                  type="button"
                  @click="toggleKeyVisibility('gemini')"
                  class="arch-btn-secondary px-3 py-1.5 text-xs font-mono font-semibold"
                >
                  {{ showKeys.gemini ? 'Ocultar' : 'Mostrar' }}
                </button>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-mono text-[11px] text-[#77766F] shrink-0">Modelo:</span>
                <input
                  v-model="config.geminiModelName"
                  type="text"
                  placeholder="gemini-2.0-flash-exp-image-generation"
                  class="arch-input flex-1 px-2.5 py-1 font-mono text-[11px]"
                />
              </div>
            </div>

            <!-- 2. OpenAI GPT-Image-1 / DALL-E 3 -->
            <div
              class="rounded-[12px] border-[1.5px] p-4 space-y-2.5"
              :class="isDark ? 'bg-[#161614] border-[#77766F]/40' : 'bg-white border-[#282824]'"
            >
              <div class="flex items-center justify-between">
                <label for="cfg-openai-key" class="font-display text-sm font-semibold">
                  2. OpenAI API Key (GPT-Image-1 / DALL-E 3)
                </label>
                <span class="rounded border border-[#282824]/40 px-2 py-0.5 font-mono text-[10px]">
                  openai.gpt-image
                </span>
              </div>
              <div class="flex gap-2">
                <input
                  id="cfg-openai-key"
                  v-model="config.openaiApiKey"
                  :type="showKeys.openai ? 'text' : 'password'"
                  placeholder="sk-proj-..."
                  class="arch-input flex-1 px-3 py-2 font-mono text-xs"
                />
                <button
                  type="button"
                  @click="toggleKeyVisibility('openai')"
                  class="arch-btn-secondary px-3 py-1.5 text-xs font-mono font-semibold"
                >
                  {{ showKeys.openai ? 'Ocultar' : 'Mostrar' }}
                </button>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-mono text-[11px] text-[#77766F] shrink-0">Modelo:</span>
                <input
                  v-model="config.openaiModelName"
                  type="text"
                  placeholder="gpt-image-1"
                  class="arch-input flex-1 px-2.5 py-1 font-mono text-[11px]"
                />
              </div>
            </div>

            <!-- 3. Fal.ai (Flux Pro Ultra & 3d.hunyuan) -->
            <div
              class="rounded-[12px] border-[1.5px] p-4 space-y-2.5"
              :class="isDark ? 'bg-[#161614] border-[#77766F]/40' : 'bg-white border-[#282824]'"
            >
              <div class="flex items-center justify-between">
                <label for="cfg-fal-key" class="font-display text-sm font-semibold">
                  3. Fal.ai API Key (Flux 1.1 Pro + 3d.hunyuan)
                </label>
                <span class="rounded border border-[#282824]/40 px-2 py-0.5 font-mono text-[10px]">
                  fal.flux-pro / 3d.hunyuan
                </span>
              </div>
              <div class="flex gap-2">
                <input
                  id="cfg-fal-key"
                  v-model="config.falApiKey"
                  :type="showKeys.fal ? 'text' : 'password'"
                  placeholder="key_id:key_secret..."
                  class="arch-input flex-1 px-3 py-2 font-mono text-xs"
                />
                <button
                  type="button"
                  @click="toggleKeyVisibility('fal')"
                  class="arch-btn-secondary px-3 py-1.5 text-xs font-mono font-semibold"
                >
                  {{ showKeys.fal ? 'Ocultar' : 'Mostrar' }}
                </button>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-mono text-[11px] text-[#77766F] shrink-0">Endpoint Flux:</span>
                <input
                  v-model="config.falFluxEndpoint"
                  type="text"
                  class="arch-input flex-1 px-2.5 py-1 font-mono text-[11px]"
                />
              </div>
            </div>

            <!-- 4. 3d.hunyuan Dedicado (Móveis / Objetos Arquitetônicos 3D) -->
            <div
              class="rounded-[12px] border-[1.75px] p-4 space-y-2.5"
              :class="
                isDark
                  ? 'bg-[#161614] border-[#F47760]/60'
                  : 'bg-[#FAF9F6] border-[#282824] shadow-[2px_2px_0px_#F47760]'
              "
            >
              <div class="flex items-center justify-between">
                <label for="cfg-hunyuan-key" class="font-display text-sm font-semibold">
                  4. 3d.hunyuan (Hunyuan 3D — Móveis & Objetos Arquitetônicos)
                </label>
                <span
                  class="rounded border border-[#282824] bg-[#F47760] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#282824]"
                >
                  3d.hunyuan
                </span>
              </div>
              <p class="text-[11px]" :class="isDark ? 'text-[#D8D0C3]' : 'text-[#77766F]'">
                Se deixar a chave específica abaixo em branco, o modelo <code>3d.hunyuan</code> usará automaticamente sua chave da Fal.ai acima no endpoint <code>fal-ai/hunyuan3d-v2</code>.
              </p>
              <div class="flex gap-2">
                <input
                  id="cfg-hunyuan-key"
                  v-model="config.hunyuanApiKey"
                  :type="showKeys.hunyuan ? 'text' : 'password'"
                  placeholder="Chave dedicada 3d.hunyuan (ou usa Fal.ai Key)"
                  class="arch-input flex-1 px-3 py-2 font-mono text-xs"
                />
                <button
                  type="button"
                  @click="toggleKeyVisibility('hunyuan')"
                  class="arch-btn-secondary px-3 py-1.5 text-xs font-mono font-semibold"
                >
                  {{ showKeys.hunyuan ? 'Ocultar' : 'Mostrar' }}
                </button>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-mono text-[11px] text-[#77766F] shrink-0">Endpoint 3D:</span>
                <input
                  v-model="config.hunyuanEndpointUrl"
                  type="text"
                  placeholder="https://fal.run/fal-ai/hunyuan3d-v2"
                  class="arch-input flex-1 px-2.5 py-1 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="flex flex-wrap items-center justify-between gap-3 border-t-[1.75px] px-5 py-3.5"
          :class="isDark ? 'bg-[#161614] border-[#77766F]/40' : 'bg-[#F5F1E9] border-[#282824]'"
        >
          <button
            type="button"
            @click="handleReset"
            class="rounded px-2.5 py-1 text-xs font-semibold text-[#F47760] hover:underline"
          >
            Limpar Chaves Salvas
          </button>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="handleExportJson"
              class="arch-btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
            >
              <ArchIcon name="download" :size="13" />
              <span>Salvar .JSON</span>
            </button>

            <button
              type="button"
              @click="emit('close')"
              class="arch-btn-primary inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold"
            >
              <ArchIcon name="check" :size="14" />
              <span>Concluir & Salvar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
