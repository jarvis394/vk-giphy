import { createStore, applyMiddleware, Middleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import reducers from './reducers'

const middlewares: Middleware[] = [thunkMiddleware]

if (process.env.NODE_ENV === 'development') {
  middlewares.push(createLogger({ collapsed: true }))
}

export type RootState = ReturnType<typeof reducers>
export default createStore(
  reducers,
  applyMiddleware(...middlewares)
)
