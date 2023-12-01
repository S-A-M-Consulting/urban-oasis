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

// Add the specific icons you want to use to the library

library.add(faToilet)
library.add(faChildReaching);
library.add(faDog);





export default function ContentPopup({ marker }) {
  console.log(marker.place_id);
  const [imageData, setImageData] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    try {
      axios
        .get(`/api/photo/${marker.place_id}`)
        .then(({ data }) => setImageData(data));
      axios
        .get(`/api/review/park/${marker.id}`)
        .then(({ data }) => setReviews(data));
      console.log("reviews: ", reviews);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  }, []);

  return (
    <>
      <div>
        <h2 className="text-center">{marker.name}</h2>
        <img src={`data:image/jpeg;base64,${imageData[0]}`} alt="Park" />
        <Rating rating={marker.google_rating}/>
        <FontAwesomeIcon icon="fa-solid fa-toilet" />
        <FontAwesomeIcon icon="fa-solid fa-child-reaching" />
        <FontAwesomeIcon icon="fa-solid fa-dog" />
        <button
          className="btn btn-outline btn-xs btn-accent"
          onClick={() => document.getElementById("my_modal_1").showModal()}
        >
          More Info
        </button>
      </div>


      {/** Modal Refactor later */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
          </div>
          <h3 className="font-bold text-lg">{marker.name}</h3>
          <p className="py-4">{marker.street_address}</p>
          <div className="carousel rounded-box carousel-end">
            {imageData.map((image, index) => {
              return (
                <div key={index} className="carousel-item">
                  <img src={`data:image/jpeg;base64,${image}`} alt="Park" />
                </div>
              );
            })}
          </div>
          <h2>Reviews</h2>
          <div className="carousel rounded-box carousel-end">
            {reviews.map((review, index) => {
              return (
                <div key={index} className="carousel-item">
                  <p>{review.user_experience}</p>
                  {/* <Icons {...review}/> */}
                </div>
              );
            })}
          </div>
        {/* Former Location for close button */}
        </div>
      </dialog>
    </>
  );
}
