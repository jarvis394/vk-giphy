import React, { useMemo } from 'react'
import styled from '@emotion/styled/macro'
import { GIFPopup } from 'src/components/Popups'
import useMessagesContext from 'src/hooks/useMessagesContext'
import { APP_MAX_WIDTH } from 'src/config/constants'

const Wrapper = styled('div')({
  position: 'relative',
  height: 0,
  width: '100%',
  padding: '0 16px',
  [`@media (max-width: ${APP_MAX_WIDTH}px)`]: {
    padding: 0,
  },
})

const Popups = () => {
  const [messagesContext] = useMessagesContext()
  const commandArguments = useMemo(
    () =>
      messagesContext.command &&
      messagesContext.message.slice(messagesContext.command.length + 2),
    [messagesContext.message]
  )

  return (
    <Wrapper>
      {messagesContext.command === 'gif' && <GIFPopup query={commandArguments} />}
    </Wrapper>
  )
}

export default Popups
