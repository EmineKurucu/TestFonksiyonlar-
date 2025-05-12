const { generateActivationCode } = require('../utils/activationCode'); // henüz yazılmadı

describe('generateActivationCode', () => {

  test('should return a 6-digit string', () => {
    const code = generateActivationCode();
    expect(code).toMatch(/^\d{6}$/); // sadece 6 haneli sayıdan oluşmalı
  });

  test('should return a different code on each call', () => {
    const code1 = generateActivationCode();
    const code2 = generateActivationCode();
    expect(code1).not.toBe(code2); // her çağrıda farklı olmalı
  });

  test('should not start with 0 (optional rule)', () => {
    const code = generateActivationCode();
    
  });

});
