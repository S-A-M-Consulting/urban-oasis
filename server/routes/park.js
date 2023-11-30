const express = require('express');
const router = express.Router();
const pool = require('../database/connection');

router.get('/', (req, res) => {
  pool.query("SELECT * FROM parks")
    .then((result) => {
      res.json(result.rows);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM parks WHERE id = $1", [id])
    .then((result) => {
      res.json(result.rows);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

router.post('/', (req, res) => {
  const { name, latitude, longitude, streetAddress, photo, rating } = req.body;
  pool.query("INSERT INTO parks (name, description, image) VALUES ($1, $2, $3, $4) RETURNING *", [name, location, description, image])
    .then((result) => {
      res.json(result.rows);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

module.exports = router;