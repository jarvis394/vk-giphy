import { RootState } from '..'
import {
  GIFS_FETCH,
  GIFS_FETCH_FULFILLED,
  GIFS_FETCH_REJECTED,
  GIFS_IDLE,
} from '../reducers/gifs/types'
import { GIPHY_FETCH_GIFS_COUNT } from 'src/config/constants'
import * as api from 'src/api'
import axios from 'axios'
import { FetchingState } from 'src/types'

interface SearchGIFsParams {
  query: string
  offset?: number
}

export const flushGIFs = () => async (dispatch, getState: () => RootState) => {
  const shouldDispatch = getState().gifs.state !== FetchingState.Idle
  shouldDispatch && dispatch({ type: GIFS_IDLE })
}

export const searchGIFs =
  (params: SearchGIFsParams) => async (dispatch, getState: () => RootState) => {
    const { query, offset = 0 } = params
    const storeState = getState()
    const storeData = storeState.gifs

    // Cancel previous request if found
    if (storeData.source) {
      storeData.source.cancel()
    }

    const source = axios.CancelToken.source()
    dispatch({ type: GIFS_FETCH, payload: { offset, query, source } })

    try {
      const language = window && window.navigator.language.split('-')[0]
      const response = await api.search({
        query,
        limit: GIPHY_FETCH_GIFS_COUNT,
        offset,
        lang: language,
        requestOptions: {
          cancelToken: source.token,
        },
      })

      if (response) {
        dispatch({
          type: GIFS_FETCH_FULFILLED,
          payload: {
            data: response.data,
            pagination: response.pagination,
            query,
          },
        })
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        return
      }

      dispatch({
        type: GIFS_FETCH_REJECTED,
        payload: { data: error, query },
      })
    }
  }
