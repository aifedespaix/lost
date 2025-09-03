/**
 * Orientation data for a first-person camera.
 *
 * Stores yaw and pitch angles in radians. Pitch is clamped between
 * configurable limits to prevent unnatural rotations.
 */
export interface FpsCameraOptions {
  /** Initial yaw angle in radians. */
  yaw?: number
  /** Initial pitch angle in radians. */
  pitch?: number
  /** Lowest allowed pitch angle in radians. Defaults to -\u03c0/2. */
  minPitch?: number
  /** Highest allowed pitch angle in radians. Defaults to \u03c0/2. */
  maxPitch?: number
}

export class FpsCamera {
  /** Yaw rotation around the vertical axis, in radians. */
  yaw: number
  private _pitch: number
  readonly minPitch: number
  readonly maxPitch: number

  constructor(options: FpsCameraOptions = {}) {
    const {
      yaw = 0,
      pitch = 0,
      minPitch = -Math.PI / 2,
      maxPitch = Math.PI / 2,
    } = options
    this.yaw = yaw
    this.minPitch = minPitch
    this.maxPitch = maxPitch
    this._pitch = 0
    this.pitch = pitch
  }

  /**
   * Pitch rotation around the horizontal axis, in radians.
   * Values are clamped between {@link minPitch} and {@link maxPitch}.
   */
  get pitch(): number {
    return this._pitch
  }

  set pitch(value: number) {
    this._pitch = Math.min(this.maxPitch, Math.max(this.minPitch, value))
  }
}
