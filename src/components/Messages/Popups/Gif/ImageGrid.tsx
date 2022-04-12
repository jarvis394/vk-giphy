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
const SELECTED_CLASS_NAME = 'gifs__image-grid-item--selected'
const NAVIGATION = {
  Left: 'ArrowLeft',
  Right: 'ArrowRight',
  Up: 'ArrowUp',
  Down: 'ArrowDown',
  Enter: 'Enter',
}

interface ImageGridProps {
  query?: GifsStoreState['query']
  showState?: GifsStoreState['showState']
}

interface ItemProps {
  data: GifResult['data']
  handleItemKeyDown: ItemKeyDownHandler
  handleItemClick: HandleItemClick
  isSelected: boolean
}

type HandleItemClick = (
  event: React.MouseEvent | React.TouchEvent | React.KeyboardEvent,
  item: GifResult['data']
) => void

type ItemKeyDownHandler = (
  event: React.KeyboardEvent<HTMLElement>,
  item: GifResult['data']
) => void

const Grid = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  padding: '12px 6px',
  [`&:focus-visible .${SELECTED_CLASS_NAME}`]: {
    outline: '2px solid ' + theme.palette.primary.main,
  },
  '&:focus': {
    outline: 'none',
  },
}))

const ItemRoot = styled('picture')(({ theme }) => ({
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: ITEM_HEIGHT,
  flex: '1 0 auto',
  maxWidth: '100%',
  backgroundColor: theme.palette.skeleton.background,
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
}))

const ItemPlaceholder = styled('span')(({ theme }) => ({
  display: 'flex',
  height: ITEM_HEIGHT,
  flex: '1 0 auto',
  maxWidth: '100%',
  backgroundColor: theme.palette.skeleton.background,
  position: 'relative',
  borderRadius: 2,
  '@supports (content-visibility: auto)': {
    contentVisibility: 'auto',
    containIntrinsicSize: ITEM_HEIGHT,
  },
}))

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
    <StyledSkeleton className="horizontal" />
    <StyledSkeleton className="horizontal" />
    <StyledSkeleton ref={ref} className="vertical" />
    <StyledSkeleton className="horizontal" />
    <StyledSkeleton className="vertical" />
  </>
))

const ItemUnmemoized: React.FC<ItemProps> = ({
  data,
  handleItemKeyDown,
  handleItemClick,
  isSelected,
}) => {
  const id = data.id.toString()
  const image = data.images.fixed_height_small
  const [ref, { isVisible }] = useTrackVisibility({
    rootMargin: '200px',
  })

  useEffect(() => {
    isSelected &&
      document?.getElementById(id)?.scrollIntoView({
        block: 'center',
      })
  }, [isSelected])

  return isVisible ? (
    <ItemRoot
      role="gridcell"
      tabIndex={-1}
      key={id}
      id={id}
      ref={ref}
      className={isSelected ? SELECTED_CLASS_NAME : ''}
      onKeyDown={(event) => handleItemKeyDown(event, data)}
      onClick={(event) => handleItemClick(event, data)}
      // Fixes soft keyboard hide and show on refocus
      onMouseDown={(event) => event.preventDefault()}
      style={{
        width: image.width + 'px',
      }}
    >
      <source type="image/webp" srcSet={image.webp} />
      <img src={image.url} alt={data.title} />
    </ItemRoot>
  ) : (
    <ItemPlaceholder
      className={isSelected ? SELECTED_CLASS_NAME : ''}
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
  const [gridCurrentSelected, setGridCurrentSelected] = useState(0)
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
    rootMargin: `${ITEM_HEIGHT * 3 + 16}px 0px`,
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
      lastSelection: [0, 0],
    })
  }

  /** Handles sending GIF on Enter keypress */
  const handleItemKeyDown: ItemKeyDownHandler = (event, item) => {
    if (event.key === NAVIGATION.Enter) {
      handleItemClick(event, item)
    }
  }

  /**
   * Finds item's bounding client rect
   * @param i Index of item in `flatData` array
   */
  const getItemBoundingRect = (i: number) => {
    const el = document.getElementById(flatData[i].id.toString())
    return el?.getBoundingClientRect()
  }

  /** Handles keyboard arrow presses to navigate through grid */
  const handleGridKeyboardNavigation = useCallback(
    (e) => {
      if (!flatData) return
      if (e.key === NAVIGATION.Left && gridCurrentSelected !== 0) {
        setGridCurrentSelected((prev) => prev - 1)
      } else if (
        e.key === NAVIGATION.Right &&
        gridCurrentSelected !== flatData.length - 1
      ) {
        setGridCurrentSelected((prev) => prev + 1)
      } else if (e.key === NAVIGATION.Down) {
        e.preventDefault()
        const currentRect = getItemBoundingRect(gridCurrentSelected)

        for (let i = gridCurrentSelected + 1; i < flatData.length; i++) {
          const elRect = getItemBoundingRect(i)
          if (
            currentRect.y + ITEM_HEIGHT <= elRect.y &&
            currentRect.x - currentRect.width / 2 <= elRect.x
          ) {
            setGridCurrentSelected(i)
            return
          }
        }
      } else if (e.key === NAVIGATION.Up) {
        e.preventDefault()
        const currentRect = getItemBoundingRect(gridCurrentSelected)

        for (let i = gridCurrentSelected - 1; i >= 0; i--) {
          const elRect = getItemBoundingRect(i)
          if (
            currentRect.y - ITEM_HEIGHT >= elRect.y &&
            currentRect.x + currentRect.width / 2 >= elRect.x
          ) {
            setGridCurrentSelected(i)
            return
          }
        }
      } else if (e.key === NAVIGATION.Enter) {
        handleItemClick(e, flatData[gridCurrentSelected])
      }
    },
    [flatData, gridCurrentSelected]
  )

  /** Registers grid arrow navigation handler */
  useEffect(() => {
    gridRef.current?.addEventListener('keydown', handleGridKeyboardNavigation)
    return () => {
      gridRef.current?.removeEventListener(
        'keydown',
        handleGridKeyboardNavigation
      )
    }
  }, [gridRef.current, flatData, gridCurrentSelected])

  if (state === FetchingState.Error) return null

  return (
    <Grid role="grid" ref={gridRef} tabIndex={0}>
      {showState === ShowState.Hide && <Skeletons />}
      {showState === ShowState.Show &&
        flatData.map((e, i) => (
          <Item
            handleItemClick={handleItemClick}
            handleItemKeyDown={handleItemKeyDown}
            isSelected={gridCurrentSelected === i}
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
