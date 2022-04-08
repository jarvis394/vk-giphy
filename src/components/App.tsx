import React from 'react'
import styled from '@emotion/styled/macro'
import { APP_MAX_WIDTH } from 'src/config/constants'
import Messages from './Messages'
import { Global, ThemeProvider } from '@emotion/react/macro'
import useSelector from 'src/hooks/useSelector'
import ThemeToggle from 'src/components/blocks/ThemeToggle'

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

const App = () => {
  const theme = useSelector((store) => store.theme.theme)

  // TODO: come up with design that fits automatic theme switcher
  // If uncommented, overrides user's last choice of theme,
  // which is not good UX.
  // useAutoThemeChange()

  return (
    <ThemeProvider theme={theme}>
      <Global
        styles={{
          body: {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          },
        }}
      />
      <ThemeToggle />
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
