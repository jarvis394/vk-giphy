import { DEFAULT_UPDATE_INTERVAL } from 'src/config/constants'

const shouldUpdate = (lastUpdated: number) => {
  const now = Date.now()
  const shouldUpdateByTS = (d: number) => now - d >= DEFAULT_UPDATE_INTERVAL

  return lastUpdated ? shouldUpdateByTS(lastUpdated) : true
}

export default shouldUpdate
