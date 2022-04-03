import { Config } from './serviceWorker'

const config: Config = {
  onUpdate: (registration: ServiceWorkerRegistration) => {
    console.log(
      '%c[info] %cUnregister current service worker',
      'color: #2979ff;',
      'color: #e9e9e9;'
    )
    registration
      .unregister()
      .then(() => {
        window.location.reload()
        console.log(
          '%c[info] %cUpdated successfully.',
          'color: #2979ff;',
          'color: #e9e9e9;'
        )
      })
      .catch((e) =>
        console.log(
          '%c[error] %cUnable to unregister service worker:',
          'color: #ff5252;',
          'color: #e9e9e9;',
          e
        )
      )
  },
  onSuccess: () => {
    console.log(
      '%c[success] %cService worker succeed in registration.',
      'color: #00e676;',
      'color: #e9e9e9;'
    )
  },
}

export default config
