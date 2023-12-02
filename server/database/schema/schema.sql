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
    street_address TEXT NOT NULL,
    place_id TEXT,
    google_rating DECIMAL(2,1)
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    park_id INT REFERENCES parks(id),
    user_id INT REFERENCES users(id),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    user_experience TEXT,
    playground BOOLEAN NOT NULL,
    playground_equipment TEXT,
    bathrooms BOOLEAN NOT NULL,
    bathrooms_description TEXT,
    openarea BOOLEAN NOT NULL,
    openarea_description TEXT,
    dog_friendly BOOLEAN NOT NULL,
    dog_friendly_description TEXT
);