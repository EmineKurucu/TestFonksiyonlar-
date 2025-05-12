const { createUser } = require('../services/userService'); // user create etmek için servis fonksiyonu burada olmalı
const User = require('../models/User'); // mongoos modeli burada olmalı

// user modlini mockluyoruz
jest.mock('../models/User');

describe('createUser', () => {
  beforeEach(() => {
    // her testten önce mock'ları temizle 
    jest.clearAllMocks();
  });

  test('should save user to database and return user data', async () => {
    // Test dataları
    const userData = {
      name: "ad",
      surname: "soyad",
      username: "adSoyad",
      password: "Password007!",
      email: "adSoyad@gmail.com",
      phone: "05551234487",
      user_type: "customer",
      customer_of: "RND Electronic and Software"
    };

    // Kayıt için mock 
    const mockUser = {
      ...userData,
      password: 'hashedPassword123',
      save: jest.fn().mockResolvedValue({
        ...userData,
        password: 'hashedPassword123'
      })
    };

    // constructor'ı mockle
    User.mockImplementation(() => mockUser);

    // test edeceğimiz fonksiyonu çağırıyoruz
    const result = await createUser(userData);

    // Test edilenler
    expect(mockUser.save).toHaveBeenCalled(); // Veritabanına kaydedildi mi?
    expect(result).toEqual(userData); // Doğru veri return ediliyor mu?
    expect(result).not.toHaveProperty('password'); // Şifre return edilmiyor
  });

  // database hatası testi 
  test('should handle database errors during user creation', async () => {
    const userData = {
      name: "ad",
      surname: "soyad",
      username: "adSoyad",
      password: "Password007!",
      email: "adSoyad@gmail.com",
      phone: "05551234487",
      user_type: "customer",
      customer_of: "RND Electronic and Software"
    };

    // Database hatasının mocklenmesi
    const mockUser = {
      ...userData,
      save: jest.fn().mockRejectedValue(new Error('Database connection failed'))
    };

    User.mockImplementation(() => mockUser);

    // hata mesajının test edilmesi
    await expect(createUser(userData)).rejects.toThrow('Database connection failed');
  });
});