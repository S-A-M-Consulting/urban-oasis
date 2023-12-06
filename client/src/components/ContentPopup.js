import axios from "axios";
import React, { useEffect, useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChildReaching,
  faToilet,
  faDog,
} from "@fortawesome/free-solid-svg-icons";
import Rating from "./Rating";
import ReviewCard from "./ReviewCard";
import SubmitUserReview from "./SubmitUserReview";
import { calculateDistance } from "../helpers/calculateDis";
import ImageCarousel from "./ImageCarousel";
import { useAuth0 } from "@auth0/auth0-react";
import Icons from "./Icons";

// Add the specific icons you want to use to the library

library.add(faToilet);
library.add(faChildReaching);
library.add(faDog);

export default function ContentPopup({
  marker,
  userLocation,
  handleCoordinates,
}) {
  const { isAuthenticated } = useAuth0();
  const [imageData, setImageData] = useState([]);
  const [reviews, setReviews] = useState([]);
  const parkLocation = [marker.latitude, marker.longitude];

  useEffect(() => {
    try {
      axios
        .get(`/api/photo/${marker.place_id}`)
        .then(({ data }) => setImageData(data));
      axios.get(`/api/review/park/${marker.id}`).then(({ data }) => {
        setReviews(data.reverse());
        //console.log("reviews: ", data); // Log reviews here
      });
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  }, [marker]);

  // pass the addreview to submituserReviewer
  const addReview = (newReview) => {
    setReviews([newReview, ...reviews]); // Update the reviews state with the new review
  };

  // implement the distance calculation and route rendering
  // two helper functions to swap the coordinates and convert them to numbers
  function swapAndConvertToNumber(pair) {
    return [parseFloat(pair[1]), parseFloat(pair[0])];
  }

  const swapCoordinates = (arr) => {
    return arr.map((pair) => {
      return [pair[1], pair[0]];
    });
  };

  const handleRenderRoute = async () => {
    const userLocationRoute = swapAndConvertToNumber(userLocation);
    const parkLocationRoute = swapAndConvertToNumber(parkLocation);
    console.log("userLocation: ", userLocationRoute);
    console.log("parkLocation: ", parkLocationRoute);

    const apiEndpoint = `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocationRoute[0]}%2C${userLocationRoute[1]}%3B${parkLocationRoute[0]}%2C${parkLocationRoute[1]}?alternatives=false&geometries=geojson&language=en&overview=full&steps=true&access_token=${process.env.REACT_APP_ROUTE_API_KEY}`;

    console.log("apiEndpoint: ", apiEndpoint);
    const response = await axios
      .get(apiEndpoint)
      .then((response) => response.data);
    console.log("response: ", response);
    const coordinates = response.routes[0].geometry.coordinates;
    console.log("coordinates: ", coordinates);
    const correctCoordinates = swapCoordinates(coordinates);
    console.log("correctCoordinates: ", correctCoordinates);
    handleCoordinates(correctCoordinates);
  };

  // const coordinatesRes = [
  //   [
  //     [-122.817613, 49.038181],
  //     [-122.817638, 49.038181],
  //     [-122.817705, 49.038191],
  //     [-122.817742, 49.038225],
  //     [-122.817736, 49.038281],
  //     [-122.817692, 49.038351],
  //     [-122.81768, 49.038356],
  //     [-122.817542, 49.038403],
  //     [-122.817467, 49.03842],
  //     [-122.817301, 49.038403],
  //     [-122.815305, 49.038397],
  //     [-122.815121, 49.038397],
  //     [-122.813515, 49.038392],
  //     [-122.812769, 49.03839],
  //     [-122.81237, 49.038403],
  //     [-122.812213, 49.038408],
  //     [-122.812131, 49.038405],
  //     [-122.811559, 49.038406],
  //     [-122.811559, 49.038321],
  //   ],
  // ];

  // const coordinates = swapCoordinates(coordinatesRes);

  return (
    <>
      <div className="flex flex-col items-center">
        <h2 className="text-center text-accent font-bold">{marker.name}</h2>
        {!imageData[0] ? (
          <span className="loading loading-spinner loading-lg text-accent"></span>
        ) : (
          <img
            src={`data:image/jpeg;base64,${imageData[0]}`}
            alt="Park"
            className="max-h-32 rounded-lg"
          />
        )}

        <Rating rating={marker.google_rating} />
        <Icons
          marker={marker}
          userLocation={userLocation}
          parkLocation={parkLocation}
        />
        <div className="flex justify-row space-x-2 my-2">
          <button
            className="btn btn-outline btn-xs btn-accent"
            onClick={() => document.getElementById("modal").showModal()}
          >
            More Info
          </button>
          <button
            className="btn btn-outline btn-xs btn-accent"
            onClick={handleRenderRoute}
          >
            Find Route
          </button>
        </div>
      </div>

      {/** Modal Refactor later */}
      <dialog id="modal" className="modal">
        <div className="modal-box">
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
          <h1 className="font-bold text-4xl text-secondary">{marker.name}</h1>
          <h3 className="py-4 text-xl text-secondary">
            {marker.street_address}
          </h3>
          {imageData && <ImageCarousel imageData={imageData} />}
          <Icons
            marker={marker}
            userLocation={userLocation}
            parkLocation={parkLocation}
          />
          {isAuthenticated && (
            <SubmitUserReview park={marker} addReview={addReview} />
          )}
          <h2 className="mt-4 text-lg text-accent">Reviews</h2>
          <div className="flex flex-col text-left">
            {reviews.map((review) => {
              return (
                <ReviewCard key={review.id} review={review} reviews={reviews} />
              );
            })}
          </div>
        </div>
      </dialog>
    </>
  );
}
