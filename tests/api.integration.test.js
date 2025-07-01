const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../model/User');
const Admin = require('../model/Admin');
const Product = require('../model/Products');

describe('API Integration Tests', () => {
  let server;
  let testUser;
  let testAdmin;
  let authToken;

  beforeAll(async () => {
    if (!process.env.MONGODB_URI_TEST) {
      throw new Error(
        'MONGODB_URI_TEST is not set. Please set it to a test database URI.',
      );
    }
    await mongoose.connect(process.env.MONGODB_URI_TEST);
    server = app.listen(0);

    // Clear test data
    await User.deleteMany({});
    await Admin.deleteMany({});
    await Product.deleteMany({});

    // Create test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      status: 'active',
    });

    // Create test admin
    testAdmin = await Admin.create({
      name: 'Test Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'Admin',
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  describe('Authentication', () => {
    test('POST /api/user/signup - should create new user', async () => {
      const response = await request(app).post('/api/user/signup').send({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    test('POST /api/user/login - should login user', async () => {
      const response = await request(app).post('/api/user/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data.token');
      authToken = response.body.data.token;
    });

    test('POST /api/admin/login - should login admin', async () => {
      const response = await request(app).post('/api/admin/login').send({
        email: 'admin@example.com',
        password: 'admin123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  });

  describe('User Routes', () => {
    beforeEach(async () => {
      // Login to get auth token
      const loginResponse = await request(app).post('/api/user/login').send({
        email: 'test@example.com',
        password: 'password123',
      });
      authToken = loginResponse.body.data.token;
    });

    test('PUT /api/user/update-user/:id - should update user profile', async () => {
      const response = await request(app)
        .put(`/api/user/update-user/${testUser._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Name',
          email: 'updated@example.com',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.user.name).toBe('Updated Name');
    });

    test('PATCH /api/user/change-password - should change password', async () => {
      const response = await request(app)
        .patch('/api/user/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          email: 'test@example.com',
          password: 'password123',
          newPassword: 'newpassword123',
        });

      expect(response.status).toBe(200);
    });
  });

  describe('Product Routes', () => {
    test('GET /api/product - should get all products', async () => {
      const response = await request(app).get('/api/product');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    test('GET /api/product/:id - should get single product', async () => {
      // Create a test product first
      const testProduct = await Product.create({
        title: 'Test Product',
        price: 100,
        quantity: 10,
        status: 'in-stock',
        productType: 'test',
        description: 'Test description',
        brand: { name: 'Test Brand', id: new mongoose.Types.ObjectId() },
        category: { name: 'Test Category', id: new mongoose.Types.ObjectId() },
        img: 'https://example.com/image.jpg',
        unit: 'piece',
        parent: 'parent-category',
      });

      const response = await request(app).get(
        `/api/product/${testProduct._id}`,
      );

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Test Product');
    });
  });

  describe('Admin Routes', () => {
    let adminToken;

    beforeEach(async () => {
      // Login as admin
      const loginResponse = await request(app).post('/api/admin/login').send({
        email: 'admin@example.com',
        password: 'admin123',
      });
      adminToken = loginResponse.body.token;
    });

    test('GET /api/admin/all - should get all staff', async () => {
      const response = await request(app)
        .get('/api/admin/all')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    test('POST /api/admin/add - should add new staff', async () => {
      const response = await request(app)
        .post('/api/admin/add')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Staff',
          email: 'staff@example.com',
          password: 'staff123',
          role: 'Admin',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Error Handling', () => {
    test('GET /api/nonexistent - should return 404', async () => {
      const response = await request(app).get('/api/nonexistent');

      expect(response.status).toBe(404);
    });

    test('POST /api/user/login - should fail with wrong password', async () => {
      const response = await request(app).post('/api/user/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(403);
    });
  });
});
