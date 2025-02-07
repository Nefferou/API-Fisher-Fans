-- Insérer des équipements de bateau
INSERT INTO equipments (name) VALUES
('sondeur'),
('vivier'),
('échelle'),
('gps'),
('portecannes'),
('radio_vhf');

-- Insertion des langues
INSERT INTO languages (name) VALUES
('english'),
('french'),
('spanish'),
('german');

-- Insertion des utilisateurs
INSERT INTO users (firstname, lastname, email, password, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number) VALUES
('John', 'Doe', 'john.doe@example.com', '$2y$10$aecpEONBxPmWTVhOgwbjHuightdnCUd7Nmzt5PAW5WZJdbaU/fJ0W', '1985-06-15', '123-456-7890', '123 Elm St', '75001', 'Paris', 'john_doe.jpg', 'particulier', '', '', 'CO12269874', '', '', ''),
('Jane', 'Smith', 'jane.smith@example.com', '$2y$10$NdtjZ8QRiZGBL2uYcHJ1We0bZGrtwXxY9mHXT11vqXILwVyDA9c1K', '1990-11-25', '098-765-4321', '456 Oak St', '75002', 'Paris', 'jane_smith.jpg', 'professionnel', 'Smith Adventures', 'location', 'CO12369874', 'INS0987654321', 'SIRET23456789012345', 'RC2345678901'),
('Alice', 'Johnson', 'alice.johnson@example.com', '$2y$10$7mMlzPKIXpjX8vYgwhyHmOnb2cIzhvLNSvtpDfCTSQG5SU8DB9n16', '1987-02-10', '321-654-9870', '789 Pine St', '75002', 'Paris', 'alice_johnson.jpg', 'professionnel', 'Alice Tours', 'location', 'FL15789325', 'INS1122334455', 'SIRET34567890123456', 'RC3456789012'),
('Bob', 'Williams', 'bob.williams@example.com', '$2y$10$ZBEHbhLC0mvdNuCj0hWB3.GiWgA6F3sDJg4UOC0BcTUwVCVH.nt7y', '1975-05-30', '456-789-0123', '101 Maple St', '75004', 'Paris', 'bob_williams.jpg', 'particulier', '', '', '', '', '', ''),
('Eve', 'Davis', 'eve.davis@example.com', '$2y$10$qn0c3rg9l3I.hBcORX0F8OzMTVzgW.5ZUKBt.vFg0DTP8CwoeP0nq', '1992-07-20', '567-890-1234', '202 Birch St', '75005', 'Paris', 'eve_davis.jpg', 'particulier', '', 'guide de peche', 'CO193018574', 'INS3344556677', '', ''),
('Carlos', 'Martinez', 'carlos.martinez@example.com', '$2y$10$aecpEONBxPmWTVhOgwbjHuightdnCUd7Nmzt5PAW5WZJdbaU/fJ0W', '1985-06-15', '123-456-7890', '123 Elm St', '75003', 'Paris', 'carlos_martinez.jpg', 'particulier', '', '', '', '', '', ''),
('Michael', 'Brown', 'michael.brown@example.com', '$2y$10$aecpEONBxPmWTVhOgwbjHuightdnCUd7Nmzt5PAW5WZJdbaU/fJ0W', '1980-03-22', '111-222-3333', '321 Cedar St', '75006', 'Paris', 'michael_brown.jpg', 'particulier', '', '', 'FL12569874', '', '', ''),
('Laura', 'Wilson', 'laura.wilson@example.com', '$2y$10$NdtjZ8QRiZGBL2uYcHJ1We0bZGrtwXxY9mHXT11vqXILwVyDA9c1K', '1988-09-14', '444-555-6666', '654 Spruce St', '75007', 'Paris', 'laura_wilson.jpg', 'particulier', '', '', '', '', '', ''),
('David', 'Taylor', 'david.taylor@example.com', '$2y$10$7mMlzPKIXpjX8vYgwhyHmOnb2cIzhvLNSvtpDfCTSQG5SU8DB9n16', '1995-01-30', '777-888-9999', '987 Willow St', '75008', 'Paris', 'david_taylor.jpg', 'particulier', '', '', '', '', '', '');

