import React from 'react'
import styled from '@emotion/styled/macro'

const StyledCentered = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexGrow: 1,
  flexDirection: 'column',
})

const Centered = ({ children, ...props }) => <StyledCentered {...props}>{children}</StyledCentered>

export default Centered
