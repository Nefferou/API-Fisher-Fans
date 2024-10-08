const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const boatRoutes = require('./routes/boats');
const fishingTripRoutes = require('./routes/fishingTrips');
const reservationRoutes = require('./routes/reservations');
const fishingLogRoutes = require('./routes/fishingLogs');

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
app.use('/api/users', userRoutes);
app.use('/api/boats', boatRoutes);
app.use('/api/fishingTrips', fishingTripRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/fishingLogs', fishingLogRoutes);

app.listen(port, () => {
    console.log(`API démarrée sur http://localhost:${port}`);
});
