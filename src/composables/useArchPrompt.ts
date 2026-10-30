import { ref, computed, watch } from 'vue'
import {
  ARCH_CONTEXTS,
  REFERENCE_IMAGE_FIELD,
  type ArchContextId,
  type PromptMode,
  type QuickFieldId,
  type AdvancedFieldId,
  type QuickPromptData,
  type AdvancedPromptData,
  type CuratedPreset,
  type FieldAccent,
  type ArchFieldConfig
} from '../data/archprompt'

export interface PromptSegment {
  type: 'static' | 'variable'
  text: string
  fieldId?: string
  label?: string
  phase?: number
  accent?: FieldAccent
  isPlaceholder?: boolean
  isOptional?: boolean
}

export interface PromptHistoryItem {
  id: string
  contextId?: ArchContextId
  title: string
  prompt: string
  mode: PromptMode
  imageRef?: string
  quickData: QuickPromptData
  advancedData: AdvancedPromptData
  createdAt: string
  isFavorite: boolean
}

const HISTORY_STORAGE_KEY = 'lucaslevino_archprompt_history_v1'
const THEME_STORAGE_KEY = 'lucaslevino_archprompt_theme_v2'
export const ANTI_DIGITAL_AESTHETIC_SUFFIX =
  'Do not look like a 3D render, CGI, VFX, video game, or digital art.'

const createEmptyQuickData = (): QuickPromptData => ({
  style: '',
  materials: '',
  environment: '',
  foreground: '',
  lighting: '',
  mood: '',
  technical: ''
})

const createEmptyAdvancedData = (): AdvancedPromptData => ({
  archStyle: '',
  buildingType: '',
  location: '',
  materials: '',
  environment: '',
  foreground: '',
  lighting: '',
  lightingDetail: '',
  mood: '',
  renderStyle: '',
  extraCommands: '',
  aspectRatio: ''
})

function parseFieldTokens(raw: string): string[] {
  if (!raw.trim()) return []
  return raw
    .replace(/\s+and\s+/gi, ', ')
    .split(',')
    .map(part => part.trim().replace(/^and\s+/i, '').replace(/\.$/, '').trim())
    .filter(Boolean)
}

function formatFieldTokens(tokens: string[], joinWithAnd = false): string {
  const unique = Array.from(new Set(tokens.filter(Boolean)))
  if (unique.length === 0) return ''
  if (unique.length === 1) return unique[0]
  if (!joinWithAnd) {
    return unique.join(', ')
  }
  if (unique.length === 2) {
    return `${unique[0]} and ${unique[1]}`
  }
  const allButLast = unique.slice(0, -1).join(', ')
  const last = unique[unique.length - 1]
  return `${allButLast}, and ${last}`
}

