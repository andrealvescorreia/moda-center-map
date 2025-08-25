import { useState } from 'react'
import type { ModaCenterGridMap } from '../../../models/ModaCenterGridMap'
import { useRouteContext } from '../../../providers/RouteProvider'
import RouteEditor from './RouteEditor'
import RouteFollower from './RouteFollower'
import { getClearRoute } from './route-service'

interface RoutingManager {
  gridMap: ModaCenterGridMap
  onStopManagingRoute: () => void
}

const RoutingManager = ({ gridMap, onStopManagingRoute }: RoutingManager) => {
  const { setRoute } = useRouteContext()
  const [isCreatingRoute, setIsCreatingRoute] = useState(true)
  const [isFollowingRoute, setIsFollowingRoute] = useState(false)

  function stopRouting() {
    setIsCreatingRoute(false)
    setIsFollowingRoute(false)
    onStopManagingRoute()
  }

  if (isCreatingRoute && !isFollowingRoute) {
    return (
      <RouteEditor
        gridMap={gridMap}
        onCancel={stopRouting}
        onStart={() => setIsFollowingRoute(true)}
      />
    )
  }
  if (isFollowingRoute) {
    return (
      <RouteFollower
        onCancel={() => setIsFollowingRoute(false)}
        onFinish={() => {
          setRoute(getClearRoute())
          stopRouting()
        }}
        onChooseToEdit={() => {
          setIsCreatingRoute(true)
          setIsFollowingRoute(false)
        }}
        gridMap={gridMap}
      />
    )
  }
}
export default RoutingManager
