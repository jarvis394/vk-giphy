import styled from '@emotion/styled/macro'
import React from 'react'
import { Centered, Subtitle, Title } from './EnterQuery'

const StyledImage = styled('img')({
  width: 48,
  height: 48,
  marginBottom: 16,
})

const NoResults = () => {
  return (
    <Centered>
      <StyledImage src="sad-emoji.png" alt="sad emoji" />
      <Title>Ничего не найдено</Title>
      <Subtitle>Попробуй поискать что-нибудь другое</Subtitle>
    </Centered>
  )
}

export default NoResults
