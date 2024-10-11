const Reservation = require('../models/reservationModel');

exports.getReservations = async (req, res) => {
    const reservations = await Reservation.find();
    res.json(reservations);
}