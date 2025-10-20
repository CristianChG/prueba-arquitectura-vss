export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
  NAME: /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,50}$/,
  PHONE: /^[0-9]{10}$/,
  ZIP_CODE: /^[0-9]{5}$/,
  ONLY_LETTERS: /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/,
};
