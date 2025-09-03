import { Clock } from 'three'

export type TickCallback = (dt: number, elapsed: number) => void

export interface LoopOptions {
  fixed?: boolean
  fps?: number
}

/**
 * Loop executes registered callbacks using requestAnimationFrame.
 * Supports fixed or variable timesteps and pause/resume.
 */
export class Loop {
  private readonly clock: Clock
  private readonly updates: TickCallback[] = []
  private readonly renders: TickCallback[] = []
  private running = false
  private accumulator = 0
  private readonly fixed: boolean
  private readonly step: number

  constructor(options: LoopOptions = {}, clock: Clock = new Clock()) {
    this.clock = clock
    this.fixed = options.fixed ?? false
    const fps = options.fps ?? 60
    this.step = 1 / fps
  }

  onUpdate(callback: TickCallback): void {
    this.updates.push(callback)
  }

  onRender(callback: TickCallback): void {
    this.renders.push(callback)
  }

  start(): void {
    if (this.running)
      return
    this.running = true
    this.clock.start()
    requestAnimationFrame(this.tick)
  }

  stop(): void {
    this.running = false
  }

  pause(): void {
    this.stop()
  }

  resume(): void {
    if (this.running)
      return
    this.running = true
    this.clock.start()
    requestAnimationFrame(this.tick)
  }

  private tick = (): void => {
    if (!this.running)
      return
    const dt = this.clock.getDelta()
    const elapsed = this.clock.elapsedTime

    if (this.fixed) {
      this.accumulator += dt
      while (this.accumulator >= this.step) {
        for (const update of this.updates)
          update(this.step, elapsed)
        this.accumulator -= this.step
      }
      for (const render of this.renders)
        render(this.step, elapsed)
    }
    else {
      for (const update of this.updates)
        update(dt, elapsed)
      for (const render of this.renders)
        render(dt, elapsed)
    }

    requestAnimationFrame(this.tick)
  }
}
