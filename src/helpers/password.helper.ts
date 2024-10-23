import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { ENV_VARIABLES } from '@/src/config';

export const hashPassword = async (password: string) => {
  const encPassword = await bcrypt.hash(
    password,
    ENV_VARIABLES.BCRYPT_SALT_ROUND,
  );
  return encPassword;
};

export const comparePassword = async (
  password: string,
  userPassword: string,
) => {
  try {
    return await bcrypt.compare(password, userPassword);
  } catch (err) {
    throw new BadRequestException('Invalid data');
  }
};
