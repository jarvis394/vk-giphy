import React from 'react'
import { useDispatch } from 'react-redux'
import TextArea, { TextAreaState } from 'src/components/blocks/TextArea'
import useMessagesContext from 'src/hooks/useMessagesContext'
import { pushMessage } from 'src/store/actions/messages'

/**
 * Renders textarea component with commands' keyword highlighing feature
 *
 * Needs to be within <Messages> provider component
 *
 * @component
 * @example
 * <Messages>
 *   <Messages.TextAreaContainer>
 *     <Messages.TextArea />
 *   <Messages.TextAreaContainer>
 * </Messages>
 */
const MessagesTextArea = () => {
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
      setMessagesContext((prev) => {
        const possibleArguments =
          prev.command && prev.message.slice(prev.command.length + 2)
        const hasCommand = !!prev.command
        const hasArguments = hasCommand && possibleArguments?.length > 0

        if (hasCommand && hasArguments)
          return {
            ...prev,
            message: prev.message.slice(0, prev.command.length + 2),
          }
        else if (hasCommand) {
          return {
            command: null,
            message: '',
          }
        } else return prev
      })
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

export default MessagesTextArea
