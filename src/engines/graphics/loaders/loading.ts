import type { LoaderConstructor } from '~/types/three-ext'
import { LoadingManager } from 'three'

/**
 * Creates a shared LoadingManager with basic logging callbacks.
 */
export function createLoadingManager(): LoadingManager {
  const manager = new LoadingManager()
  manager.onStart = (url, loaded, total) => {
    console.warn(`Loading started: ${url} (${loaded}/${total})`)
  }
  manager.onProgress = (url, loaded, total) => {
    console.warn(`Loading: ${url} (${loaded}/${total})`)
  }
  manager.onError = (url) => {
    console.error(`Error loading ${url}`)
  }
  return manager
}

/**
 * Generic loader utility using the shared LoadingManager.
 */
export function useLoader<T>(
  LoaderCtor: LoaderConstructor<T>,
  url: string,
  manager: LoadingManager,
): Promise<T> {
  const loader = new LoaderCtor(manager)
  return new Promise<T>((resolve, reject) => {
    loader.load(
      url,
      data => resolve(data as T),
      undefined,
      error => reject(error),
    )
  })
}
