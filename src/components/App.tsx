import React from 'react'
import styled from '@emotion/styled/macro'
import TextArea from './blocks/TextArea'
import { APP_MAX_WIDTH } from 'src/config/constants'

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

const MessagesContainer = styled('div')({
  display: 'flex',
  flexGrow: 1,
})

const TextAreaContainer = styled('div')({
  width: '100%',
  background: '#FAFBFC',
  borderTop: '1px solid #DCE1E5',
  padding: '13px 16px',
  height: 'fit-content',
})

const App = () => {
  return (
    <Root>
      <MessagesContainer></MessagesContainer>
      <TextAreaContainer>
        <TextArea />
      </TextAreaContainer>
    </Root>
  )
}

export default App
