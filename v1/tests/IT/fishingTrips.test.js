const request = require('supertest');
const app = require('../../../index');

let token = '';
const port = 3003;
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

describe('Test fishing trips paths', () => {
    describe('GET all trips', () => {
        it('should retrieve all fishing trips', async () => {
            const response = await request(baseUrl)
                .get('/api/v1/fishing-trips')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
        });
    });

    describe('GET trip by ID', () => {
        it('should retrieve a fishing trip by ID', async () => {
            const tripId = 1;

            const response = await request(baseUrl)
                .get(`/api/v1/fishing-trips/${tripId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', tripId);
        });

        it('should return 404 if trip does not exist', async () => {
            const response = await request(baseUrl)
                .get(`/api/v1/fishing-trips/9999`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.error.text).toBe('Sortie de pêche non trouvée');
        });
    });
});
