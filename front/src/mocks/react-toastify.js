// src/mocks/react-toastify.js
export const toast = {
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  warning: jest.fn(),
};

export const ToastContainer = () => null; // para componentes
export default { toast, ToastContainer };
