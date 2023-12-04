import * as EmailValidator from "email-validator";

export const ValidateEmail = (email) => {
  const res = EmailValidator.validate(email);
  return res;
};
