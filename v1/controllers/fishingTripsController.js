const FishingTrip = require('../models/fishingTripModel');

exports.createTrip = async (req, res) => {
    try {
        const newTrip = await FishingTrip.createTrip(req.body);
        res.status(201).json(newTrip);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la création de la sortie de pêche');
    }
};

exports.updateTrip = async (req, res) => {
    try {
        const updatedTrip = await FishingTrip.updateTrip(req.params.id, req.body);
        res.json(updatedTrip);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la mise à jour de la sortie de pêche');
    }
};

exports.deleteTrip = async (req, res) => {
    try {
        const deletedTrip = await FishingTrip.deleteTrip(req.params.id);
        if (deletedTrip) {
            res.status(204).send();
        } else {
            res.status(404).send('Sortie de pêche non trouvée');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la suppression de la sortie de pêche');
    }
};

exports.getTrip = async (req, res) => {
    try {
        const trip = await FishingTrip.getTrip(req.params.id);
        if (!trip) {
            res.status(404).send('Sortie de pêche non trouvée');
        } else {
            res.json(trip);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération de la sortie de pêche');
    }
};

exports.getAllTrips = async (req, res) => {
    try {
        const trips = await FishingTrip.getAllTrips();
        res.json(trips);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération des sorties de pêche');
    }
};
