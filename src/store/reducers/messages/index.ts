import produce from 'immer'
import { MESSAGES_PUSH, State } from './types'

const initialState: State = {
  data: [],
}

export default produce((draft, { type, payload }) => {
  switch (type) {
    case MESSAGES_PUSH:
      draft.data.push(payload)
      break
    default:
      break
  }
}, initialState)
