import React, { useCallback, useMemo, useState } from 'react'
import styled from '@emotion/styled/macro'
import useSelector from 'src/hooks/useSelector'
import { FetchingState } from 'src/types'
import Spinner from 'src/components/blocks/Spinner'
import Skeleton from 'src/components/blocks/Skeleton'
import NoResults from './NoResults'
import Error from './Error'
import isVerticalImage from 'src/utils/isVerticalImage'
import { useDispatch } from 'react-redux'
import { searchGIFs } from 'src/store/actions/gifs'
import { GIPHY_FETCH_GIFS_COUNT } from 'src/config/constants'
import useInfiniteScroll from 'src/hooks/useInfiniteScroll'

const Root = styled('div')<{ isLoading: boolean }>(({ isLoading }) => ({
  overflow: isLoading ? 'hidden' : 'scroll',
  height: '100%',
  width: 'auto',
  margin: '0 6px',
  display: 'flex',
  flexDirection: 'column',
  '&::-webkit-scrollbar': {
    background: 'transparent',
    width: 6,
    height: 0,
  },
  '&::-webkit-scrollbar-thumb': {
    minHeight: 40,
    background: '#DAE2EA',
    borderRadius: 100,
    '&:active': {
      background: '#D0D8DF',
    },
  },
  '&::-webkit-scrollbar-track': {
    margin: '6px 0',
  },
}))

const Header = styled('div')({
  display: 'flex',
  gap: 8,
  marginTop: 12,
  padding: '0 6px',
  alignItems: 'center',
})

const HeaderText = styled('p')({
  margin: 0,
  color: '#B0B5BA',
  fontSize: 13,
  fontWeight: 500,
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
})

const StyledSpinner = styled(Spinner)({
  color: '#B0B5BA',
})

const Grid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gridAutoRows: 118,
  gridGap: 8,
  gridAutoFlow: 'dense',
  padding: '12px 6px',
})

const Item = styled('picture')({
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 118,
  backgroundColor: 'transparent',
  position: 'relative',
  borderRadius: 2,
  overflow: 'hidden',
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
  height: 118,
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

const ImageGrid: React.FC<{
  query: string
}> = ({ query }) => {
  const storePagination = useSelector((store) => store.gifs.pagination)
  const storeQuery = useSelector((store) => store.gifs.query)
  const data = useSelector((store) => store.gifs.data)
  const state = useSelector((store) => store.gifs.state)
  const [currentOffset, setCurrentOffset] = useState(0)
  const hasNext = currentOffset < storePagination.total_count
  const handleLoadMoreGIFs = useCallback(() => {
    setCurrentOffset((prev) => {
      dispatch(
        searchGIFs({
          offset: prev + GIPHY_FETCH_GIFS_COUNT,
          query,
        })
      )
      return prev + GIPHY_FETCH_GIFS_COUNT
    })
  }, [query, currentOffset])
  const scrollEndRef = useInfiniteScroll({
    loading: state === FetchingState.Fetching,
    rootMargin: '0px 0px 0px 0px',
    hasNext,
    onLoadMore: handleLoadMoreGIFs,
  })
  const dispatch = useDispatch()
  const shouldShowResults =
    (state === FetchingState.Fetched && query === storeQuery) ||
    (state === FetchingState.Fetching && currentOffset !== 0)
  const flatData = useMemo(() => {
    let res = []
    if (!shouldShowResults) return null
    Object.keys(data).forEach((e) => (res = res.concat(data[e].gifs)))
    return res
  }, [shouldShowResults, Object.keys(data)])
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
    <Root isLoading={!shouldShowResults}>
      <Header>
        {!shouldShowResults && (
          <>
            <StyledSpinner width={16} height={16} />
            <HeaderText>
              Ищем гифки по запросу {'"' + query + '"'}...
            </HeaderText>
          </>
        )}
        {shouldShowResults && (
          <HeaderText>Результаты по запросу {'"' + query + '"'}</HeaderText>
        )}
      </Header>
      {state === FetchingState.Error && <Error />}
      {shouldShowResults && flatData.length === 0 && <NoResults />}
      <Grid>
        {!shouldShowResults && <Skeletons />}
        {shouldShowResults &&
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
        {shouldShowResults && flatData?.length !== 0 && hasNext && (
          <>
            {new Array(skeletonsLastLineCount).fill(0).map((_, i) => (
              <StyledSkeleton key={i} {...(i == 0 && { ref: scrollEndRef })} />
            ))}
            <StyledSkeleton />
            <StyledSkeleton className="horizontal" />
            <StyledSkeleton />
          </>
        )}
      </Grid>
    </Root>
  )
}

export default React.memo(ImageGrid)
