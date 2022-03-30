import React from 'react'
import { keyframes } from '@emotion/react/macro'
import styled from '@emotion/styled/macro'
import { Icon24Spinner } from '@vkontakte/icons'
import { Icon24SpinnerProps } from '@vkontakte/icons/dist/24/spinner'

const spinnerAnimation = keyframes`
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
`
const StyledSpinner = styled(Icon24Spinner)(({ theme }) => ({
  animation: `${spinnerAnimation} 1.1s infinite linear`,
}))

const Spinner: React.FC<Icon24SpinnerProps> = ({ ...props }) => {
  return <StyledSpinner {...props} />
}

export default Spinner
