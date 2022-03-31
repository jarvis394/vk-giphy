import React, { useMemo } from 'react'
import styled from '@emotion/styled/macro'
import useSelector from 'src/hooks/useSelector'
import { FetchingState } from 'src/types'
import Spinner from 'src/components/blocks/Spinner'
import Skeleton from 'src/components/blocks/Skeleton'

const Root = styled('div')<{ isLoading: boolean }>(({ isLoading }) => ({
  overflow: isLoading ? 'hidden' : 'scroll',
  height: '100%',
  width: 'auto',
  margin: '0 6px',
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
  padding: '0 6px',
  margin: '12px 0',
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
  },
  '&.horizontal': {
    gridColumnEnd: 'span 2',
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
  const data = useSelector((store) => store.gifs.data)
  const state = useSelector((store) => store.gifs.state)
  const shouldHideResults = useMemo(
    () => state !== FetchingState.Fetched,
    [state]
  )
  const shouldShowResults = useMemo(
    () => state === FetchingState.Fetched,
    [state]
  )
  const flatData = useMemo(() => {
    if (shouldHideResults) return null
    return Object.values(data)
      .map((e) => e.gifs)
      .flat()
  }, [shouldHideResults])

  return (
    <Root isLoading={shouldHideResults}>
      <Header>
        {shouldHideResults && (
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
      <Grid>
        {shouldHideResults && <Skeletons />}
        {shouldShowResults &&
          flatData.map((e, i) => (
            <Item
              key={i}
              className={
                e.images.fixed_height_small.width /
                  e.images.fixed_height_small.height >
                1
                  ? 'horizontal'
                  : 'vertical'
              }
            >
              <source
                type="image/webp"
                srcSet={e.images.fixed_height_small.webp}
              />
              <img src={e.images.fixed_height_small.url} alt="" />
            </Item>
          ))}
      </Grid>
    </Root>
  )
}

export default React.memo(ImageGrid)
