import styled from '@emotion/styled/macro'
import React from 'react'

const Root = styled('div')({
  display: 'flex',
  flexGrow: 1,
  padding: '14px 16px',
})

const Stack = () => {
  return <Root>Messages</Root>
}

export default Stack
