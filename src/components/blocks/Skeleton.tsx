import React, { ComponentPropsWithoutRef } from 'react'
import { keyframes } from '@emotion/react/macro'
import styled from '@emotion/styled/macro'

const skeletonProgress = keyframes`
  0% {
    left: -500px;
  }
  100% {
    left: 100%;
  }
`

const Root = styled('span')({
  width: '100%',
  height: '1em',
  background: '#E9ECEF',
  borderRadius: 4,
  display: 'inline-block',
  lineHeight: 1,
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    height: '100%',
    width: 500,
    top: 0,
    left: -500,
    backgroundImage: `linear-gradient(
      90deg,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.6),
      rgba(255, 255, 255, 0)
    )`,
    animation: `${skeletonProgress} 1.2s ease-in-out infinite`,
  },
})

const Skeleton = ({ ...props }) => {
  return <Root {...props}>&zwnj;</Root>
}

export default React.memo(Skeleton)
