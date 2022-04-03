import React from 'react'
import styled from '@emotion/styled/macro'
import Centered from 'src/components/blocks/Centered'
import Subtitle from 'src/components/blocks/Subtitle'
import Title from 'src/components/blocks/Title'
import useSelector from 'src/hooks/useSelector'
import { FetchingState } from 'src/types'

const StyledImage = styled('img')({
  width: 48,
  height: 48,
  marginBottom: 16,
})

const Error = () => {
  const fetchError = useSelector((store) => store.gifs.fetchError)
  const state = useSelector((store) => store.gifs.state)

  // if (state !== FetchingState.Error) return null

  return (
    <Centered>
      <StyledImage src="error-emoji.png" alt="error emoji" />
      <Title>Произошла ошибка</Title>
      <Subtitle>{fetchError?.message}</Subtitle>
    </Centered>
  )
}

export default Error
