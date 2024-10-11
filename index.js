const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');
const boatsRoutes = require('./routes/boatsRoutes');
const fishingTripsRoutes = require('./routes/fishingTripsRoutes');
const reservationsRoutes = require('./routes/reservationsRoutes');
const fishingLogsRoutes = require('./routes/fishingLogsRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connecté'))
    .catch(err => console.error('Erreur de connexion à MongoDB', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/boats', boatsRoutes);
app.use('/api/fishingTrips', fishingTripsRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/fishingLogs', fishingLogsRoutes);

app.listen(port, () => {
    console.log(`API démarrée sur http://localhost:${port}`);
});
