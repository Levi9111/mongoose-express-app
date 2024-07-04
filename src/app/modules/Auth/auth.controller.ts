import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User successfully logged in',
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...paswordData } = req.body;

  const result = await AuthService.changePassword(req.user, paswordData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
};
