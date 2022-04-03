import React, { useCallback, useMemo, useState } from 'react'
import styled from '@emotion/styled/macro'
import useSelector from 'src/hooks/useSelector'
import { FetchingState, ShowState } from 'src/types'
import Skeleton from 'src/components/blocks/Skeleton'
import isVerticalImage from 'src/utils/isVerticalImage'
import { useDispatch } from 'react-redux'
import { searchGIFs } from 'src/store/actions/gifs'
import { GIPHY_FETCH_GIFS_COUNT } from 'src/config/constants'
import useInfiniteScroll from 'src/hooks/useInfiniteScroll'
import useMessagesContext from 'src/hooks/useMessagesContext'
import getArgsFromMessagesContext from 'src/utils/getArgsFromMessagesContext'

const ITEM_HEIGHT = 118

const Grid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gridAutoRows: ITEM_HEIGHT,
  gridGap: 8,
  gridAutoFlow: 'dense',
  padding: '12px 6px',
})

const Item = styled('picture')({
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: ITEM_HEIGHT,
  backgroundColor: 'transparent',
  position: 'relative',
  borderRadius: 2,
  overflow: 'hidden',
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
  '&.vertical': {
    gridColumnEnd: 'span 1',
    '@media (max-width: 350px)': {
      gridColumnEnd: 'span 2',
    },
  },
  '&.horizontal': {
    gridColumnEnd: 'span 2',
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
  },
})

const StyledSkeleton = styled(Skeleton)({
  borderRadius: 2,
  height: ITEM_HEIGHT,
  '&.vertical': {
    gridColumnEnd: 'span 1',
  },
  '&.horizontal': {
    gridColumnEnd: 'span 2',
  },
})

const Skeletons = () => (
  <>
    <StyledSkeleton className="horizontal" />
    <StyledSkeleton className="horizontal" />
    <StyledSkeleton />
    <StyledSkeleton className="horizontal" />
    <StyledSkeleton />
  </>
)

const ImageGrid = () => {
  const [messagesContext] = useMessagesContext()
  const query = useMemo(
    () => getArgsFromMessagesContext(messagesContext) || '',
    [messagesContext.message]
  )
  const totalCount = useSelector((store) => store.gifs.pagination.total_count)
  const data = useSelector((store) => store.gifs.data)
  const state = useSelector((store) => store.gifs.state)
  const showState = useSelector((store) => store.gifs.showState)
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
  const flatData = useMemo(() => {
    let res = []
    if (showState === ShowState.Hide) return null
    Object.keys(data).forEach((e) => (res = res.concat(data[e])))
    return res
  }, [showState, Object.keys(data)])
  // Finds how many skeleton items we need to insert at the end
  // of the image grid
  const skeletonsLastLineCount = useMemo(() => {
    let c = 0
    if (!flatData) return 0
    flatData.forEach((e) => {
      c += isVerticalImage(e.images.fixed_height_small) ? 1 : 2
    })
    return Math.ceil(c / 4) * 4 - c
  }, [flatData])

  return (
    <Grid>
      {showState === ShowState.Hide && <Skeletons />}
      {showState === ShowState.Show &&
        flatData.map((e, i) => (
          <Item
            key={i}
            className={
              isVerticalImage(e.images.fixed_height_small)
                ? 'vertical'
                : 'horizontal'
            }
          >
            <source
              type="image/webp"
              srcSet={e.images.fixed_height_small.webp}
            />
            <img src={e.images.fixed_height_small.url} alt="" />
          </Item>
        ))}
      {showState === ShowState.Show && totalCount !== 0 && hasNext && (
        <>
          {new Array(skeletonsLastLineCount).fill(0).map((_, i) => (
            <StyledSkeleton key={i} />
          ))}
          <StyledSkeleton ref={scrollEndRef} />
          <StyledSkeleton className="horizontal" />
          <StyledSkeleton />
        </>
      )}
    </Grid>
  )
}

export default React.memo(ImageGrid)
