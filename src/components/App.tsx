import React from 'react'
import styled from '@emotion/styled/macro'
import { APP_MAX_WIDTH } from 'src/config/constants'
import Messages from './Messages'

const Root = styled('div')({
  background: '#ffffff',
  margin: '8px auto',
  height: 'calc(100vh - 16px)',
  display: 'flex',
  maxWidth: APP_MAX_WIDTH,
  width: '100%',
  flexDirection: 'column',
  borderRadius: 4,
  overflow: 'hidden',
  [`@media (max-width: ${APP_MAX_WIDTH}px)`]: {
    margin: '0 auto',
    padding: 0,
    borderRadius: 0,
    height: '100vh',
  },
})

const App = () => {
  return (
    <Root>
      <Messages>
        <Messages.Stack />
        <Messages.Popups />
        <Messages.TextArea />
      </Messages>
    </Root>
  )
}

export default App
