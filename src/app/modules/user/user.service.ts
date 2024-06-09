import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { AcademicSemister } from '../academicSemister/academicSemister.model';
import { TStudent } from '../students/student.interface';
import { Student } from '../students/student.model';
import { TUser } from './user.interface';
import { generateStudentId } from './user.utils';
import { User } from './usetr.model';
import mongoose from 'mongoose';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // create a  user object
  const userData: Partial<TUser> = {};

  // if password is not given, use default password

  userData.password = password || (config.default_password as string);

  // set student role
  userData.role = 'student';

  // find academic semister info
  const admissionSemister = await AcademicSemister.findById(
    payload.admissionSemister,
  );

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    if (!admissionSemister)
      throw new AppError(httpStatus.NOT_FOUND, 'No admissionSemister found');

    // set generated id
    userData.id = await generateStudentId(admissionSemister);

    // create a user(transaction -1)
    const newUser = await User.create([userData], { session });

    // create a student
    if (!newUser.length)
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    // set id , _id as user
    payload.id = newUser[0].id; // Embadded id
    payload.user = newUser[0]._id; // Referencing _id

    // create a student (translation - 2)
    const newStudentData = await Student.create([payload], { session });

    if (!newStudentData.length)
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');

    await session.commitTransaction();
    await session.endSession();

    return newStudentData;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
  }
};

export const UserServices = {
  createStudentIntoDB,
};
