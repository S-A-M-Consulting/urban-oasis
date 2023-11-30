export default function ContentPopup({ marker }) {
  return (
    <div className="popup-box">
      <div className="box">
        <h2>{marker.name}</h2>
        <button className="btn btn-primary" onClick={() => console.log(marker)}>Add to Favourites</button>
      </div>
    </div>
  );
}