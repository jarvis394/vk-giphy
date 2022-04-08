import React from 'react'
import styled from '@emotion/styled/macro'
import { Icon28MoonOutline, Icon28SunOutline } from '@vkontakte/icons'
import { useDispatch } from 'react-redux'
import { APP_MAX_WIDTH } from 'src/config/constants'
import useSelector from 'src/hooks/useSelector'
import { setTheme } from 'src/store/actions/theme'
import isDarkTheme from 'src/utils/isDarkTheme'

const Root = styled('button')(({ theme }) => ({
  color: theme.palette.text.secondary,
  background: 'transparent',
  border: 'none',
  width: 56,
  height: 56,
  position: 'absolute',
  right: 16,
  top: 0,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  WebkitTapHighlightColor: 'transparent',
  [`@media (max-width: ${APP_MAX_WIDTH}px)`]: {
    right: 0,
    top: 0,
    width: 48,
    height: 48,
  },
  '&:active': {
    color: theme.palette.text.subtitle,
  },
}))

const ThemeToggle = () => {
  const theme = useSelector((store) => store.theme.theme)
  const dispatch = useDispatch()
  const changeTheme = () => {
    dispatch(setTheme(isDarkTheme(theme) ? 'light' : 'dark'))
  }

  return (
    <Root onClick={changeTheme} aria-label="Change theme">
      {isDarkTheme(theme) ? <Icon28MoonOutline /> : <Icon28SunOutline />}
    </Root>
  )
}

export default React.memo(ThemeToggle)
