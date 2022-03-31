import axios, { AxiosRequestConfig } from 'axios'
import { GIPHY_API_TOKEN } from 'src/config/keys'
import { GIPHY_API_URL } from '../config/constants'

interface Arguments {
  /** API method as an URL path */
  path: string

  /** Query parameters */
  params?: Record<string, string>

  /** Axios request options */
  requestOptions?: AxiosRequestConfig
}

export default async <T = never>({
  path,
  params,
  requestOptions,
}: Arguments): Promise<T> => {
  return (
    await axios.get<T>(GIPHY_API_URL + path, {
      params: {
        api_key: GIPHY_API_TOKEN,
        ...params,
      },
      ...requestOptions,
    })
  ).data
}
