import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import "./App.css";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";

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
    <MapContainer center={[49.02388, -122.801178]} zoom={13}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {parkMarkers.map((marker) => (
        <Marker position={marker.geocode} icon={customIcon}>
          <Popup>
            <h2>{marker.popup}</h2>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default App;
