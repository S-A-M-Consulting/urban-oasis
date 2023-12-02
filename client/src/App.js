import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Map from "./components/Map";
import "leaflet/dist/leaflet.css";
import "./App.css";
import "./index.css";
import { useAuth0 } from '@auth0/auth0-react';

import MapContext from "./components/MapContext";

function App() {
  const defaultLocation = [49.044078046834706, -122.81547546331375];
  const [mapCenter, setMapCenter] = useState(defaultLocation);
  const [clickTrigger, setClickTrigger] = useState(null);

  const { user, isAuthenticated, isLoading } = useAuth0();
  
  const updateMapCenter = (newCenter) => {
    if (newCenter) {
      setMapCenter(newCenter);
    }
  };

  return (
    <>
      <MapContext.Provider value={{ clickTrigger, setClickTrigger }}>
        <Navbar updateMapCenter={updateMapCenter} />
        <Map updateMapCenter={updateMapCenter} mapCenter={mapCenter} />
      </MapContext.Provider>
    </>
  );
}

export default App;
