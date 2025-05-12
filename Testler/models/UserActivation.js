// MongoDb için mongoose modeli ile userActivation modeli oluşturuyoruz
const mongoose = require('mongoose');

const userActivationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  operation_type: {
    type: String,
    required: true,
    enum: ['user_activation'], // ilerde genişletmek istersen buraya ekle
    default: 'user_activation'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  description: {
    type: String,
    required: true,
    default: 'user created'
  },
  code: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const UserActivation = mongoose.model('UserActivation', userActivationSchema);
module.exports = UserActivation;
