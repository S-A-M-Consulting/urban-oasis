import React from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChildReaching,
  faToilet,
  faDog,
} from "@fortawesome/free-solid-svg-icons";

library.add(faToilet);
library.add(faChildReaching);
library.add(faDog);

export default function ToggleView({
  handleToiletsChange,
  handlePlaygroundsChange,
  handleDogFriendlyChange,
  parkMarkers,
}) {
  return (
    <div className="flex flex-col">
      <div className="form-control w-52">
        <label className="cursor-pointer label">
          <FontAwesomeIcon icon="fa-solid fa-children" />
          <input type="checkbox" className="toggle toggle-primary" checked onClick={handlePlaygroundsChange}/>
        </label>
      </div>
      <div className="form-control w-52">
        <label className="cursor-pointer label">
          <FontAwesomeIcon icon="fa-solid fa-dog" />
          <input type="checkbox" className="toggle toggle-secondary" checked onClick={dleDogFriendlyChange}/>
        </label>
      </div>
      <div className="form-control w-52">
        <label className="cursor-pointer label">
          <FontAwesomeIcon icon="fa-solid fa-child-reaching" />
          <input type="checkbox" className="toggle toggle-accent" checked onClick={}/>
        </label>
      </div>
    </div>
  );
}
