import React, { useMemo, useState } from 'react'
import styled from '@emotion/styled/macro'
import { APP_MAX_WIDTH } from 'src/config/constants'
import Messages from './Messages'
import { Global, ThemeProvider } from '@emotion/react/macro'
import { generateTheme, ThemeType } from 'src/styles/theme'
import isDarkTheme from 'src/utils/isDarkTheme'
import { Icon28SunOutline, Icon28MoonOutline } from '@vkontakte/icons'

const Root = styled('div')(({ theme }) => ({
  background: theme.palette.background.paper,
  margin: '8px auto',
  height: 'calc(100vh - 16px)',
  display: 'flex',
  maxWidth: APP_MAX_WIDTH,
  width: '100%',
  flexDirection: 'column',
  borderRadius: 8,
  overflow: 'hidden',
  position: 'relative',
  border: '1px solid ' + theme.palette.border.main,
  [`@media (max-width: ${APP_MAX_WIDTH}px)`]: {
    margin: '0 auto',
    padding: 0,
    borderRadius: 0,
    height: '100vh',
    border: 'none',
  },
}))

const ThemeToggle = styled('button')(({ theme }) => ({
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
  [`@media (max-width: ${APP_MAX_WIDTH}px)`]: {
    right: 0,
    top: 0,
    width: 48,
    height: 48,
  },
  '&:active': {
    color: theme.palette.text.subtitle,
  },
  WebkitTapHighlightColor: 'transparent',
}))

const App = () => {
  const [themeType, setThemeType] = useState<ThemeType>('light')
  const theme = useMemo(() => generateTheme(themeType), [themeType])

  return (
    <ThemeProvider theme={theme}>
      <Global
        styles={{
          body: {
            backgroundColor: theme.palette.background.default,
          },
        }}
      />
      <ThemeToggle
        onClick={() =>
          setThemeType((prev) => (prev === 'light' ? 'dark' : 'light'))
        }
      >
        {isDarkTheme(theme) ? <Icon28MoonOutline /> : <Icon28SunOutline />}
      </ThemeToggle>
      <Root>
        <Messages>
          <Messages.Stack />
          <Messages.Popups />
          <Messages.TextArea />
        </Messages>
      </Root>
    </ThemeProvider>
  )
}

export default App
