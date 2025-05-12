const bcrypt = require('bcryptjs');

// Mock database
const mockDatabase = {
  users: [
    {
      phone: '+905551234567',
      name: 'Nikola Tesla',
      username: "nikolaTesla",
      password: "Password123!",
      email: "nikolaTesla@gmail.com",
      user_type: "freelancer",
      customer_of: "RND Electronic and Software"
    },
    {
      phone: '+905559876543',
      name: 'Marry Curie',
      username: "marryCurie",
      password: "Password56!",
      email: "marryCurie@gmail.com",
      user_type: "freelancer",
      customer_of: "RND Electronic and Software"
    }
  ]
};

// Telefon numarasına göre kullanıcı ara
const findUserByPhone = async (phoneNumber) => {
  const user = mockDatabase.users.find(user => user.phone === phoneNumber);
  if (!user) {
    throw new Error('Bu telefon numarası ile kayıtlı kullanıcı bulunamadı');
  }
  return user;
};

// Yeni kullanıcı oluştur
const createUser = async (userData) => {
  // Parolayı hashle
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // Yeni kullanıcı nesnesi
  const newUser = {
    ...userData,
    id: mockDatabase.users.length + 1,
    password: hashedPassword
  };

  // Veritabanına ekle
  mockDatabase.users.push(newUser);

  return newUser;
};

module.exports = {
  findUserByPhone,
  createUser,
  mockDatabase // testlerde erişmek için
};
