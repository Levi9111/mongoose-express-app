import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/usetr.model';
import { TLoginUser } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';

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

const changePassword = async (
  userData: JwtPayload,
  payload: {
    oldPassword: string;
    newPassword: string;
  },
) => {
  const user = await User.isUserExistsByCustomId(userData?.userId);

  if (!user)
    throw new AppError(httpStatus.NOT_FOUND, `This user does not exist`);

  if (user.isDeleted)
    throw new AppError(httpStatus.FORBIDDEN, `This user is deleted`);

  if (user.status === 'blocked')
    throw new AppError(httpStatus.FORBIDDEN, `This user is blocked`);

  const isPasswordMatch = await User.isPasswordMatch(
    payload.oldPassword,
    user.password,
  );
  if (!isPasswordMatch)
    throw new AppError(httpStatus.FORBIDDEN, `Password does not match!!!`);

  // hashed password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

export const AuthService = {
  loginUser,
  changePassword,
};
