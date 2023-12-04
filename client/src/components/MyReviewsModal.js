export default function MyReviewsModal({ isOpen, onClose, reviews }) {
    console.log("reviews in the modal ", reviews);
    if (!isOpen) return null;
  
    
    return (
      <div className="modal-box">
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
        <h1>My Reviews</h1>
        <div className="modal-content flex flex-col text-left">
          {console.log("reviewsModal reviews: ", reviews)}
          {reviews.map((review) => {
            return <div>this is a test</div>;
          })}
        </div>
      </div>
    );
  }
  