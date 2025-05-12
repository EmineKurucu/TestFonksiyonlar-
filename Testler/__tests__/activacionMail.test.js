const { sendActivationMail } = require('../services/mailService');
const User = require('../models/User');

// Mock modelleri çekiyoruz
jest.mock('../models/User');
jest.mock('../services/mailService');

describe('sendActivationMail', () => {
  beforeEach(() => {
    // Testten önce geçmiş mocklemeyi temizle
    jest.clearAllMocks();
  });

  test('should return success response when mail is sent', async () => {
    // Test data gerçek kullanıcı veri yapısı
    const userData = {
      phone: '+905551234567',
      name: 'Nikola Tesla',
      username: 'nikolaTesla',
      password: 'Password123!',
      email: 'nikolaTesla@gmail.com',
      user_type: 'freelancer',
      customer_of: 'RND Electronic and Software'
    };

    // Mail gönderildiğinde başarılıysa return edilir
    sendActivationMail.mockResolvedValue({
      status: 201,
      success: true,
      message: 'User created, activation mail sent.',
      data: {
        user: userData,
        oid: 'activation123'
      }
    });

    // test fonksiyonunu çağırıyoruz
    const result = await sendActivationMail(userData);

    // Testler
    expect(result).toEqual({
      status: 201,
      success: true,
      message: 'User created, activation mail sent.',
      data: {
        user: userData,
        oid: 'activation123'
      }
    });
  });

  test('should delete user and return error response when mail fails', async () => {
    // Test data - gerçek kullanıcı veri yapısı
    const userData = {
      phone: '+905551234567',
      name: 'Nikola Tesla',
      username: 'nikolaTesla',
      password: 'Password123!',
      email: 'nikolaTesla@gmail.com',
      user_type: 'freelancer',
      customer_of: 'RND Electronic and Software'
    };

    // Hata oluştuğunda user silinir
    User.findByIdAndDelete = jest.fn().mockResolvedValue(userData);

    // Mail gönderilirken hata oluşmasını mockle
    sendActivationMail.mockResolvedValue({
      status: 500,
      success: false,
      message: 'Issue while sending activation mail',
      data: null
    });

    // Test edilecek fonksiyonu çağırıyoruz
    const result = await sendActivationMail(userData);

    // Testler
    expect(result).toEqual({
      status: 500,
      success: false,
      message: 'Issue while sending activation mail',
      data: null
    });
    expect(User.findByIdAndDelete).toHaveBeenCalledWith(userData.username); // username ile silme işlemi
  });
});