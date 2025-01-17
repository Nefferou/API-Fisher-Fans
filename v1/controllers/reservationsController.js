const Reservation = require('../models/reservationModel');
const AppError = require('../../utils/appError');

exports.createReservation = async (req, res) => {
    try {
        const newReservation = await Reservation.createReservation(req.body);
        res.status(201).json(newReservation);
    } catch (err) {
        console.error(err);
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la création de la réservation');
    }
};

exports.updateReservation = async (req, res) => {
    try {
        const updatedReservation = await Reservation.updateReservation(req.params.id, req.body);
        res.json(updatedReservation);
    } catch (err) {
        console.error(err);
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la mise à jour de la réservation');
    }
};

exports.deleteReservation = async (req, res) => {
    try {
        await Reservation.deleteReservation(req.params.id);
        res.status(204).send("Réservation supprimée avec succès");
    } catch (err) {
        console.error(err);
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la suppression de la réservation');
    }
};

exports.getReservation = async (req, res) => {
    try {
        const reservation = await Reservation.getReservation(req.params.id);
        res.status(200).json(reservation);
    } catch (err) {
        console.error(err);
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la récupération de la réservation');
    }
};

exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.getAllReservations();
        res.status(200).json(reservations);
    } catch (err) {
        console.error(err);
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la récupération des réservations');
    }
};
