const Boat = require('../models/boatModel');

exports.createBoat = async (req, res) => {
    try {
        const newBoat = await Boat.createBoat(req.body);
        res.status(201).json(newBoat);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la création du bateau');
    }
};

exports.updateBoat = async (req, res) => {
    try {
        const updatedBoat = await Boat.updateBoat(req.params.id, req.body);
        res.json(updatedBoat);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la mise à jour du bateau');
    }
};

exports.patchBoat = async (req, res) => {
    try {
        const patchedBoat = await Boat.patchBoat(req.params.id, req.body);
        res.json(patchedBoat);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la mise à jour du bateau');
    }
}

exports.deleteBoat = async (req, res) => {
    try {
        const deletedBoat = await Boat.deleteBoat(req.params.id);
        if (deletedBoat) {
            res.status(204).send();
        } else {
            res.status(404).send('Bateau non trouvé');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la suppression du bateau');
    }
};

exports.getBoat = async (req, res) => {
    try {
        const boat = await Boat.getBoat(req.params.id);
        if (!boat) {
            res.status(404).send('Bateau non trouvé');
        } else {
            res.json(boat);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération du bateau');
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
        res.json(boats);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération des bateaux');
    }
};
