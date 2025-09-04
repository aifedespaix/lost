import type {
  Material,
  Object3D,
  Texture,
  WebGLRenderer,
} from 'three'

function disposeMaterial(material: Material): void {
  const entries = Object.values(material) as unknown[]
  for (const value of entries) {
    if (value && typeof value === 'object' && 'dispose' in value)
      (value as Texture).dispose()
  }
  material.dispose()
}

/**
 * Recursively disposes geometries, materials and textures in an Object3D tree.
 */
export function disposeObject3D(root: Object3D): void {
  root.traverse((obj) => {
    const mesh = obj as unknown as {
      geometry?: { dispose: () => void }
      material?: Material | Material[]
    }
    if (mesh.geometry)
      mesh.geometry.dispose()
    const material = mesh.material
    if (Array.isArray(material))
      material.forEach(disposeMaterial)
    else if (material)
      disposeMaterial(material)
  })
}

/**
 * Disposes renderer resources.
 */
export function disposeRenderer(renderer: WebGLRenderer): void {
  renderer.renderLists.dispose()
  renderer.dispose()
}
