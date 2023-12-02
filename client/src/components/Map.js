import React, { useState, useEffect, useContext, useRef } from "react";
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
import ToggleView from "./toggleView";

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
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [showToilets, setShowToilets] = useState(true);
  const [showPlaygrounds, setShowPlaygrounds] = useState(true);
  const [showDogFriendly, setShowDogFriendly] = useState(true);

  const handleToiletsChange = (event) => {
    event.preventDefault();

    // clicking! restroom will gone
    if (showToilets) {
      setShowToilets(false);
      console.log("no washroom: ", showToilets);
      const noToilets = [...parkMarkers].filter((marker) => !marker.restrooms);
      setFilteredMarkers(noToilets);
    } else {
      // bring the restroom back
      setShowToilets(true);
      const noToilets = [...parkMarkers];
      setFilteredMarkers(noToilets);
      console.log("park has washroom: ", showToilets);
    }
  };

  const handlePlaygroundsChange = (event) => {
    event.preventDefault();
    if (showPlaygrounds) {
      setShowPlaygrounds(false);
      const noPlaygrounds = [...parkMarkers].filter(
        (marker) => !marker.playground
      );
      setFilteredMarkers(noPlaygrounds);
    } else {
      // bring the restroom back
      setShowPlaygrounds(true);
      const noPlaygrounds = [...parkMarkers];
      setFilteredMarkers(noPlaygrounds);
    }
  };

  const handleDogFriendlyChange = (event) => {
    event.preventDefault();


    if (showDogFriendly) {
      setShowDogFriendly(false);
      const noDogfriendly = [...parkMarkers].filter(
        (marker) => !marker.dog_friendly
      );
      setFilteredMarkers(noDogfriendly);
    } else {
      // bring the restroom back
      setShowDogFriendly(true);
      const noDogfriendly = [...parkMarkers];
      setFilteredMarkers(noDogfriendly);
    }
  };

  // bring all the park data to the frontend
  useEffect(() => {
    axios
      .get("/api/park")
      .then((response) => {
        const convertedParks = convertCoordinatesToList(response.data);
        setParkMarkers(convertedParks);
        setFilteredMarkers(convertedParks);
        console.log(convertedParks);
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
        <button
          className="toggle"
          type="checkbox"
          onClick={handlePlaygroundsChange}
          style={{ position: "absolute", bottom: 50, right: 10, zIndex: 1000 }}
          checked
        >
          No kids
        </button>
        <button
          className="btn btn-primary btn-xs btn-accent mb-4"
          onClick={handleToiletsChange}
          style={{ position: "absolute", bottom: 70, right: 10, zIndex: 1000 }}
        >
          No Toilets
        </button>
        <button
          className="btn btn-primary btn-xs btn-accent mb-4"
          onClick={handleDogFriendlyChange}
          style={{ position: "absolute", bottom: 90, right: 10, zIndex: 1000 }}
        >
          No Dogs
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
              {filteredMarkers.map((marker) => (
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
                    <ContentPopup marker={marker} userLocation={userLocation} />
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
