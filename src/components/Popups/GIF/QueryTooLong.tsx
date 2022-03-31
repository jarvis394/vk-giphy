import React from 'react'
import styled from '@emotion/styled/macro'
import { Centered, Subtitle, Title } from './EnterQuery'

const StyledImage = styled('img')({
  width: 48,
  height: 48,
  marginBottom: 16,
})

const QueryTooLong = () => {
  return (
    <Centered>
      <StyledImage src="search-emoji.png" alt="error emoji" />
      <Title>Длина запроса превышает 50 символов</Title>
      <Subtitle>Может, попробуешь что-нибудь поменьше?</Subtitle>
    </Centered>
  )
}

export default QueryTooLong
