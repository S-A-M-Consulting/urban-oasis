DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS parks CASCADE;
DROP TABLE IF EXISTS users CASCADE; 

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    photo TEXT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE parks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    streetAddress TEXT NOT NULL,
    placeId TEXT,
    googleRating DECIMAL(2,1)
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    parkId INT REFERENCES parks(id),
    userId INT REFERENCES users(id),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    userExperience TEXT,
    playground BOOLEAN NOT NULL,
    playgroundEquipment TEXT,
    bathrooms BOOLEAN NOT NULL,
    bathroomDescription TEXT,
    openArea BOOLEAN NOT NULL,
    openAreaDescription TEXT
);