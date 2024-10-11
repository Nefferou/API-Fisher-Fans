import Boat from '../models/boatModel.js';

exports.getBoats = async (req, res) => {
    const filters = {};
    if (req.query.owner) filters.owner = req.query.owner;
    if (req.query.name) filters.name = { $regex: req.query.name, $options: 'i' }; // Rechercher par nom

    const boats = await Boat.find(filters);
    res.json(boats);
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