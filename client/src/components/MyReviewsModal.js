import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useState, useEffect } from "react";
import ReviewCard from "./ReviewCard";


export default function MyReviewsModal({ onClose }) {
  // move the auth0 user to the top of the file !!!
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [userReviews, setUserReviews] = useState([]);

// got the park name by parkId
const getParkByParkId = async (id) => {
    if (user) {
      try {
        const response = await axios.get(`/api/park/${id}`)
          .then(response => response.data).then(data => data.name);
          console.log("response from park name", response);
        return response;
      } catch (error) {
        console.error("Error fetching park data:", error);
      }
    }
    return ''; // Return an empty string if something goes wrong
  };

  
  // bring user reviews to the frontend
  


  const getUserReviews = async () => {
    if (user) {
      try {
        const userFromDatabase = await axios.get(`/api/user/email/${user.email}`)
          .then((response) => response.data);
  
        const reviewsResponse = await axios.get(`/api/review/user/${userFromDatabase.id}`);
        const reviews = await Promise.all(reviewsResponse.data.map(async review => {
          const parkName = await getParkByParkId(review.park_id);
          return {...review, parkName};
        }));
  
        console.log("reviews back from axios", reviews);
        setUserReviews(reviews);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    getUserReviews();
  }, [user]);


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
                <p>{review.parkName}</p>
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
