require('dotenv').config();

const fs = require('fs');
const db = require('./database/connection');
const axios = require('axios');

const readJsonFile = (filename) => {
  try {
    // Read the content of the JSON file synchronously
    const data = fs.readFileSync(filename, 'utf8');
  
    // Parse the JSON data
    const jsonData = JSON.parse(data);
  
    // Now jsonData contains the parsed JSON object
    //console.log(jsonData);
    return jsonData;
  } catch (error) {
    console.error(`Error reading or parsing JSON: ${error}`);
  }
}

const seedParkData = async (data) => {
  console.log("starting seed parkData", data.length);
  
  for (const park of data) {
    const {name, geometry, vicinity, place_id, rating} = park;
    const {lat, lng} = geometry.location;
    //const photo = photos[0].photo_reference || " ";
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

    await axios.post('http://localhost:8080/api/park', parkData);
    console.log('parkData:', parkData);
  }
}

const runSchemaFiles = async () => {
  console.log('Starting to build tables...');
  const schemaFiles = fs.readdirSync('./database/schema');
  for (const fn of schemaFiles) {
    const sql = fs.readFileSync(`./database/schema/${fn}`, "utf8");
    console.log(`\t-> Running ${fn}`);
    await db.query(sql);
  }
}

const runSeedFiles = async () => {
  console.log('Done seeding tables, reading JSON file...');
  const data = readJsonFile('./all_results.json');
  //console.log(data[0].results);
  await seedParkData(data);
  console.log('Done reading JSON file.');

  console.log('Starting to seed tables...');
  const schemaFiles = fs.readdirSync('./database/seeds');
  for (const fn of schemaFiles) {
    const sql = fs.readFileSync(`./database/seeds/${fn}`, "utf8");
    console.log(`\t-> Running ${fn}`);
    await db.query(sql);
  }
  
};

const runResetDb = async () => {
  try {

    await runSchemaFiles();
    await runSeedFiles();
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    db.end();
  }
}

runResetDb();