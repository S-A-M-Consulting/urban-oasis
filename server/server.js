require('dotenv').config();
const express = require("express");
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

const cwd = process.cwd();
const public = path.join(cwd, '..', 'public');
app.use(express.static(public));

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

const pool = require('./database/connection');

app.use('/api/park', require('./routes/park'));
app.use('/api/user', require('./routes/user'));
app.use('/api/review', require('./routes/review'));


app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});