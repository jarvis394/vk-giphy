import React from 'react'
import styled from '@emotion/styled/macro'
import { GIFPopup } from 'src/components/Popups'

const Wrapper = styled('div')({
  position: 'relative',
  height: 0,
  width: '100%',
  padding: '0 16px',
})

const Popups = () => {
  return (
    <Wrapper>
      <GIFPopup />
    </Wrapper>
  )
}

export default Popups
