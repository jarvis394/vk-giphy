import { combineReducers } from 'redux'
import gifs from './gifs'
import messages from './messages'
import theme from './theme'

export default combineReducers({
  gifs,
  messages,
  theme,
})
