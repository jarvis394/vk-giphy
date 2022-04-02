import { useEffect } from 'react'
import {
  useTrackVisibility,
  IntersectionObserverHookArgs,
  IntersectionObserverHookRefCallback,
} from 'react-intersection-observer-hook'

const DEFAULT_DELAY_MS = 100

export type UseInfiniteScrollProps = Pick<
  IntersectionObserverHookArgs,
  /** Specifies margin for visibility change */
  'rootMargin'
> & {
  /** Current loading state */
  loading: boolean
  /** Whether we can fetch something more */
  hasNext: boolean
  /** Function for loading new items. Executed on reaching ref element. */
  onLoadMore: VoidFunction
  disabled?: boolean
  /** Delay before `onLoadMore` call */
  delayMs?: number
}

const useInfiniteScroll = ({
  loading,
  hasNext,
  onLoadMore,
  rootMargin,
  disabled,
  delayMs = DEFAULT_DELAY_MS,
}: UseInfiniteScrollProps): IntersectionObserverHookRefCallback => {
  const [ref, { isVisible }] = useTrackVisibility({
    rootMargin,
  })
  // Recalculated on each deps change, no need of useMemo
  const shouldLoadMore = !disabled && !loading && isVisible && hasNext

  useEffect(() => {
    if (shouldLoadMore) {
      // In some edge cases `loading` prop changes to false with ref item
      // still in view. This will cause repetitive onLoadMore() call
      // We can wait a little to eliminate this possibility.
      const timer = setTimeout(() => {
        onLoadMore()
      }, delayMs)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [onLoadMore, shouldLoadMore, delayMs])

  return ref
}

export default useInfiniteScroll
