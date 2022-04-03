import { FetchingState, ShowState } from 'src/types'
import { ErrorResult, GifsResult, Result } from '@giphy/js-fetch-api'
import { AxiosError, CancelTokenSource } from 'axios'

const PREFIX = 'GIFS_'
export const GIFS_IDLE = PREFIX + 'IDLE'
export const GIFS_FETCH = PREFIX + 'FETCH'
export const GIFS_FETCH_FULFILLED = PREFIX + 'FETCH_FULFULLED'
export const GIFS_FETCH_REJECTED = PREFIX + 'FETCH_REJECTED'

export interface State {
  state: FetchingState
  showState: ShowState
  fetchError: AxiosError<ErrorResult>
  data: Record<number, GifsResult['data']>
  pagination: Result['pagination']
  query: string
  source: CancelTokenSource
}
