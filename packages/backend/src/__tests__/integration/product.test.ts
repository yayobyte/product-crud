import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import { createApp } from '../../app';
import jwt from 'jsonwebtoken';
import { UserRole } from '../../types/roles';

// Mock environment for tests
process.env.JWT_SECRET = 'test-secret-key';

describe('Product API Integration Tests', () => {
  let app: express.Application;
  let request: any; // Using any to bypass type checking issue
  let adminToken: string;
  let userToken: string;
  let testProductId: number;

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

  // Create a fresh test product that persists through the tests
  beforeAll(async () => {
    // Wait a moment to ensure app is fully ready
    await new Promise((resolve) => setTimeout(resolve, 500));

    const productData = {
      title: 'Integration Test Product',
      price: 99.99,
      description: 'A product created by integration tests',
      category: 'test',
      image: 'test-image.jpg',
    };

    const createResponse = await request
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(productData);

    testProductId = createResponse.body.id;

    // Verify the product was created successfully
    console.log(`Test product created with ID: ${testProductId}`);
  });

  describe('GET /api/products', () => {
    it('should return a list of products', async () => {
      const response = await request.get('/api/products').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // Check that our products have the expected structure
      const product = response.body[0];
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('title');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('category');
      expect(product).toHaveProperty('image');
      expect(product).toHaveProperty('rating');
    });
  });
  describe('GET /api/products/:id', () => {
    it('should return a single product when given a valid ID', async () => {
      console.log(`Testing GET for product with ID: ${testProductId}`);

      const response = await request
        .get(`/api/products/${testProductId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', testProductId);
      expect(response.body.title).toBe('Integration Test Product');
      expect(response.body.price).toBe(99.99);
      expect(response.body.description).toBe(
        'A product created by integration tests'
      );
    });

    it('should return 404 when given a non-existent ID', async () => {
      const nonExistentId = 99999;
      const response = await request
        .get(`/api/products/${nonExistentId}`)
        .expect(404);

      expect(response.body).toHaveProperty(
        'message',
        `Product with ID ${nonExistentId} not found`
      );
    });

    it('should return 400 when given an invalid ID format', async () => {
      const response = await request
        .get('/api/products/invalid-id')
        .expect(400);

      expect(response.body).toHaveProperty(
        'message',
        'Invalid product ID format'
      );
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product when admin is authenticated', async () => {
      const newProduct = {
        title: 'New Test Product',
        price: 49.99,
        description: 'A newly created test product',
        category: 'test',
        image: 'new-test.jpg',
      };

      const response = await request
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newProduct)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', newProduct.title);
      expect(response.body).toHaveProperty('price', newProduct.price);
      expect(response.body).toHaveProperty(
        'description',
        newProduct.description
      );
    });

    it('should return 401 when no authentication is provided', async () => {
      const newProduct = {
        title: 'Unauthorized Product',
        price: 29.99,
        description: 'This product should not be created',
        category: 'test',
        image: 'unauth.jpg',
      };

      const response = await request
        .post('/api/products')
        .send(newProduct)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'No token provided');
    });

    it('should return 403 when non-admin user attempts to create a product', async () => {
      const newProduct = {
        title: 'Forbidden Product',
        price: 19.99,
        description: 'This product should not be created by a regular user',
        category: 'test',
        image: 'forbidden.jpg',
      };

      const response = await request
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newProduct)
        .expect(403);

      expect(response.body).toHaveProperty(
        'message',
        'Insufficient permissions.'
      );
    });

    it('should return 400 when product data is incomplete', async () => {
      const incompleteProduct = {
        title: 'Incomplete Product',
        // Missing price and other required fields
      };

      const response = await request
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(incompleteProduct)
        .expect(400);

      expect(response.body).toHaveProperty(
        'message',
        'Missing or invalid required product fields'
      );
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update an existing product when admin is authenticated', async () => {
      // First, get the product to verify its current state
      const getResponse = await request
        .get(`/api/products/${testProductId}`)
        .expect(200);

      // Store the existing description
      const originalDescription = getResponse.body.description;

      const updateData = {
        title: 'Updated Test Product',
        price: 79.99,
      };

      const response = await request
        .put(`/api/products/${testProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('id', testProductId);
      expect(response.body).toHaveProperty('title', updateData.title);
      expect(response.body).toHaveProperty('price', updateData.price);
      // The description should remain unchanged from what it was
      expect(response.body).toHaveProperty('description', originalDescription);
    });

    it('should return 401 when no authentication is provided for update', async () => {
      const updateData = {
        title: 'Unauthorized Update',
      };

      const response = await request
        .put(`/api/products/${testProductId}`)
        .send(updateData)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'No token provided');
    });

    it('should return 403 when non-admin user attempts to update a product', async () => {
      const updateData = {
        title: 'Forbidden Update',
      };

      const response = await request
        .put(`/api/products/${testProductId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body).toHaveProperty(
        'message',
        'Insufficient permissions.'
      );
    });

    it('should return 404 when updating a non-existent product', async () => {
      const nonExistentId = 99999;
      const updateData = {
        title: 'Non-existent Product Update',
      };

      const response = await request
        .put(`/api/products/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty(
        'message',
        `Product with ID ${nonExistentId} not found`
      );
    });

    it('should return 400 when no update data is provided', async () => {
      const response = await request
        .put(`/api/products/${testProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty(
        'message',
        'No update data provided'
      );
    });
  });

  describe('DELETE /api/products/:id', () => {
    let productToDelete: number;

    // Create a product specifically for delete testing
    beforeEach(async () => {
      const productData = {
        title: 'Product To Delete',
        price: 15.99,
        description: 'This product will be deleted',
        category: 'test',
        image: 'delete-test.jpg',
      };

      const createResponse = await request
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData);

      productToDelete = createResponse.body.id;
    });

    it('should delete an existing product when admin is authenticated', async () => {
      // First, delete the product
      await request
        .delete(`/api/products/${productToDelete}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);

      // Then, verify it's been deleted by trying to fetch it
      const getResponse = await request
        .get(`/api/products/${productToDelete}`)
        .expect(404);

      expect(getResponse.body).toHaveProperty(
        'message',
        `Product with ID ${productToDelete} not found`
      );
    });

    it('should return 401 when no authentication is provided for delete', async () => {
      const response = await request
        .delete(`/api/products/${productToDelete}`)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'No token provided');
    });

    it('should return 403 when non-admin user attempts to delete a product', async () => {
      const response = await request
        .delete(`/api/products/${productToDelete}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body).toHaveProperty(
        'message',
        'Insufficient permissions.'
      );
    });

    it('should return 404 when deleting a non-existent product', async () => {
      const nonExistentId = 99999;

      const response = await request
        .delete(`/api/products/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body).toHaveProperty(
        'message',
        `Product with ID ${nonExistentId} not found`
      );
    });
  });
});
