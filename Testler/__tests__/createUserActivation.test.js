const { createUserActivation } = require('../services/userActivationService');
const UserActivation = require('../models/UserActivation');
const User = require('../models/User');

// user create etmek için mockleme yapıyoruz
jest.mock('../models/UserActivation');
jest.mock('../models/User');

describe('createUserActivation', () => {
  beforeEach(() => {
    // testten önce geçmiş mocklemeyi temizle
    jest.clearAllMocks();
  });

  test('should create and return user activation operation', async () => {
    // Test dataları
    const activationData = {
      user_id: 'user123',
      operation_type: 'user_activation',
      status: 'pending',
      description: 'user created',
      code: 'ACT123'
    };

    // Save methodunu mockle
    const mockActivation = {
      ...activationData,
      save: jest.fn().mockResolvedValue(activationData)
    };

    // UserActivation constructor'ını mockle
    UserActivation.mockImplementation(() => mockActivation);

    // test edilecek fonksiyonu çağırıyoruz
    const result = await createUserActivation(activationData);

    // Testte bakılanlar
    expect(mockActivation.save).toHaveBeenCalled(); // Operasyon kaydedildi mi
    expect(result).toEqual(activationData); // Operasyon doğru şekilde dönüyor mu
  });

  test('should delete user when activation creation fails', async () => {
    // Test dataları
    const activationData = {
      user_id: 'user123',
      operation_type: 'user_activation',
      status: 'pending',
      description: 'user created',
      code: 'ACT123'
    };

    // User modelinin findByIdAndDelete methodunu mockle / aktivasyon oluşturma hatası olursa
    User.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: 'user123' });

    // aktivasyon oluşturma hatası olursa
    const mockActivation = {
      ...activationData,
      save: jest.fn().mockRejectedValue(new Error('Activation failed'))
    };

    UserActivation.mockImplementation(() => mockActivation);

    // hata mesajının test edilmesi
    await expect(createUserActivation(activationData)).rejects.toThrow('Activation failed');
    expect(User.findByIdAndDelete).toHaveBeenCalledWith('user123'); // Kullanıcı silindi mi?
  });
}); 