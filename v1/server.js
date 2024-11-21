const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());

// Routes
const userRoutes = require('./routes/usersRoutes');
const boatRoutes = require('./routes/boatsRoutes');
const fishingTripRoutes = require('./routes/fishingTripsRoutes');
const reservationRoutes = require('./routes/reservationsRoutes');
const fishingLogRoutes = require('./routes/fishingLogsRoutes');

// Utilisation des routes avec versionning v1
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/boats', boatRoutes);
app.use('/api/v1/fishing-trips', fishingTripRoutes);
app.use('/api/v1/reservations', reservationRoutes);
app.use('/api/v1/fishing-logs', fishingLogRoutes);

// Lancer le serveur
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
