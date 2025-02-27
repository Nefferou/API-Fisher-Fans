const Reservation = require('../models/reservationModel');
const catchAsync = require('../../utils/catchAsync');

exports.createReservation = catchAsync(async (req, res) => {
    const newReservation = await Reservation.createReservation(req.body);
    res.status(201).json(newReservation);
});

exports.updateReservation = catchAsync(async (req, res) => {
    const updatedReservation = await Reservation.updateReservation(req.params.id, req.body);
    res.status(200).json(updatedReservation);
});

exports.patchReservation = catchAsync(async (req, res) => {
    const updatedReservation = await Reservation.patchReservation(req.params.id, req.body);
    res.status(200).json(updatedReservation);
});

exports.deleteReservation = catchAsync(async (req, res) => {
    await Reservation.deleteReservation(req.params.id);
    res.status(200).status(204).send("Réservation supprimée avec succès");
});

exports.getReservation = catchAsync(async (req, res) => {
    const reservation = await Reservation.getReservation(req.params.id);
    res.status(200).status(200).json(reservation);
});

exports.getAllReservations = catchAsync(async (req, res) => {
    const { tripId } = req.query;
    const filters = { tripId };
    const reservations = await Reservation.getAllReservations(filters);
    res.status(200).json(reservations);
});
