// Validate email format
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validate password strength
// Minimum 8 characters, at least one uppercase, one lowercase, one number
export const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

// Validate name (only letters and spaces, min 2 characters)
export const validateName = (name) => {
  const regex = /^[A-Za-z ]{2,}$/;
  return regex.test(name);
};

// Validate QR code (example: must be alphanumeric and 6-12 characters)
export const validateQRCode = (qrCode) => {
  const regex = /^[A-Za-z0-9]{6,12}$/;
  return regex.test(qrCode);
};

// Validate roll number / student ID (digits only, 1-10 characters)
export const validateRollNumber = (rollNumber) => {
  const regex = /^[0-9]{1,10}$/;
  return regex.test(rollNumber);
};

// Validate phone number (10 digits)
export const validatePhone = (phone) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(phone);
};

// General function to check if input is empty
export const isEmpty = (value) => {
  return !value || value.trim() === "";
};
