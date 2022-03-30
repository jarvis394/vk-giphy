import { useContext } from 'react'
import { MessagesContext } from 'src/components/Messages'

const useMessagesContext = () => {
  const context = useContext(MessagesContext)

  if (!context) {
    throw new Error(
      'This component must be used within a <Messages> component.'
    )
  }

  return context
}

export default useMessagesContext
