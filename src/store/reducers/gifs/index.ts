import produce from 'immer'
import { GIPHY_FETCH_GIFS_COUNT } from 'src/config/constants'
import { FetchingState, ShowState } from 'src/types'
import {
  GIFS_IDLE,
  GIFS_FETCH,
  GIFS_FETCH_FULFILLED,
  GIFS_FETCH_REJECTED,
  State,
} from './types'

const initialState: State = {
  query: '',
  state: FetchingState.Idle,
  showState: ShowState.Hide,
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
    case GIFS_IDLE:
      draft.state = FetchingState.Idle
      draft.showState = ShowState.Hide
      draft.query = null
      draft.pagination = {
        count: GIPHY_FETCH_GIFS_COUNT,
        offset: 0,
        total_count: null,
      }
      break
    case GIFS_FETCH:
      draft.state = FetchingState.Fetching
      draft.showState = ShowState[payload.offset === 0 ? 'Hide' : 'Show']
      draft.source = payload.source
      draft.fetchError = null
      // Empty data if user is has made a different search
      // We don't need to empty data if we are fetching same query with offset
      if (payload.offset === 0) draft.data = {}
      draft.pagination.offset = payload.offset
      draft.query = payload.query
      break
    case GIFS_FETCH_FULFILLED:
      // Reject fetched data for another query (condition race)
      // Could happen when data is almost loaded and user changes the query
      // Fetch cancelling is implemented so this should™ never happen
      if (payload.query !== draft.query) return

      draft.state = FetchingState.Fetched
      draft.showState = ShowState.Show
      draft.source = null

      // In some cases, high `offset` will lead to Giphy API misfunction
      // and it will return { data: [], pagination: undefined }.
      // We should ignore the result in this case and set pagination
      // to the last successful result
      if (!payload.pagination) {
        draft.pagination.total_count =
          draft.pagination.offset + draft.pagination.count
        return
      }

      draft.data[payload.pagination.offset] = payload.data
      draft.pagination = payload.pagination
      break
    case GIFS_FETCH_REJECTED:
      draft.state = FetchingState.Error
      draft.showState = ShowState.Hide
      draft.data = {}
      draft.fetchError = payload.data
      // Pagination object should be the same to let to
      // retry fetch at faulty `offset`
      break
    default:
      break
  }
}, initialState)
