const Reservation = require('../models/reservationModel');

exports.getReservations = async (req, res) => {
    const reservations = await Reservation.find();
    res.json(reservations);
}

exports.getReservation = async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);
    res.json(reservation);
}

exports.createReservation = async (req, res) => {
    const newReservation = new Reservation(req.body);
    await newReservation.save();
    res.status(201).send('Réservation créée');
}

exports.updateReservation = async (req, res) => {
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(reservation);
}

exports.deleteReservation = async (req, res) => {
    await Reservation.findByIdAndDelete(req.params.id);
    res.status(204).send();
}