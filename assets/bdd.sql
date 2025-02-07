    -- Supprimer les tables si elles existent
    DROP TABLE IF EXISTS user_boats CASCADE;
    DROP TABLE IF EXISTS user_trips CASCADE;
    DROP TABLE IF EXISTS trip_boat CASCADE;
    DROP TABLE IF EXISTS user_reservations CASCADE;
    DROP TABLE IF EXISTS trip_reservations CASCADE;
    DROP TABLE IF EXISTS user_languages CASCADE;
    DROP TABLE IF EXISTS user_logs CASCADE;
    DROP TABLE IF EXISTS boat_equipments CASCADE;
    DROP TABLE IF EXISTS fishing_logs CASCADE;
    DROP TABLE IF EXISTS reservations CASCADE;
    DROP TABLE IF EXISTS trips CASCADE;
    DROP TABLE IF EXISTS boats CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS languages CASCADE;
    DROP TABLE IF EXISTS equipments CASCADE;

    -- Table Equipments
    CREATE TABLE equipments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    );

    -- Table Languages
    CREATE TABLE languages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    );

    -- Table Users
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        firstname VARCHAR(255) NOT NULL,
        lastname VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        birthday DATE,
        tel VARCHAR(20),
        address VARCHAR(255),
        postal_code VARCHAR(10),
        city VARCHAR(100),
        profile_picture VARCHAR(255),
        status VARCHAR(255) NOT NULL,
        society_name VARCHAR(255),
        activity_type VARCHAR(100),
        boat_license VARCHAR(50),
        insurance_number VARCHAR(50),
        siret_number VARCHAR(20),
        rc_number VARCHAR(20)
    );

    -- Table Boats
    CREATE TABLE boats (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        boat_type VARCHAR(255),
        picture VARCHAR(255),
        licence_type VARCHAR(255),
        bail DECIMAL(10, 2),
        max_capacity INT,
        city VARCHAR(100),
        longitude FLOAT,
        latitude FLOAT,
        motor_type VARCHAR(255),
        motor_power INT
    );

    -- Table Trips
    CREATE TABLE trips (
        id SERIAL PRIMARY KEY,
        information TEXT,
        type VARCHAR(255),
        price DECIMAL(10, 2),
        cost_type VARCHAR(255),
        begin_date DATE,
        end_date DATE,
        begin_time TIME,
        end_time TIME
    );

    -- Table FishingLogs
    CREATE TABLE fishing_logs (
        id SERIAL PRIMARY KEY,
        fish_name VARCHAR(100),
        picture VARCHAR(255),
        comment TEXT,
        height INT,
        weight INT,
        location VARCHAR(255),
        date DATE,
        freed BOOLEAN
    );

    -- Table Reservations
    CREATE TABLE reservations (
        id SERIAL PRIMARY KEY,
        price DECIMAL(10, 2),
        nb_places INT
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
        FOREIGN KEY (trip_id) REFERENCES trips(id)
    );

    CREATE TABLE trip_boat (
        boat_id INT,
        trip_id INT,
        PRIMARY KEY(boat_id, trip_id),
        FOREIGN KEY (boat_id) REFERENCES boats(id),
        FOREIGN KEY (trip_id) REFERENCES trips(id)
    );

    CREATE TABLE user_reservations (
        user_id INT,
        reservation_id INT,
        PRIMARY KEY(user_id, reservation_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (reservation_id) REFERENCES reservations(id)
    );

    CREATE TABLE trip_reservations (
        trip_id INT,
        reservation_id INT,
        PRIMARY KEY(trip_id, reservation_id),
        FOREIGN KEY (trip_id) REFERENCES trips(id),
        FOREIGN KEY (reservation_id) REFERENCES reservations(id)
    );

    CREATE TABLE user_languages (
        user_id INT,
        language_id INT,
        PRIMARY KEY(user_id, language_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (language_id) REFERENCES languages(id)
    );

    CREATE TABLE user_logs (
        user_id INT,
        log_id INT,
        PRIMARY KEY(user_id, log_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (log_id) REFERENCES fishing_logs(id)
    );

    -- Relational Tables for Boats
    CREATE TABLE boat_equipments (
        boat_id INT,
        equipment_id INT,
        PRIMARY KEY(boat_id, equipment_id),
        FOREIGN KEY (boat_id) REFERENCES boats(id),
        FOREIGN KEY (equipment_id) REFERENCES equipments(id)
    );