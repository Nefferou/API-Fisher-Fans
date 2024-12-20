-- Insérer des équipements de bateau
INSERT INTO equipments (name) VALUES
('sondeur'),
('vivier'),
('échelle'),
('GPS'),
('portecannes'),
('radio VHF');

-- Insertion des langues
INSERT INTO languages (name) VALUES
('English'),
('French'),
('Spanish'),
('German');

-- Insertion des utilisateurs
INSERT INTO users (firstname, lastname, email, password, birthday, tel, address, postal_code, city, profile_picture, status, society_name, activity_type, boat_license, insurance_number, siret_number, rc_number) VALUES
('John', 'Doe', 'john.doe@example.com', '$2y$10$aecpEONBxPmWTVhOgwbjHuightdnCUd7Nmzt5PAW5WZJdbaU/fJ0W', '1985-06-15', '123-456-7890', '123 Elm St', '75001', 'Paris', 'john_doe.jpg', 'active', 'Doe Fishing Inc.', 'Fishing Guide', 'B', 'INS1234567890', 'SIRET12345678901234', 'RC1234567890'),
('Jane', 'Smith', 'jane.smith@example.com', '$2y$10$NdtjZ8QRiZGBL2uYcHJ1We0bZGrtwXxY9mHXT11vqXILwVyDA9c1K', '1990-11-25', '098-765-4321', '456 Oak St', '75002', 'Paris', 'jane_smith.jpg', 'active', 'Smith Adventures', 'Tourism', 'C', 'INS0987654321', 'SIRET23456789012345', 'RC2345678901'),
('Alice', 'Johnson', 'alice.johnson@example.com', '$2y$10$7mMlzPKIXpjX8vYgwhyHmOnb2cIzhvLNSvtpDfCTSQG5SU8DB9n16', '1987-02-10', '321-654-9870', '789 Pine St', '75003', 'Paris', 'alice_johnson.jpg', 'active', 'Alice Tours', 'Tourism', 'B', 'INS1122334455', 'SIRET34567890123456', 'RC3456789012'),
('Bob', 'Williams', 'bob.williams@example.com', '$2y$10$ZBEHbhLC0mvdNuCj0hWB3.GiWgA6F3sDJg4UOC0BcTUwVCVH.nt7y', '1975-05-30', '456-789-0123', '101 Maple St', '75004', 'Paris', 'bob_williams.jpg', 'inactive', 'Williams Sailing', 'Fishing Guide', 'A', 'INS2233445566', 'SIRET45678901234567', 'RC4567890123'),
('Eve', 'Davis', 'eve.davis@example.com', '$2y$10$qn0c3rg9l3I.hBcORX0F8OzMTVzgW.5ZUKBt.vFg0DTP8CwoeP0nq', '1992-07-20', '567-890-1234', '202 Birch St', '75005', 'Paris', 'eve_davis.jpg', 'active', 'Eve Adventure Co.', 'Fishing', 'C', 'INS3344556677', 'SIRET56789012345678', 'RC5678901234');

-- Insertion des bateaux
INSERT INTO boats (name, description, boat_type, picture, licence_type, bail, max_capacity, city, longitude, latitude, motor_type, motor_power) VALUES
('Sea Explorer', 'A spacious fishing boat', 'Fishing', 'sea_explorer.jpg', 'B', 100.00, 8, 'Paris', 2.3522, 48.8566, 'Outboard', 150),
('Ocean Voyager', 'Luxury yacht for tours', 'Tourism', 'ocean_voager.jpg', 'C', 300.00, 12, 'Paris', 2.3522, 48.8566, 'Inboard', 250),
('River Drifter', 'Small boat for calm river trips', 'Fishing', 'river_drifter.jpg', 'A', 50.00, 4, 'Paris', 2.3522, 48.8566, 'Outboard', 100);

-- Insertion des voyages
INSERT INTO trips (information, type, price, cost_type, date, time, passengers, boat, organiser) VALUES
('Fishing trip in the Mediterranean Sea', 'Fishing', 150.00, 'Per Person', '2024-12-01', '08:00:00', '[1,2,3]', 1, 1),
('Sightseeing tour along the coast', 'Tourism', 200.00, 'Per Person', '2024-12-02', '10:00:00', '[2,3]', 2, 2),
('River fishing adventure', 'Fishing', 120.00, 'Per Person', '2024-12-03', '09:00:00', '[4,5]', 3, 3);

-- Insertion des logs de pêche
INSERT INTO fishing_logs (fish_name, picture, comment, height, weight, owner) VALUES
('Tuna', 'tuna.jpg', 'Caught a big tuna!', 80, 200, 1),
('Salmon', 'salmon.jpg', 'Great catch!', 60, 150, 2),
('Bass', 'bass.jpg', 'Caught a nice bass', 50, 120, 3),
('Trout', 'trout.jpg', 'Caught a great trout', 40, 100, 4),
('Perch', 'perch.jpg', 'Nice size perch caught!', 30, 80, 5);

-- Insertion des réservations
INSERT INTO reservations (price, nb_places, trip, organiser) VALUES
(150.00, 4, 1, 1),
(200.00, 5, 2, 2),
(120.00, 3, 3, 3);

-- Insertion des relations entre utilisateurs et bateaux
INSERT INTO user_boats (user_id, boat_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 1),
(5, 2);

-- Insertion des relations entre utilisateurs et voyages
INSERT INTO user_trips (user_id, trip_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 1),
(5, 2);

-- Insertion des relations entre utilisateurs et réservations
INSERT INTO user_reservations (user_id, reservation_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 1),
(5, 2);

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
(5, 4);

-- Insertion des relations entre utilisateurs et logs de pêche
INSERT INTO user_logs (user_id, log_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

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

-- Insertion des relations entre voyageurs et voyages
INSERT INTO trip_passengers (trip_id, user_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 4),
(2, 5),
(3, 4),
(3, 5);