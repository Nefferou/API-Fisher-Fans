const request = require('supertest');
const app = require('../../../index');

let token = '';
const port = 3001;
let server;
let baseUrl;

// Fonction pour générer une adresse e-mail aléatoire
function generateRandomEmail() {
  const randomString = Math.random().toString(36).substring(2, 15); // Génère une chaîne aléatoire
  return `${randomString}@example.com`;
}

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

describe('Test users paths', () => {
  // Test GET
  describe('GET all', () => {
    it('All users', async () => {

      const response = await request(baseUrl)
          .get(`/api/v1/users`)
          .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });

  describe('GET with ID', () => {
    it('User ID exist', async () => {
      const userId = 1;  // Remplacez par un ID d'utilisateur valide

      const response = await request(baseUrl)
          .get(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', userId);
    });

    it('User ID not exist', async () => {
      const userId = 9999;  // ID qui n'existe pas

      const response = await request(baseUrl)
          .get(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);

      // Vérifier que la réponse contient un message d'erreur
      expect(response.error).toHaveProperty('text');
      expect(response.error.text).toBe('Utilisateur non trouvé'); // Ajustez si nécessaire

    });
  });

  // Test POST (Create User)
  describe('POST /users', () => {
    it('Create user successfully', async () => {
      const email = generateRandomEmail();
      const newUser = {
        firstname: 'Johny250032',
        lastname: 'Doe',
        email: email,
        password: 'password123',
        birthday: '1990-01-01',
        tel: '0123456789',
        address: '123 Main St',
        postal_code: '75001',
        city: 'Paris',
        profile_picture: 'url-to-image',
        status: 'active',
        society_name: 'JohnDoe Inc',
        activity_type: 'fishing',
        boat_license: 'rtykl',
        insurance_number: '12345',
        siret_number: '987654321',
        rc_number: 'A123',
        spokenLanguages: ['french']
      };

      const response = await request(baseUrl)
          .post(`/api/v1/users`)
          .set('Authorization', `Bearer ${token}`)
          .send(newUser);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', email);
    });

    /// TODO: Add more tests for other fields
    /*
    it('Create user with missing required fields', async () => {
      const incompleteUser = {
        firstname: 'Jane',
        lastname: 'Doe',
        email: 'jane.doe@example.com'
        // Missing other required fields
      };

      const response = await request(baseUrl)
          .post(`/api/v1/users`)
          .set('Authorization', `Bearer ${token}`)
          .send(incompleteUser);

      expect(response.status).toBe(400); // Assuming 400 for bad request
      expect(response.error).toHaveProperty('text', 'Missing required fields');
    });
    */
  });

  // Test PUT (Update User)
  describe('PUT /users/:id', () => {
    it('Update user successfully', async () => {
      const userId = 1;  // Remplacez avec un ID d'utilisateur valide
      const updatedData = {
        firstname: 'updatedJohny',
        lastname: 'Doe',
        email: 'johny.doeess@example.com',
        password: 'password123',
        birthday: '1990-01-01',
        tel: '0123456789',
        address: '123 Main St',
        postal_code: '75001',
        city: 'Paris',
        profile_picture: 'url-to-image',
        status: 'active',
        society_name: 'JohnDoe Inc',
        activity_type: 'fishing',
        boat_license: 'rtykl',
        insurance_number: '12345',
        siret_number: '987654321',
        rc_number: 'A123',
        spokenLanguages: ['french']
      };

      const response = await request(baseUrl)
          .put(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('firstname', 'updatedJohny');
    });

    it('Update user with invalid ID', async () => {
      const userId = 9999;  // ID qui n'existe pas
      const updatedData = {
        firstname: 'updatedJohny',
        lastname: 'Doe',
        email: 'johny.doeess@example.com',
        password: 'password123',
        birthday: '1990-01-01',
        tel: '0123456789',
        address: '123 Main St',
        postal_code: '75001',
        city: 'Paris',
        profile_picture: 'url-to-image',
        status: 'active',
        society_name: 'JohnDoe Inc',
        activity_type: 'fishing',
        boat_license: 'rtykl',
        insurance_number: '12345',
        siret_number: '987654321',
        rc_number: 'A123',
        spokenLanguages: ['french']
      };

      const response = await request(baseUrl)
          .put(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updatedData);

      expect(response.status).toBe(404);
      expect(response.error).toHaveProperty('text', 'Utilisateur non trouvé');
    });
  });

  // Test PATCH (Partially Update User)
  describe('PATCH /users/:id', () => {
    it('Partially update user successfully', async () => {
      const userId = 1;  // Remplacez avec un ID d'utilisateur valide
      const patchData = {
        city: 'UpdatedCity'
      };

      const response = await request(baseUrl)
          .patch(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${token}`)
          .send(patchData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('city', 'UpdatedCity');
    });

    it('Partially update user with invalid ID', async () => {
      const userId = 9999;  // ID qui n'existe pas
      const patchData = {
        city: 'UpdatedCity'
      };

      const response = await request(baseUrl)
          .patch(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${token}`)
          .send(patchData);

      expect(response.status).toBe(404);
      expect(response.error).toHaveProperty('text', 'Utilisateur non trouvé');
    });
  });

  // Test DELETE (Delete User)
  describe('DELETE /users/:id', () => {
    it('Delete user successfully', async () => {
      const userId = 1;  // Remplacez avec un ID d'utilisateur valide

      const response = await request(baseUrl)
          .delete(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);  // No content on success
    });

    it('Delete user with invalid ID', async () => {
      const userId = 9999;  // ID qui n'existe pas

      const response = await request(baseUrl)
          .delete(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });
});
