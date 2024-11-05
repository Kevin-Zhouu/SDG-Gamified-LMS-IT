const request = require('supertest');
const app = require('../app'); // Adjust the path to your app
const { generateToken } = require('../utils/auth'); // Adjust as necessary

describe('/api/sdg/ endpoints', () => {
  let token;

  beforeAll(() => {
    // Generate or set a valid access token for testing
    token = generateToken({ userId: 1 }); // Replace with your token generation logic
  });

  describe('GET /api/sdg/', () => {
    it('should retrieve all SDG items with a valid access token', async () => {
      const res = await request(app)
        .get('/api/sdg/')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    it('should return 401 if access token is missing', async () => {
      const res = await request(app).get('/api/sdg/');
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 401 if access token is invalid', async () => {
      const res = await request(app)
        .get('/api/sdg/')
        .set('Authorization', 'Bearer invalidtoken');
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
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
    });

    it('should return 401 if access token is missing for POST request', async () => {
      const newItem = {
        title: 'SDG Title',
        backgroundURL: 'https://example.com/image.png',
        subtitle: 'SDG Subtitle',
      };
      const res = await request(app).post('/api/sdg/').send(newItem);
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 401 if access token is invalid for POST request', async () => {
      const newItem = {
        title: 'SDG Title',
        backgroundURL: 'https://example.com/image.png',
        subtitle: 'SDG Subtitle',
      };
      const res = await request(app)
        .post('/api/sdg/')
        .set('Authorization', 'Bearer invalidtoken')
        .send(newItem);
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 if required fields are missing in POST request', async () => {
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