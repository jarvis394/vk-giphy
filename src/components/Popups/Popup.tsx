import React from 'react'
import styled from '@emotion/styled/macro'
import { APP_MAX_WIDTH } from 'src/config/constants'

const Root = styled('div')({
  position: 'absolute',
  backgroundColor: '#FFFFFF',
  bottom: -8,
  border: '1px solid #F0F4F6',
  borderRadius: 8,
  boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.07)',
  maxWidth: 428,
  height: 248,
  width: '100%',
  [`@media (max-width: ${APP_MAX_WIDTH}px)`]: {
    maxWidth: '100%',
    height: 248,
    bottom: -1,
    borderRadius: 0,
    boxShadow: 'none',
    border: 'none',
    borderTop: '1px solid #DCE1E5',
    borderBottom: '1px solid #DCE1E5',
  },
})

const Popup = ({ children, ...props }) => {
  return <Root {...props}>{children}</Root>
}

export default Popup
