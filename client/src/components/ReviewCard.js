import axios from "axios";
import React, { useEffect, useState } from "react";
import Icons from "./Icons";

export default function ReviewCard({ reviews, review, marker,deleteReview }) {
  const [user, setUser] = useState([]);

  useEffect(() => {
    try {
      axios.get(`/api/user/${review.user_id}`).then(({ data }) => {
        setUser(data);
        //console.log({ review, marker, user});
      });
    } catch (error) {
      console.error("Error fetching User:", error);
    }
  }, []);

  const handleDelete = (event) => {
    event.preventDefault();
    // Perform API call to delete the review from the backend
    axios
      .delete(`/api/review/${review.id}`)
      .then(({ res }) => {
        const updatedReviews = reviews.filter(
          (data) => data.id !== review.id
        );
        deleteReview(updatedReviews);
      })
      .catch((error) => {
        console.error("Error fetching User:", error);
      });
  };

  return (
    <div>
      <div className="max-w-sm">
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img src={user.photo} />
            </div>
          </div>
          <div className="chat-bubble  break-words">
            <article className="break-words">
              {user.name} says {review.review}
            </article>
          </div>
        </div>
        <h2 className="card-title">{review.rating}/5 ⭐️'s</h2>
        <button onClick={handleDelete}>Delete Review</button>
        <p>{user.experience}</p>
      </div>
    </div>
  );
}
