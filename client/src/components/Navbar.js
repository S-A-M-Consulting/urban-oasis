// Navbar.js
import React, { useState, useEffect } from "react";
import axios from "axios";

import 'tailwindcss/tailwind.css';
//import '@headlessui/react/styles.css';
import 'daisyui/dist/full.css';

//import './Navbar.css';

const Navbar = () => {
  const [parkSearch, setParkSearch] = useState("");
  const [selectedPark, setSelectedPark] = useState(null);

  const handleParkSearch = async () => {
    try {
      // Fetch park details based on the park name entered in the search bar
      const response = await axios.get(`/api/park/name/${parkSearch}`);
      console.log(response.data);
      if (response.data.length > 0) {
        setSelectedPark(response.data); // Select the first park from the search result
      } else {
        setSelectedPark(null); // Reset selected park if no result found
      }
    } catch (error) {
      console.error("Error searching for park:", error);
    }
  };

  useEffect(() => {
    if (selectedPark) {
      // Update map center to the selected park's location
      // Code to set the map center goes here...
      // Also, trigger a click event on the selected park's marker
      // This can be achieved by setting a state variable to the selected park's ID and passing it to the marker component as a prop
    }
  }, [selectedPark]);
  return (
    <nav className="navbar bg-base-100">
      <div className="flex-none">
        <img
          alt="Logo"
          src={process.env.PUBLIC_URL + "logo.png"}
          className="w-20 h-20"
        />
      </div>
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Urban Oasis</a>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search for a park..."
            value={parkSearch}
            onChange={(e) => setParkSearch(e.target.value)}
            className="input input-bordered w-24 md:w-auto"
          />
          <button onClick={handleParkSearch}>Search</button>
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src={process.env.PUBLIC_URL + "user.png"}
              />
            </div>
          </div>
          <ul className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
