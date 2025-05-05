import { describe, it, expect, beforeAll } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import { createApp } from '../../app';
import jwt from 'jsonwebtoken';
import { UserRole } from '../../types/roles';

// Mock environment for tests
process.env.JWT_SECRET = 'test-secret-key';

describe('Authentication API Integration Tests', () => {
  let app: express.Application;
  let request: any; // Using any to bypass type checking issue
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    // Create a fresh app instance for testing
    app = await createApp();
    request = supertest(app);

    // Generate tokens for testing protected routes
    adminToken = jwt.sign(
      { userId: 1, username: 'admin', role: UserRole.ADMIN },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    userToken = jwt.sign(
      { userId: 2, username: 'user', role: UserRole.USER },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
  });

  describe('POST /api/auth/login', () => {
    it('should return a token when valid admin credentials are provided', async () => {
      const response = await request
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'password123' })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
    });

    it('should return a token when valid user credentials are provided', async () => {
      const response = await request
        .post('/api/auth/login')
        .send({ username: 'user', password: 'password456' })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
    });

    it('should return 401 Unauthorized when invalid password is provided', async () => {
      const response = await request
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'wrongpassword' })
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 404 Not Found when non-existent username is provided', async () => {
      const response = await request
        .post('/api/auth/login')
        .send({ username: 'nonexistent', password: 'password123' })
        .expect(404);

      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('should return 400 Bad Request when username is missing', async () => {
      const response = await request
        .post('/api/auth/login')
        .send({ password: 'password123' })
        .expect(400);

      expect(response.body).toHaveProperty(
        'message',
        'Username and password are required'
      );
    });

    it('should return 400 Bad Request when password is missing', async () => {
      const response = await request
        .post('/api/auth/login')
        .send({ username: 'admin' })
        .expect(400);

      expect(response.body).toHaveProperty(
        'message',
        'Username and password are required'
      );
    });
  });

  describe('Authentication middleware', () => {
    it('should return 401 Unauthorized when no token is provided', async () => {
      const response = await request
        .post('/api/products')
        .send({
          title: 'Test Product',
          price: 9.99,
          description: 'A test product',
          category: 'test',
          image: 'test.jpg',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message', 'No token provided');
    });

    it('should return 401 Unauthorized when invalid token is provided', async () => {
      const response = await request
        .post('/api/products')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          title: 'Test Product',
          price: 9.99,
          description: 'A test product',
          category: 'test',
          image: 'test.jpg',
        })
        .expect(401);

      expect(response.body).toHaveProperty(
        'message',
        'Invalid or expired token'
      );
    });
  });

  describe('RBAC middleware', () => {
    it('should allow admin to create a product', async () => {
      const productData = {
        title: 'Test Product',
        price: 9.99,
        description: 'A test product',
        category: 'test',
        image: 'test.jpg',
      };

      const response = await request
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(productData.title);
    });

    it('should not allow regular user to create a product', async () => {
      const productData = {
        title: 'User Test Product',
        price: 19.99,
        description: 'A user test product',
        category: 'test',
        image: 'user-test.jpg',
      };

      const response = await request
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(productData)
        .expect(403);

      expect(response.body).toHaveProperty(
        'message',
        'Insufficient permissions.'
      );
    });
  });

  describe('Public routes', () => {
    it('should allow access to get all products without a token', async () => {
      const response = await request.get('/api/products').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should allow access to get a product by ID without a token', async () => {
      // First get all products to find a valid ID
      const productsResponse = await request.get('/api/products').expect(200);

      const firstProductId = productsResponse.body[0]?.id;

      if (firstProductId) {
        const response = await request
          .get(`/api/products/${firstProductId}`)
          .expect(200);

        expect(response.body).toHaveProperty('id', firstProductId);
      } else {
        // Skip test if no products found
        console.warn('No products available to test getProductById');
      }
    });
  });
});
