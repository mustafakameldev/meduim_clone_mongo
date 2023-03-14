import { hash, compare } from 'bcrypt';
export const hashPassword = async (password) => {
  return await hash(password, 10);
};

export const comparePassword = async (
  password1: string,
  password2: string,
): Promise<string> => {
  return await compare(password1, password2);
};
