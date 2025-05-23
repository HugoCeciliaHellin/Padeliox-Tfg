// src/mocks/axios.js
const interceptors = {
  request: { use: jest.fn() },
  response: { use: jest.fn() }
};

const axiosMock = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors, // <-- así también lo tienes arriba
  create: () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors, // <-- ¡importante! Así nunca será undefined
  }),
};

export default axiosMock;
