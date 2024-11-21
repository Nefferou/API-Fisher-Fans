const { Pool } = require('pg');

// Charger les variables d'environnement (tu peux utiliser dotenv)
require('dotenv').config();

const pool = new Pool({
    user: "postgres", // Utilisateur de la DB
    host: "localhost", // Hôte (souvent 'localhost')
    database: "fisher-fans", // Nom de la base de données
    password: "postgres", // Mot de passe
    port: 5432, // Port, 5432 par défaut
});

module.exports = pool;
