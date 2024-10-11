const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import V1 Routes
const v1AuthRoutes = require('./v1/routes/authRoutes');
const v1UsersRoutes = require('./v1/routes/usersRoutes');
const v1BoatsRoutes = require('./v1/routes/boatsRoutes');
const v1FishingTripsRoutes = require('./v1/routes/fishingTripsRoutes');
const v1ReservationsRoutes = require('./v1/routes/reservationsRoutes');
const v1FishingLogsRoutes = require('./v1/routes/fishingLogsRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connecté'))
    .catch(err => console.error('Erreur de connexion à MongoDB', err));

// V1 Routes
app.use('v1/auth', v1AuthRoutes);
app.use('v1/users', v1UsersRoutes);
app.use('v1/boats', v1BoatsRoutes);
app.use('v1/fishingTrips', v1FishingTripsRoutes);
app.use('v1/reservations', v1ReservationsRoutes);
app.use('v1/fishingLogs', v1FishingLogsRoutes);

app.listen(port, () => {
    console.log(`API démarrée sur http://localhost:${port}`);
});
