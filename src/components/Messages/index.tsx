import React from 'react'
import Stack from './Stack'
import TextAreaContainer from './TextAreaContainer'
import TextArea from './TextArea'
import Popups from './Popups'

export const MessagesContext = React.createContext(undefined)

const Messages = ({ children }) => {
  return (
    <MessagesContext.Provider value={null}>{children}</MessagesContext.Provider>
  )
}

Messages.TextAreaContainer = TextAreaContainer
Messages.TextArea = TextArea
Messages.Popups = Popups
Messages.Stack = Stack
export default Messages