-- Insertion des bateaux
INSERT INTO boats (name, description, boat_type, picture, licence_type, bail, max_capacity, city, longitude, latitude, motor_type, motor_power) VALUES
('Sea Explorer', 'A spacious fishing boat', 'cabine', 'sea_explorer.jpg', 'cotier', 100.00, 8, 'Paris', 2.3522, 48.8566, 'diesel', 150),
('Ocean Voyager', 'Luxury yacht for tours', 'catamaran', 'ocean_voager.jpg', 'cotier', 300.00, 12, 'Paris', 3.3522, 46.8566, 'essence', 250),
('River Drifter', 'Small boat for calm river trips', 'voilier', 'river_drifter.jpg', 'fluvial', 50.00, 4, 'Paris', 3.0, 46.8566, 'aucun', 100);

-- Insertion des voyages
INSERT INTO trips (information, type, price, cost_type, begin_date, end_date, begin_time, end_time) VALUES
('Fishing trip in the Mediterranean Sea', 'journaliere', 150.00, 'par personne', '2024-12-01', '2024-12-01', '08:00:00', '17:00:00'),
('Sightseeing tour along the coast', 'journaliere', 200.00, 'par personne', '2024-12-02', '2024-12-02', '10:00:00', '19:00:00'),
('River fishing adventure', 'recurrente', 120.00, 'global', '2024-12-03', '2024-12-10', '09:00:00', '16:00:00');

-- Insertion des logs de pêche
INSERT INTO fishing_logs (fish_name, picture, comment, height, weight, location, date, freed) VALUES
('Tuna', 'tuna.jpg', 'Caught a big tuna!', 80, 200, 'Mediterranean Sea', '2024-12-01', FALSE),
('Marlin', 'marlin.jpg', 'Caught a marlin!', 90, 250, 'Atlantic Ocean', '2024-12-02', FALSE),
('Swordfish', 'swordfish.jpg', 'Caught a swordfish!', 100, 300, 'Pacific Ocean', '2024-12-03', FALSE),
('Mackerel', 'mackerel.jpg', 'Caught a mackerel!', 40, 100, 'North Sea', '2024-12-04', FALSE),
('Sardine', 'sardine.jpg', 'Caught a sardine!', 20, 50, 'Mediterranean Sea', '2024-12-05', FALSE);

-- Insertion des réservations
INSERT INTO reservations (price, nb_places) VALUES
(150.00, 2),
(350.00, 3),
(50.00, 1),
(150.00, 2);

-- Insertion des relations entre utilisateurs et bateaux
INSERT INTO user_boats (user_id, boat_id) VALUES
(2, 1),
(3, 2),
(5, 3);

-- Insertion des relations entre utilisateurs et voyages
INSERT INTO user_trips (user_id, trip_id) VALUES
(2, 1),
(3, 2),
(5, 3);

-- Insertion des relations entre bateaux et voyages
INSERT INTO trip_boat (boat_id, trip_id) VALUES
(1, 1),
(2, 2),
(3, 3);

-- Insertion des relations entre utilisateurs et réservations
INSERT INTO user_reservations (user_id, reservation_id) VALUES
(1, 1),
(6, 2),
(9, 3),
(8, 4);

-- Insertion des relations entre voyage et réservations
INSERT INTO trip_reservations (trip_id, reservation_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(1, 4);

-- Insertion des relations entre utilisateurs et langues
INSERT INTO user_languages (user_id, language_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 3),
(3, 1),
(3, 4),
(4, 2),
(4, 3),
(5, 1),
(5, 4),
(6, 1),
(7, 1),
(8, 1),
(9, 1);

-- Insertion des relations entre utilisateurs et logs de pêche
INSERT INTO user_logs (user_id, log_id) VALUES
(1, 1),
(4, 2),
(6, 3),
(7, 4),
(7, 5);

-- Insertion des relations entre bateaux et équipements
INSERT INTO boat_equipments (boat_id, equipment_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 4),
(2, 5),
(2, 6),
(3, 1),
(3, 2),
(3, 6);