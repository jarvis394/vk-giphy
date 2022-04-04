import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { useTrackVisibility } from 'react-intersection-observer-hook'

const ITEM_HEIGHT = 118
const SELECTED_CLASS_NAME = 'messages__image-grid-item--selected'
const NAVIGATION = {
  Left: 'ArrowLeft',
  Right: 'ArrowRight',
}

interface ImageGridProps {
  query?: GifsStoreState['query']
  showState?: GifsStoreState['showState']
}

interface ItemProps {
  data: GifResult['data']
  handleItemKeyDown: ItemKeyDownHandler
  handleItemClick: HandleItemClick
}

type HandleItemClick = (
  event: React.MouseEvent | React.TouchEvent | React.KeyboardEvent,
  item: GifResult['data']
) => void

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

const ItemRoot = styled('picture')({
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: ITEM_HEIGHT,
  flex: '1 0 auto',
  maxWidth: '100%',
  backgroundColor: '#E9ECEF',
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
    borderRadius: 2,
  },
  '&:focus': {
    outline: 'none',
  },
  [`&.${SELECTED_CLASS_NAME}`]: {
    outline: '2px solid #0077ff',
  },
})

const ItemPlaceholder = styled('span')({
  display: 'flex',
  height: ITEM_HEIGHT,
  flex: '1 0 auto',
  maxWidth: '100%',
  backgroundColor: '#E9ECEF',
  position: 'relative',
  borderRadius: 2,
  '@supports (content-visibility: auto)': {
    contentVisibility: 'auto',
    containIntrinsicSize: ITEM_HEIGHT,
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

const ItemUnmemoized: React.FC<ItemProps> = ({
  data,
  handleItemKeyDown,
  handleItemClick,
}) => {
  const id = data.id.toString()
  const image = data.images.fixed_height_small
  const [ref, { isVisible }] = useTrackVisibility({
    rootMargin: '200px',
  })

  return isVisible ? (
    <ItemRoot
      role="gridcell"
      tabIndex={-1}
      key={id}
      id={id}
      ref={ref}
      onKeyDown={(event) => handleItemKeyDown(event, data)}
      onClick={(event) => handleItemClick(event, data)}
      onTouchEnd={(event) => handleItemClick(event, data)}
      style={{
        width: image.width + 'px',
      }}
    >
      <source type="image/webp" srcSet={image.webp} />
      <img src={image.url} alt={data.title} />
    </ItemRoot>
  ) : (
    <ItemPlaceholder
      id={id}
      ref={ref}
      style={{
        width: image.width + 'px',
      }}
    />
  )
}
const Item = React.memo(ItemUnmemoized)

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
  const [gridSelection, setGridSelection] = useState({
    prev: 0,
    current: 0,
  })
  const gridRef = useRef<HTMLDivElement>()
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
    rootMargin: '100px',
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
  const handleItemClick: HandleItemClick = (event, item) => {
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

  /** Handles keyboard arrow presses to navigate through grid */
  const handleGridKeyboardNavigation = useCallback(
    (e) => {
      if (!flatData) return null
      if (e.key === NAVIGATION.Left && gridSelection.current !== 0) {
        setGridSelection((prev) => ({
          prev: prev.current,
          current: prev.current - 1,
        }))
      } else if (
        e.key === NAVIGATION.Right &&
        gridSelection.current !== flatData.length - 1
      ) {
        setGridSelection((prev) => ({
          prev: prev.current,
          current: prev.current + 1,
        }))
      } else if (e.key === 'Enter') {
        handleItemClick(e, flatData[gridSelection.current])
      }
    },
    [flatData, gridSelection]
  )

  /** Removes selection on grid blur */
  const handleGridBlur = () => {
    const el = document.getElementsByClassName(SELECTED_CLASS_NAME)[0]
    el?.classList?.remove(SELECTED_CLASS_NAME)
  }

  /** Registers grid arrow navigation handler */
  useEffect(() => {
    gridRef.current?.addEventListener('keydown', handleGridKeyboardNavigation)
    return () => {
      gridRef.current?.removeEventListener(
        'keydown',
        handleGridKeyboardNavigation
      )
    }
  }, [gridRef.current, flatData, gridSelection])

  useEffect(() => {
    if (flatData && flatData.length > 0) {
      const currentId = flatData[gridSelection.current].id.toString()
      const prevId = flatData[gridSelection.prev].id.toString()
      const prev = document.getElementById(prevId)
      const current = document.getElementById(currentId)
      current.classList.add(SELECTED_CLASS_NAME)
      prev.classList.remove(SELECTED_CLASS_NAME)

      // Do not scroll into item view if we first time get focus,
      // therefore not messing up user's first scroll
      if (gridSelection.current !== gridSelection.prev) {
        current.scrollIntoView({
          block: 'center',
        })
      }
    }
  }, [flatData, gridSelection])

  if (state === FetchingState.Error) return null

  return (
    <Grid role="grid" ref={gridRef} tabIndex={0} onBlur={handleGridBlur}>
      {showState === ShowState.Hide && <Skeletons />}
      {showState === ShowState.Show &&
        flatData.map((e) => (
          <Item
            handleItemClick={handleItemClick}
            handleItemKeyDown={handleItemKeyDown}
            key={e.id}
            data={e}
          />
        ))}
      {showState === ShowState.Show && totalCount !== 0 && hasNext && (
        <Skeletons ref={scrollEndRef} />
      )}
    </Grid>
  )
}

export default React.memo(ImageGrid)
