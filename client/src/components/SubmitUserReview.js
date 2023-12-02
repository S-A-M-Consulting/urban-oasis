export default function SubmitUserReview(props) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Submit a Review</h3>
      </div>
      <div className="card-body">
        <form>
          <div className="form-group">
            <label htmlFor="review-rating">Rating</label>
            <input type="number" className="form-control" id="review-rating" />
          </div>
          <div className="form-group">
            <label htmlFor="review-content">Content</label>
            <textarea className="form-control textarea textarea-bordered" id="review-content" rows="3"></textarea>
          </div>
          <button type="submit" className="btn btn-accent">Submit</button>
        </form>
      </div>
    </div>
  );
}