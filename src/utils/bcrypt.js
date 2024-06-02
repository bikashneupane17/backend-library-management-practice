import bcrypt, { hash } from "bcrypt";

const SALT = 2;

//encrypt password
export const hashPassword = (plainPassword) => {
  return bcrypt.hashSync(plainPassword, SALT);
};

//compare password
export const comparePassword = (plainPassword, hashPassword) => {
  return bcrypt.compareSync(plainPassword, hashPassword);
};
