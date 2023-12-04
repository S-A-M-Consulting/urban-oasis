import React from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { calculateDistance } from "../helpers/calculateDis";

export default function Icons({ marker, userLocation, parkLocation }) {
  return (
    <div className="flex space-x-2 my-1">
      {userLocation && parkLocation && <i>{calculateDistance(userLocation[0], userLocation[1], parkLocation[0], parkLocation[1])} km</i>}
      {marker.restrooms && <FontAwesomeIcon icon="fa-solid fa-toilet" />}
      {marker.playground && <FontAwesomeIcon icon="fa-solid fa-child-reaching" />}
      {marker.dog_friendly && <FontAwesomeIcon icon="fa-solid fa-dog" />}
    </div>
  );
}