import { describe, expect, it } from 'vitest';
import AppError from '../src/models/appError.mjs';
import { catchErrorAsync } from '../src/utilities/catchErrorAsync.mjs';

describe('AppError', () => {
  it('should create a 404 error with correct properties', () => {
    const message = 'Kunde inte hitta resursen';
    const statusCode = 404;
    const error = new AppError(message, statusCode);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(statusCode);
    expect(error.success).toBe(false);
    expect(error.status).toContain('Not Found');
  });

  it('should create a 500 error with correct properties', () => {
    const message = 'Intern serverfel';
    const statusCode = 500;
    const error = new AppError(message, statusCode);

    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(statusCode);
    expect(error.status).toContain('Internal Server Error');
  });
});

describe('catchErrorAsync', () => {
  it('should pass errors to the next middleware', async () => {
    const errorMessage = 'Test error';
    const middleware = catchErrorAsync(() => {
      return Promise.reject(new Error(errorMessage));
    });

    const req = {};
    const res = {};
    const next = (error) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(errorMessage);
    };

    await middleware(req, res, next);
  });
});
