import { acceptHMRUpdate, defineStore } from 'pinia'

export type SprintMode = 'hold' | 'toggle'

/**
 * Store for user input settings.
 *
 * Values are persisted to `localStorage` so they survive page reloads.
 */
export const useSettingsInputStore = defineStore('settings.input', () => {
  const sensitivity = useStorage<number>('settings-input-sensitivity', 1)
  const invertY = useStorage<boolean>('settings-input-invert-y', false)
  const sprintMode = useStorage<SprintMode>('settings-input-sprint-mode', 'hold')
  const showHints = useStorage<boolean>('settings-input-show-hints', true)

  function setSensitivity(value: number) {
    if (!Number.isFinite(value) || value <= 0)
      throw new Error('Sensitivity must be a positive number')
    sensitivity.value = value
  }

  function setInvertY(value: boolean) {
    invertY.value = value
  }

  function setSprintMode(mode: SprintMode) {
    if (mode !== 'hold' && mode !== 'toggle')
      throw new Error('Invalid sprint mode')
    sprintMode.value = mode
  }

  function setShowHints(value: boolean) {
    showHints.value = value
  }

  return {
    sensitivity: readonly(sensitivity),
    invertY: readonly(invertY),
    sprintMode: readonly(sprintMode),
    showHints: readonly(showHints),
    setSensitivity,
    setInvertY,
    setSprintMode,
    setShowHints,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useSettingsInputStore as any, import.meta.hot))
