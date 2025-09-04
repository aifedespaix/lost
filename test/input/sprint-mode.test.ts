import { vi, beforeEach, describe, expect, it } from 'vitest'
import { ref, readonly } from 'vue'
vi.stubGlobal('useStorage', <T>(_key: string, value: T) => ref(value))
vi.stubGlobal('readonly', readonly)
import { createPinia, setActivePinia } from 'pinia'
import { InputEngine } from '~/engines/input/InputEngine'
import { KeyboardSource } from '~/engines/input/sources/KeyboardSource'
import { Action } from '~/engines/input/types'
import { useSettingsInputStore } from '~/stores/settings.input'

function setupEngine(store: ReturnType<typeof useSettingsInputStore>): InputEngine {
  const engine = new InputEngine()
  engine.registerSource(new KeyboardSource())

  let sprinting = false
  engine.onAction(Action.Sprint, pressed => {
    if (store.sprintMode === 'hold')
      sprinting = pressed
    else if (pressed)
      sprinting = !sprinting
  })

  const baseSnapshot = engine.snapshot.bind(engine)
  engine.snapshot = () => {
    const snap = baseSnapshot()
    const actions = { ...snap.actions, [Action.Sprint]: sprinting }
    return { ...snap, actions }
  }

  engine.start()
  return engine
}

describe('sprint modes', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('activates sprint only while held in hold mode', () => {
    const store = useSettingsInputStore()
    const engine = setupEngine(store)

    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ShiftLeft' }))
    let snap = engine.snapshot()
    expect(snap.actions[Action.Sprint]).toBe(true)

    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ShiftLeft' }))
    snap = engine.snapshot()
    expect(snap.actions[Action.Sprint]).toBe(false)

    engine.stop()
  })

  it('toggles sprint state in toggle mode', () => {
    const store = useSettingsInputStore()
    store.setSprintMode('toggle')
    const engine = setupEngine(store)

    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ShiftLeft' }))
    let snap = engine.snapshot()
    expect(snap.actions[Action.Sprint]).toBe(true)

    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ShiftLeft' }))
    engine.snapshot() // process release
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ShiftLeft' }))
    snap = engine.snapshot()
    expect(snap.actions[Action.Sprint]).toBe(false)

    engine.stop()
  })
})

