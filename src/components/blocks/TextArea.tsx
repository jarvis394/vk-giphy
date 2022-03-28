import { keyframes } from '@emotion/react/macro'
import styled from '@emotion/styled/macro'
import React, { useMemo, useState } from 'react'
import {
  COMMAND_KEYWORDS,
  COMMAND_PREFIX,
  TEXTAREA_MAX_LINES,
} from 'src/config/constants'
import { formatNewLine } from 'src/utils/formatNewLine'

const PADDING_VERTICAL = 9.5
const PADDING_HORIZONTAL = 12
const MESSAGE_LINE_HEIGHT = 17
const PLACEHOLDER_CLASSES = {
  visible: 'textarea__placeholder-visible',
  hidden: 'textarea__placeholder-hidden',
}

const Root = styled('div')({
  overflowY: 'auto',
  minHeight: MESSAGE_LINE_HEIGHT + 2 * PADDING_VERTICAL,
  maxHeight: MESSAGE_LINE_HEIGHT * TEXTAREA_MAX_LINES + 2 * PADDING_VERTICAL,
  border: '1px solid #D3D9DE',
  borderRadius: 6,
  width: '100%',
  minWidth: 256,
})

const Wrapper = styled('div')({
  position: 'relative',
  overflow: 'hidden',
  minHeight: MESSAGE_LINE_HEIGHT + 2 * PADDING_VERTICAL,
})

const InnerTextArea = styled('textarea')({
  fontFamily: 'Roboto',
  fontSize: 13,
  lineHeight: `${MESSAGE_LINE_HEIGHT}px`,
  fontWeight: 400,
  margin: 0,
  padding: `${PADDING_VERTICAL}px ${PADDING_HORIZONTAL}px`,
  border: 'none',
  outline: 'none',
  WebkitTextFillColor: 'transparent',
  position: 'absolute',
  top: 0,
  left: 0,
  resize: 'none',
  width: '100%',
  height: '100%',
  whiteSpace: 'pre-wrap',
})

const Message = styled('div')({
  fontFamily: 'Roboto',
  fontSize: 13,
  lineHeight: `${MESSAGE_LINE_HEIGHT}px`,
  fontWeight: 400,
  margin: 0,
  padding: `${PADDING_VERTICAL}px ${PADDING_HORIZONTAL}px`,
  border: 'none',
  outline: 'none',
  background: 'transparent',
  pointerEvents: 'none',
  position: 'relative',
  wordBreak: 'break-word',
  width: '100%',
  height: '100%',
  whiteSpace: 'pre-wrap',
})

const PlaceholderText = styled('span')({
  fontWeight: 400,
  color: '#828282',
  transitionDuration: '212ms',
  position: 'absolute',
  top: PADDING_VERTICAL,
  transitionTimingFunction: 'cubic-bezier(0, 0.5, 0.5, 1)',
  [`&.${PLACEHOLDER_CLASSES.hidden}`]: {
    left: PADDING_HORIZONTAL + 16,
    opacity: 0,
  },
  [`&.${PLACEHOLDER_CLASSES.visible}`]: {
    left: PADDING_HORIZONTAL,
    opacity: 1,
  },
})

const StyledKeyword = styled('span')({
  fontWeight: 600,
  background: 'linear-gradient(135deg, #2EE6A8, #3399FF, #9933FF, #FF3399)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
})

const TextArea = ({ ...props }) => {
  const [message, setMessage] = useState<string>('')
  const [messageCommand, setMessageCommand] = useState<string>()
  const [messageElement, setMessageElement] = useState<JSX.Element>()
  const shouldRenderPlaceholder = useMemo(
    () => message?.length === 0,
    [message]
  )

  const handleTextAreaInput: React.ChangeEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    // No need of sanitizing because text is being inserted safely into page
    const newMessage = e.target.value
    const firstWhitespaceIndex = newMessage?.indexOf(' ')
    const possibleCommand = newMessage?.slice(1, firstWhitespaceIndex)
    const commandStartsWithPrefix =
      newMessage && newMessage[0] === COMMAND_PREFIX
    const commandInCommandKeywords = COMMAND_KEYWORDS.has(possibleCommand)
    let newMessageElement = <>{formatNewLine(newMessage)}</>
    let newMessageCommand = null

    // Highlight word if it has whitespace after it,
    // starts with `PREFIX` and is in list of supported command keywords
    if (
      firstWhitespaceIndex !== -1 &&
      commandStartsWithPrefix &&
      commandInCommandKeywords
    ) {
      newMessageElement = (
        <>
          <StyledKeyword>
            {newMessage.slice(0, firstWhitespaceIndex)}
          </StyledKeyword>
          {formatNewLine(newMessage.slice(firstWhitespaceIndex))}
        </>
      )
      newMessageCommand = possibleCommand
    }

    setMessageCommand(newMessageCommand)
    setMessage(newMessage)
    setMessageElement(newMessageElement)
  }

  const handleTextAreaKeyDown: React.KeyboardEventHandler<
    HTMLTextAreaElement
  > = (e) => {
    const keyCode = e.key
    if (keyCode === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      alert(`Sent message: ${message}!`)
    }
  }

  return (
    <Root>
      <Wrapper>
        <InnerTextArea
          role="textbox"
          aria-multiline="true"
          onChange={handleTextAreaInput}
          onKeyDown={handleTextAreaKeyDown}
          aria-placeholder="Напишите сообщение..."
        />
        <Message>
          {messageElement}
          <PlaceholderText
            className={
              shouldRenderPlaceholder
                ? PLACEHOLDER_CLASSES.visible
                : PLACEHOLDER_CLASSES.hidden
            }
          >
            Напишите сообщение...
          </PlaceholderText>
        </Message>
      </Wrapper>
    </Root>
  )
}

export default TextArea
