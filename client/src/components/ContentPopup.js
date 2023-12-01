import axios from "axios";
import React, { useEffect, useState } from "react";
import Icons from "./Icons";
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
      <h2>{marker.name}</h2>
      <h3>{marker.place_id}</h3>
      <img src={`data:image/jpeg;base64,${imageData[0]}`} alt="Park" />
      <button
        className="btn btn-outline btn-xs btn-accent"
        onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        ...
      </button>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
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
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
