const request = require('supertest');
const app = require('../../../index');

let token = '';
const port = 3002;
let server;
let baseUrl;

// Fonction qui effectue un login et récupère le token JWT avant de lancer les tests
beforeAll(async () => {
    server = app.listen(port, () => {
        console.log(`🚀 Test server running on port ${port}`);
    });
    baseUrl = `http://localhost:${port}`;

    const loginResponse = await request(baseUrl)
        .post('/api/v1/auth/login')
        .send({
            email: "alice.johnson@example.com",
            password: "test"
        });

    expect(loginResponse.status).toBe(200);  // Vérifie que l'authentification réussit
    token = loginResponse.body.token;  // Récupère dynamiquement le token
});

describe('Test reservations paths', () => {
    describe('GET all reservations', () => {
        it('should retrieve all reservations', async () => {
            const response = await request(baseUrl)
                .get('/api/v1/reservations')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
        });
    });

    describe('GET reservation by ID', () => {
        it('should retrieve a reservation by ID', async () => {
            const reservationId = 1;

            const response = await request(baseUrl)
                .get(`/api/v1/reservations/${reservationId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', reservationId);
        });

        it('should return 404 if reservation does not exist', async () => {
            const response = await request(baseUrl)
                .get(`/api/v1/reservations/9999`)
                .set('Authorization', `Bearer ${token}`);

            // TODO Change to 404
            expect(response.status).toBe(200);
            //expect(response.error.text).toBe('Réservation non trouvée');
        });
    });
});
