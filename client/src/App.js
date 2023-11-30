import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Map from "./components/Map";
import "leaflet/dist/leaflet.css";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <Map />
    </>
  );
}

export default App;
