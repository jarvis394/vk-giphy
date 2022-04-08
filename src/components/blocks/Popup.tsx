import React from 'react'
import styled from '@emotion/styled/macro'
import {
  APP_MAX_WIDTH,
  POPUP_MAX_WIDTH,
  POPUP_HEIGHT,
} from 'src/config/constants'

const Root = styled('div')<{ active: boolean }>(({ theme, active }) => ({
  opacity: active ? 1 : 0,
  bottom: active ? -4 : 4,
  pointerEvents: active ? 'auto' : 'none',
  userSelect: active ? 'auto' : 'none',
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  border: '1px solid ' + theme.palette.border.paper,
  borderRadius: 8,
  boxShadow: theme.shadows.popup,
  maxWidth: POPUP_MAX_WIDTH,
  height: POPUP_HEIGHT,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'opacity 180ms ease, bottom 180ms ease',
  zIndex: 20,
  [`@media (max-width: ${APP_MAX_WIDTH}px)`]: {
    maxWidth: '100%',
    height: POPUP_HEIGHT,
    opacity: active ? 1 : 0,
    bottom: active ? -1 : -8,
    zIndex: 0,
    borderRadius: 0,
    boxShadow: 'none',
    border: 'none',
    borderTop: '1px solid ' + theme.palette.border.light,
    borderBottom: '1px solid ' + theme.palette.border.light,
    transition: 'bottom 120ms ease, opacity 120ms ease',
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
