import React from 'react'
import styled from '@emotion/styled/macro'
import Centered from 'src/components/blocks/Centered'
import Subtitle from 'src/components/blocks/Subtitle'
import Title from 'src/components/blocks/Title'

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