export function useArchPrompt() {
  const activeContextId = ref<ArchContextId>('exterior')
  const mode = ref<PromptMode>('quick')
  const imageRef = ref<string>('')
  const quickData = ref<QuickPromptData>(createEmptyQuickData())
  const advancedData = ref<AdvancedPromptData>(createEmptyAdvancedData())

  const isManualEdit = ref(false)
  const manualPromptText = ref('')
  const activePresetId = ref<string | null>(null)
  const enforceAntiDigitalSuffix = ref<boolean>(true)

  const loadInitialTheme = (): boolean => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY)
      if (saved !== null) return saved === 'dark'
    } catch {}
    return false
  }
  const isDark = ref<boolean>(loadInitialTheme())

  const toggleTheme = () => {
    isDark.value = !isDark.value
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDark.value ? 'dark' : 'light')
    } catch {}
  }

  const loadHistory = (): PromptHistoryItem[] => {
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const history = ref<PromptHistoryItem[]>(loadHistory())

  const persistHistory = () => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history.value.slice(0, 30)))
    } catch {}
  }

  const activeContext = computed(() => {
    return ARCH_CONTEXTS.find(c => c.id === activeContextId.value) || ARCH_CONTEXTS[0]
  })

  const currentFields = computed<ArchFieldConfig<string>[]>(() => {
    return mode.value === 'quick'
      ? activeContext.value.quickFields
      : activeContext.value.advancedFields
  })

  const referenceImageField = REFERENCE_IMAGE_FIELD

  const contextPresets = computed(() => {
    return activeContext.value.presets
  })

  const selectContext = (ctxId: ArchContextId) => {
    if (activeContextId.value === ctxId) return
    activeContextId.value = ctxId
    quickData.value = createEmptyQuickData()
    advancedData.value = createEmptyAdvancedData()
    activePresetId.value = null
    isManualEdit.value = false
  }

  const getFieldValue = (fieldId: string): string => {
    if (fieldId === 'imageRef') {
      return imageRef.value
    }
    if (mode.value === 'quick') {
      return quickData.value[fieldId as QuickFieldId] ?? ''
    }
    return advancedData.value[fieldId as AdvancedFieldId] ?? ''
  }

  const setFieldValue = (fieldId: string, value: string) => {
    if (fieldId === 'imageRef') {
      imageRef.value = value
      return
    }
    activePresetId.value = null
    if (mode.value === 'quick') {
      quickData.value[fieldId as QuickFieldId] = value
      if (fieldId in advancedData.value) {
        advancedData.value[fieldId as AdvancedFieldId] = value
      }
    } else {
      advancedData.value[fieldId as AdvancedFieldId] = value
      if (fieldId in quickData.value) {
        quickData.value[fieldId as QuickFieldId] = value
      }
    }
  }

  const isChipSelected = (fieldId: string, chipValue: string): boolean => {
    const current = getFieldValue(fieldId).toLowerCase()
    if (!current) return false
    const target = chipValue.toLowerCase().trim()
    const tokens = parseFieldTokens(current).map(t => t.toLowerCase())
    if (tokens.includes(target)) return true
    return current.includes(target)
  }

  const toggleChip = (fieldId: string, chipValue: string) => {
    const fieldCfg =
      fieldId === 'imageRef'
        ? REFERENCE_IMAGE_FIELD
        : currentFields.value.find(f => f.id === fieldId)
    const currentRaw = getFieldValue(fieldId)

    if (fieldCfg?.singleSelectChip) {
      const nextVal = currentRaw.trim().toLowerCase() === chipValue.toLowerCase() ? '' : chipValue
      setFieldValue(fieldId, nextVal)
      return
    }

    if (mode.value === 'quick' && fieldId === 'style' && activeContextId.value === 'exterior') {
      const lowerChip = chipValue.toLowerCase()
      const isSettingChip = lowerChip.startsWith('in a ') || lowerChip.startsWith('in an ')
      if (currentRaw.toLowerCase().includes(lowerChip)) {
        const cleaned = currentRaw
          .replace(new RegExp(chipValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig'), '')
          .replace(/\s{2,}/g, ' ')
          .replace(/^[,\s]+|[,\s]+$/g, '')
        setFieldValue(fieldId, cleaned)
        return
      }
      if (isSettingChip) {
        const withoutOldSetting = currentRaw.replace(/\s+in an?\s+[^,.]+setting/i, '').trim()
        setFieldValue(fieldId, withoutOldSetting ? `${withoutOldSetting} ${chipValue}` : chipValue)
        return
      } else {
        const settingMatch = currentRaw.match(/(\bin an?\s+[^,.]+setting)/i)
        const settingPart = settingMatch ? settingMatch[1] : ''
        setFieldValue(fieldId, settingPart ? `${chipValue} ${settingPart}` : chipValue)
        return
      }
    }

    const tokens = parseFieldTokens(currentRaw)
    const targetLower = chipValue.toLowerCase().trim()
    const existingIndex = tokens.findIndex(t => t.toLowerCase() === targetLower)

    if (existingIndex >= 0) {
      tokens.splice(existingIndex, 1)
      setFieldValue(fieldId, formatFieldTokens(tokens, fieldCfg?.joinWithAnd))
    } else {
      if (currentRaw.toLowerCase().includes(targetLower)) {
        const cleaned = currentRaw
          .replace(new RegExp(chipValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig'), '')
          .replace(/,\s*,/g, ',')
          .replace(/^[,\s]+|[,\s]+$/g, '')
        setFieldValue(fieldId, cleaned)
      } else {
        tokens.push(chipValue)
        setFieldValue(fieldId, formatFieldTokens(tokens, fieldCfg?.joinWithAnd))
      }
    }
  }

  // Construct structured segments dynamically based on activeContext connectors (pure render prompt)
  const promptSegments = computed<PromptSegment[]>(() => {
    const conn = activeContext.value.connectors

    if (mode.value === 'quick') {
      const d = quickData.value
      const qFields = activeContext.value.quickFields
      const seg = (id: QuickFieldId, placeholder: string): PromptSegment => {
        const cfg = qFields.find(f => f.id === id) || qFields[0]
        const val = d[id]?.trim()
        const cleanVal = val ? val.replace(/\.$/, '') : `[${placeholder}]`
        return {
          type: 'variable',
          text: cleanVal,
          fieldId: id,
          label: cfg.label,
          phase: cfg.phase,
          accent: cfg.accent,
          isPlaceholder: !val
        }
      }

      return [
        { type: 'static', text: conn.intro },
        seg('style', 'style'),
        { type: 'static', text: conn.materialsBridge },
        seg('materials', 'materials'),
        { type: 'static', text: conn.environmentBridge },
        seg('environment', 'environment'),
        { type: 'static', text: conn.foregroundBridge },
        seg('foreground', 'foreground'),
        { type: 'static', text: conn.lightingBridge },
        seg('lighting', 'lighting'),
        { type: 'static', text: conn.moodBridge },
        seg('mood', 'mood'),
        { type: 'static', text: '. ' },
        seg('technical', 'technical'),
        { type: 'static', text: '.' }
      ]
    } else {
      const d = advancedData.value
      const aFields = activeContext.value.advancedFields
      const seg = (id: AdvancedFieldId, placeholder: string): PromptSegment => {
        const cfg = aFields.find(f => f.id === id) || aFields[0]
        const val = d[id]?.trim()
        const cleanVal = val ? val.replace(/\.$/, '') : `[${placeholder}]`
        return {
          type: 'variable',
          text: cleanVal,
          fieldId: id,
          label: cfg.label,
          phase: cfg.phase,
          accent: cfg.accent,
          isPlaceholder: !val
        }
      }

      return [
        { type: 'static', text: conn.advIntro },
        seg('archStyle', 'style'),
        { type: 'static', text: ' ' },
        seg('buildingType', 'subject'),
        { type: 'static', text: conn.advLocationBridge },
        seg('location', 'context'),
        { type: 'static', text: conn.advMaterialsBridge },
        seg('materials', 'materials'),
        { type: 'static', text: conn.advEnvironmentBridge },
        seg('environment', 'environment'),
        { type: 'static', text: conn.advForegroundBridge },
        seg('foreground', 'foreground'),
        { type: 'static', text: conn.advLightingBridge },
        seg('lighting', 'lighting'),
        { type: 'static', text: conn.advLightingDetailBridge },
        seg('lightingDetail', 'light details'),
        { type: 'static', text: conn.advMoodBridge },
        seg('mood', 'mood'),
        { type: 'static', text: '. ' },
        seg('renderStyle', 'render style'),
        { type: 'static', text: ', ' },
        seg('extraCommands', 'extra commands'),
        { type: 'static', text: ', ' },
        seg('aspectRatio', 'aspect ratio'),
        { type: 'static', text: '.' }
      ]
    }
  })

  const templatePrompt = computed(() => {
    const coreRender = promptSegments.value
      .filter(s => !s.isOptional)
      .map(s => s.text)
      .join('')
    const cleanImageRef = imageRef.value.trim().replace(/^[,\s]+|[.\s]+$/g, '')
    const withImageRef = cleanImageRef
      ? `${coreRender} Reference image directive: ${cleanImageRef.charAt(0).toUpperCase() + cleanImageRef.slice(1)}.`
      : coreRender

    if (
      enforceAntiDigitalSuffix.value &&
      !withImageRef.toLowerCase().includes('do not look like a 3d render') &&
      !withImageRef.toLowerCase().includes('do not look like cgi')
    ) {
      return `${withImageRef} ${ANTI_DIGITAL_AESTHETIC_SUFFIX}`
    }
    return withImageRef
  })

  const finalPrompt = computed(() => {
    return isManualEdit.value ? manualPromptText.value : templatePrompt.value
  })

  watch(
    templatePrompt,
    newVal => {
      if (!isManualEdit.value) {
        manualPromptText.value = newVal
      }
    },
    { immediate: true }
  )

  const enableManualEdit = () => {
    manualPromptText.value = templatePrompt.value
    isManualEdit.value = true
  }

  const resetManualEdit = () => {
    isManualEdit.value = false
    manualPromptText.value = templatePrompt.value
  }

  const completionStats = computed(() => {
    const coreFields =
      mode.value === 'quick'
        ? activeContext.value.quickFields
        : activeContext.value.advancedFields
    const total = coreFields.length
    const filled = coreFields.filter(f => Boolean(getFieldValue(f.id).trim())).length
    const percentage = Math.round((filled / total) * 100)
    const isReady = filled === total && !finalPrompt.value.includes('[')
    return {
      filled,
      total,
      pending: total - filled,
      percentage,
      isReady,
      hasImageRef: Boolean(imageRef.value.trim())
    }
  })

  const switchMode = (newMode: PromptMode) => {
    if (mode.value === newMode) return
    if (newMode === 'advanced') {
      if (!advancedData.value.materials && quickData.value.materials) {
        advancedData.value.materials = quickData.value.materials
      }
      if (!advancedData.value.environment && quickData.value.environment) {
        advancedData.value.environment = quickData.value.environment
      }
      if (!advancedData.value.foreground && quickData.value.foreground) {
        advancedData.value.foreground = quickData.value.foreground
      }
      if (!advancedData.value.mood && quickData.value.mood) {
        advancedData.value.mood = quickData.value.mood
      }
      if (!advancedData.value.archStyle && quickData.value.style) {
        advancedData.value.archStyle = quickData.value.style
      }
      if (!advancedData.value.lighting && quickData.value.lighting) {
        advancedData.value.lighting = quickData.value.lighting
      }
      if (!advancedData.value.renderStyle && quickData.value.technical) {
        advancedData.value.renderStyle = quickData.value.technical
        advancedData.value.extraCommands = 'no text'
        advancedData.value.aspectRatio = '1:1'
      }
    } else {
      if (advancedData.value.archStyle || advancedData.value.buildingType || advancedData.value.location) {
        const parts = [
          advancedData.value.archStyle,
          advancedData.value.buildingType,
          advancedData.value.location
        ].filter(Boolean)
        if (parts.length > 0) quickData.value.style = parts.join(' ')
      }
      if (advancedData.value.materials) quickData.value.materials = advancedData.value.materials
      if (advancedData.value.environment) quickData.value.environment = advancedData.value.environment
      if (advancedData.value.foreground) quickData.value.foreground = advancedData.value.foreground
      if (advancedData.value.lighting || advancedData.value.lightingDetail) {
        quickData.value.lighting = [
          advancedData.value.lighting,
          advancedData.value.lightingDetail
        ]
          .filter(Boolean)
          .join(', with ')
      }
      if (advancedData.value.mood) quickData.value.mood = advancedData.value.mood
      if (advancedData.value.renderStyle || advancedData.value.extraCommands || advancedData.value.aspectRatio) {
        quickData.value.technical = [
          advancedData.value.renderStyle,
          advancedData.value.extraCommands,
          advancedData.value.aspectRatio
        ]
          .filter(Boolean)
          .join(', ')
      }
    }
    mode.value = newMode
  }

  const loadPreset = (preset: CuratedPreset) => {
    if (preset.contextId && preset.contextId !== activeContextId.value) {
      activeContextId.value = preset.contextId
    }
    quickData.value = { ...preset.quick }
    advancedData.value = { ...preset.advanced }
    activePresetId.value = preset.id
    isManualEdit.value = false
  }

  const loadReferenceExample = () => {
    const firstPreset = activeContext.value.presets[0]
    if (firstPreset) {
      loadPreset(firstPreset)
    }
  }

  const surpriseMe = () => {
    activePresetId.value = null
    isManualEdit.value = false

    const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

    for (const field of activeContext.value.quickFields) {
      quickData.value[field.id] = pickRandom(field.options).value
    }
    for (const field of activeContext.value.advancedFields) {
      advancedData.value[field.id] = pickRandom(field.options).value
    }
  }

  const clearAll = () => {
    imageRef.value = ''
    quickData.value = createEmptyQuickData()
    advancedData.value = createEmptyAdvancedData()
    activePresetId.value = null
    isManualEdit.value = false
  }

  const saveToHistory = (markFavorite = false, customTitle?: string) => {
    const promptStr = finalPrompt.value.trim()
    if (!promptStr) return

    const existing = history.value.find(item => item.prompt === promptStr)
    if (existing) {
      if (markFavorite) existing.isFavorite = true
      persistHistory()
      return existing
    }

    const defaultTitle =
      customTitle ||
      `[${activeContext.value.label}] ` +
        (mode.value === 'quick'
          ? quickData.value.style.slice(0, 38) || 'Prompt'
          : `${advancedData.value.archStyle} ${advancedData.value.buildingType}`.trim().slice(0, 38) ||
            'Prompt')

    const newItem: PromptHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      contextId: activeContextId.value,
      title: defaultTitle,
      prompt: promptStr,
      mode: mode.value,
      imageRef: imageRef.value,
      quickData: { ...quickData.value },
      advancedData: { ...advancedData.value },
      createdAt: new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      isFavorite: markFavorite
    }

    history.value.unshift(newItem)
    persistHistory()
    return newItem
  }

  const toggleFavorite = (id: string) => {
    const item = history.value.find(h => h.id === id)
    if (item) {
      item.isFavorite = !item.isFavorite
      persistHistory()
    }
  }

  const deleteHistoryItem = (id: string) => {
    history.value = history.value.filter(h => h.id !== id)
    persistHistory()
  }

  const restoreHistoryItem = (item: PromptHistoryItem) => {
    if (item.contextId) {
      activeContextId.value = item.contextId
    }
    mode.value = item.mode
    imageRef.value = item.imageRef || ''
    quickData.value = { ...item.quickData }
    advancedData.value = { ...item.advancedData }
    isManualEdit.value = false
    activePresetId.value = null
  }

  return {
    activeContextId,
    activeContext,
    contextPresets,
    selectContext,
    mode,
    imageRef,
    quickData,
    advancedData,
    currentFields,
    referenceImageField,
    isDark,
    toggleTheme,
    isManualEdit,
    manualPromptText,
    activePresetId,
    enforceAntiDigitalSuffix,
    promptSegments,
    templatePrompt,
    finalPrompt,
    completionStats,
    history,
    getFieldValue,
    setFieldValue,
    isChipSelected,
    toggleChip,
    enableManualEdit,
    resetManualEdit,
    switchMode,
    loadPreset,
    loadReferenceExample,
    surpriseMe,
    clearAll,
    saveToHistory,
    toggleFavorite,
    deleteHistoryItem,
    restoreHistoryItem
  }
}
