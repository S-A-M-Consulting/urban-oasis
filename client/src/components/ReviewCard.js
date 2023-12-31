import axios from "axios";
import React, { useEffect, useState } from "react";

export default function ReviewCard({ reviews, review, deleteReview }) {
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
              <b>{user.name} says:</b> {review.review}
            </article>
          </div>
        </div>
        <h2 className="card-title">{review.rating}/5 ⭐️'s</h2>
        <p>{user.experience}</p>
      </div>
    </div>
  );
}
