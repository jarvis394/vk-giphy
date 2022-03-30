import React from 'react'
import TextArea, { TextAreaState } from 'src/components/blocks/TextArea'
import useMessagesContext from 'src/hooks/useMessagesContext'

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
  const handleChange = (
    _e: React.ChangeEvent<HTMLTextAreaElement>,
    state: TextAreaState
  ) => {
    setMessagesContext(state)
  }
  const handleSubmit = (state: TextAreaState) => {
    //dispatch(send(state))
    console.log('submit:', state)
  }

  return <TextArea onChange={handleChange} onSubmit={handleSubmit} />
}

export default MessagesTextArea
