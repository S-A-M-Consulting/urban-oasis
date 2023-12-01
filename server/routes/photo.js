const express = require("express");
const router = express.Router();
const pool = require("../database/connection");
const queries = require("../database/queries/queries");
const axios = require("axios");


router.get("/:placeId", async (req, res) => {
  try {
    const { placeId } = req.params;
    const apiKey = process.env.MAPS_API_KEY; // Replace with your Google API key

    const endPoint = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${apiKey}`
    

    const detailsResponse = await axios.get(endPoint);
    const photos = detailsResponse.data.result.photos;

    const photoReferences = photos.map(photo => photo.photo_reference);

    const photoUrls = photoReferences.map(photoReference => {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`
    });

    const photoResponse = await axios.all(photoUrls.map(url => axios.get(url, { responseType: "arraybuffer" })));

    

    const photoData = photoResponse.map(photo => {
       const data = photo.data;
       return data.toString("base64");
    });
    console.log("photo:", photoData[0]);
    res.json(photoData);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;



