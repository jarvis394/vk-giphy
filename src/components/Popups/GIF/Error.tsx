import styled from '@emotion/styled/macro'
import React from 'react'
import useSelector from 'src/hooks/useSelector'
import { Centered, Subtitle, Title } from './EnterQuery'

const StyledImage = styled('img')({
  width: 48,
  height: 48,
  marginBottom: 16,
})

const Error = () => {
  const fetchError = useSelector((store) => store.gifs.fetchError)
  return (
    <Centered>
      <StyledImage src="error-emoji.png" alt="error emoji" />
      <Title>Произошла ошибка</Title>
      <Subtitle>{fetchError.message}</Subtitle>
    </Centered>
  )
}

export default Error
