import React from 'react'
import styled from '@emotion/styled/macro'

const Root = styled('div')({
  position: 'absolute',
  padding: '9px 10px',
  backgroundColor: '#ffffff',
  bottom: 8,
  border: '1px solid #D3D9DE',
  borderRadius: 4,
})

const Popup = ({ children }) => {
  return <Root>{children}</Root>
}

export { default as GIFPopup } from './GIF'
export default Popup
