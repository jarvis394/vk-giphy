import React, { useState } from 'react'
import Stack from './Stack'
import TextArea from './TextArea'
import TextAreaInput from './TextAreaInput'
import Popups from './Popups'

export interface MessagesState {
  command: string
  message: string
  lastSelection: [number, number]
}

export const MessagesContext = React.createContext<{
  context: MessagesState
  setContext: React.Dispatch<React.SetStateAction<MessagesState>>
}>(undefined)

const Messages = ({ children }) => {
  const [context, setContext] = useState<MessagesState>({
    command: null,
    message: '',
    lastSelection: [0, 0],
  })

  return (
    <MessagesContext.Provider
      value={{
        context,
        setContext,
      }}
    >
      {children}
    </MessagesContext.Provider>
  )
}

Messages.TextArea = TextArea
Messages.TextAreaInput = TextAreaInput
Messages.Popups = Popups
Messages.Stack = Stack
export default Messages
