// Jest timeout süresini artır
jest.setTimeout(10000);

// MongoDB bağlantısını mock'la
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue(true),
  connection: {
    on: jest.fn(),
    once: jest.fn()
  },
  model: jest.fn(),
  Schema: jest.fn()
}));

// Console.error'ları test sırasında gösterme
global.console = {
  ...console,
  error: jest.fn(),
  log: jest.fn()
}; 