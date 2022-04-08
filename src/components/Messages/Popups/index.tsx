import React from 'react'
import styled from '@emotion/styled/macro'
import GifPopup from './Gif'
import ThemePopup from './Theme'
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
  return (
    <Wrapper>
      <GifPopup />
      <ThemePopup />
    </Wrapper>
  )
}

export { default as GifPopup } from './Gif'
export { default as ThemePopup } from './Theme'
export default Popups
