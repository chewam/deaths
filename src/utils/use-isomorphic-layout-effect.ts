import { useEffect, useLayoutEffect } from "react"

// `useLayoutEffect` warns during SSR ("does nothing on the server"); fall back
// to `useEffect` server-side so the chart components can read DOM dimensions
// synchronously on the client without polluting the build output with React
// warnings.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

export default useIsomorphicLayoutEffect
