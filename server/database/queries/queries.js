const db = require('../connection');
const { error, debug, getAll, getOne, insert, update } = require('../../utils/util');

//parks
const getAllParks = () => {
  return db.query("SELECT * FROM parks")
  .then(getAll)
  .catch(error('getUsers'));
};

const getOnePark = (id) => {
  return db.query("SELECT * FROM parks WHERE id = $1", [id])
  .then(getOne)
  .catch(error('getOnePark'));
};

const addPark = (park) => {
  return insert(db, 'parks', park)
  .then(getOne)
  .catch(error('addPark'));
};

const updatePark = (id, park) => {
  return update(db, 'parks', id, park)
  .then(getOne)
  .catch(error('updatePark'));
};

const deletePark = (id) => {
  return db.query("DELETE FROM parks WHERE id = $1", [id])
  .then(getOne)
  .catch(error('deletePark'));
};

//users

const getAllUsers = () => {
  return db.query("SELECT * FROM users")
  .then(getAll)
  .catch(error('getUsers'));
}

const getOneUser = (id) => {
  return db.query("SELECT * FROM users WHERE id = $1", [id])
  .then(getOne)
  .catch(error('getOneUser'));
}

const addUser = (user) => {
  return insert(db, 'users', user)
  .then(getOne)
  .catch(error('addUser'));
}

const updateUser = (id, user) => {
  return update(db, 'users', id, user)
  .then(getOne)
  .catch(error('updateUser'));
}

const deleteUser = (id) => {
  return db.query("DELETE FROM users WHERE id = $1", [id])
  .then(getOne)
  .catch(error('deleteUser'));
}

//reviews

const getReviewsByPark = (parkId) => {
  return db.query("SELECT * FROM reviews WHERE parkId = $1", [parkId])
  .then(getAll)
  .catch(error('getReviewsByPark'));
};

const getReviewsByUser = (userId) => {
  return db.query("SELECT * FROM reviews WHERE userId = $1", [userId])
  .then(getAll)
  .catch(error('getReviewsByUser'));
};

const addReview = (review) => {
  return insert(db, 'reviews', review)
  .then(getOne)
  .catch(error('addReview'));
};

const updateReview = (id, review) => {
  return update(db, 'reviews', id, review)
  .then(getOne)
  .catch(error('updateReview'));
};

const deleteReview = (id) => {
  return db.query("DELETE FROM reviews WHERE id = $1", [id])
  .then(getOne)
  .catch(error('deleteReview'));
};

const queries = {
  getAllParks,
  getOnePark,
  addPark,
  updatePark,
  deletePark,
  getAllUsers,
  getOneUser,
  addUser,
  updateUser,
  deleteUser,
  getReviewsByPark,
  getReviewsByUser,
  addReview,
  updateReview,
  deleteReview
};

module.exports = queries; 