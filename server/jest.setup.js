// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.JWT_EXPIRES_IN = '1d';
process.env.MONGODB_URI = 'mongodb://localhost:27017/crud-test';

