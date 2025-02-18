import { useCallback, useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
interface MapInfoCollectorProps {
  onUpdateInfo: (info: {
    center: L.LatLng;
    bounds: L.LatLngBounds;
    zoom: number;
  }) => void;
}
function MapInfoCollector({ onUpdateInfo }: MapInfoCollectorProps) {

  const map = useMap();
  const info = useRef({
    center: map.getCenter(),
    bounds: map.getBounds(),
    zoom: map.getZoom()
  });
  useEffect(() => {
    onUpdateInfo(info.current);
  }, [onUpdateInfo])

  const updateInfo = useCallback(() => {
    info.current = {
      center: map.getCenter(),
      bounds: map.getBounds(),
      zoom: map.getZoom()
    };
    onUpdateInfo(info.current);
  }, [map, onUpdateInfo]);


  useEffect(() => {
    map.on("moveend zoomend", updateInfo);
    return () => {
      map.off("moveend zoomend", updateInfo);
    };
  }, [map, updateInfo]);
  return false;
  return (
    <div>

      <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(255,255,255,0.8)", padding: 10, borderRadius: 5, marginLeft: '30px' }}>
        <p><strong>Centro:</strong> {info.current.center.lat.toFixed(5)}, {info.current.center.lng.toFixed(5)}</p>
        <p><strong>Zoom:</strong> {info?.current.zoom}</p>
        <p><strong>Bounds:</strong></p>
        <ul>
          <li><strong>SW:</strong> {info?.current.bounds.getSouthWest().lat.toFixed(5)}, {info?.current.bounds.getSouthWest().lng.toFixed(5)}</li>
          <li><strong>NE:</strong> {info?.current.bounds.getNorthEast().lat.toFixed(5)}, {info?.current.bounds.getNorthEast().lng.toFixed(5)}</li>
        </ul>
      </div>

    </div>
  );
}

export default MapInfoCollector;