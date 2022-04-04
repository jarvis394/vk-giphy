import React, { useCallback, useMemo, useState } from 'react'
import styled from '@emotion/styled/macro'
import useSelector from 'src/hooks/useSelector'
import { FetchingState, ShowState } from 'src/types'
import Skeleton from 'src/components/blocks/Skeleton'
import { useDispatch } from 'react-redux'
import { searchGIFs } from 'src/store/actions/gifs'
import { GIPHY_FETCH_GIFS_COUNT } from 'src/config/constants'
import useInfiniteScroll from 'src/hooks/useInfiniteScroll'
import useMessagesContext from 'src/hooks/useMessagesContext'
import getArgsFromMessagesContext from 'src/utils/getArgsFromMessagesContext'
import { GifResult, GifsResult } from '@giphy/js-fetch-api'
import { pushMessage } from 'src/store/actions/messages'
import { State as GifsStoreState } from 'src/store/reducers/gifs/types'

const ITEM_HEIGHT = 118

interface ImageGridProps {
  query?: GifsStoreState['query']
  showState?: GifsStoreState['showState']
}

type ItemKeyDownHandler = (
  event: React.KeyboardEvent<HTMLElement>,
  item: GifResult['data']
) => void

const Grid = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  padding: '12px 6px',
})

const Item = styled('picture')({
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: ITEM_HEIGHT,
  flex: '1 0 auto',
  maxWidth: '100%',
  backgroundColor: 'transparent',
  position: 'relative',
  borderRadius: 2,
  overflow: 'hidden',
  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0.12)',
  '@supports (content-visibility: auto)': {
    contentVisibility: 'auto',
    containIntrinsicSize: ITEM_HEIGHT,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    boxShadow: '0 0 0 1px rgba(0, 0, 0, .03) inset',
  },
  '&.no-border::after': {
    content: 'none',
  },
  '& img': {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})

const StyledSkeleton = styled(Skeleton)({
  borderRadius: 2,
  flex: '1 0 auto',
  height: ITEM_HEIGHT,
  '&.vertical': {
    width: 64,
  },
  '&.horizontal': {
    width: 128,
  },
})

// eslint-disable-next-line react/display-name
const Skeletons = React.forwardRef<HTMLDivElement>((_, ref) => (
  <>
    <StyledSkeleton ref={ref} className="horizontal" />
    <StyledSkeleton className="horizontal" />
    <StyledSkeleton className="vertical" />
    <StyledSkeleton className="horizontal" />
    <StyledSkeleton className="vertical" />
  </>
))

const ImageGrid: React.FC<ImageGridProps> = ({
  query: propsQuery,
  showState: propsShowState,
}) => {
  const [messagesContext, setMessagesContext] = useMessagesContext()
  const query = useMemo(
    () => propsQuery || getArgsFromMessagesContext(messagesContext) || '',
    [propsQuery, messagesContext.message]
  )
  const totalCount = useSelector((store) => store.gifs.pagination.total_count)
  const data = useSelector((store) => store.gifs.data)
  const state = useSelector((store) => store.gifs.state)
  const storeShowState = useSelector((store) => store.gifs.showState)
  const showState = useMemo(
    () => propsShowState || storeShowState,
    [propsShowState, storeShowState]
  )
  const [currentOffset, setCurrentOffset] = useState(0)
  const hasNext = currentOffset + GIPHY_FETCH_GIFS_COUNT < totalCount
  const dispatch = useDispatch()
  const handleLoadMoreGIFs = useCallback(() => {
    dispatch(
      searchGIFs({
        offset: currentOffset + GIPHY_FETCH_GIFS_COUNT,
        query,
      })
    )
    setCurrentOffset((prev) => prev + GIPHY_FETCH_GIFS_COUNT)
  }, [query, currentOffset])
  const scrollEndRef = useInfiniteScroll({
    loading: state === FetchingState.Fetching,
    rootMargin: '0px 0px 0px 0px',
    hasNext,
    onLoadMore: handleLoadMoreGIFs,
  })
  const flatData = useMemo<GifsResult['data']>(() => {
    let res = []
    if (showState === ShowState.Hide) return null
    Object.keys(data).forEach((e) => (res = res.concat(data[e])))
    return res
  }, [showState, Object.keys(data)])

  /** Sends image as attachment */
  const handleItemClick = (
    event: React.MouseEvent | React.TouchEvent | React.KeyboardEvent,
    item: GifResult['data']
  ) => {
    event.preventDefault()
    const originalImage = item.images.original
    dispatch(
      pushMessage({
        attachment: {
          width: Number(originalImage.width),
          height: Number(originalImage.height),
          url: originalImage.url,
          webp: originalImage.webp,
          title: item.title,
        },
        timestamp: Date.now(),
      })
    )
    setMessagesContext({
      command: null,
      message: '',
    })
  }
  const handleItemKeyDown: ItemKeyDownHandler = (event, item) => {
    if (event.key === 'Enter') {
      handleItemClick(event, item)
    }
  }

  return (
    <Grid role="grid">
      {showState === ShowState.Hide && <Skeletons />}
      {showState === ShowState.Show &&
        flatData.map((e, i) => (
          <Item
            role="gridcell"
            tabIndex={0}
            key={i}
            id={e.id.toString()}
            onKeyDown={(event) => handleItemKeyDown(event, e)}
            onClick={(event) => handleItemClick(event, e)}
            onTouchEnd={(event) => handleItemClick(event, e)}
            style={{
              width: e.images.fixed_height_small.width + 'px',
            }}
          >
            <source
              type="image/webp"
              srcSet={e.images.fixed_height_small.webp}
            />
            <img src={e.images.fixed_height_small.url} alt={e.title} />
          </Item>
        ))}
      {showState === ShowState.Show && totalCount !== 0 && hasNext && (
        <Skeletons ref={scrollEndRef} />
      )}
    </Grid>
  )
}

export default React.memo(ImageGrid)
