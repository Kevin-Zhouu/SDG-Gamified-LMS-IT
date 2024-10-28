const request = require('supertest');
const app = require('../app'); // Adjust the path to your app
const { generateToken } = require('../utils/auth'); // Adjust as necessary
const db = require('../models'); // Adjust if you use a database connection

describe('Integration tests for /api/sdg endpoints', () => {
  let token;

  beforeAll(async () => {
    // Setup the test environment, like starting the app or connecting to a test DB
    await db.connect(); // if using a real or mock database
    token = generateToken({ userId: 1 }); // Replace with your token generation logic
  });

  afterAll(async () => {
    // Clean up resources, such as closing DB connections
    await db.disconnect();
  });

  describe('GET /api/sdg/', () => {
    it('should retrieve all SDG items with a valid access token', async () => {
      const res = await request(app)
        .get('/api/sdg/')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThanOrEqual(0); // Adjust based on expected data
    });
  });

  describe('POST /api/sdg/', () => {
    it('should create a new SDG item with valid data and access token', async () => {
      const newItem = {
        title: 'SDG Title',
        backgroundURL: 'https://example.com/image.png',
        subtitle: 'SDG Subtitle',
      };
      const res = await request(app)
        .post('/api/sdg/')
        .set('Authorization', `Bearer ${token}`)
        .send(newItem);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe(newItem.title);
      // Verify that the item was actually created in the database
      const createdItem = await db.SDG.findById(res.body.id); // Replace with your DB model
      expect(createdItem).not.toBeNull();
      expect(createdItem.title).toBe(newItem.title);
    });

    it('should not create an SDG item with missing fields', async () => {
      const incompleteItem = {
        title: 'SDG Title',
        // backgroundURL and subtitle are missing
      };
      const res = await request(app)
        .post('/api/sdg/')
        .set('Authorization', `Bearer ${token}`)
        .send(incompleteItem);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });
});