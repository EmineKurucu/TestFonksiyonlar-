const UserActivation = require('../models/UserActivation');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Mail gönderme fonksiyonu
const sendActivationMail = async (userData) => {
  try {
    // Aktivasyon kodu oluştur
    const activationCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Aktivasyon kaydı oluştur
    const activation = new UserActivation({
      user_id: userData._id,
      operation_type: 'user_activation',
      status: 'pending',
      description: 'user created',
      code: activationCode
    });

    // Aktivasyon kaydını veritabanına kaydet
    const savedActivation = await activation.save();

    // Mail gönderme işlemi
    const transporter = nodemailer.createTransport({
      // Mail sunucu ayarları buraya gelecek
    });

    await transporter.sendMail({
      from: 'your-email@example.com',
      to: userData.email,
      subject: 'Hesap Aktivasyonu',
      text: `Merhaba ${userData.username},\n\nHesabınızı aktifleştirmek için kodunuz: ${activationCode}`
    });

    // Başarılı gönderimde başarılı yanıt dön
    return {
      status: 201,
      success: true,
      message: 'User created, activation mail sent.',
      data: {
        user: userData,
        oid: savedActivation._id
      }
    };

  } catch (error) {
    // Hata durumunda kullanıcıyı silme
    try {
      await User.findByIdAndDelete(userData._id);
    } catch (deleteError) {
      console.error('Failed to delete user after mail error:', deleteError);
    }

    // Hata yanıtı dön 
    return {
      status: 500,
      success: false,
      message: 'Issue while sending activation mail',
      data: null
    };
  }
};

module.exports = {
  sendActivationMail
}; 