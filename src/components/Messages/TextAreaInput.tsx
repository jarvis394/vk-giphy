import React from 'react'
import { useDispatch } from 'react-redux'
import TextArea, { TextAreaState } from 'src/components/blocks/TextArea'
import useMessagesContext from 'src/hooks/useMessagesContext'
import { pushMessage } from 'src/store/actions/messages'
import { changeAutoTheme, setTheme } from 'src/store/actions/theme'
import { isThemeType } from 'src/styles/theme'
import escapeCommand from 'src/utils/escapeCommand'
import getArgsFromMessagesContext from 'src/utils/getArgsFromMessagesContext'

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
    const query = getArgsFromMessagesContext(state)?.trim()
    if (state.command === 'theme' && query) {
      if (isThemeType(query)) {
        dispatch(setTheme(query))
      } else if (query === 'auto') {
        dispatch(changeAutoTheme())
      }
    } else {
      dispatch(
        pushMessage({
          text: state.message.trim(),
          timestamp: Date.now(),
        })
      )
    }
    setMessagesContext({
      command: null,
      message: '',
      lastSelection: [0, 0],
    })
  }
  
  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    if (e.key === 'Escape') {
      setMessagesContext((prev) => {
        const escapedCommand = escapeCommand(prev)
        const selection = escapedCommand.message.length
        return {
          ...escapedCommand,
          lastSelection: [selection, selection],
        }
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

export default MessagesTextAreaInput
