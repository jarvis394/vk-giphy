/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */
/**
 * This file must be at src/ top level in order for CRA builder
 * to find it and include into build.
 */

import { clientsClaim, setCacheNameDetails } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import {
  precacheAndRoute,
  createHandlerBoundToURL,
  precache,
} from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies'

const generateRevision = () => Date.now().toString()

declare const self: ServiceWorkerGlobalScope

clientsClaim()

// Precache all of the assets generated by the build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in the service worker file.
precacheAndRoute(self.__WB_MANIFEST)

// Precache images
precache([
  { url: './emojis-sprite.png', revision: generateRevision() },
  { url: './error-emoji.png', revision: generateRevision() },
  { url: './sad-emoji.png', revision: generateRevision() },
  { url: './search-emoji.png', revision: generateRevision() },
])

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with the index.html shell.
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$')
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }: { request: Request; url: URL }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== 'navigate') {
      return false
    }

    // If this is a URL that starts with /_, skip.
    if (url.pathname.startsWith('/_')) {
      return false
    }

    // If this looks like a URL for a resource, because it contains
    // a file extension, skip.
    if (url.pathname.match(fileExtensionRegexp)) {
      return false
    }

    // Return true to signal that we want to use the handler.
    return true
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
)

setCacheNameDetails({
  prefix: 'vk-giphy',
  suffix: 'v1',
  precache: 'precache',
  runtime: 'runtime',
})

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({ type: 'SKIP_WAITING' })
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

const newResponse = (
  res: Response,
  headerFn: (headers: Headers) => Headers
): Promise<void | Response> => {
  const cloneHeaders = () => {
    const headers = new Headers()
    res.headers.forEach((value, key) => {
      headers.append(key, value)
    })
    return headers
  }

  const headers = headerFn ? headerFn(cloneHeaders()) : res.headers

  return new Promise((resolve) =>
    res.blob().then((blob) => {
      resolve(
        new Response(blob, {
          status: res.status,
          statusText: res.statusText,
          headers,
        })
      )
    })
  )
}

const cacheHeaderPlugin = [
  {
    cacheWillUpdate: ({ response }) =>
      newResponse(response.clone(), (headers: Headers) => {
        headers.set('x-sw-cache', new Date().getTime().toString())
        return headers
      }),
  },
]

registerRoute(
  /^https?:\/\/api\.giphy\.com\/v1\/.*/,
  new CacheFirst({
    cacheName: 'api-cache',
    plugins: [
      ...cacheHeaderPlugin,
      new CacheableResponsePlugin({
        statuses: [200, 201],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 24 * 60 * 60 * 7, // one week
        maxEntries: 20,
      }),
    ],
  })
)

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
)

// Cache the underlying font files with a cache-first strategy for 1 year.
registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
)
