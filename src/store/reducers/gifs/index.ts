import produce from 'immer'
import { GIPHY_FETCH_GIFS_COUNT } from 'src/config/constants'
import { FetchingState } from 'src/types'
import {
  GIFS_FETCH,
  GIFS_FETCH_FULFILLED,
  GIFS_FETCH_REJECTED,
  State,
} from './types'

const initialState: State = {
  query: '',
  state: FetchingState.Idle,
  fetchError: null,
  data: {},
  source: null,
  pagination: {
    count: GIPHY_FETCH_GIFS_COUNT,
    offset: 0,
    total_count: null,
  },
}

export default produce((draft, { type, payload }) => {
  switch (type) {
    case GIFS_FETCH:
      draft.state = FetchingState.Fetching
      draft.source = payload.source
      draft.fetchError = null
      // Empty data if user is has made a different search
      // We don't need to empty data if we are fetching same query with offset
      if (payload.query !== draft.query) draft.data = {}
      draft.pagination.offset = payload.offset
      draft.query = payload.query
      break
    case GIFS_FETCH_FULFILLED:
      // Reject fetched data for another query (condition race)
      // Could happen when data is almost loaded and user changes the query
      // Fetch cancelling is implemented so this should™ never happen
      if (payload.query !== draft.query) return

      draft.state = FetchingState.Fetched
      draft.data[payload.pagination.offset] = {
        gifs: payload.data,
        lastUpdated: Date.now(),
      }
      draft.source = null
      draft.pagination = payload.pagination
      break
    case GIFS_FETCH_REJECTED:
      draft.state = FetchingState.Error
      draft.data = {}
      draft.fetchError = payload.data
      // Pagination object should be the same to let to
      // retry fetch at faulty `offset`
      break
    default:
      break
  }
}, initialState)
