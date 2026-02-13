const request = require('supertest');
const express = require('express');
const routes = require('../routes');
const User = require('../models/User');

// Import setup
require('./setup');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

describe('Auth API Tests', () => {
  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        type: 'user',
        password: 'password123',
      });
    });

    it('should return 400 if email is missing', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Email and password are required');
    });

    it('should return 400 if password is missing', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Email and password are required');
    });

    it('should return 401 if email does not exist', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should return 401 if password is incorrect', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should return 200 with token and user on successful login', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user).not.toHaveProperty('password');
    });
  });

  describe('GET /me - Authenticated Route', () => {
    let authToken;

    beforeEach(async () => {
      // Create a test user and get auth token
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        type: 'user',
        password: 'password123',
      });

      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      authToken = loginResponse.body.token;
    });

    it('should return 401 if no token is provided', async () => {
      const response = await request(app).get('/me');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Token de autenticação não fornecido');
    });

    it('should return 401 if token format is invalid', async () => {
      const response = await request(app)
        .get('/me')
        .set('Authorization', 'InvalidFormat');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 if token is invalid', async () => {
      const response = await request(app)
        .get('/me')
        .set('Authorization', 'Bearer invalidtoken123');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 200 with user data if token is valid', async () => {
      const response = await request(app)
        .get('/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email');
      expect(response.body.email).toBe('test@example.com');
    });
  });
});
