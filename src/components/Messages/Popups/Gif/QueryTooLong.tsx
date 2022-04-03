import React, { useMemo } from 'react'
import styled from '@emotion/styled/macro'
import useMessagesContext from 'src/hooks/useMessagesContext'
import { GIPHY_MAX_QUERY_LENGTH } from 'src/config/constants'
import getArgsFromMessagesContext from 'src/utils/getArgsFromMessagesContext'
import Centered from 'src/components/blocks/Centered'
import Subtitle from 'src/components/blocks/Subtitle'
import Title from 'src/components/blocks/Title'

const StyledImage = styled('img')({
  width: 48,
  height: 48,
  marginBottom: 16,
})

const QueryTooLong = () => {
  const [messagesContext] = useMessagesContext()
  const query = useMemo(
    () => getArgsFromMessagesContext(messagesContext) || '',
    [messagesContext.message]
  )

  return (
    <Centered>
      <StyledImage src="search-emoji.png" alt="error emoji" />
      <Title>Длина запроса превышает 50 символов</Title>
      <Subtitle>Может, попробуешь что-нибудь поменьше?</Subtitle>
    </Centered>
  )
}

export default QueryTooLong
