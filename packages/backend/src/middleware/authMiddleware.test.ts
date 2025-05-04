import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import jwt, {
  Secret,
  VerifyCallback,
  JwtPayload,
  VerifyErrors,
} from 'jsonwebtoken';
import { authenticateToken } from './authMiddleware';
import { UnauthorizedError } from '../errors/httpErrors';
import { UserRole } from '../types/roles';

vi.mock('jsonwebtoken');

describe('Auth Middleware - authenticateToken', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  let originalJwtSecret: string | undefined;

  beforeEach(() => {
    vi.resetAllMocks();
    mockRequest = { headers: {} };
    mockResponse = {};
    nextFunction = vi.fn();

    originalJwtSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = 'test-secret'; // Ensure secret is set before mock

    // Default mock for jwt.verify simulating an error
    (jwt.verify as Mock).mockImplementation(
      (token: string, secret: Secret, callback: VerifyCallback) => {
        // Use standard Error and cast to VerifyErrors for the mock callback
        const error = new Error('mock verify error');
        callback(error as VerifyErrors, undefined);
      }
    );
  });

  afterEach(() => {
    process.env.JWT_SECRET = originalJwtSecret;
  });

  it('should call next with UnauthorizedError if no token is provided', () => {
    authenticateToken(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect((nextFunction as Mock).mock.calls[0][0].message).toBe(
      'No token provided'
    );
    expect(jwt.verify).not.toHaveBeenCalled();
  });

  it('should call next with UnauthorizedError if token is malformed', () => {
    mockRequest.headers = { authorization: 'Bearer' };
    authenticateToken(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect((nextFunction as Mock).mock.calls[0][0].message).toBe(
      'No token provided'
    );
    expect(jwt.verify).not.toHaveBeenCalled();
  });

  it('should call next with UnauthorizedError if jwt.verify fails', () => {
    mockRequest.headers = { authorization: 'Bearer invalidtoken' };
    // Default mock implementation simulates failure
    authenticateToken(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(jwt.verify).toHaveBeenCalledWith(
      'invalidtoken',
      'test-secret',
      expect.any(Function)
    );
    expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect((nextFunction as Mock).mock.calls[0][0].message).toBe(
      'Invalid or expired token'
    );
  });

  it('should set req.user and call next() if token is valid', () => {
    mockRequest.headers = { authorization: 'Bearer validtoken' };
    const mockPayload: JwtPayload = {
      userId: 123,
      role: UserRole.ADMIN,
      iat: Date.now() / 1000,
      exp: Date.now() / 1000 + 3600,
    };

    // Override mock for successful verification
    (jwt.verify as Mock).mockImplementation(
      (token: string, secret: Secret, callback: VerifyCallback) => {
        callback(null, mockPayload);
      }
    );

    authenticateToken(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(jwt.verify).toHaveBeenCalledWith(
      'validtoken',
      'test-secret',
      expect.any(Function)
    );
    expect(nextFunction).toHaveBeenCalledWith();
    expect(mockRequest.user).toEqual({ userId: 123, role: UserRole.ADMIN });
  });

  it('should call next with UnauthorizedError if JWT_SECRET is not set', () => {
    delete process.env.JWT_SECRET; // Test the internal check
    mockRequest.headers = { authorization: 'Bearer validtoken' };

    authenticateToken(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(jwt.verify).not.toHaveBeenCalled(); // Should not reach verify
    expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect((nextFunction as Mock).mock.calls[0][0].message).toBe(
      'Authentication configuration error.'
    );
  });

  it('should call next with UnauthorizedError if token payload is invalid (not object)', () => {
    mockRequest.headers = { authorization: 'Bearer validtoken' };
    const invalidPayload = 'not-an-object';

    (jwt.verify as Mock).mockImplementation(
      (token: string, secret: Secret, callback: VerifyCallback) => {
        callback(null, invalidPayload as any);
      }
    );

    authenticateToken(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(jwt.verify).toHaveBeenCalledWith(
      'validtoken',
      'test-secret',
      expect.any(Function)
    );
    expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect((nextFunction as Mock).mock.calls[0][0].message).toBe(
      'Invalid token payload'
    );
  });

  it('should call next with UnauthorizedError if token payload is missing required fields (userId)', () => {
    mockRequest.headers = { authorization: 'Bearer validtoken' };
    const incompletePayload = { role: UserRole.USER, iat: 0, exp: 0 }; // Missing userId

    (jwt.verify as Mock).mockImplementation(
      (token: string, secret: Secret, callback: VerifyCallback) => {
        callback(null, incompletePayload as JwtPayload);
      }
    );

    authenticateToken(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(jwt.verify).toHaveBeenCalledWith(
      'validtoken',
      'test-secret',
      expect.any(Function)
    );
    expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect((nextFunction as Mock).mock.calls[0][0].message).toBe(
      'Invalid token payload'
    );
  });

  it('should call next with UnauthorizedError if token payload is missing required fields (role)', () => {
    mockRequest.headers = { authorization: 'Bearer validtoken' };
    const incompletePayload = { userId: 123, iat: 0, exp: 0 }; // Missing role

    (jwt.verify as Mock).mockImplementation(
      (token: string, secret: Secret, callback: VerifyCallback) => {
        callback(null, incompletePayload as JwtPayload);
      }
    );

    authenticateToken(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(jwt.verify).toHaveBeenCalledWith(
      'validtoken',
      'test-secret',
      expect.any(Function)
    );
    expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect((nextFunction as Mock).mock.calls[0][0].message).toBe(
      'Invalid token payload'
    );
  });
});
