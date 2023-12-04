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

library.add(faToilet)
library.add(faChildReaching);
library.add(faDog);





export default function ContentPopup({ marker, userLocation }) {
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
        <Icons marker={marker} userLocation={userLocation} parkLocation={parkLocation}/>
        <button
          className="btn btn-outline btn-xs btn-accent"
          onClick={() => document.getElementById("modal").showModal()}
        >
          More Info
        </button>
      </div>

      {/** Modal Refactor later */}
      <dialog id="modal" className="modal">
        <div className="modal-box">
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
          <h1 className="font-bold text-4xl text-primary">{marker.name}</h1>
          <h3 className="py-4 text-xl text-secondary">{marker.street_address}</h3>
          {imageData && <ImageCarousel imageData={imageData}/>}
          <Icons marker={marker} userLocation={userLocation} parkLocation={parkLocation}/>
          { isAuthenticated && <SubmitUserReview park={marker} addReview={addReview} />}
          <h2 className="mt-4 text-lg text-accent">Reviews</h2>
          <div className="flex flex-col text-left">
            {reviews.map((review) => {
              return (
                <ReviewCard key={review.id} review={review}
            reviews={reviews} />
              );
            })}
          </div>
        </div>
      </dialog>
    </>
  );
}
