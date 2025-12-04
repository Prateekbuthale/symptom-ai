// src/utils/hash.js
import bcrypt from "bcrypt";

export const hashPassword = async (pwd) => {
  const saltRounds = 10;
  return await bcrypt.hash(pwd, saltRounds);
};

export const comparePassword = async (pwd, hash) => {
  return await bcrypt.compare(pwd, hash);
};
