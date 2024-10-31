CREATE DATABASE IF NOT EXISTS FisherFans;
USE FisherFans;

-- Table Equipments
CREATE TABLE equipments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

-- Table Languages
CREATE TABLE languages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

-- Table Users
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    birthday DATE,
    tel VARCHAR(20),
    address VARCHAR(255),
    postal_code VARCHAR(10),
    city VARCHAR(100),
    profile_picture VARCHAR(255),
    status ENUM('particulier', 'professionnel') NOT NULL,
    society_name VARCHAR(255),
    activity_type VARCHAR(100),
    boat_license VARCHAR(50),
    insurance_number VARCHAR(50),
    siret_number VARCHAR(14),
    rc_number VARCHAR(14),
    fishing_log INT,
    FOREIGN KEY (fishing_log) REFERENCES fishing_logs(id)
);

-- Table Boats
CREATE TABLE boats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    boat_type ENUM('open', 'cabine', 'catamaran', 'voilier', 'jet-ski', 'canoe'),
    picture VARCHAR(255),
    licence_type ENUM('cotier', 'fluvial'),
    bail DECIMAL(10, 2),
    max_capacity INT,
    city VARCHAR(100),
    longitude1 FLOAT,
    longitude2 FLOAT,
    latitude1 FLOAT,
    latitude2 FLOAT,
    motor_type ENUM('diesel', 'essence', 'aucun'),
    motor_power INT
);

-- Table Trips
CREATE TABLE trips (
    id INT PRIMARY KEY AUTO_INCREMENT,
    information TEXT,
    type ENUM('journaliere', 'recurente'),
    price DECIMAL(10, 2),
    cost_type ENUM('global', 'par personne'),
    date DATE,
    time TIME,
    passengers JSON,
    boat INT,
    organiser INT,
    FOREIGN KEY (boat) REFERENCES boats(id),
    FOREIGN KEY (organiser) REFERENCES users(id)
);

-- Table Reservations
CREATE TABLE reservations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    price DECIMAL(10, 2),
    nb_places INT,
    trip INT,
    organiser INT,
    FOREIGN KEY (trip) REFERENCES fishing_trips(id),
    FOREIGN KEY (organiser) REFERENCES users(id)
);

-- Table FishingLogs
CREATE TABLE fishing_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fish_name VARCHAR(100),
    picture VARCHAR(255),
    comment TEXT,
    height INT,
    weight INT,
    owner INT,
    FOREIGN KEY (ownerId) REFERENCES users(id)
);

-- Relational Tables for Users
CREATE TABLE user_boats (
    user_id INT,
    boat_id INT,
    PRIMARY KEY(user_id, boat_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (boat_id) REFERENCES boats(id)
);

CREATE TABLE user_trips (
    user_id INT,
    trip_id INT,
    PRIMARY KEY(user_id, trip_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (trip_id) REFERENCES fishing_trips(id)
);

CREATE TABLE user_reservations (
    user_id INT,
    reservation_id INT,
    PRIMARY KEY(user_id, reservation_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (reservation_id) REFERENCES reservations(id)
);

CREATE TABLE user_languages (
    user_id INT,
    language_id INT,
    PRIMARY KEY(user_id, language_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (language_id) REFERENCES languages(id)
);

-- Relational Tables for Boats
CREATE TABLE boat_equipments (
    boat_id INT,
    equipment_id INT,
    PRIMARY KEY(boat_id, equipment_id),
    FOREIGN KEY (boat_id) REFERENCES boats(id),
    FOREIGN KEY (equipment_id) REFERENCES equipments(id)
);

-- Relational Tables for Trips
CREATE TABLE trip_passengers (
    trip_id INT,
    user_id INT,
    PRIMARY KEY(trip_id, user_id),
    FOREIGN KEY (trip_id) REFERENCES trips(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);