import axios from "axios";
import React, { useEffect, useState } from "react";
import Icons from "./Icons";
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

// Add the specific icons you want to use to the library

library.add(faToilet)
library.add(faChildReaching);
library.add(faDog);





export default function ContentPopup({ marker, userLocation }) {
  
  const [imageData, setImageData] = useState([]);
  const [reviews, setReviews] = useState([]);
  const parkLocation = [marker.latitude, marker.longitude];

  useEffect(() => {
    try {
      axios
        .get(`/api/photo/${marker.place_id}`)
        .then(({ data }) => setImageData(data));
      axios.get(`/api/review/park/${marker.id}`).then(({ data }) => {
        setReviews(data);
        //console.log("reviews: ", data); // Log reviews here
      });
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  }, [marker]);
  
  // pass the addreview to submituserReviewer
  const addReview = (newReview) => {
    setReviews([...reviews, newReview]); // Update the reviews state with the new review
  };
  // delete the review and pass to submituserReviewer
  const deleteReview = (updatedReviews) => {
    setReviews(updatedReviews);
  };
  return (
    <>
      <div className="flex flex-col items-center">
        <h2 className="text-center text-accent font-bold">{marker.name}</h2>
        {!imageData[0] ? <span className="loading loading-spinner loading-lg text-accent"></span> : <img
          src={`data:image/jpeg;base64,${imageData[0]}`}
          alt="Park"
          className="max-h-32 rounded-lg"
        />}
        <Rating rating={marker.google_rating} />
        <div className="flex space-x-2 my-1">
          {userLocation && parkLocation && <i>{calculateDistance(userLocation[0],userLocation[1], parkLocation[0],parkLocation[1]) } km</i>}
          {marker.restroom && <FontAwesomeIcon icon="fa-solid fa-toilet" />}
          {marker.playground && (
            <FontAwesomeIcon icon="fa-solid fa-child-reaching" />
          )}
          {marker.dog_friendly && <FontAwesomeIcon icon="fa-solid fa-dog" />}
        </div>
        <button
          className="btn btn-outline btn-xs btn-accent"
          onClick={() => document.getElementById("modal").showModal()}
        >
          More Info
        </button>
      </div>

      {/** Modal Refactor later */}
      <dialog id="modal" className="modal text-accent">
        <div className="modal-box">
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
          <h1 className="font-bold text-xl">{marker.name}</h1>
          <p className="py-4">{marker.street_address}</p>
          <div className="carousel rounded-box carousel-end max-h-64">
            {imageData.map((image, index) => {
              return (
                <div key={index} className="carousel-item">
                  <img
                    src={`data:image/jpeg;base64,${image}`}
                    alt="Park"
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              );
            })}
          </div>
          <SubmitUserReview park={marker} addReview={addReview} />
          <h2>Reviews</h2>
          <div className="flex flex-col items-center">
            {reviews.map((review) => {
              return (
                <ReviewCard key={review.id} review={review} marker={marker} deleteReview={deleteReview}
            reviews={reviews} />
              );
            })}
          </div>
        </div>
      </dialog>
    </>
  );
}
