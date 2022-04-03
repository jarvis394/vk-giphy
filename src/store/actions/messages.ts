import { Message } from 'src/types'
import { MESSAGES_PUSH } from '../reducers/messages/types'

export const pushMessage = (data: Message) => async (dispatch) => {
  dispatch({ type: MESSAGES_PUSH, payload: data })
}
