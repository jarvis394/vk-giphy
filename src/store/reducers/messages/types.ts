import { Message } from 'src/types'

const PREFIX = 'MESSAGES_'
export const MESSAGES_PUSH = PREFIX + 'PUSH'

export interface State {
  data: Message[]
}
