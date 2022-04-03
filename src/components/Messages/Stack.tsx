import React, { useEffect, useRef } from 'react'
import styled from '@emotion/styled/macro'
import useSelector from 'src/hooks/useSelector'
import Message from 'src/components/blocks/Message'

const Root = styled('div')({
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  gap: 12,
  padding: '14px 16px',
  overflowY: 'scroll',
  overflowX: 'hidden',
})

const Stack = () => {
  const messages = useSelector((store) => store.messages.data)
  const rootRef = useRef<HTMLDivElement>()

  /** Scroll to bottom on message push */
  useEffect(() => {
    rootRef.current && rootRef.current.scrollTo(0, rootRef.current.scrollHeight)
  }, [messages])

  return (
    <Root ref={rootRef}>
      {messages.map((e, i) => (
        <Message data={e} key={i} />
      ))}
    </Root>
  )
}

export default Stack
