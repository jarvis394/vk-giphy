import React from 'react'
import styled from '@emotion/styled/macro'

const StyledSubtitle = styled('span')({
  fontSize: 13,
  margin: 0,
  fontWeight: 400,
  color: '#B0B5BA',
})

const Subtitle = ({ children, ...props }) => <StyledSubtitle {...props}>{children}</StyledSubtitle>

export default Subtitle
