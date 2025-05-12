const { createUserActivation } = require('../services/userActivationService');
const UserActivation = require('../models/UserActivation');
const User = require('../models/User');

// Mock the models
jest.mock('../models/UserActivation');
jest.mock('../models/User');

describe('createUserActivation', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('should create and return user activation operation', async () => {
    // Test data
    const activationData = {
      user_id: 'user123',
      operation_type: 'user_activation',
      status: 'pending',
      description: 'user created',
      code: 'ACT123'
    };

    // Mock the save method
    const mockActivation = {
      ...activationData,
      save: jest.fn().mockResolvedValue(activationData)
    };

    // Mock the UserActivation constructor
    UserActivation.mockImplementation(() => mockActivation);

    // Call the function we're testing
    const result = await createUserActivation(activationData);

    // Assertions
    expect(mockActivation.save).toHaveBeenCalled(); // Operasyon kaydedildi mi?
    expect(result).toEqual(activationData); // Operasyon doğru şekilde dönüyor mu?
  });

  test('should delete user when activation creation fails', async () => {
    // Test data
    const activationData = {
      user_id: 'user123',
      operation_type: 'user_activation',
      status: 'pending',
      description: 'user created',
      code: 'ACT123'
    };

    // Mock User model's findByIdAndDelete
    User.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: 'user123' });

    // Mock activation save to fail
    const mockActivation = {
      ...activationData,
      save: jest.fn().mockRejectedValue(new Error('Activation failed'))
    };

    UserActivation.mockImplementation(() => mockActivation);

    // Test that the function throws an error and deletes the user
    await expect(createUserActivation(activationData)).rejects.toThrow('Activation failed');
    expect(User.findByIdAndDelete).toHaveBeenCalledWith('user123'); // Kullanıcı silindi mi?
  });
});