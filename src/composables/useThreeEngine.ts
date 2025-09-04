import type { GameEngine } from '~/engines/graphics/GameEngine'

const THREE_ENGINE_KEY = Symbol('ThreeEngine') as InjectionKey<GameEngine>

/**
 * Provides a GameEngine instance to the Vue component tree.
 */
export function provideThreeEngine(engine: GameEngine): void {
  provide(THREE_ENGINE_KEY, engine)
}

/**
 * Injects the GameEngine instance.
 */
export function useThreeEngine(): GameEngine {
  const engine = inject(THREE_ENGINE_KEY)
  if (!engine)
    throw new Error('GameEngine instance not provided')
  return engine
}
