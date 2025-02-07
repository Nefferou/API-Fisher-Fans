const request = require('supertest');
const app = require('../../../index');

let token = '';
const port = 3005;
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

describe('Test boats paths', () => {
    describe('GET all boats', () => {
        it('should retrieve all boats', async () => {
            const response = await request(baseUrl)
                .get('/api/v1/boats')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
        });
    });

    describe('GET boat by ID', () => {
        it('should retrieve a boat by ID', async () => {
            const boatId = 1;

            const response = await request(baseUrl)
                .get(`/api/v1/boats/${boatId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', boatId);
        });

        it('should return 404 if boat does not exist', async () => {
            const response = await request(baseUrl)
                .get(`/api/v1/boats/9999`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.error.text).toBe('Bateau non trouvé');
        });
    });

    // Test POST (Create User)
    describe('POST /boats', () => {
        it('Create boat successfully', async () => {
            const newBoat = {
                name: "Sea Explorer",
                description: "A spacious fishing boat",
                boat_type: "cabine",
                picture: "sea_explorer.jpg",
                licence_type: "cotier",
                bail: 100.00,
                max_capacity: 8,
                city: "Paris",
                longitude: 2.3522,
                latitude: 48.8566,
                motor_type: "diesel",
                motor_power: 150,
                equipments: [1, 2, 3], // Liste des équipements
                owner: 2 // ID du propriétaire du bateau
            };


            const response = await request(baseUrl)
                .post(`/api/v1/boats`)
                .set('Authorization', `Bearer ${token}`)
                .send(newBoat);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
        });
    });

    // Test PUT (Update User)
    describe('PUT /boats/:id', () => {
        it('Update boat successfully', async () => {
            const boatId = 1;  // Remplacez avec un ID d'utilisateur valide
            const updatedData = {
                name: "Sea Explorers",
                description: "A spacious fishing boat",
                boat_type: "cabine",
                picture: "sea_explorer.jpg",
                licence_type: "cotier",
                bail: 100.00,
                max_capacity: 8,
                city: "Paris",
                longitude: 2.3522,
                latitude: 48.8566,
                motor_type: "diesel",
                motor_power: 150,
                equipments: [1, 2, 3], // Liste des équipements
                owner: 2 // ID du propriétaire du bateau
            };

            const response = await request(baseUrl)
                .put(`/api/v1/boats/${boatId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('name', 'Sea Explorers');
        });

        it('Update boat with invalid ID', async () => {
            const boatId = 9999;  // ID qui n'existe pas
            const updatedData = {
                name: "Sea Explorer",
                description: "A spacious fishing boat",
                boat_type: "cabine",
                picture: "sea_explorer.jpg",
                licence_type: "cotier",
                bail: 100.00,
                max_capacity: 8,
                city: "Paris",
                longitude: 2.3522,
                latitude: 48.8566,
                motor_type: "diesel",
                motor_power: 150,
                equipments: [1, 2, 3], // Liste des équipements
                owner: 2 // ID du propriétaire du bateau
            };

            const response = await request(baseUrl)
                .put(`/api/v1/boats/${boatId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedData);

            expect(response.status).toBe(404);
            expect(response.error).toHaveProperty('text', 'Bateau non trouvé');
        });
    });

    // Test PATCH (Partially Update User)
    describe('PATCH /boats/:id', () => {
        it('Partially update boat successfully', async () => {
            const boatId = 1;  // Remplacez avec un ID d'utilisateur valide
            const patchData = {
                picture: 'UpdatedPicture.jpg'
            };

            const response = await request(baseUrl)
                .patch(`/api/v1/boats/${boatId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(patchData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('picture', 'UpdatedPicture.jpg');
        });

        it('Partially update boat with invalid ID', async () => {
            const boatId = 9999;  // ID qui n'existe pas
            const patchData = {
                city: 'UpdatedCity'
            };

            const response = await request(baseUrl)
                .patch(`/api/v1/boats/${boatId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(patchData);

            expect(response.status).toBe(404);
            expect(response.error).toHaveProperty('text', 'Bateau non trouvé');
        });
    });

    // Test DELETE (Delete User)
    describe('DELETE /boats/:id', () => {
        it('Delete boat successfully', async () => {
            const boatId = 1;  // Remplacez avec un ID d'utilisateur valide

            const response = await request(baseUrl)
                .delete(`/api/v1/boats/${boatId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(204);  // No content on success
        });

        it('Delete boat with invalid ID', async () => {
            const boatId = 9999;  // ID qui n'existe pas

            const response = await request(baseUrl)
                .delete(`/api/v1/boats/${boatId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });
});
