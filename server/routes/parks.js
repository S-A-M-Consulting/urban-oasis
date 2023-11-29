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

module.exports = router;