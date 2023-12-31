// Navbar.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import MapContext from "./MapContext";
import { useContext } from "react";
import { debounce } from 'lodash'; // Import the debounce function from lodash




import 'tailwindcss/tailwind.css';
import 'daisyui/dist/full.css';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import { useAuth0 } from "@auth0/auth0-react";
//import './Navbar.css';

import MyReviewsModal from "./MyReviewsModal";


export default function Navbar(props) {
  // move the auth0 user to the top of the file !!!
  const { user, isAuthenticated, isLoading } = useAuth0();
  const profilePic = isAuthenticated
    ? user.picture
    : process.env.PUBLIC_URL + "user.png";


  const [parkSearch, setParkSearch] = useState("");
  const [selectedPark, setSelectedPark] = useState([]);
  const { setClickTrigger } = useContext(MapContext);
  const [searchError, setSearchError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchChanged, setSearchChanged] = useState(false);





  // handle the click on the map
  const handleMarkerClick = (coords) => {
    setClickTrigger(coords);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleParkSearch();
      setSuggestions([]);
    }
  };

  const handleParkSearch = async () => {
    try {
      // Fetch park details based on the park name entered in the search bar
      const response = await axios.get(`/api/park/name/${parkSearch}`);
      console.log("park data:", response.data);
      if (response.data && Object.keys(response.data).length !== 0) {
        setSelectedPark([response.data.latitude, response.data.longitude]);
        setParkSearch("");
        setSearchError(""); // Clear any previous error messages on successful search
      } else {
        // If no data is received, assume park not found
        setSearchError("Park not found. Please try again.");
        setParkSearch("");
        setSelectedPark([]); // Reset selectedPark if search fails

        // Clear the error message after 2 seconds
        setTimeout(() => {
          setSearchError("");
        }, 2000);
      }
    } catch (error) {
      console.error("Error searching for park:", error);
      setSearchError("Error searching for park. Please try again.");
      setSelectedPark([]); // Reset selectedPark if search fails

      // Clear the error message after 2 seconds
      setTimeout(() => {
        setSearchError("");
      }, 2000);
    }
  };

  useEffect(() => {
    if (selectedPark) {
      // console.log("hit here in the useEffect");
      // console.log("selectedPark", selectedPark);
      props.updateMapCenter(selectedPark);
      handleMarkerClick(selectedPark);

      // Also, trigger a click event on the selected park's marker
      // This can be achieved by setting a state variable to the selected park's ID and passing it to the marker component as a prop
    }
  }, [selectedPark]);



  // useEffect(() => {
  //   if (user) {
  //     try {
  //       const data = axios.get(`/api/user/email/${user.email}`)
  //         .then(res => console.log('response', res.data));

  //     } catch (error) {
  //       // axios.post(`/api/user`, { name: user.given_name + user.last_name, email: user.email, photo: user.picture, password: user.sub });
  //       console.log("error", error);
  //     }
  //   }
  // }, [user]);

  // implement the serach suggestions feature:
  const debouncedSearch = debounce(async (searchTerm) => {
    try {
      // Fetch park name suggestions based on the input
      const response = await axios.get(`/api/park/prefix/${searchTerm}`);
      const suggestions = response.data; // Assuming it returns an array of suggested park names
      // Update UI with suggestions (you'll need to implement this part)
      console.log("Suggestions:", suggestions);
      // Update a state variable to store the suggestions and display them below the input
      updateSuggestions(suggestions);
      // Update the state to display suggestions in the UI
    } catch (error) {
      console.error("Error fetching park suggestions:", error);
    }
  }, 300); // Adjust the debounce duration as needed (300ms here)

  // Update UI with suggestions
  const updateSuggestions = (suggestions) => {
    setSuggestions(suggestions);
  };

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setParkSearch(searchTerm); // Update the park search state
    debouncedSearch(searchTerm); // Perform debounced search for suggestions

    // Close suggestions when input is empty
    if (!searchTerm) {
      setSuggestions([]);
    }
  };

  // const handleSuggestionClick = (name) => {
  //   console.log("hit in the handleSuggestionClick", name);
  //   setParkSearch(name); // Update the park search state
  //   console.log("parkSearch in handle state is", parkSearch);
  //   handleParkSearch(); // Perform a park search
  //   setSuggestions([]); // Clear the suggestions
  // };

  // refactor the code:
  const handleSuggestionClick = (name) => {
    console.log("hit in the handleSuggestionClick", name);
    setParkSearch(name); // Update the park search state
    console.log("parkSearch in handle state is", parkSearch);
    setSearchChanged(true); // Flag to trigger the actions in useEffect
  };

  const handleSearchActions = () => {
    if (searchChanged) {
      handleParkSearch(); // Perform actions based on the updated parkSearch
      setSuggestions([]); // Clear the suggestions
      setSearchChanged(false); // Reset the flag
    }
  };

  useEffect(() => {
    handleSearchActions();
  }, [parkSearch]); // Only triggers when parkSearch changes

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
        <h1 className="mx-2 text-xl">Urban Oasis</h1>
        <div className="form-control">
          <input
            type="text"
            placeholder=" Search for a park..."
            value={parkSearch}
            onKeyPress={handleKeyPress}
            onChange={handleInputChange}
            className="input text-sm w-24 md:w-auto"
            style={{
              backgroundImage: 'linear-gradient(transparent 50%, white 50%)',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '100% 2px', // Adjusted size to make the line more visible
              backgroundPosition: 'bottom',
              border: 'none', // Added to remove default input border which might hide the background
            }}
          />
          {/* Render suggestions dynamically */}
          {suggestions.length > 0 && (
            <ul className="suggestions absolute bg-white shadow-md rounded mt-1 p-2 w-full top-16">
              {console.log("hit in the popup")}
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="suggestion-item rounded-md p-1 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion.name)}
                >
                  {suggestion.name /* Render suggestion details */}
                </li>
              ))}
            </ul>
          )}
        </div>
        {searchError && (
          <div className="searchError absolute top-16 bg-red-200 border border-red-500 text-red-700 px-4 py-1 rounded shadow-md">
            {searchError}
          </div>
        )}
      </div>

      <div className="flex-none gap-2">
        { isAuthenticated && <button className="btn btn-xl btn-outline" onClick={props.modalClick}>
          My Reviews
        </button>}
        {isAuthenticated ? <LogoutButton /> : <LoginButton />}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img alt="Profile" src={profilePic} />
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


