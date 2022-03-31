import { createStore, applyMiddleware, Middleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducers from './reducers'

const middlewares: Middleware[] = [thunkMiddleware]

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createLogger } = require('redux-logger')
  middlewares.push(createLogger({ collapsed: true }))
}

export type RootState = ReturnType<typeof reducers>
export default createStore(reducers, applyMiddleware(...middlewares))
