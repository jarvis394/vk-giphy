import React, { useEffect, useRef } from 'react'
import styled from '@emotion/styled/macro'
import useSelector from 'src/hooks/useSelector'
import Message from 'src/components/blocks/Message'
import Centered from '../blocks/Centered'
import Subtitle from '../blocks/Subtitle'
import { alpha } from 'src/utils/colorManipulation'
import Title from '../blocks/Title'
import { COMMAND_KEYWORDS, COMMAND_PREFIX } from 'src/config/constants'
import useMessagesContext from 'src/hooks/useMessagesContext'
import isDarkTheme from 'src/utils/isDarkTheme'

const commands = []
COMMAND_KEYWORDS.forEach((e) => commands.push(e))

const Spacer = styled('div')({ display: 'flex', flexGrow: 1 })

const StyledCentered = styled(Centered, {
  shouldForwardProp: (p) => p !== 'hidden',
})<{ hidden: boolean }>(({ hidden }) => ({
  opacity: hidden ? 0 : 1,
  pointerEvents: hidden ? 'none' : 'auto',
  userSelect: hidden ? 'none' : 'auto',
  transition: 'opacity 240ms ease',
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
}))

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  position: 'relative',
  gap: 12,
  padding: '14px 16px',
  overflowY: 'scroll',
  overflowX: 'hidden',
  marginRight: 6,
  '&::-webkit-scrollbar': {
    background: 'transparent',
    width: 6,
    height: 0,
  },
  '&::-webkit-scrollbar-thumb': {
    minHeight: 40,
    background: theme.palette.scrollbar.main,
    borderRadius: 100,
    '&:active': {
      background: theme.palette.scrollbar.active,
    },
  },
  '&::-webkit-scrollbar-track': {
    margin: '6px 0',
  },
}))

const NoMessagesText = styled(Subtitle)({
  marginBottom: 16,
})

const CommandsBlock = styled('div')(({ theme }) => ({
  backgroundColor: alpha(theme.palette.text.secondary, 0.12),
  padding: 12,
  fontSize: 13,
  borderRadius: 8,
  color: alpha(theme.palette.text.primary, 0.63),
  maxWidth: '60%',
}))

const CommandsTitle = styled(Title)(({ theme }) => ({
  fontSize: 13,
  lineHeight: '17px',
}))

const CommandKeyword = styled('button')(({ theme }) => ({
  fontSize: 13,
  lineHeight: '17px',
  margin: 0,
  color: '#ffffff',
  background:
    (isDarkTheme(theme)
      ? 'linear-gradient(rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.24)),'
      : '') + theme.palette.rainbowGradient,
  borderRadius: 8,
  padding: '4px 8px',
  fontWeight: 600,
  width: 'fit-content',
  cursor: 'pointer',
  border: 'none',
  position: 'relative',
}))

const CommandKeywordsContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: 8,
  marginTop: 8,
  flexWrap: 'wrap',
})

const Stack = () => {
  const [_, setMessagesContext] = useMessagesContext()
  const messages = useSelector((store) => store.messages.data)
  const rootRef = useRef<HTMLDivElement>()
  const enterCommand = (e: string) => {
    setMessagesContext({
      message: COMMAND_PREFIX + e + ' ',
      command: e,
      lastSelection: [e.length + 2, e.length + 2],
    })
  }

  /** Scroll to bottom on message push */
  useEffect(() => {
    rootRef.current && rootRef.current.scrollTo(0, rootRef.current.scrollHeight)
  }, [messages])

  return (
    <Root ref={rootRef}>
      <StyledCentered hidden={messages.length !== 0}>
        <NoMessagesText>Здесь пока пусто.</NoMessagesText>
        <CommandsBlock>
          <CommandsTitle>Доступные команды</CommandsTitle>
          <CommandKeywordsContainer>
            {commands.map((e, i) => (
              <CommandKeyword
                tabIndex={messages.length === 0 ? 0 : -1}
                onClick={() => enterCommand(e)}
                key={i}
              >
                {COMMAND_PREFIX}{e}
              </CommandKeyword>
            ))}
          </CommandKeywordsContainer>
        </CommandsBlock>
      </StyledCentered>

      {messages.length !== 0 && <Spacer />}
      {messages.map((e, i) => (
        <Message data={e} key={i} />
      ))}
    </Root>
  )
}

export default Stack
