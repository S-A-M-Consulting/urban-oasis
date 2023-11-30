import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  LayersControl,
} from "react-leaflet";
import "./App.css";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import Navbar from "./components/Navbar";
const { BaseLayer } = LayersControl;

function App() {
  const parkMarkers = [
    {
      geocode: [49.0297254, -122.8167744],
      popup: "Centennial Park",
    },
    {
      geocode: [49.0286915, -122.7847924],
      popup: "Maccaud Park",
    },
  ];

  const customIcon = new Icon({
    iconUrl: require("./img/park.png"),
    iconSize: [38, 38],
  });

  return (
    <>
    <Navbar />
    <MapContainer center={[49.02388, -122.801178]} zoom={13}>
      <LayersControl position="topright">
        <BaseLayer checked name="Open Street Map">
          {/* Default Leaflet Tiles */}
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </BaseLayer>
        <BaseLayer name="Satellite">
          {/* GOOGLE MAPS TILES */}
          <TileLayer
            attribution="Google Maps"
            // url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" // regular
            url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}" // satellite
            // url="http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}" // terrain
            maxZoom={20}
            subdomains={["mt0", "mt1", "mt2", "mt3"]}
          />
        </BaseLayer>
        <BaseLayer name="WaterColour">
          {/* WaterColour Leaflet Tiles */}
          <TileLayer
            attribution="Stamen Watercolor"
            url="https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg"
          />
        </BaseLayer>

        <MarkerClusterGroup chunkedLoading>
          {parkMarkers.map((marker) => (
            // Need to add a key!
            <Marker position={marker.geocode} icon={customIcon}>
              <Popup>
                <h2>{marker.popup}</h2>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </LayersControl>
    </MapContainer>
    </>
  );
}

export default App;
