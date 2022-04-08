import React, { useEffect, useRef } from 'react'
import styled from '@emotion/styled/macro'
import useSelector from 'src/hooks/useSelector'
import Message from 'src/components/blocks/Message'

const Spacer = styled('div')({ display: 'flex', flexGrow: 1 })

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  gap: 12,
  padding: '14px 16px',
  overflowY: 'scroll',
  overflowX: 'hidden',
  marginRight: 6,
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

const Stack = () => {
  const messages = useSelector((store) => store.messages.data)
  const rootRef = useRef<HTMLDivElement>()

  /** Scroll to bottom on message push */
  useEffect(() => {
    rootRef.current && rootRef.current.scrollTo(0, rootRef.current.scrollHeight)
  }, [messages])

  return (
    <Root ref={rootRef}>
      <Spacer />
      {messages.map((e, i) => (
        <Message data={e} key={i} />
      ))}
    </Root>
  )
}

export default Stack
