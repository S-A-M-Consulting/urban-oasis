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
import MapContext from "./MapContext";
import { useContext } from "react";
import { useRef } from "react";


const { BaseLayer } = LayersControl;

const val = "Dummy value";

const userIcon = new Icon({
  iconUrl: require("./../img/pin.png"),
  iconSize: [38, 38],
});



function ChangeMapView({ center }) {
  const map = useMap();

  useEffect(() => {
    if (map && center && center.length === 2) {
      const [lat, lng] = center;
      map.setView([lat, lng]);
    }
  }, [map, center]);

  return null;
}



export default function Map(props) {
  const defaultLocation = [49.044078046834706, -122.81547546331375];

  const [userLocation, setUserLocation] = useState(defaultLocation);
  const [parkMarkers, setParkMarkers] = useState([]);

  // bring all the park data to the frontend
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

  // use for get user's location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        console.log("User Coords:", userCoords);
        props.updateMapCenter(userCoords);
        setUserLocation(userCoords);
      },
      (error) => {
        console.error("Error getting the location: ", error.message);
      }
    );
  }, []);

  /////////
  const { clickTrigger } = useContext(MapContext);
  const markers = useRef({}); // Store markers in a ref

  useEffect(() => {
    if (clickTrigger && clickTrigger.length === 2) {
      const [lat, lng] = clickTrigger;

      // Check if the markers have loaded
      if (Object.keys(markers.current).length > 0) {
        // Find the marker closest to the clicked coordinates
        let closestMarker = null;
        let minDistance = Number.MAX_VALUE;

        Object.values(markers.current).forEach((marker) => {
          const markerLatLng = marker.getLatLng();
          const distance = markerLatLng.distanceTo([lat, lng]);

          if (distance < minDistance) {
            minDistance = distance;
            closestMarker = marker;
          }
        });

        // Trigger a click event on the closest marker
        if (closestMarker) {
          closestMarker.fire("click");
        }
      }
    }
  }, [clickTrigger]);

  /////////////////

  const updateMapToUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        console.log("User Coords:", userCoords);
        props.updateMapCenter(userCoords);
        setUserLocation(userCoords);
      },
      (error) => {
        console.error("Error getting the location: ", error.message);
      }
    );
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
        <MapContainer center={props.mapCenter} zoom={13}>
          <ChangeMapView center={props.mapCenter} />
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
                  ref={(markerRef) => {
                    if (markerRef) {
                      markers.current[marker.id] = markerRef;
                    }
                  }}
                >
                  <Popup offset={[-10, -20]}>
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
