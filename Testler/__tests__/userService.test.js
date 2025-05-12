const { createUser } = require('../services/userService');
const User = require('../models/User');

// Mock the User model
jest.mock('../models/User');

describe('User Registration', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('should create and save a new user to database', async () => {
    // Test data
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'securePassword123'
    };

    // Mock the save method
    const mockUser = {
      ...userData,
      _id: 'mockUserId123',
      save: jest.fn().mockResolvedValue({
        ...userData,
        _id: 'mockUserId123'
      })
    };

    // Mock the User constructor
    User.mockImplementation(() => mockUser);

    // Call the function we're testing
    const result = await createUser(userData);

    // Assertions
    expect(User).toHaveBeenCalledWith(userData);
    expect(mockUser.save).toHaveBeenCalled();
    expect(result).toEqual({
      ...userData,
      _id: 'mockUserId123'
    });
    expect(result).not.toHaveProperty('password'); // Password should not be returned
  });

  test('should throw error if user creation fails', async () => {
    // Test data
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'securePassword123'
    };

    // Mock the save method to throw an error
    const mockUser = {
      ...userData,
      save: jest.fn().mockRejectedValue(new Error('Database error'))
    };

    // Mock the User constructor
    User.mockImplementation(() => mockUser);

    // Assert that the function throws an error
    await expect(createUser(userData)).rejects.toThrow('Database error');
  });

  test('should not save user if required fields are missing', async () => {
    // Test with missing email
    const invalidUserData = {
      username: 'testuser',
      password: 'securePassword123'
    };

    // Mock the User constructor
    User.mockImplementation(() => {
      throw new Error('Validation failed');
    });

    // Assert that the function throws a validation error
    await expect(createUser(invalidUserData)).rejects.toThrow('Validation failed');
  });
}); 