import { MessagesState } from 'src/components/Messages'

const getArgsFromMessagesContext = (messagesContext: MessagesState) => {
  return (
    messagesContext.command &&
    messagesContext.message.slice(messagesContext.command.length + 2)
  )
}

export default getArgsFromMessagesContext
