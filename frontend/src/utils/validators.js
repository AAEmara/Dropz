export const isRequired = (value) => {
  return value !== undefined && value !== null && value.trim() !== "";
};

export const isValidEmail = (email) => {
  const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email.trim());
};

export const isStrongPassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{8,}$/
  return regex.test(password);
};

export const isMatchingPassword = (password, confirmPassword) => {
  return password === confirmPassword;
};

export const isValidName = (name, minLength = 3) => {
  const regex = /^[A-Za-z]+$/;
  return regex.test(name) && name.length >= minLength;
};
