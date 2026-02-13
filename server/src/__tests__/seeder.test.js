const mongoose = require('mongoose');
const User = require('../models/User');

// Import setup
require('./setup');

describe('User Seeder Tests', () => {
  it('should create admin user if database is empty', async () => {
    // Database should be empty due to setup afterEach cleanup
    const userCount = await User.countDocuments();
    expect(userCount).toBe(0);

    // Simulate seeder logic
    const adminExists = await User.findOne({
      email: 'admin@spsgroup.com.br',
    });

    expect(adminExists).toBeNull();

    // Create admin user
    const adminUser = await User.create({
      name: 'admin',
      email: 'admin@spsgroup.com.br',
      type: 'admin',
      password: '1234',
    });

    expect(adminUser).toBeDefined();
    expect(adminUser.email).toBe('admin@spsgroup.com.br');
    expect(adminUser.type).toBe('admin');
    expect(adminUser.name).toBe('admin');

    // Verify password was hashed
    expect(adminUser.password).toBeDefined();
    expect(adminUser.password).not.toBe('1234');
  });

  it('should not create duplicate admin user if already exists', async () => {
    // Create admin user first
    await User.create({
      name: 'admin',
      email: 'admin@spsgroup.com.br',
      type: 'admin',
      password: '1234',
    });

    // Simulate seeder logic
    const adminExists = await User.findOne({
      email: 'admin@spsgroup.com.br',
    });

    expect(adminExists).toBeDefined();

    // Count users in database
    const userCount = await User.countDocuments();
    expect(userCount).toBe(1);

    // Try to create again (should not happen in seeder)
    try {
      await User.create({
        name: 'admin',
        email: 'admin@spsgroup.com.br',
        type: 'admin',
        password: '1234',
      });
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      // Should throw duplicate key error
      expect(error.code).toBe(11000); // MongoDB duplicate key error code
    }

    // Verify still only one user
    const finalCount = await User.countDocuments();
    expect(finalCount).toBe(1);
  });

  it('should hash password correctly on user creation', async () => {
    const plainPassword = '1234';
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      type: 'user',
      password: plainPassword,
    });

    // Fetch user with password field (since it's select: false by default)
    const userWithPassword = await User.findById(user._id).select('+password');

    expect(userWithPassword.password).toBeDefined();
    expect(userWithPassword.password).not.toBe(plainPassword);

    // Verify password validation works
    const isValid = await userWithPassword.validatePassword(plainPassword);
    expect(isValid).toBe(true);

    const isInvalid = await userWithPassword.validatePassword('wrongpassword');
    expect(isInvalid).toBe(false);
  });
});
