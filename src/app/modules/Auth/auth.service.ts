import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/usetr.model';
import { TLoginUser } from './auth.interface';
import bcrypt from 'bcrypt';

const loginUser = async (payload: TLoginUser) => {
  // check if the user exists

  const isUserExist = await User.findOne({ id: payload.id });

  if (!isUserExist)
    throw new AppError(httpStatus.NOT_FOUND, `This user does not exist`);

  console.log(isUserExist);

  //   check if the user is already deleted

  const isDeleted = isUserExist?.isDeleted;
  if (isDeleted)
    throw new AppError(httpStatus.FORBIDDEN, `This user is deleted`);

  // check if the user is blocked

  const userStatus = isUserExist?.status;
  if (userStatus === 'blocked')
    throw new AppError(httpStatus.FORBIDDEN, `This user is blocked`);

  // check if the password is correct

  const isPasswordMatch = await bcrypt.compare(
    payload?.password,
    isUserExist?.password,
  );

  console.log(isPasswordMatch);

  // Access Granted: Send AccessToken, Refresh Token

  return {};
};

export const AuthService = {
  loginUser,
};
