const Boat = require('../models/boatModel');
const AppError = require('../../utils/appError');

exports.createBoat = async (req, res) => {
    try {
        const newBoat = await Boat.createBoat(req.body);
        res.status(201).json(newBoat);
    } catch (err) {
        console.error(err);
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la création du bateau');
    }
};

exports.updateBoat = async (req, res) => {
    try {
        const updatedBoat = await Boat.updateBoat(req.params.id, req.body);
        res.status(200).json(updatedBoat);
    } catch (err) {
        console.error(err);
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la mise à jour du bateau');
    }
};

exports.patchBoat = async (req, res) => {
    try {
        const patchedBoat = await Boat.patchBoat(req.params.id, req.body);
        res.status(200).json(patchedBoat);
    } catch (err) {
        console.error(err);
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la mise à jour du bateau');
    }
}

exports.deleteBoat = async (req, res) => {
    try {
        await Boat.deleteBoat(req.params.id);
        res.status(204).send("Bateau supprimé avec succès");
    } catch (err) {
        console.error(err);
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la suppression du bateau');
    }
};

exports.getBoat = async (req, res) => {
    try {
        const boat = await Boat.getBoat(req.params.id);
        res.status(200).json(boat);
    } catch (err) {
        console.error(err);
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la récupération du bateau');
    }
};

exports.getAllBoats = async (req, res) => {
    try {
        // get query params
        const { ownerId, minLatitude, maxLatitude, minLongitude, maxLongitude } = req.query;
        const filters = { ownerId, minLatitude, maxLatitude, minLongitude, maxLongitude };

        // remove undefined filters
        Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

        const boats = await Boat.getAllBoats(filters);
        res.status(200).json(boats);
    } catch (err) {
        console.error(err);
        if (err instanceof AppError) res.status(err.statusCode).send(err.message);
        else res.status(500).send('Erreur lors de la récupération des bateaux');
    }
};
