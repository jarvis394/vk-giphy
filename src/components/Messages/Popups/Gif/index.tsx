import React, { useEffect, useMemo, useRef, useState } from 'react'
import Popup from 'src/components/blocks/Popup'
import Header from './Header'
import EnterQueryScreen from './EnterQuery'
import ErrorScreen from './Error'
import NoResultsScreen from './NoResults'
import ImageGridScreen from './ImageGrid'
import { useDispatch } from 'react-redux'
import { searchGIFs, flushGIFs } from 'src/store/actions/gifs'
import useSelector from 'src/hooks/useSelector'
import QueryTooLongScreen from './QueryTooLong'
import useMessagesContext from 'src/hooks/useMessagesContext'
import getArgsFromMessagesContext from 'src/utils/getArgsFromMessagesContext'
import styled from '@emotion/styled/macro'
import { FetchingState, ShowState } from 'src/types'
import { GIPHY_MAX_QUERY_LENGTH } from 'src/config/constants'
import { State as GifsStoreState } from 'src/store/reducers/gifs/types'

// Controls throttle delay between user input and search action
const SEARCH_DELAY_MS = 400

interface GetCurrentScreenProps {
  query: GifsStoreState['query']
  state: GifsStoreState['state']
  totalCount: GifsStoreState['pagination']['total_count']
  showState: GifsStoreState['showState']
  command: string
}

const Root = styled('div')<{ isLoading: boolean }>(({ theme, isLoading }) => ({
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
    background: theme.palette.scrollbar.main,
    borderRadius: 100,
    '&:active': {
      background: theme.palette.scrollbar.active,
    },
  },
  '&::-webkit-scrollbar-track': {
    margin: '6px 0',
  },
}))

const getCurrentScreen = ({
  query,
  state,
  totalCount,
  showState,
  command,
}: GetCurrentScreenProps) => {
  if (!query && command === 'gif') return <EnterQueryScreen />
  if (state === FetchingState.Error)
    return (
      <>
        <Header query={query} showState={ShowState.Show} />
        <ErrorScreen />
      </>
    )
  if (query && query.length > GIPHY_MAX_QUERY_LENGTH)
    return (
      <>
        <Header query={query} showState={ShowState.Show} />
        <QueryTooLongScreen />
      </>
    )
  else if (query)
    return (
      <>
        <Header query={query} showState={showState} />
        {state === FetchingState.Fetched && totalCount === 0 && (
          <NoResultsScreen />
        )}
        <ImageGridScreen query={query} showState={showState} />
      </>
    )
}

const GifPopup = () => {
  const [messagesContext] = useMessagesContext()
  const rootRef = useRef<HTMLDivElement>()
  const query = useMemo(
    () => getArgsFromMessagesContext(messagesContext) || '',
    [messagesContext.message]
  )
  const storeQuery = useSelector((store) => store.gifs.query)
  const dispatch = useDispatch()
  const state = useSelector((store) => store.gifs.state)
  const totalCount = useSelector((store) => store.gifs.pagination.total_count)
  const showState = useSelector((store) => store.gifs.showState)
  const [currentScreen, setCurrentScreen] = useState(
    getCurrentScreen({
      query,
      state,
      totalCount,
      showState,
      command: messagesContext.command,
    })
  )
  const [currentShowState, setCurrentShowState] = useState(showState)
  const [isPopupRootShown, setIsPopupRootShown] = useState(
    messagesContext.command === 'gif'
  )

  useEffect(() => {
    rootRef.current?.scrollTo(0, 0)
    dispatch(flushGIFs())
    if (messagesContext.command === 'gif') {
      const id = setTimeout(() => {
        if (
          storeQuery !== query &&
          query !== '' &&
          query.length <= GIPHY_MAX_QUERY_LENGTH
        ) {
          dispatch(
            searchGIFs({
              query,
            })
          )
        }
      }, SEARCH_DELAY_MS)
      return () => clearTimeout(id)
    }
  }, [messagesContext.message])

  /** Preserve component state to create seamless inactive transition */
  useEffect(() => {
    if (messagesContext.command === 'gif') {
      setIsPopupRootShown(true)
      setCurrentShowState(showState)
      setCurrentScreen(
        getCurrentScreen({
          query,
          state,
          totalCount,
          showState,
          command: messagesContext.command,
        })
      )
    } else {
      // We want to reset EnterQuery screen every time popup has been closed
      const id = setTimeout(() => {
        setIsPopupRootShown(false)
      }, 180) // Transition duration of popup close
      return () => clearTimeout(id)
    }
  }, [messagesContext.message, state, totalCount, showState])

  return (
    <Popup active={messagesContext.command === 'gif'}>
      {isPopupRootShown && (
        <Root isLoading={currentShowState === ShowState.Hide} ref={rootRef}>
          {currentScreen}
        </Root>
      )}
    </Popup>
  )
}

export default React.memo(GifPopup)
