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

  return (
    <TextArea
      onSubmit={handleSubmit}
      messagesContext={messagesContext}
      setMessagesContext={setMessagesContext}
    />
  )
}

export default MessagesTextArea
