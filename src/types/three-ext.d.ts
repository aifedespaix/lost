/* eslint-disable */
import type { Loader, LoadingManager } from 'three'

/**
 * Constructor type for Three.js loaders returning data of type `T`.
 */
export type LoaderConstructor<T, TLoader extends Loader = Loader> = new (
  manager: LoadingManager,
) => TLoader & {
  load: (
    url: string,
    onLoad: (data: T) => void,
    onProgress?: (event: ProgressEvent<EventTarget>) => void,
    onError?: (err: unknown) => void,
  ) => void;
};
