import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Map from "./components/Map";
import "leaflet/dist/leaflet.css";
import "./App.css";
import "./index.css";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

import MapContext from "./components/MapContext";
import MyReviewsModal from "./components/MyReviewsModal";

function App() {
  const defaultLocation = [49.044078046834706, -122.81547546331375];
  const [mapCenter, setMapCenter] = useState(defaultLocation);
  const [clickTrigger, setClickTrigger] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth0();

  const updateMapCenter = (newCenter) => {
    if (newCenter) {
      setMapCenter(newCenter);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      axios
        .get(`/api/user/email/${user.email}`)
        .then((result) => result.data)
        .then( async (data) => {
          if (!data) {
            const image = await axios.get(user.picture, { responseType: "arraybuffer" })
              .then((result) => result.data).then((data) => "data:image/jpeg;base64," + data.toString("base64"));

            const newUser = {
              email: user.email,
              name: user.name,
              photo: image,
              password: user.sub,
            };
            axios
              .post(`/api/user`, newUser)
              .then((result) => result.data)
              .then((data) => sessionStorage.setItem("user_id", data.id))
              .catch((err) => console.log(err.message));
          } else {
            sessionStorage.setItem("user_id", data.id);
          }
        })
        .catch((err) => console.log(err.message));
    }
  }, [user]);

  return (
    <>
      <MapContext.Provider value={{ clickTrigger, setClickTrigger }}>
        <Navbar updateMapCenter={updateMapCenter} modalClick={() => setIsModalOpen(true)}/>
        <Map updateMapCenter={updateMapCenter} mapCenter={mapCenter} isModalOpen={isModalOpen} modalClick={() => setIsModalOpen(false)}/>
      </MapContext.Provider>
    </>
  );
}

export default App;
