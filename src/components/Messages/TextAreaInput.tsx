import React from 'react'
import { useDispatch } from 'react-redux'
import TextArea, { TextAreaState } from 'src/components/blocks/TextArea'
import useMessagesContext from 'src/hooks/useMessagesContext'
import { pushMessage } from 'src/store/actions/messages'
import escapeCommand from 'src/utils/escapeCommand'

/**
 * Renders textarea component with commands' keyword highlighing feature
 *
 * Needs to be within <Messages> provider component
 *
 * @component
 * @example
 * <Messages>
 *   <Messages.TextAreaInput />
 * </Messages>
 */
const MessagesTextAreaInput = () => {
  const [messagesContext, setMessagesContext] = useMessagesContext()
  const dispatch = useDispatch()
  const handleSubmit = (state: TextAreaState) => {
    dispatch(
      pushMessage({
        text: state.message.trim(),
        timestamp: Date.now(),
      })
    )
    setMessagesContext({
      command: null,
      message: '',
    })
  }
  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    if (e.key === 'Escape') {
      setMessagesContext((prev) => escapeCommand(prev))
    }
  }

  return (
    <TextArea
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      messagesContext={messagesContext}
      setMessagesContext={setMessagesContext}
    />
  )
}

export default MessagesTextAreaInput
