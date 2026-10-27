import { ref, computed, watch } from 'vue'
import {
  QUICK_FIELDS,
  ADVANCED_FIELDS,
  CURATED_PRESETS,
  type PromptMode,
  type QuickFieldId,
  type AdvancedFieldId,
  type QuickPromptData,
  type AdvancedPromptData,
  type CuratedPreset,
  type FieldAccent
} from '../data/archprompt'

export interface PromptSegment {
  type: 'static' | 'variable'
  text: string
  fieldId?: string
  label?: string
  phase?: number
  accent?: FieldAccent
  isPlaceholder?: boolean
}

export interface PromptHistoryItem {
  id: string
  title: string
  prompt: string
  mode: PromptMode
  quickData: QuickPromptData
  advancedData: AdvancedPromptData
  createdAt: string
  isFavorite: boolean
}

const HISTORY_STORAGE_KEY = 'lucaslevino_archprompt_history_v1'
const THEME_STORAGE_KEY = 'lucaslevino_archprompt_theme_v1'

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

// Normalize and parse comma / "and" separated items in a field
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
  const mode = ref<PromptMode>('quick')
  const quickData = ref<QuickPromptData>(createEmptyQuickData())
  const advancedData = ref<AdvancedPromptData>(createEmptyAdvancedData())

  // Manual editing of the final generated prompt
  const isManualEdit = ref(false)
  const manualPromptText = ref('')
  const activePresetId = ref<string | null>(null)

  // Theme (Default Dark Studio as in prompt_generator.jsx)
  const loadInitialTheme = (): boolean => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY)
      if (saved !== null) return saved === 'dark'
    } catch {}
    return true
  }
  const isDark = ref<boolean>(loadInitialTheme())

  const toggleTheme = () => {
    isDark.value = !isDark.value
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDark.value ? 'dark' : 'light')
    } catch {}
  }

  // History & Favorites in localStorage
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

  // Current active fields configuration
  const currentFields = computed(() => {
    return mode.value === 'quick' ? QUICK_FIELDS : ADVANCED_FIELDS
  })

  const getFieldValue = (fieldId: string): string => {
    if (mode.value === 'quick') {
      return quickData.value[fieldId as QuickFieldId] ?? ''
    }
    return advancedData.value[fieldId as AdvancedFieldId] ?? ''
  }

  const setFieldValue = (fieldId: string, value: string) => {
    activePresetId.value = null
    if (mode.value === 'quick') {
      quickData.value[fieldId as QuickFieldId] = value
      // Sync shared fields to advanced
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

  // Check if a chip is active in the given field
  const isChipSelected = (fieldId: string, chipValue: string): boolean => {
    const current = getFieldValue(fieldId).toLowerCase()
    if (!current) return false
    const target = chipValue.toLowerCase().trim()
    const tokens = parseFieldTokens(current).map(t => t.toLowerCase())
    if (tokens.includes(target)) return true
    return current.includes(target)
  }

  // Toggle a chip into/out of a field
  const toggleChip = (fieldId: string, chipValue: string) => {
    const fieldCfg = currentFields.value.find(f => f.id === fieldId)
    const currentRaw = getFieldValue(fieldId)

    if (fieldCfg?.singleSelectChip) {
      const nextVal = currentRaw.trim().toLowerCase() === chipValue.toLowerCase() ? '' : chipValue
      setFieldValue(fieldId, nextVal)
      return
    }

    // Special case for style in quick mode when combining subject + setting ("in a ...")
    if (mode.value === 'quick' && fieldId === 'style') {
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
        // Replace existing "in a ... setting" or append
        const withoutOldSetting = currentRaw.replace(/\s+in an?\s+[^,.]+setting/i, '').trim()
        setFieldValue(fieldId, withoutOldSetting ? `${withoutOldSetting} ${chipValue}` : chipValue)
        return
      } else {
        // Extract existing setting if present
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
      // Also check if chipValue itself contains commas (e.g. "8k resolution, photorealistic")
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

  // Construct structured segments for live preview highlighting
  const promptSegments = computed<PromptSegment[]>(() => {
    if (mode.value === 'quick') {
      const d = quickData.value
      const seg = (id: QuickFieldId, placeholder: string): PromptSegment => {
        const cfg = QUICK_FIELDS.find(f => f.id === id)!
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

      const fgValue = d.foreground?.trim() || ''
      const fgHasPrefix = /^a\s+|^an\s+/i.test(fgValue)
      const fgHasInForeground = /in the foreground/i.test(fgValue)

      return [
        { type: 'static', text: 'Render the architecture as a ' },
        seg('style', 'style'),
        { type: 'static', text: ', using ' },
        seg('materials', 'materials'),
        { type: 'static', text: '. Surround the house with ' },
        seg('environment', 'environment'),
        { type: 'static', text: fgHasPrefix ? '. Add ' : '. Add a ' },
        seg('foreground', 'foreground'),
        { type: 'static', text: fgValue && !fgHasInForeground ? ' in the foreground. Use ' : '. Use ' },
        seg('lighting', 'lighting'),
        { type: 'static', text: '. Keep the scene ' },
        seg('mood', 'mood'),
        { type: 'static', text: '. ' },
        seg('technical', 'technical'),
        { type: 'static', text: '.' }
      ]
    } else {
      const d = advancedData.value
      const seg = (id: AdvancedFieldId, placeholder: string): PromptSegment => {
        const cfg = ADVANCED_FIELDS.find(f => f.id === id)!
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
        { type: 'static', text: 'Render the architecture as a ' },
        seg('archStyle', 'style'),
        { type: 'static', text: ' ' },
        seg('buildingType', 'building type'),
        { type: 'static', text: ' in a ' },
        seg('location', 'location'),
        { type: 'static', text: ' setting, using ' },
        seg('materials', 'materials'),
        { type: 'static', text: '. Surround the architecture with ' },
        seg('environment', 'landscaping'),
        { type: 'static', text: '. In the foreground, add ' },
        seg('foreground', 'foreground element'),
        { type: 'static', text: '. Use ' },
        seg('lighting', 'lighting'),
        { type: 'static', text: ' with ' },
        seg('lightingDetail', 'light details'),
        { type: 'static', text: '. Keep the scene ' },
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

  // Constructed prompt string from template
  const templatePrompt = computed(() => {
    return promptSegments.value.map(s => s.text).join('')
  })

  // Final prompt (either template or manually edited)
  const finalPrompt = computed(() => {
    return isManualEdit.value ? manualPromptText.value : templatePrompt.value
  })

  // Keep manualPromptText synced when not in manual edit mode
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

  // Completion statistics
  const completionStats = computed(() => {
    const fields = currentFields.value
    const total = fields.length
    const filled = fields.filter(f => Boolean(getFieldValue(f.id).trim())).length
    const percentage = Math.round((filled / total) * 100)
    const isReady = filled === total && !finalPrompt.value.includes('[')
    return {
      filled,
      total,
      pending: total - filled,
      percentage,
      isReady
    }
  })

  // Switch between Quick & Advanced while bridging values
  const switchMode = (newMode: PromptMode) => {
    if (mode.value === newMode) return
    if (newMode === 'advanced') {
      // Map quick -> advanced if advanced fields are empty
      if (!advancedData.value.materials && quickData.value.materials) {
        advancedData.value.materials = quickData.value.materials
      }
      if (!advancedData.value.environment && quickData.value.environment) {
        advancedData.value.environment = quickData.value.environment
      }
      if (!advancedData.value.foreground && quickData.value.foreground) {
        advancedData.value.foreground = quickData.value.foreground.replace(/\s+in the foreground/i, '')
      }
      if (!advancedData.value.mood && quickData.value.mood) {
        advancedData.value.mood = quickData.value.mood
      }
      if (!advancedData.value.archStyle && quickData.value.style) {
        const match = quickData.value.style.match(/^(.*?)\s+(residence|mansion|pavilion|eco-lodge|cabin|museum|villa|tower)\s*(?:in an?\s+(.*?)\s*setting)?$/i)
        if (match) {
          advancedData.value.archStyle = match[1].trim()
          advancedData.value.buildingType = match[2].trim()
          if (match[3]) advancedData.value.location = match[3].trim()
        } else {
          advancedData.value.archStyle = quickData.value.style
        }
      }
      if (!advancedData.value.lighting && quickData.value.lighting) {
        const parts = quickData.value.lighting.split(/,\s*with\s+/i)
        advancedData.value.lighting = parts[0].trim()
        if (parts[1]) advancedData.value.lightingDetail = parts[1].trim()
      }
      if (!advancedData.value.renderStyle && quickData.value.technical) {
        advancedData.value.renderStyle = 'Ultra-realistic architectural visualization, soft global illumination, detailed vegetation'
        advancedData.value.extraCommands = 'no text'
        advancedData.value.aspectRatio = '1:1'
      }
    } else {
      // Map advanced -> quick
      if (advancedData.value.archStyle || advancedData.value.buildingType || advancedData.value.location) {
        const s = [advancedData.value.archStyle, advancedData.value.buildingType].filter(Boolean).join(' ')
        const loc = advancedData.value.location ? ` in a ${advancedData.value.location} setting` : ''
        if (s) quickData.value.style = `${s}${loc}`
      }
      if (advancedData.value.materials) quickData.value.materials = advancedData.value.materials
      if (advancedData.value.environment) quickData.value.environment = advancedData.value.environment
      if (advancedData.value.foreground) quickData.value.foreground = advancedData.value.foreground
      if (advancedData.value.lighting || advancedData.value.lightingDetail) {
        quickData.value.lighting = [
          advancedData.value.lighting,
          advancedData.value.lightingDetail ? `with ${advancedData.value.lightingDetail}` : ''
        ]
          .filter(Boolean)
          .join(', ')
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

  // Load curated preset
  const loadPreset = (preset: CuratedPreset) => {
    quickData.value = { ...preset.quick }
    advancedData.value = { ...preset.advanced }
    activePresetId.value = preset.id
    isManualEdit.value = false
  }

  // Load the official Reference Prompt from guia_de_prompts_arquitet_nicos.md
  const loadReferenceExample = () => {
    loadPreset(CURATED_PRESETS[0])
  }

  // Randomize / Surprise Me
  const surpriseMe = () => {
    activePresetId.value = null
    isManualEdit.value = false

    const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

    // Generate for both modes so switching modes keeps the surprise
    for (const field of QUICK_FIELDS) {
      quickData.value[field.id] = pickRandom(field.options).value
    }
    for (const field of ADVANCED_FIELDS) {
      advancedData.value[field.id] = pickRandom(field.options).value
    }
  }

  // Clear all fields
  const clearAll = () => {
    quickData.value = createEmptyQuickData()
    advancedData.value = createEmptyAdvancedData()
    activePresetId.value = null
    isManualEdit.value = false
  }

  // Save current prompt to history
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
      (mode.value === 'quick'
        ? quickData.value.style.slice(0, 48) || 'Prompt Arquitetônico'
        : `${advancedData.value.archStyle} ${advancedData.value.buildingType}`.trim().slice(0, 48) ||
          'Prompt Avançado')

    const newItem: PromptHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: defaultTitle,
      prompt: promptStr,
      mode: mode.value,
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
    mode.value = item.mode
    quickData.value = { ...item.quickData }
    advancedData.value = { ...item.advancedData }
    isManualEdit.value = false
    activePresetId.value = null
  }

  return {
    mode,
    quickData,
    advancedData,
    currentFields,
    isDark,
    toggleTheme,
    isManualEdit,
    manualPromptText,
    activePresetId,
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
