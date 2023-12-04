import * as bcrypt from "bcrypt";

export const getHashedPassword = (password) => {
  const res = bcrypt.hashSync(password, 10);
  return res;
};

export const comparePassword = (password, hashedPassword) => {
  const res = bcrypt.compareSync(password, hashedPassword);
  return res;
};
