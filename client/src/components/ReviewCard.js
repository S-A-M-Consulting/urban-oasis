import axios from "axios";
import React, { useEffect, useState } from "react";
import Icons from "./Icons";

export default function ReviewCard({ review, marker }) {
  const [user, setUser] = useState([]);

  useEffect(() => {
    try {
      axios
        .get(`/api/review/park/user/${review.userId}`)
        .then(({ data }) => setUser(data));
      console.log("user: ", user);
    } catch (error) {
      console.error("Error fetching User:", error);
    }
  }, []);

  return (
    <>
      <div className="card w-96 bg-primary text-primary-content">
        <div className="card-body">
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img src={user.photo} />
              </div>
            </div>
            <div className="chat-bubble">
              ${user.name}'s review of ${marker.name}
            </div>
          </div>
          <h2 className="card-title">{}</h2>
          <p></p>
          <div className="card-actions justify-end">
            <button className="btn">Buy Now</button>
          </div>
        </div>
      </div>
    </>
  );
}
