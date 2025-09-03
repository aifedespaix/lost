import type { LoadingManager, PerspectiveCamera } from 'three'
import {
  ACESFilmicToneMapping,
  Clock,
  Color,
  Group,
  PCFSoftShadowMap,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three'

import { FpsCamera } from '~/ecs/components/FpsCamera'
import { CharacterController } from '~/ecs/components/CharacterController'
import { createFpsLookSystem } from '~/ecs/systems/FpsLookSystem'
import { createFpsMoveSystem } from '~/ecs/systems/FpsMoveSystem'
import { InputEngine } from '~/engines/input/InputEngine'

import { createMainCamera } from '~/3d/engine/cameras/MainCamera'
import { createDefaultLights } from '~/3d/engine/lights/DefaultLights'
import { Loop } from '~/3d/engine/Loop'
import { ResizeHandler } from '~/3d/engine/ResizeHandler'
import { createLoadingManager } from '~/3d/loaders/loading'
import { createBaseScene } from '~/3d/scene/createBaseScene'
import { disposeObject3D, disposeRenderer } from '~/3d/utils/dispose'

export interface GameEngineOptions {
  canvas: HTMLCanvasElement
  width: number
  height: number
  antialias?: boolean
  background?: string | number
  showHelpers?: boolean
}

export type System = (dt: number, elapsed: number) => void

/**
 * GameEngine orchestrates the Three.js rendering pipeline and lifecycle.
 */
export class GameEngine {
  private readonly renderer: WebGLRenderer
  private readonly scene: Scene
  private readonly camera: PerspectiveCamera
  private readonly clock: Clock
  private readonly loop: Loop
  private readonly loadingManager: LoadingManager
  private readonly resizeHandler: ResizeHandler
  private readonly helpers: Group
  private readonly systems = new Set<System>()
  private readonly inputEngine: InputEngine
  private readonly fpsCamera: FpsCamera
  private readonly characterController: CharacterController

  private visibilityHandler: () => void
  private started = false
  private loopConfigured = false

  constructor(options: GameEngineOptions) {
    const {
      canvas,
      width,
      height,
      antialias = true,
      background,
      showHelpers = false,
    } = options

    this.renderer = new WebGLRenderer({ canvas, antialias })
    const rendererConfig = this.renderer as unknown as {
      physicallyCorrectLights?: boolean
      useLegacyLights?: boolean
    }
    if ('useLegacyLights' in rendererConfig)
      rendererConfig.useLegacyLights = false
    else
      rendererConfig.physicallyCorrectLights = true
    this.renderer.outputColorSpace = SRGBColorSpace
    this.renderer.toneMapping = ACESFilmicToneMapping
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = PCFSoftShadowMap
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
    this.renderer.setSize(width, height)

    if (background !== undefined)
      this.renderer.setClearColor(new Color(background))

    this.scene = new Scene()
    this.camera = createMainCamera()
    this.clock = new Clock()
    this.loop = new Loop({}, this.clock)
    this.loadingManager = createLoadingManager()
    this.resizeHandler = new ResizeHandler()
    this.helpers = new Group()
    this.helpers.visible = showHelpers
    this.scene.add(this.helpers)

    createDefaultLights(this.scene, { helpers: this.helpers })
    createBaseScene(this.scene, { helpers: this.helpers })

    this.inputEngine = new InputEngine()
    this.fpsCamera = new FpsCamera()
    this.characterController = new CharacterController()

    this.registerSystem(createFpsLookSystem({
      input: this.inputEngine,
      camera: this.fpsCamera,
      target: this.camera,
    }))
    this.registerSystem(createFpsMoveSystem({
      input: this.inputEngine,
      camera: this.fpsCamera,
      controller: this.characterController,
      target: this.camera,
    }))

    this.visibilityHandler = () => {
      if (document.hidden)
        this.loop.pause()
      else
        this.loop.resume()
    }
  }

  start(): void {
    document.addEventListener('visibilitychange', this.visibilityHandler)
    this.resizeHandler.attach(this)
    if (this.started) {
      this.loop.resume()
      return
    }
    if (!this.loopConfigured) {
      this.loop.onUpdate((dt, elapsed) => {
        for (const system of this.systems)
          system(dt, elapsed)
      })
      this.loop.onRender(() => {
        this.renderer.render(this.scene, this.camera)
      })
      this.loopConfigured = true
    }
    this.started = true
    this.inputEngine.start()
    this.loop.start()
  }

  stop(): void {
    this.loop.stop()
    document.removeEventListener('visibilitychange', this.visibilityHandler)
    this.resizeHandler.detach()
    this.started = false
    this.inputEngine.stop()
  }

  dispose(): void {
    this.stop()
    disposeObject3D(this.scene)
    disposeRenderer(this.renderer)
  }

  registerSystem(system: System): void {
    this.systems.add(system)
  }

  unregisterSystem(system: System): void {
    this.systems.delete(system)
  }

  setHelpersVisible(visible: boolean): void {
    this.helpers.visible = visible
  }

  getScene(): Scene {
    return this.scene
  }

  getCamera(): PerspectiveCamera {
    return this.camera
  }

  getRenderer(): WebGLRenderer {
    return this.renderer
  }

  getClock(): Clock {
    return this.clock
  }

  getLoadingManager(): LoadingManager {
    return this.loadingManager
  }

  /** Input engine used for player interactions. */
  getInputEngine(): InputEngine {
    return this.inputEngine
  }

  /** First-person camera orientation component. */
  getFpsCamera(): FpsCamera {
    return this.fpsCamera
  }

  /** Character controller component representing player movement configuration. */
  getCharacterController(): CharacterController {
    return this.characterController
  }
}
