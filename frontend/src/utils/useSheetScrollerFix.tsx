import { useLayoutEffect, useRef } from 'react'

// source: https://github.com/Temzasse/react-modal-sheet/issues/154#issuecomment-3284932870

/**
 * @example ```tsx
 * const scrollRef = useSheetScrollerFix();
 *
 * <Sheet.Content scrollRef={scrollRef} />
 * ```
 */
export function useSheetScrollerFix() {
  const scrollRef = useRef<HTMLDivElement>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useLayoutEffect(() => {
    if (scrollRef.current) {
      const scroller = scrollRef.current
      const originalScrollCb = scroller.onscroll

      scroller.style.touchAction = 'pan-down'

      scroller.onscroll = function (e) {
        if (!scroller) return

        if (scroller.scrollTop === 0) {
          scroller.style.touchAction = 'pan-down'
        } else {
          scroller.style.touchAction = 'unset'
        }

        return originalScrollCb?.bind(this)?.(e)
      }
      return () => {
        scroller.onscroll = originalScrollCb
      }
    }
  }, [scrollRef.current])

  return scrollRef
}
