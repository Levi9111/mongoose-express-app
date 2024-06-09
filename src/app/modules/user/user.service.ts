import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { AcademicSemister } from '../academicSemister/academicSemister.model';
import { TStudent } from '../students/student.interface';
import { Student } from '../students/student.model';
import { TUser } from './user.interface';
import { generateStudentId } from './user.utils';
import { User } from './usetr.model';

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

  if (!admissionSemister)
    throw new AppError(httpStatus.NOT_FOUND, 'No admissionSemister found');

  // set generated id
  userData.id = await generateStudentId(admissionSemister);

  // create a user
  const newUser = await User.create(userData);

  // create a student
  if (Object.keys(newUser).length) {
    // set id , _id as user
    payload.id = newUser.id; // Embadded id
    payload.user = newUser._id; // Referencing _id

    const newStudentData = await Student.create(payload);

    return newStudentData;
  }
};

export const UserServices = {
  createStudentIntoDB,
};
