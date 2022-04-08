import React, { useMemo } from 'react'
import styled from '@emotion/styled/macro'
import useSelector from 'src/hooks/useSelector'
import useMessagesContext from 'src/hooks/useMessagesContext'
import { ShowState } from 'src/types'
import getArgsFromMessagesContext from 'src/utils/getArgsFromMessagesContext'
import Spinner from 'src/components/blocks/Spinner'
import { State as GifsStoreState } from 'src/store/reducers/gifs/types'

interface HeaderProps {
  query?: GifsStoreState['query']
  showState?: GifsStoreState['showState']
}

const Root = styled('div')({
  display: 'flex',
  gap: 8,
  marginTop: 12,
  padding: '0 6px',
  alignItems: 'center',
})

const Title = styled('p')(({ theme }) => ({
  margin: 0,
  color: theme.palette.text.subtitle,
  fontSize: 13,
  fontWeight: 500,
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
}))

const StyledSpinner = styled(Spinner)(({ theme }) => ({
  color: theme.palette.text.subtitle,
}))

const Header: React.FC<HeaderProps> = ({
  query: propsQuery,
  showState: propsShowState,
}) => {
  const [messagesContext] = useMessagesContext()
  const query = useMemo(
    () => propsQuery || getArgsFromMessagesContext(messagesContext) || '',
    [propsQuery, messagesContext.message]
  )
  const storeShowState = useSelector((store) => store.gifs.showState)
  const showState = useMemo(
    () => propsShowState || storeShowState,
    [propsShowState, storeShowState]
  )

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

export default React.memo(Header)
