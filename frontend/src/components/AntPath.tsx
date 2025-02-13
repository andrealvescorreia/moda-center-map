import { createElementHook, createPathHook, createContainerComponent } from '@react-leaflet/core'
// @ts-expect-error a biblioteca não tem typesc
import { antPath } from 'leaflet-ant-path';

// @ts-expect-error aaa
function createAntPath(props, context) {
    const instance = antPath(props.positions, props.options)
    return { instance, context: { ...context, overlayContainer: instance } }
}

// @ts-expect-error aaa
function updateAntPath(instance, props, prevProps) {
    if (props.positions !== prevProps.positions || props.options !== prevProps.options) {
        instance.setLatLngs(props.positions)
    }
}

const useAntPathElement = createElementHook(createAntPath, updateAntPath)
const useAntPath = createPathHook(useAntPathElement)
const AntPath = createContainerComponent(useAntPath)

export default AntPath;
// fonte: https://github.com/rubenspgcavalcante/react-leaflet-ant-path/issues/10