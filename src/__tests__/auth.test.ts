import request from 'supertest';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('@prisma/client');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

import prisma from '../lib/prisma';
import authRouter from '../routes/auth';

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const mockUser = { id: 1, username: 'testuser' };
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/auth/register')
        .send({ username: 'testuser', password: 'mypassword' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: mockUser.id, username: mockUser.username });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { username: 'testuser', password: 'hashedpassword' },
      });
    });
  });

  describe('POST /auth/login', () => {
    it('should login a user successfully', async () => {
      const mockUser = { id: 1, username: 'testuser', password: 'hashedpassword' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('token123');

      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'testuser', password: 'mypassword' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ token: 'token123' });
    });

    it('should return 400 if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'testuser', password: 'mypassword' });

      expect(response.status).toBe(400);
    });

    it('should return 400 if password is incorrect', async () => {
      const mockUser = { id: 1, username: 'testuser', password: 'hashedpassword' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'testuser', password: 'wrongpassword' });

      expect(response.status).toBe(400);
    });
  });
});
