/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { AcademicSemister } from '../academicSemister/academicSemister.model';
import { TStudent } from '../students/student.interface';
import { Student } from '../students/student.model';
import { TUser } from './user.interface';
import { generateFacultyId, generateStudentId } from './user.utils';
import { User } from './usetr.model';
import mongoose from 'mongoose';
import { TFaculty } from '../faculty/faculty.interface';
import { Faculty } from '../faculty/faculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';

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
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Failed to create student: ${error.message}`,
    );
  }
};

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  // create a  user object
  const userData: Partial<TUser> = {};

  // if password is not given, use default password

  userData.password = password || (config.default_faculty_pass as string);

  // set student role
  userData.role = 'faculty';

  // find academic semister info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment)
    throw new AppError(httpStatus.NOT_FOUND, 'No academic department found');

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // set generated id
    userData.id = await generateFacultyId();
    const newUser = await User.create([userData], { session });

    if (!newUser.length)
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    const newFacultyData = await Faculty.create([payload], { session });

    if (!newFacultyData.length)
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');

    await session.commitTransaction();
    await session.endSession();

    return newFacultyData;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Failed to create Faculty: ${error.message}`,
    );
  }
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
};
