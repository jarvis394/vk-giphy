import { MessagesState } from 'src/components/Messages'

const escapeCommand = (context: MessagesState) => {
  const possibleArguments =
    context.command && context.message.slice(context.command.length + 2)
  const hasCommand = !!context.command
  const hasArguments = hasCommand && possibleArguments?.length > 0

  if (hasCommand && hasArguments)
    return {
      ...context,
      message: context.message.slice(0, context.command.length + 2),
    }
  else if (hasCommand) {
    return {
      command: null,
      message: '',
    }
  } else return context
}

export default escapeCommand
