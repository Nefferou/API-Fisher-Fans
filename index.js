const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Import Middleware
app.use(express.json());
const { authenticate } = require('./authMiddleware');

// Import V1 Routes
const v1AuthRoutes = require('./v1/routes/authRoutes');
const v1UsersRoutes = require('./v1/routes/usersRoutes');
const v1BoatsRoutes = require('./v1/routes/boatsRoutes');
const v1FishingTripsRoutes = require('./v1/routes/fishingTripsRoutes');
const v1ReservationsRoutes = require('./v1/routes/reservationsRoutes');
const v1FishingLogsRoutes = require('./v1/routes/fishingLogsRoutes');

// V1 Routes
app.use('/api/v1/auth', v1AuthRoutes);
app.use('/api/v1/users', authenticate, v1UsersRoutes);
app.use('/api/v1/boats', authenticate, v1BoatsRoutes);
app.use('/api/v1/fishingTrips', authenticate, v1FishingTripsRoutes);
app.use('/api/v1/reservations', authenticate, v1ReservationsRoutes);
app.use('/api/v1/fishingLogs', authenticate, v1FishingLogsRoutes);

app.listen(port, () => {
    console.log(`API démarrée sur http://localhost:${port}`);
});
