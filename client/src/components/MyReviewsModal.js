import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useState, useEffect } from "react";
import ReviewCard from "./ReviewCard";


export default function MyReviewsModal({ onClose }) {
  // move the auth0 user to the top of the file !!!
  const { user, isAuthenticated, isLoading } = useAuth0();
  const profilePic = isAuthenticated
    ? user.picture
    : process.env.PUBLIC_URL + "user.png";

// got the park name by parkId
const getParkByParkId = async () => {
    if (user) {
      try {
        const userFromDatabase = await axios
          .get(`/api/user/email/${user.email}`)
          .then((response) => response.data);
        const reviews = await axios
          .get(`/api/review/user/${userFromDatabase.id}`)
          .then((response) => response.data);
        setUserReviews(reviews);
        console.log(userReviews);
        // setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  
  // bring user reviews to the frontend
  const [userReviews, setUserReviews] = useState([]);

  const getUserReviews = async () => {
    if (user) {
      try {
        const userFromDatabase = await axios
          .get(`/api/user/email/${user.email}`)
          .then((response) => response.data);
        const reviews = await axios
          .get(`/api/review/user/${userFromDatabase.id}`)
          .then((response) => response.data);
        setUserReviews(reviews);
        console.log(userReviews);
        // setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };


  useEffect(() => {
    getUserReviews();
  }, []);


  // delete the review and pass to submituserReviewer
  const deleteReview = (updatedReviews) => {
    setUserReviews(updatedReviews);
  };

  
  const handleDelete = (id) => {
    // Perform API call to delete the review from the backend
    axios
      .delete(`/api/review/${id}`)
      .then(({ res }) => {
        const updatedReviews = userReviews.filter(
          (data) => data.id !== id
        );
        deleteReview(updatedReviews);
      })
      .catch((error) => {
        console.error("Error fetching User:", error);
      });
  };
  

  return (
    <div className="modal-container">
      <div className="modal-box">
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
        {userReviews.length === 0 ? <h1>No reviews yet</h1>:<h1>My Reviews</h1>}
        <div className="modal-content flex flex-col text-left">
          {userReviews.map((review, index) => {
            return (
              <div key={index}>
                <ReviewCard review={review} />
                <button className="btn btn-outline btn-xs btn-accent" onClick={() => handleDelete(review.id)}>Delete</button>
              </div>
              );
          })}
        </div>
      </div>
    </div>
  );
}
