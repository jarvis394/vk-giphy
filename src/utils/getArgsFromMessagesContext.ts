import { MessagesState } from 'src/components/Messages'

type Context = Omit<MessagesState, 'lastSelection'> & {
  lastSelection?: unknown
}
const getArgsFromMessagesContext = (messagesContext: Context) => {
  return (
    messagesContext.command &&
    messagesContext.message.slice(messagesContext.command.length + 2)
  )
}

export default getArgsFromMessagesContext
