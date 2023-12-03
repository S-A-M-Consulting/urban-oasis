const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../database/connection');
require('dotenv').config();
const queries = require('../database/queries/queries');

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const getParksInArea = async (lat, lng, radius) => {
  const apiKey = process.env.MAPS_API_KEY;
  const endPoint = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=park&key=${apiKey}`;
  console.log(endPoint);
  const data = await axios.get(endPoint).then((response) => response.data);
  const results = data.results;
  console.log(results.length);
  // const nextPageToken = data.next_page_token;
  // if (nextPageToken) {
  //   const allResults = await fetchNextPage(endPoint, nextPageToken, results);
  //   return allResults;
  // }
  return results;
}

const addParksToDatabase = async (parks) => {
  for (const park of parks) {
    const { name, geometry, vicinity, place_id, rating } = park;
    const { lat, lng } = geometry.location;
    const flip = () => Math.random() < 0.5;

    const parkData = {
      name,
      latitude: lat,
      longitude: lng,
      street_address: vicinity,
      google_rating: rating,
      place_id: place_id,
      dog_friendly: flip(),
      restrooms: flip(),
      playground: flip()
    };
    console.log("added park", parkData.place_id);
    await queries.addPark(parkData);
  } 
}

//getParksInArea(40.7128, -74.0060, 10000).then((results) => { console.log(results) });

router.post('/', async (req, res) => {
  try {
    const { lat, lng, radius } = req.body;
    console.log({lat, lng, radius});
    const parks = await getParksInArea(lat, lng, radius);
    console.log(parks.length);
    await addParksToDatabase(parks);
    res.json(parks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})


module.exports = router;