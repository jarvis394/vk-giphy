import { FetchingState } from 'src/types'
import { ErrorResult, GifsResult, Result } from '@giphy/js-fetch-api'

const PREFIX = 'GIFS_'
export const GIFS_FETCH = PREFIX + 'FETCH'
export const GIFS_FETCH_FULFILLED = PREFIX + 'FETCH_FULFULLED'
export const GIFS_FETCH_REJECTED = PREFIX + 'FETCH_REJECTED'

interface DataRecord {
  gifs: GifsResult['data']
  lastUpdated: number
}
export interface State {
  state: FetchingState
  fetchError: ErrorResult
  data: Record<number, DataRecord>
  pagination: Result['pagination']
}
