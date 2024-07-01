import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/usetr.model';
import { TLoginUser } from './auth.interface';
import jwt from 'jsonwebtoken';
import config from '../../config';

const loginUser = async (payload: TLoginUser) => {
  // check if the user exists

  // const isUserExists = await User.findOne({ id: payload.id });
  const user = await User.isUserExistsByCustomId(payload.id);

  if (!(await User.isUserExistsByCustomId(payload.id)))
    throw new AppError(httpStatus.NOT_FOUND, `This user does not exist`);

  //   check if the user is already deleted

  if (await User.isDeletedByCustomId(payload.id))
    throw new AppError(httpStatus.FORBIDDEN, `This user is deleted`);

  // check if the user is blocked

  const userStatus = user?.status;
  if (userStatus === 'blocked')
    throw new AppError(httpStatus.FORBIDDEN, `This user is blocked`);

  // check if the password is correct

  const isPasswordMatch = await User.isPasswordMatch(
    payload?.password,
    user?.password,
  );

  if (!isPasswordMatch)
    throw new AppError(httpStatus.FORBIDDEN, `Password does not match!!!`);
  // Access Granted: Send AccessToken, Refresh Token

  // create token and send to the client

  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '10d',
  });

  return {
    accessToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

export const AuthService = {
  loginUser,
};
