import type { SprintMode } from '~/stores/settings.input'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSettingsInputStore } from '~/stores/settings.input'

describe('settings input store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('exposes defaults and persists updates', async () => {
    const store = useSettingsInputStore()

    expect(store.sensitivity).toBe(1)
    expect(store.invertY).toBe(false)
    expect(store.sprintMode).toBe('hold')
    expect(store.showHints).toBe(true)

    store.setSensitivity(0.5)
    store.setInvertY(true)
    store.setSprintMode('toggle')
    store.setShowHints(false)
    await nextTick()

    expect(store.sensitivity).toBe(0.5)
    expect(store.invertY).toBe(true)
    expect(store.sprintMode).toBe('toggle')
    expect(store.showHints).toBe(false)

    setActivePinia(createPinia())
    const fresh = useSettingsInputStore()
    expect(fresh.sensitivity).toBe(0.5)
    expect(fresh.invertY).toBe(true)
    expect(fresh.sprintMode).toBe('toggle')
    expect(fresh.showHints).toBe(false)
  })

  it('rejects invalid sprint mode', () => {
    const store = useSettingsInputStore()
    expect(() => store.setSprintMode('invalid' as SprintMode)).toThrow('Invalid sprint mode')
  })

  it('rejects non-positive sensitivity', () => {
    const store = useSettingsInputStore()
    expect(() => store.setSensitivity(0)).toThrow('Sensitivity must be a positive number')
  })
})
