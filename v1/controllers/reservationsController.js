const Reservation = require('../models/reservationModel');

exports.createReservation = async (req, res) => {
    try {
        const newReservation = await Reservation.createReservation(req.body);
        res.status(201).json(newReservation);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la création de la réservation');
    }
};

exports.updateReservation = async (req, res) => {
    try {
        const updatedReservation = await Reservation.updateReservation(req.params.id, req.body);
        res.json(updatedReservation);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la mise à jour de la réservation');
    }
};

exports.deleteReservation = async (req, res) => {
    try {
        const deletedReservation = await Reservation.deleteReservation(req.params.id);
        if (deletedReservation) {
            res.status(204).send();
        } else {
            res.status(404).send('Réservation non trouvée');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la suppression de la réservation');
    }
};

exports.getReservation = async (req, res) => {
    try {
        const reservation = await Reservation.getReservation(req.params.id);
        if (!reservation) {
            res.status(404).send('Réservation non trouvée');
        } else {
            res.json(reservation);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération de la réservation');
    }
};

exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.getAllReservations();
        res.json(reservations);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération des réservations');
    }
};
