const express = require('express');
const router = express.Router();
const pool = require('../database/connection');

router.get('/', (req, res) => {
  pool.query("SELECT * FROM users")
    .then((result) => {
      res.json(result.rows);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM users WHERE id = $1", [id])
    .then((result) => {
      res.json(result.rows);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

module.exports = router;