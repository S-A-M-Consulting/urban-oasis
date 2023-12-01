import axios from "axios";
import React, { useEffect, useState } from "react";

export default function ContentPopup({ marker }) {

  console.log(marker.place_id);
  const [imageData, setImageData] = useState([]);

  useEffect(() => {
    
      try {
       axios.get(`/api/photo/${marker.place_id}`).then(({ data }) => setImageData(data[0]));
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    
  }, []);
  return (
    <>
    <h2>{marker.name}</h2>
    <h3>{marker.place_id}</h3>
    <img src={`data:image/jpeg;base64,${imageData}`} alt="Park" />
      <button className="btn btn-outline btn-xs btn-accent" onClick={() => document.getElementById('my_modal_1').showModal()}>...</button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click the button below to close</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}