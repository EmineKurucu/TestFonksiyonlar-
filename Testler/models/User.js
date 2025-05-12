// MongoDb için mongoose modeli ile user modeli oluşturuyoruz
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  surname: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  user_type: {
    type: String,
    required: true,
    enum: ['customer', 'admin', 'employee'], 
    default: 'customer'
  },
  customer_of: {
    type: String,
    required: function () {
      return this.user_type === 'customer';
    }
  }
}, {
  timestamps: true
});

// Şifreyi dışa vermeden sadece gerekli alanları döndürmek için
userSchema.methods.toObject = function() {
  const obj = this.toJSON();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
