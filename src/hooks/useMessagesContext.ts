import { useContext } from 'react'
import { MessagesContext, MessagesState } from 'src/components/Messages'

const useMessagesContext = (): [
  MessagesState,
  React.Dispatch<React.SetStateAction<MessagesState>>
] => {
  const context = useContext(MessagesContext)

  if (!context) {
    throw new Error(
      'This component must be used within a <Messages> component.'
    )
  }

  return [context.context, context.setContext]
}

export default useMessagesContext
