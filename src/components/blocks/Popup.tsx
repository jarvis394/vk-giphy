import React from 'react'
import styled from '@emotion/styled/macro'
import { APP_MAX_WIDTH } from 'src/config/constants'

const Root = styled('div')<{ active: boolean }>(({ active }) => ({
  opacity: active ? 1 : 0,
  bottom: active ? -8 : 4,
  position: 'absolute',
  backgroundColor: '#FFFFFF',
  border: '1px solid #F0F4F6',
  borderRadius: 8,
  boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.07)',
  maxWidth: 428,
  height: 248,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 180ms ease',
  [`@media (max-width: ${APP_MAX_WIDTH}px)`]: {
    maxWidth: '100%',
    height: 248,
    bottom: -1,
    borderRadius: 0,
    boxShadow: 'none',
    border: 'none',
    borderTop: '1px solid #DCE1E5',
    borderBottom: '1px solid #DCE1E5',
  },
}))

type Props = JSX.IntrinsicElements['div'] & { active?: boolean }

// eslint-disable-next-line react/display-name
const Popup = React.forwardRef<HTMLDivElement, React.PropsWithChildren<Props>>(
  ({ active = true, children, ...props }, ref) => (
    <Root active={active} {...props} ref={ref}>
      {children}
    </Root>
  )
)

export default React.memo(Popup)
