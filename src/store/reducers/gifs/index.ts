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
      draft.fetchError = null
      if (payload.query !== draft.query) draft.data = {}
      draft.pagination.offset = payload.offset
      draft.query = payload.query
      break
    case GIFS_FETCH_FULFILLED:
      draft.state = FetchingState.Fetched
      draft.data[payload.pagination.offset] = {
        gifs: payload.data,
        lastUpdated: Date.now(),
      }
      draft.pagination = payload.pagination
      break
    case GIFS_FETCH_REJECTED:
      draft.state = FetchingState.Error
      draft.data = null
      draft.fetchError = payload.data
      // Pagination object should be the same to let to
      // retry fetch at faulty `offset`
      break
    default:
      break
  }
}, initialState)
