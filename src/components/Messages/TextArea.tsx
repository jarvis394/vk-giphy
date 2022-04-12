import React, { useCallback, useMemo } from 'react'
import styled from '@emotion/styled/macro'
import MessagesTextAreaInput from './TextAreaInput'
import useMessagesContext from 'src/hooks/useMessagesContext'
import escapeCommand from 'src/utils/escapeCommand'
import { Icon24Cancel, Icon24Send } from '@vkontakte/icons'
import { pushMessage } from 'src/store/actions/messages'
import { useDispatch } from 'react-redux'

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  background: theme.palette.background.wrapper,
  padding: '13px 16px',
  height: 'fit-content',
  zIndex: 10,
  display: 'flex',
  flexDirection: 'row',
  ...(theme.palette.type !== 'dark' && {
    borderTop: '1px solid ' + theme.palette.border.light,
  }),
}))

const IconButton = styled('button', {
  shouldForwardProp: (p) => p != 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  border: 'none',
  padding: '7px',
  background: 'transparent',
  color: theme.palette.icon.main,
  opacity: active ? theme.palette.icon.opacity : 0,
  position: 'absolute',
  cursor: 'pointer',
  top: 0,
  left: 0,
  transitionDuration: '150ms',
  pointerEvents: active ? 'auto' : 'none',
  '&:disabled': {
    pointerEvents: 'none',
    opacity: theme.palette.icon.disabledOpacity + ' !important',
    cursor: 'none',
  },
  '&:focus': {
    outline: '2px solid ' + theme.palette.primary.main,
  },
  ...(active && {
    '&:hover': {
      opacity: theme.palette.icon.hoverOpacity,
    },
  }),
}))

const Buttons = styled('div')({
  position: 'relative',
  marginRight: -12,
  marginLeft: 4,
  height: 38,
  width: 38,
  display: 'flex',
  flexShrink: 0,
})

const CancelButton = ({ ...props }) => (
  <IconButton {...props} aria-label="Cancel command">
    <Icon24Cancel />
  </IconButton>
)
const SendButton = ({ ...props }) => (
  <IconButton {...props} aria-label="Send message">
    <Icon24Send />
  </IconButton>
)

const MessagesTextArea = () => {
  const [messagesContext, setMessagesContext] = useMessagesContext()
  const dispatch = useDispatch()
  const canSendMessage = useMemo(
    () => messagesContext.message.trim().length !== 0,
    [messagesContext.message]
  )
  const handleCancelClick = (e) => {
    e.preventDefault()
    setMessagesContext((prev) => {
      const escapedCommand = escapeCommand(prev)
      const selection = escapedCommand.message.length
      return {
        ...escapedCommand,
        lastSelection: [selection, selection],
      }
    })
  }
  const handleSendClick = useCallback(
    (e) => {
      e.preventDefault()
      if (canSendMessage) {
        dispatch(
          pushMessage({
            text: messagesContext.message.trim(),
            timestamp: Date.now(),
          })
        )
        setMessagesContext((prev) => ({
          lastSelection: [0, 0],
          command: null,
          message: '',
        }))
      }
    },
    [messagesContext.message, canSendMessage]
  )

  return (
    <Root>
      <MessagesTextAreaInput />
      <Buttons
        onClick={messagesContext.command ? handleCancelClick : handleSendClick}
        // Fixes soft keyboard hide and show on refocus
        onMouseDown={(event) => event.preventDefault()}
      >
        <CancelButton
          tabIndex={messagesContext.command ? 0 : -1}
          active={!!messagesContext.command}
        />
        <SendButton
          disabled={!canSendMessage}
          tabIndex={!messagesContext.command ? 0 : -1}
          active={!messagesContext.command}
        />
      </Buttons>
    </Root>
  )
}

export default React.memo(MessagesTextArea)
