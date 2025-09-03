import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import InputHints from '~/components/ui/hud/InputHints.vue'

function mountWithLocale(locale: string) {
  const i18n = createI18n({ legacy: false, locale, messages: {} })
  return mount(InputHints, {
    global: {
      plugins: [i18n],
    },
  })
}

describe('InputHints', () => {
  it('renders keyboard keys according to locale', () => {
    const en = mountWithLocale('en')
    expect(en.findAll('.key').map(k => k.text())).toEqual(['W', 'A', 'S', 'D'])
    en.unmount()

    const fr = mountWithLocale('fr')
    expect(fr.findAll('.key').map(k => k.text())).toEqual(['Z', 'Q', 'S', 'D'])
  })

  it('switches to gamepad hints when a gamepad connects', async () => {
    const wrapper = mountWithLocale('en')
    expect(wrapper.findAll('.key')).toHaveLength(4)

    ;(navigator as any).getGamepads = () => [{ id: 'stub' } as Gamepad]
    window.dispatchEvent(new Event('gamepadconnected'))
    await nextTick()
    expect(wrapper.find('.gamepad-stick').exists()).toBe(true)

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }))
    await nextTick()
    expect(wrapper.findAll('.key')).toHaveLength(4)
  })
})

