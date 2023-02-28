declare module 'valtio/macro' {
export function useProxy<T extends object>(proxyObject: T): void
}