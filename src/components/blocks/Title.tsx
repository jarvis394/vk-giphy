import React from 'react'
import styled from '@emotion/styled/macro'

const StyledTitle = styled('h1')({
  fontSize: 16,
  margin: 0,
  marginBottom: 6,
  fontWeight: 600,
  color: '#868B8F',
})

const Title = ({ children, ...props }) => (
  <StyledTitle {...props}>{children}</StyledTitle>
)

export default Title
