import React, { useState } from 'react';
import axios from 'axios';

export default function SubmitUserReview({ park, user, addReview }) {
  const [reviewContent, setReviewContent] = useState("");
  const [rating, setRating] = useState(1);

  const handleReviewContentChange = (event) => {
    setReviewContent(event.target.value);
  };

  const handleRatingChange = (event) => {
    setRating(parseInt(event.target.value, 10)); // Parse the value as an integer
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Perform actions with the reviewContent and rating, e.g., submit to the server
    const review = {
      user_id: 1,
      park_id: park.id,
      review: reviewContent,
      rating: rating
    };

    console.log("review: ", review);

    axios
      .post("/api/review", review)
      .then(({ data }) => {
        console.log(data);
        addReview(data); // Add the new review to the list in ContentPopup
      })
      .catch((error) => {
        console.error(error);
      });

    // Reset the form after submission
    setReviewContent("");
    setRating(0);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Write a Review</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <textarea
              className="form-control textarea textarea-bordered w-full"
              id="review-content"
              rows="3"
              value={reviewContent}
              onChange={handleReviewContentChange}
            ></textarea>
          </div>
          <button
            type="submit"
            className="btn btn-accent mt-2"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <div className="form-group rating flex-row justify-center">
            {[1, 2, 3, 4, 5].map((value) => (
              <input
                key={value}
                type="radio"
                name="rating-1"
                className="mask mask-star"
                value={value}
                checked={rating === value}
                onChange={handleRatingChange}
              />
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}
