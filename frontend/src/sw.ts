import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute } from 'workbox-routing/NavigationRoute'
import { Route } from 'workbox-routing/Route'
import { registerRoute } from 'workbox-routing/registerRoute'
import { CacheFirst, NetworkFirst } from 'workbox-strategies'

declare const self: ServiceWorkerGlobalScope

cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST || [])

self.skipWaiting()

// cache images
const imageRoute = new Route(
  ({ request, sameOrigin }) => {
    return sameOrigin && request.destination === 'image'
  },

  // strategy: prefere usar as imagens já salvas em cache do que requisitalas novamente.
  new CacheFirst({
    // imagens salvas em cache ficam disponiveis mesmo offline.
    cacheName: 'images',
  })
)
registerRoute(imageRoute)

// cache api calls
const API_URL = import.meta.env.VITE_API_URL
const fetchUserRoute = new Route(
  ({ request }) => {
    return request.url === `${API_URL}/user`
  },
  new NetworkFirst({
    cacheName: 'api/fetch-user',
  })
)
const fetchFavoriteSellersRoute = new Route(
  ({ request }) => {
    return request.url.includes(`${API_URL}/seller/favorite`)
  },
  new NetworkFirst({
    cacheName: 'api/fetch-favorite-sellers',
  })
)
const fetchSellersRoute = new Route(
  ({ request }) => {
    return request.url.includes(`${API_URL}/seller`)
  },
  new NetworkFirst({
    cacheName: 'api/fetch-sellers',
  })
)
const fetchOneSellerRoute = new Route(
  ({ request }) => {
    return request.url.includes(`${API_URL}/seller/id`)
  },
  new NetworkFirst({
    cacheName: 'api/fetch-one-seller',
  })
)
const fetchSellerByBoxeRoute = new Route(
  ({ request }) => {
    return request.url.includes(`${API_URL}/seller/boxe`)
  },
  new NetworkFirst({
    cacheName: 'api/fetch-seller-by-boxe',
  })
)
const fetchSellerByStoreRoute = new Route(
  ({ request }) => {
    return request.url.includes(`${API_URL}/seller/store`)
  },
  new NetworkFirst({
    cacheName: 'api/fetch-seller-by-store',
  })
)
registerRoute(fetchUserRoute)
registerRoute(fetchFavoriteSellersRoute)
registerRoute(fetchSellersRoute)
registerRoute(fetchOneSellerRoute)
registerRoute(fetchSellerByBoxeRoute)
registerRoute(fetchSellerByStoreRoute)

// cache navigations
const navigationRoute = new NavigationRoute(
  new NetworkFirst({
    cacheName: 'navigation',
    networkTimeoutSeconds: 3,
  })
)
registerRoute(navigationRoute)
