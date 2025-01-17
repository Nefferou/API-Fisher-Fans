const FishingTrip = require('../models/fishingTripModel');
const AppError = require('../../utils/appError');

exports.createTrip = async (req, res) => {
    try {
        const newTrip = await FishingTrip.createTrip(req.body);
        res.status(201).json(newTrip);
    } catch (err) {
        console.error(err);
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la création de la sortie de pêche');
    }
};

exports.updateTrip = async (req, res) => {
    try {
        const updatedTrip = await FishingTrip.updateTrip(req.params.id, req.body);
        res.status(200).json(updatedTrip);
    } catch (err) {
        console.error(err);
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la mise à jour de la sortie de pêche');
    }
};

exports.patchTrip = async (req, res) => {
    try {
        const patchedTrip = await FishingTrip.patchTrip(req.params.id, req.body);
        res.status(200).json(patchedTrip);
    } catch (err) {
        console.error(err);
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la mise à jour de la sortie de pêche');
    }
}

exports.deleteTrip = async (req, res) => {
    try {
        await FishingTrip.deleteTrip(req.params.id);
        res.status(204).send("Sortie de pêche supprimée avec succès");
    } catch (err) {
        console.error(err);
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la suppression de la sortie de pêche');
    }
};

exports.getTrip = async (req, res) => {
    try {
        const trip = await FishingTrip.getTrip(req.params.id);
        res.status(200).json(trip);
    } catch (err) {
        console.error(err);
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la récupération de la sortie de pêche');
    }
};

exports.getAllTrips = async (req, res) => {
    try {
        // get query params
        const {beginDate, endDate, organiserId, boatId} = req.query;
        const filters = {beginDate, endDate, organiserId, boatId};

        // remove undefined keys
        Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

        const trips = await FishingTrip.getAllTrips(filters);
        res.status(200).json(trips);
    } catch (err) {
        console.error(err);
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la récupération des sorties de pêche');
    }
};
