import React from 'react'
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

const Root = styled('span')(({ theme }) => ({
  width: '100%',
  height: '1em',
  background: theme.palette.skeleton.background,
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
      rgba(255, 255, 255, ${theme.palette.skeleton.waveOpacity}),
      rgba(255, 255, 255, 0)
    )`,
    animation: `${skeletonProgress} 1.2s ease-in-out infinite`,
  },
}))

// eslint-disable-next-line react/display-name
const Skeleton = React.forwardRef<HTMLDivElement, JSX.IntrinsicElements['div']>(
  (props, ref) => (
    <Root {...props} ref={ref}>
      &zwnj;
    </Root>
  )
)

export default React.memo(Skeleton)
