const request = require('supertest');
const express = require('express');
const routes = require('../routes');
const mongoose = require('mongoose');
const User = require('../models/User');

// Import setup
require('./setup');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

describe('User API Tests', () => {
  let authToken;
  let testUser;

  beforeEach(async () => {
    // Create a test user and get auth token before each test
    testUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      type: 'admin',
      password: 'admin123',
    });

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'admin123',
      });

    authToken = loginResponse.body.token;
  });

  describe('POST /users - Create User', () => {
    it('should return 401 if no token is provided', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          email: 'newuser@example.com',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Nome, email e senha são obrigatórios');
    });

    it('should return 409 if email already exists', async () => {
      const response = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Duplicate User',
          email: 'admin@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Email já cadastrado');
    });

    it('should create a new user successfully', async () => {
      const response = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          type: 'user',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe('New User');
      expect(response.body.email).toBe('newuser@example.com');
      expect(response.body.type).toBe('user');
    });

    it('should default type to "user" if not provided', async () => {
      const response = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Default User',
          email: 'default@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body.type).toBe('user');
    });
  });

  describe('GET /users - List Users', () => {
    beforeEach(async () => {
      // Create additional users
      await User.create([
        {
          name: 'User 1',
          email: 'user1@example.com',
          type: 'user',
          password: 'password123',
        },
        {
          name: 'User 2',
          email: 'user2@example.com',
          type: 'user',
          password: 'password123',
        },
      ]);
    });

    it('should return 401 if no token is provided', async () => {
      const response = await request(app).get('/users');

      expect(response.status).toBe(401);
    });

    it('should return all users when authenticated', async () => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3); // admin + 2 additional users
    });
  });

  describe('GET /users/:id - Get Single User', () => {
    it('should return 401 if no token is provided', async () => {
      const response = await request(app).get(`/users/${testUser._id}`);

      expect(response.status).toBe(401);
    });

    it('should return 404 if user does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/users/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('User not found');
    });

    it('should return user data when found', async () => {
      const response = await request(app)
        .get(`/users/${testUser._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body._id.toString()).toBe(testUser._id.toString());
      expect(response.body.email).toBe('admin@example.com');
    });
  });

  describe('PUT /users/:id - Update User', () => {
    it('should return 401 if no token is provided', async () => {
      const response = await request(app)
        .put(`/users/${testUser._id}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(401);
    });

    it('should return 404 if user does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/users/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Usuário não encontrado');
    });

    it('should update user successfully', async () => {
      const response = await request(app)
        .put(`/users/${testUser._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Admin',
          type: 'admin',
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Admin');
      expect(response.body.email).toBe('admin@example.com');
    });

    it('should return 409 if trying to update to existing email', async () => {
      // Create another user
      const anotherUser = await User.create({
        name: 'Another User',
        email: 'another@example.com',
        type: 'user',
        password: 'password123',
      });

      const response = await request(app)
        .put(`/users/${anotherUser._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          email: 'admin@example.com',
        });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Email já cadastrado');
    });
  });

  describe('DELETE /users/:id - Delete User', () => {
    it('should return 401 if no token is provided', async () => {
      const response = await request(app).delete(`/users/${testUser._id}`);

      expect(response.status).toBe(401);
    });

    it('should return 404 if user does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/users/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Usuário não encontrado');
    });

    it('should delete user successfully', async () => {
      const response = await request(app)
        .delete(`/users/${testUser._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Usuário removido com sucesso');

      // Verify user was deleted
      const deletedUser = await User.findById(testUser._id);
      expect(deletedUser).toBeNull();
    });
  });
});
