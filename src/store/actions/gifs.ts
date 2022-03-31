import { RootState } from '..'
import shouldUpdate from 'src/utils/shouldUpdate'
import gf from 'src/config/giphyFetch'
import {
  GIFS_FETCH,
  GIFS_FETCH_FULFILLED,
  GIFS_FETCH_REJECTED,
} from '../reducers/gifs/types'
import { GIPHY_FETCH_GIFS_COUNT } from 'src/config/constants'

interface SearchGIFsParams {
  query: string
  offset?: number
}

export const searchGIFs =
  (params: SearchGIFsParams) => async (dispatch, getState: () => RootState) => {
    const { query, offset = 0 } = params
    const storeState = getState()
    const storeData = storeState.gifs

    if (
      query === storeData.query &&
      !shouldUpdate(storeData.data[offset]?.lastUpdated)
    ) {
      return Promise.resolve()
    }

    dispatch({ type: GIFS_FETCH, payload: { offset, query } })

    try {
      const { data, pagination } = await gf.search(query, {
        limit: GIPHY_FETCH_GIFS_COUNT,
        offset,
      })

      dispatch({
        type: GIFS_FETCH_FULFILLED,
        payload: { data, pagination },
      })
    } catch (error) {
      dispatch({
        type: GIFS_FETCH_REJECTED,
        payload: { data: error },
      })
    }
  }
