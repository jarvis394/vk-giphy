import React from 'react'
import styled from '@emotion/styled/macro'
import TextArea from './blocks/TextArea'

const Root = styled('div')({
  background: '#ffffff',
  margin: '8px auto',
  height: 'calc(100vh - 16px)',
  display: 'flex',
  maxWidth: 500,
  width: '100%',
  flexDirection: 'column',
  borderRadius: 4,
  overflow: 'hidden',
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
