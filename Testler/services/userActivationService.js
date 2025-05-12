const UserActivation = require('../models/UserActivation');
const User = require('../models/User');

const createUserActivation = async (activationData) => {
  try {
    // Aktivasyon oluşturuyoruz
    const activation = new UserActivation(activationData);

    // database'e kaydediyoruz
    const savedActivation = await activation.save();

    return savedActivation;
  } catch (error) {
    // Aktivasyonda hata olursa kullanıcı silinir
    try {
      await User.findByIdAndDelete(activationData.user_id);
    } catch (deleteError) {
      // kullanıcı silme hatası
      console.error('Failed to delete user after activation failure:', deleteError);
    }
    throw error;
  }
};

module.exports = {
  createUserActivation
}; 