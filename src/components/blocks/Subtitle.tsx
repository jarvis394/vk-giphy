import React from 'react'
import styled from '@emotion/styled/macro'

const StyledSubtitle = styled('span')(({ theme }) => ({
  fontSize: 13,
  margin: 0,
  fontWeight: 400,
  color: theme.palette.text.subtitle,
}))

const Subtitle = ({ children, ...props }) => <StyledSubtitle {...props}>{children}</StyledSubtitle>

export default Subtitle
