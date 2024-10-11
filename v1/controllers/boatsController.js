const Boat = require('../models/boatModel');

exports.getBoats = async (req, res) => {
    const filters = {};
    if (req.query.owner) filters.owner = req.query.owner;
    if (req.query.name) filters.name = { $regex: req.query.name, $options: 'i' }; // Rechercher par nom

    const boats = await Boat.find(filters);
    res.json(boats);
}

exports.getBoat = async (req, res) => {
    const boat = await Boat.findById(req.params.id);
    res.json(boat);
}

exports.createBoat = async (req, res) => {
    try {
        const newBoat = new Boat(req.body);
        await newBoat.save();
        res.status(201).send('Bateau créé');
    } catch (error) {
        res.status(400).send('Erreur lors de la création du bateau');
    }
}

exports.updateBoat = async (req, res) => {
    try {
        const boat = await Boat.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(boat);
    }
    catch (error) {
        res.status(400).send('Erreur lors de la mise à jour du bateau');
    }
}

exports.deleteBoat = async (req, res) => {
    try {
        await Boat.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).send('Erreur lors de la suppression du bateau');
    }
}