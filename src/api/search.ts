import { AxiosRequestConfig } from 'axios'
import { GIPHY_FETCH_GIFS_COUNT } from 'src/config/constants'
import makeRequest from './makeRequest'
import { GifsResult } from '@giphy/js-fetch-api'

interface Params {
  query: string
  limit?: number
  offset?: number
  rating?: string
  lang?: string
  requestOptions?: AxiosRequestConfig
}

export default async ({
  query,
  offset = 0,
  limit = GIPHY_FETCH_GIFS_COUNT,
  rating = 'g',
  lang = 'ru',
  requestOptions,
}: Params) =>
  await makeRequest<GifsResult>({
    path: 'search',
    params: {
      offset: offset.toString(),
      q: query,
      limit: limit.toString(),
      rating,
      lang,
    },
    requestOptions,
  })
