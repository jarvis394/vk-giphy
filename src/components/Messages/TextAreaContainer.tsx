import styled from '@emotion/styled/macro'
import React from 'react'

const Root = styled('div')({
  width: '100%',
  background: '#FAFBFC',
  borderTop: '1px solid #DCE1E5',
  padding: '13px 16px',
  height: 'fit-content',
})

const TextAreaContainer = ({ children }) => {
  return <Root>{children}</Root>
}

export default TextAreaContainer
