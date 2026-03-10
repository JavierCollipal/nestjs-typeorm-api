import { InternalServerErrorException } from '@nestjs/common';

export class DatabaseException extends InternalServerErrorException {
  constructor(operation: string, error?: any) {
    const message = `Database error during ${operation}`;
    super(message);

    // Log the actual error for debugging (in production, use a logger)
    if (process.env.NODE_ENV === 'development') {
      console.error('Database Error:', error);
    }
  }
}
