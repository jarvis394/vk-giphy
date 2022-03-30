import React from 'react'
import styled from '@emotion/styled/macro'
import { GIFPopup } from 'src/components/Popups'
import useMessagesContext from 'src/hooks/useMessagesContext'

const Wrapper = styled('div')({
  position: 'relative',
  height: 0,
  width: '100%',
  padding: '0 16px',
})

const Popups = () => {
  const [messagesContext] = useMessagesContext()

  return (
    <Wrapper>
      {messagesContext.command === 'gif' && <GIFPopup />}
    </Wrapper>
  )
}

export default Popups
