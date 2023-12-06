import React, { useState, useEffect, useContext, useRef } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  LayersControl,
  useMap,
  Polyline,
} from "react-leaflet";

import { Icon } from "leaflet"; // Import Leaflet Icon (L) here
import L from "leaflet";

import MarkerClusterGroup from "react-leaflet-cluster";
import axios from "axios";
import { convertCoordinatesToList } from "../helpers/frontendHelper";
import ContentPopup from "./ContentPopup";
import MapContext from "./MapContext";
import ToggleView from "./toggleView";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChildReaching,
  faToilet,
  faDog,
} from "@fortawesome/free-solid-svg-icons";
// Add the specific icons you want to use to the library

import MyReviewsModal from "./MyReviewsModal";
// import mapboxgl from "mapbox-gl";


library.add(faToilet);
library.add(faChildReaching);
library.add(faDog);

const { BaseLayer } = LayersControl;

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
  const mapRef = useRef(null); // Initialize a reference for your Leaflet map

  const defaultLocation = [49.044078046834706, -122.81547546331375];

  const [userLocation, setUserLocation] = useState(defaultLocation);
  const [parkMarkers, setParkMarkers] = useState([]);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [showToilets, setShowToilets] = useState(true);
  const [showPlaygrounds, setShowPlaygrounds] = useState(true);
  const [showDogFriendly, setShowDogFriendly] = useState(true);
  const [checkToilet, setCheckToilet] = useState(true);
  const [checkPlayground, setCheckPlayground] = useState(true);
  const [checkDog, setCheckDog] = useState(true);
  const [coordinates, setCoordinates] = useState([]);

  const handleToiletsChange = () => {
    // clicking! restroom will gone
    if (showToilets) {
      setShowToilets(false);
      console.log("no washroom: ", showToilets);
      setCheckToilet(false);
    } else {
      // bring the restroom back
      setShowToilets(true);
      setCheckToilet(true);
      console.log("park has washroom: ", showToilets);
    }
  };

  const handlePlaygroundsChange = () => {
    if (showPlaygrounds) {
      setShowPlaygrounds(false);
      setCheckPlayground(false);
    } else {
      setShowPlaygrounds(true);
      setCheckPlayground(true);
    }
  };

  const handleDogFriendlyChange = () => {
    if (showDogFriendly) {
      setShowDogFriendly(false);
      setCheckDog(false);
    } else {
      setShowDogFriendly(true);
      setCheckDog(true);
    }
  };

  // filter helpers:
  useEffect(() => {
    let filtered = [...parkMarkers];

    if (!showToilets) {
      filtered = filtered.filter((marker) => !marker.restrooms);
    }

    if (!showPlaygrounds) {
      filtered = filtered.filter((marker) => !marker.playground);
    }

    if (!showDogFriendly) {
      filtered = filtered.filter((marker) => !marker.dog_friendly);
    }

    setFilteredMarkers(filtered);
    console.log("flitered", filteredMarkers);
  }, [showToilets, showPlaygrounds, showDogFriendly, parkMarkers]);

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

  // handle the coordinates for the route
  const handleCoordinates = (arr) => {
    setCoordinates(arr);
  }

  return (
    <>
      <div id="leaflet-container">
        {props.isModalOpen && (
          <div className="modal-wrapper">
            <MyReviewsModal onClose={props.modalClick} />
          </div>
        )}
        <div
          className="dropdown dropdown-down dropdown-end btn-accent"
          style={{ position: "absolute", top: 118, right: 65, zIndex: 1000 }}
        >
          <div
            tabIndex={0}
            role="button"
            className="btn btn-xl btn-accent mb-4"
          >
            Park Categories
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <div className="form-control">
                <label className="cursor-pointer label">
                  <FontAwesomeIcon
                    icon="fa-solid fa-toilet"
                    style={{ color: "white" }}
                  />
                  <input
                    type="checkbox"
                    checked={checkToilet}
                    onChange={handleToiletsChange}
                    className="checkbox checkbox-accent"
                  />
                </label>
              </div>
            </li>
            <li>
              <div className="form-control">
                <label className="cursor-pointer label">
                  <FontAwesomeIcon
                    icon="fa-solid fa-child-reaching"
                    style={{ color: "white" }}
                  />
                  <input
                    type="checkbox"
                    checked={checkPlayground}
                    onChange={handlePlaygroundsChange}
                    className="checkbox checkbox-accent"
                  />
                </label>
              </div>
            </li>
            <li>
              <div className="form-control">
                <label className="cursor-pointer label">
                  <FontAwesomeIcon
                    icon="fa-solid fa-dog"
                    style={{ color: "white" }}
                  />
                  <input
                    type="checkbox"
                    id="checkboxDog"
                    checked={checkDog}
                    onChange={handleDogFriendlyChange}
                    className="checkbox checkbox-accent"
                  />
                </label>
              </div>
            </li>
          </ul>
        </div>

        <button
          className="btn btn-primary btn-xl btn-accent mb-4"
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
            <Polyline pathOptions={{ color: "blue" }} positions={coordinates} />
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
                    <ContentPopup
                      marker={marker}
                      userLocation={userLocation}
                      handleCoordinates={handleCoordinates}
                    />
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
