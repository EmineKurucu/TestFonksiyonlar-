// Mock validation fonksiyonu
const validateUserInput = (userData) => {
  // validation resultını dönüyor
  return {
    isValid: false,
    errors: []
  };
};

module.exports = validateUserInput; 