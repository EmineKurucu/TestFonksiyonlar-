const { hashPassword } = require('../services/authService'); // hashleme yapılacak fonksiyon
const bcrypt = require('bcryptjs');

describe('hashPassword', () => {
  test('should return a hashed password that matches the original password', async () => {
    const plainPassword = 'securePassword123';

    const hashedPassword = await hashPassword(plainPassword);
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);

    expect(typeof hashedPassword).toBe('string');
    expect(hashedPassword).not.toBe(plainPassword);
    expect(isMatch).toBe(true);
  });

  test('should return custom error response when hashing fails', async () => {
    // bcrypt.hash fonksiyonunu mock'la ve hata fırlat
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => {
      throw new Error('Hashing failed');
    });

    const plainPassword = 'failPassword';

    await expect(hashPassword(plainPassword)).rejects.toEqual({
      status: 500,
      success: false,
      message: "Couldn’t hash the password.",
      data: null
    });

    // Mock'u temizle
    bcrypt.hash.mockRestore();
  });
});
