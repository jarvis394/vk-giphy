import { useState, useLayoutEffect } from 'react'

interface UseMediaQueryOptions {
  defaultMatches: boolean
  matchMedia: (query: string) => MediaQueryList
}

const useMediaQuery = (
  query: string,
  options: Partial<UseMediaQueryOptions> = {}
) => {
  const supportMatchMedia =
    typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined'

  const {
    defaultMatches = false,
    matchMedia = supportMatchMedia ? window.matchMedia : null,
  } = {
    ...options,
  }

  const [match, setMatch] = useState(
    supportMatchMedia ? matchMedia(query).matches : defaultMatches
  )

  useLayoutEffect(() => {
    if (!supportMatchMedia) {
      return undefined
    }

    const queryList = matchMedia(query)
    const updateMatch = () => {
      setMatch(queryList.matches)
    }
    updateMatch()
    queryList.addEventListener('change', updateMatch)
    return () => {
      queryList.removeEventListener('change', updateMatch)
    }
  }, [query, matchMedia, supportMatchMedia])

  return match
}

export default useMediaQuery
