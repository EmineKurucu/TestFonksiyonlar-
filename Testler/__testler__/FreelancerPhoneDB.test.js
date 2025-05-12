const { findUserByPhone } = require('../utils/userService');

describe('findUserByPhone', () => {
  // Başarılı durum testi
  test('should return user when phone number exists', async () => {
    const phoneNumber = '+905551234567';
    const expectedUser = {
      phone: '+905551234567',
      name: 'Nikola Tesla',
      username : "nikolaTesla",
      password : "Password123!",
      email : "nikolaTesla@gmail.com",
      user_type : "freelancer",
      customer_of : "RND Electronic and Software"
    };

    const result = await findUserByPhone(phoneNumber);
    expect(result).toEqual(expectedUser);
  });

  // Kullanıcı bulunamadığında hata testi
  test('should throw error when phone number does not exist', async () => {
    const nonExistentPhone = '+905550000000';

    await expect(findUserByPhone(nonExistentPhone))
      .rejects
      .toThrow('Bu telefon numarası ile kayıtlı kullanıcı bulunamadı');
  });

});

