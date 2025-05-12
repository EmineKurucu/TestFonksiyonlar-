const User = require('../models/User');
const { hashPassword } = require('./authService');

const createUser = async (userData) => {
  try {
    // Validate required fields
    if (!userData.username || !userData.email || !userData.password) {
      throw new Error('Validation failed');
    }

    // Hash the password
    const hashedPassword = await hashPassword(userData.password);

    // Create new user instance
    const user = new User({
      ...userData,
      password: hashedPassword
    });

    // Save user to database
    const savedUser = await user.save();

    // Remove password from returned user object
    const userWithoutPassword = savedUser.toObject();
    delete userWithoutPassword.password;

    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser
}; 