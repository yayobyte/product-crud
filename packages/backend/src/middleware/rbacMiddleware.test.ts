import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { checkRole } from './rbacMiddleware';
import { UserRole } from '../types/roles';
import { ForbiddenError, UnauthorizedError } from '../errors/httpErrors';

describe('RBAC Middleware - checkRole', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    vi.resetAllMocks();

    mockRequest = {};
    mockResponse = {};
    nextFunction = vi.fn();
  });

  it('should call next with UnauthorizedError if req.user is missing', () => {
    const middleware = checkRole([UserRole.ADMIN]);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect((nextFunction as Mock).mock.calls[0][0].message).toBe(
      'Authentication required.'
    );
  });

  it('should call next with UnauthorizedError if req.user.role is missing', () => {
    // Use 'as any' to bypass strict type checking for this specific test case
    mockRequest.user = { userId: 1 } as any; // Role is intentionally missing
    const middleware = checkRole([UserRole.ADMIN]);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect((nextFunction as Mock).mock.calls[0][0].message).toBe(
      'Authentication required.'
    );
  });

  it('should call next with ForbiddenError if user role is not in allowedRoles', () => {
    mockRequest.user = { userId: 1, role: UserRole.USER };
    const middleware = checkRole([UserRole.ADMIN]); // Only ADMIN allowed
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(nextFunction).toHaveBeenCalledWith(expect.any(ForbiddenError));
    expect((nextFunction as Mock).mock.calls[0][0].message).toBe(
      'Insufficient permissions.'
    );
  });

  it('should call next() without arguments if user role is in allowedRoles (single role)', () => {
    mockRequest.user = { userId: 1, role: UserRole.ADMIN };
    const middleware = checkRole([UserRole.ADMIN]); // ADMIN allowed
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(nextFunction).toHaveBeenCalledWith(); // Called with no arguments signifies success
  });

  it('should call next() without arguments if user role is in allowedRoles (multiple roles)', () => {
    mockRequest.user = { userId: 1, role: UserRole.USER };
    const middleware = checkRole([UserRole.ADMIN, UserRole.USER]); // Both allowed
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(nextFunction).toHaveBeenCalledWith();
  });
});
