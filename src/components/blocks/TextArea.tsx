import styled from '@emotion/styled/macro'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  COMMAND_KEYWORDS,
  COMMAND_PREFIX,
  TEXTAREA_MAX_LINES,
} from 'src/config/constants'
import { formatNewLine } from 'src/utils/formatNewLine'
import { MessagesState } from '../Messages'

type TextAreaChangeHandler = React.ChangeEventHandler<HTMLTextAreaElement>
type TextAreaKeyDownHandler = React.KeyboardEventHandler<HTMLTextAreaElement>
export interface TextAreaState {
  message: string
  command: string
}
type TextAreaProps = Omit<
  JSX.IntrinsicElements['textarea'],
  'onChange' | 'onSubmit'
> & {
  onChange?: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    state: TextAreaState
  ) => void
  onSubmit?: (state: TextAreaState) => unknown
  setMessagesContext?: React.Dispatch<React.SetStateAction<MessagesState>>
  messagesContext?: MessagesState
}

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
  position: 'absolute',
  top: PADDING_VERTICAL,
  transition:
    'opacity 360ms cubic-bezier(0, 1, 0, 1), left 360ms cubic-bezier(0, 1, 0, 1), color 200ms ease',
  [`&.${PLACEHOLDER_CLASSES.hidden}`]: {
    left: PADDING_HORIZONTAL + 16,
    opacity: 0,
  },
  [`&.${PLACEHOLDER_CLASSES.visible}`]: {
    left: PADDING_HORIZONTAL,
    opacity: 1,
  },
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
  [`&:focus + ${Message} > ${PlaceholderText}`]: {
    color: '#B2B2B2',
  },
})

const StyledKeyword = styled('span')({
  fontWeight: 600,
  background: 'linear-gradient(135deg, #2EE6A8, #3399FF, #9933FF, #FF3399)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
})

const getMessageCommand = (message: string) => {
  const firstWhitespaceIndex = message?.indexOf(' ')
  const possibleCommand = message?.slice(1, firstWhitespaceIndex)
  const commandStartsWithPrefix = message && message[0] === COMMAND_PREFIX
  const commandInCommandKeywords = COMMAND_KEYWORDS.has(possibleCommand)

  // Highlight word if it has whitespace after it,
  // starts with `PREFIX` and is in list of supported command keywords
  if (
    firstWhitespaceIndex !== -1 &&
    commandStartsWithPrefix &&
    commandInCommandKeywords
  ) {
    return possibleCommand
  } else return null
}

const makeMessageElement = (message: string, command?: string) => {
  const firstWhitespaceIndex = message?.indexOf(' ')
  let messageElement = <>{formatNewLine(message)}</>

  // Highlight command if present
  if (command) {
    messageElement = (
      <>
        <StyledKeyword>{message.slice(0, firstWhitespaceIndex)}</StyledKeyword>
        {formatNewLine(message.slice(firstWhitespaceIndex))}
      </>
    )
  }

  return messageElement
}

/**
 * Renders textarea component with commands' keyword highlighing feature
 * Can be controlled or uncontrolled. Provide `messagesContext` and `setMessagesContext`
 * to use controlled-style.
 *
 * @component
 * @example
 * // Controlled variant
 * const [messagesContext, setMessagesContext] = useMessagesContext()
 *
 * return (
 *   <TextArea
 *     messagesContext={messagesContext}
 *     setMessagesContext={setMessagesContext}
 *   />
 * )
 *
 * // Uncontrolled variant
 * const [messagesContext, setMessagesContext] = useMessagesContext()
 * const handleChange = (_e, newMessagesContext) => {
 *   setMessagesContext(newMessagesContext)
 * }
 *
 * return (
 *   <TextArea onChange={handleChange} onSubmit={...} />
 * )
 */
const TextArea: React.FC<TextAreaProps> = ({
  onChange,
  onSubmit,
  onKeyDown,
  messagesContext: propsMessagesContext,
  setMessagesContext: propsSetMessagesContext,
  ...props
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>()
  const [componentMessagesContext, setComponentMessagesContext] =
    useState<MessagesState>({
      message: '',
      command: null,
    })
  const messagesContext = useMemo(
    () => propsMessagesContext || componentMessagesContext,
    [propsMessagesContext, componentMessagesContext]
  )
  const setMessagesContext = useMemo(
    () => propsSetMessagesContext || setComponentMessagesContext,
    [propsSetMessagesContext, setComponentMessagesContext]
  )
  const [messageElement, setMessageElement] = useState<JSX.Element>()
  const placeholderClasses = useMemo(
    () =>
      !messagesContext.message || messagesContext.message?.length === 0
        ? PLACEHOLDER_CLASSES.visible
        : PLACEHOLDER_CLASSES.hidden,
    [messagesContext.message]
  )

  const handleTextAreaChange: TextAreaChangeHandler = useCallback(
    (e) => {
      // No need of sanitizing because text is being inserted safely into page
      const newMessage = e.target.value
      const newMessageCommand = getMessageCommand(newMessage)

      setMessagesContext({
        command: newMessageCommand,
        message: newMessage,
      })
      if (onChange) {
        onChange(e, {
          message: newMessage,
          command: newMessageCommand,
        })
      }
    },
    [setMessagesContext]
  )

  const handleTextAreaKeyDown: TextAreaKeyDownHandler = useCallback(
    (e) => {
      if (
        onSubmit &&
        e.key === 'Enter' &&
        !e.shiftKey &&
        messagesContext.message.trim() !== ''
      ) {
        e.preventDefault()
        onSubmit(messagesContext)
        e.currentTarget.focus()
      }
      onKeyDown(e)
    },
    [messagesContext.message, onSubmit, onKeyDown]
  )

  /**
   * Constructs message element for textArea overlay
   * and refocuses textArea on input
   */
  useEffect(() => {
    const newMessageElement = makeMessageElement(
      messagesContext.message,
      messagesContext.command
    )
    setMessageElement(newMessageElement)
    if (textAreaRef.current && document.activeElement !== textAreaRef.current) {
      textAreaRef.current.focus()
    }
  }, [messagesContext.message, textAreaRef.current])

  return (
    <Root>
      <Wrapper>
        <InnerTextArea
          ref={textAreaRef}
          role="textbox"
          autoFocus
          aria-multiline="true"
          aria-placeholder="Напишите сообщение..."
          aria-label="Ввод сообщения"
          onChange={handleTextAreaChange}
          onKeyDown={handleTextAreaKeyDown}
          value={messagesContext.message}
          {...props}
        />
        <Message>
          {messageElement}
          <PlaceholderText className={placeholderClasses}>
            Напишите сообщение...
          </PlaceholderText>
        </Message>
      </Wrapper>
    </Root>
  )
}

export default React.memo(TextArea)
