import React, { useMemo } from 'react'
import styled from '@emotion/styled/macro'
import useSelector from 'src/hooks/useSelector'
import useMessagesContext from 'src/hooks/useMessagesContext'
import { FetchingState, ShowState } from 'src/types'
import getArgsFromMessagesContext from 'src/utils/getArgsFromMessagesContext'
import Spinner from 'src/components/blocks/Spinner'

const Root = styled('div')({
  display: 'flex',
  gap: 8,
  marginTop: 12,
  padding: '0 6px',
  alignItems: 'center',
})

const Title = styled('p')({
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

const Header = () => {
  const [messagesContext] = useMessagesContext()
  const query = useMemo(
    () => getArgsFromMessagesContext(messagesContext) || '',
    [messagesContext.message]
  )
  const showState = useSelector((store) => store.gifs.showState)

  if (!query) return null

  return (
    <Root>
      {showState === ShowState.Hide && (
        <>
          <StyledSpinner width={16} height={16} />
          <Title>Ищем гифки по запросу {'"' + query + '"'}...</Title>
        </>
      )}
      {showState === ShowState.Show && (
        <Title>Результаты по запросу {'"' + query + '"'}</Title>
      )}
    </Root>
  )
}

export default Header
