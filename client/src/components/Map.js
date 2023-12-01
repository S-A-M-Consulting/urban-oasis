import React, { useState, useEffect } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  LayersControl,
  useMap,
} from "react-leaflet";

import { Icon } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import axios from "axios";
import { convertCoordinatesToList } from "../helpers/frontendHelper";
import ContentPopup from "./ContentPopup";

const { BaseLayer } = LayersControl;

const userIcon = new Icon({
  iconUrl: require("./../img/pin.png"),
  iconSize: [38, 38],
});

function ChangeMapView({ center }) {
  const map = useMap();
  map.setView(center);
  return null;
}

export default function Map(props) {
  const defaultLocation = [49.044078046834706, -122.81547546331375];
  const [mapCenter, setMapCenter] = useState(defaultLocation);
  const [userLocation, setUserLocation] = useState(defaultLocation);
  const [parkMarkers, setParkMarkers] = useState([]);

  useEffect(() => {
    axios
      .get("/api/park")
      .then((response) => {
        const covertedParks = convertCoordinatesToList(response.data);
        setParkMarkers(covertedParks);
      })
      .catch((error) => {
        console.error("Error fetching park data:", error);
      });
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        console.log("User Coords:", userCoords);
        setMapCenter(userCoords);
        setUserLocation(userCoords);
      },
      (error) => {
        console.error("Error getting the location: ", error.message);
      }
    );
  }, []);

  const updateMapToUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        console.log("User Coords:", userCoords);
        setMapCenter(userCoords);
        setUserLocation(userCoords);
      },
      (error) => {
        console.error("Error getting the location: ", error.message);
      }
    );
  };

  const goToUserLocation = () => {
    setMapCenter(userLocation); // Set map center to user's location
  };

  const customIcon = new Icon({
    iconUrl: require("./../img/park.png"),
    iconSize: [38, 38],
  });

  return (
    <>
      <div id="leaflet-container">
        <button
          className="btn btn-primary btn-xs btn-accent mb-4"
          onClick={updateMapToUserLocation}
          style={{ position: "absolute", bottom: 20, right: 10, zIndex: 1000 }}
        >
          Go to My Location
        </button>
        <MapContainer center={mapCenter} zoom={13}>
          <ChangeMapView center={mapCenter} />
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
                <Marker
                  position={marker.geocode}
                  icon={customIcon}
                  key={marker.id}
                >
                  <Popup>
                    <ContentPopup marker={marker} />
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
            {userLocation !== defaultLocation && (
              <Marker position={userLocation} icon={userIcon}>
                <Popup>You are here</Popup>
              </Marker>
            )}
          </LayersControl>
        </MapContainer>
      </div>
    </>
  );
}
