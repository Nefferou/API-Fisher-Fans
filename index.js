const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const https = require('https');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = process.env.API_PORT || 3000;

dotenv.config();

// Import Middlewares
const { authenticate } = require('./authMiddleware');
app.use(express.json());

// SSL credentials for HTTPS
const credentials = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH),
    passphrase: process.env.SSL_PASSPHRASE
};

// Swagger route
const swaggerDocument = YAML.load('./assets/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
app.use('/api/v1/fishing-trips', authenticate, v1FishingTripsRoutes);
app.use('/api/v1/reservations', authenticate, v1ReservationsRoutes);
app.use('/api/v1/fishing-logs', authenticate, v1FishingLogsRoutes);

// 🔹 **Empêche le serveur de démarrer en mode test**
if (process.env.NODE_ENV !== 'test') {
    https.createServer(credentials, app).listen(port, () => {
        console.log(`API started on port: ${port}`);
    });
}

// Exporter l'application pour la tester
module.exports = app;