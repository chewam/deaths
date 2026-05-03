import "@testing-library/jest-dom/vitest"

// jsdom doesn't implement ResizeObserver — charts use it to track container width.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??=
  ResizeObserverStub as unknown as typeof ResizeObserver
