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

  attach(engine: ResizableEngine): void {
    this.engine = engine
    window.addEventListener('resize', this.onResize)
    this.resize()
  }

  detach(): void {
    window.removeEventListener('resize', this.onResize)
    this.engine = undefined
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
