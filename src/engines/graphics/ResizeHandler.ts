import type { PerspectiveCamera, WebGLRenderer } from 'three'

export interface ResizableEngine {
  getRenderer: () => WebGLRenderer
  getCamera: () => PerspectiveCamera
}

/**
 * Handles viewport resize and device pixel ratio changes.
 */
export class ResizeHandler {
  private engine?: ResizableEngine
  private readonly onResize = () => this.resize()
  private readonly onDprChange = () => {
    this.resize()
    this.setupDprListener()
  }

  private dprQuery?: MediaQueryList

  attach(engine: ResizableEngine): void {
    this.engine = engine
    window.addEventListener('resize', this.onResize)
    this.setupDprListener()
    this.resize()
  }

  detach(): void {
    window.removeEventListener('resize', this.onResize)
    if (this.dprQuery)
      this.dprQuery.removeEventListener('change', this.onDprChange)
    this.dprQuery = undefined
    this.engine = undefined
  }

  private setupDprListener(): void {
    if (!window.matchMedia)
      return

    if (this.dprQuery)
      this.dprQuery.removeEventListener('change', this.onDprChange)

    this.dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
    this.dprQuery.addEventListener('change', this.onDprChange)
  }

  private resize(): void {
    if (!this.engine)
      return
    const renderer = this.engine.getRenderer()
    const camera = this.engine.getCamera()
    const width = window.innerWidth
    const height = window.innerHeight
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }
}
