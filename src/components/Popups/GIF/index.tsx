import React, { useEffect } from 'react'
import { Popup } from '..'
import EnterQueryScreen from './EnterQuery'
import ImageGridScreen from './ImageGrid'
import { useDispatch } from 'react-redux'
import { searchGIFs, flushGIFs } from 'src/store/actions/gifs'
import useSelector from 'src/hooks/useSelector'
import QueryTooLongScreen from './QueryTooLong'
import { GIPHY_MAX_QUERY_LENGTH } from 'src/config/constants'

const GIFPopup: React.FC<{
  query: string
}> = ({ query }) => {
  const storeQuery = useSelector((store) => store.gifs.query)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(flushGIFs())
    const id = setTimeout(() => {
      if (storeQuery !== query && query !== '') {
        dispatch(
          searchGIFs({
            query,
          })
        )
      }
    }, 400)
    return () => clearTimeout(id)
  }, [query])

  return (
    <Popup>
      {!query && <EnterQueryScreen />}
      {query && query.length > GIPHY_MAX_QUERY_LENGTH && <QueryTooLongScreen />}
      {query && query.length <= GIPHY_MAX_QUERY_LENGTH && (
        <ImageGridScreen query={query} />
      )}
    </Popup>
  )
}

export default React.memo(GIFPopup)
