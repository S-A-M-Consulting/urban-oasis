import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Map from "./components/Map";
import "leaflet/dist/leaflet.css";
import "./App.css";
import "./index.css";
import MapContext from "./components/MapContext";

function App() {
  const defaultLocation = [49.044078046834706, -122.81547546331375];
  const [mapCenter, setMapCenter] = useState(defaultLocation);
  const [clickTrigger, setClickTrigger] = useState(null);


  const updateMapCenter = (newCenter) => {
    setMapCenter(newCenter);
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
