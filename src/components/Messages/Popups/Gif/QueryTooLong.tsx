import React from 'react'
import styled from '@emotion/styled/macro'
import Centered from 'src/components/blocks/Centered'
import Subtitle from 'src/components/blocks/Subtitle'
import Title from 'src/components/blocks/Title'
import { GIPHY_MAX_QUERY_LENGTH } from 'src/config/constants'

const StyledImage = styled('img')({
  width: 48,
  height: 48,
  marginBottom: 16,
})

const QueryTooLong = () => {
  return (
    <Centered>
      <StyledImage src="search-emoji.png" alt="error emoji" />
      <Title>Длина запроса превышает {GIPHY_MAX_QUERY_LENGTH} символов</Title>
      <Subtitle>Может, попробуешь что-нибудь поменьше?</Subtitle>
    </Centered>
  )
}

export default QueryTooLong
