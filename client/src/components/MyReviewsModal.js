import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useState, useEffect } from "react";


export default function MyReviewsModal({ onClose }) {
  // move the auth0 user to the top of the file !!!
  const { user, isAuthenticated, isLoading } = useAuth0();
  const profilePic = isAuthenticated
    ? user.picture
    : process.env.PUBLIC_URL + "user.png";


  
  // add this new function
  const [userReviews, setUserReviews] = useState([]);
  console.log("reviews in the modal ", userReviews);

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

  return (
    <div className="modal-container">
      <div className="modal-box">
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
        <h1>My Reviews</h1>
        <div className="modal-content flex flex-col text-left">
          {userReviews.map((review, index) => {
            return <div key={index}>{review.review}</div>;
          })}
        </div>
      </div>
    </div>
  );
}
