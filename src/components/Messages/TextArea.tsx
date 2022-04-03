import React, { useCallback, useMemo } from 'react'
import styled from '@emotion/styled/macro'
import MessagesTextAreaInput from './TextAreaInput'
import useMessagesContext from 'src/hooks/useMessagesContext'
import escapeCommand from 'src/utils/escapeCommand'
import { Icon24Cancel, Icon24Send } from '@vkontakte/icons'
import { pushMessage } from 'src/store/actions/messages'
import { useDispatch } from 'react-redux'

const Root = styled('div')({
  width: '100%',
  background: '#FAFBFC',
  borderTop: '1px solid #DCE1E5',
  padding: '13px 16px',
  height: 'fit-content',
  zIndex: 10,
  display: 'flex',
  flexDirection: 'row',
})

const IconButton = styled('button', {
  shouldForwardProp: (p) => p != 'active',
})<{ active?: boolean }>(({ active }) => ({
  border: 'none',
  padding: '7px',
  background: 'transparent',
  color: '#818c99',
  opacity: active ? 0.7 : 0,
  position: 'absolute',
  cursor: 'pointer',
  top: 0,
  left: 0,
  transitionDuration: '150ms',
  pointerEvents: active ? 'auto' : 'none',
  '&:disabled': {
    pointerEvents: 'none',
    opacity: 0.5,
    cursor: 'none',
  },
  ...(active && {
    '&:hover': {
      opacity: 1,
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
  <IconButton {...props}>
    <Icon24Cancel />
  </IconButton>
)
const SendButton = ({ ...props }) => (
  <IconButton {...props}>
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
  const handleCancelClick = () => {
    setMessagesContext((prev) => escapeCommand(prev))
  }
  const handleSendClick = useCallback(() => {
    if (canSendMessage) {
      dispatch(
        pushMessage({
          text: messagesContext.message.trim(),
          timestamp: Date.now(),
        })
      )
      setMessagesContext({
        command: null,
        message: '',
      })
    }
  }, [messagesContext.message, canSendMessage])

  return (
    <Root>
      <MessagesTextAreaInput />
      <Buttons
        onClick={messagesContext.command ? handleCancelClick : handleSendClick}
      >
        <CancelButton active={!!messagesContext.command} />
        <SendButton
          disabled={!canSendMessage}
          active={!messagesContext.command}
        />
      </Buttons>
    </Root>
  )
}

export default React.memo(MessagesTextArea)
