import React, { useEffect, useState } from 'react'
import { Popup } from '..'
import EnterQueryScreen from './EnterQuery'
import ImageGridScreen from './ImageGrid'
import { useDispatch } from 'react-redux'
import { searchGIFs } from 'src/store/actions/gifs'
import useSelector from 'src/hooks/useSelector'

const GIFPopup: React.FC<{
  query: string
}> = ({ query }) => {
  const [isTyping, setIsTyping] = useState(false)
  const storeQuery = useSelector((store) => store.gifs.query)
  const dispatch = useDispatch()

  useEffect(() => {
    setIsTyping(true)
    const id = setTimeout(() => {
      setIsTyping(false)
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
      {query && <ImageGridScreen query={query} isTyping={isTyping} />}
    </Popup>
  )
}

export default GIFPopup
