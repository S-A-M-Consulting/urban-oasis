import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';


export default function SubmitUserReview(props) {
  const [reviewContent, setReviewContent] = useState('');
  const [rating, setRating] = useState(0);

  const handleReviewContentChange = (event) => {
    setReviewContent(event.target.value);
  };

  const handleRatingChange = (event) => {
    setRating(parseInt(event.target.value, 10)); // Parse the value as an integer
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Perform actions with the reviewContent and rating, e.g., submit to the server

    // Reset the form after submission
    setReviewContent('');
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
          <button type="submit" className="btn btn-accent mt-2">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}