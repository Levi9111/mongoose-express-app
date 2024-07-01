/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../students/student.interface';
import { Student } from '../students/student.model';
import { TUser } from './user.interface';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import { User } from './usetr.model';
import mongoose from 'mongoose';
import { TFaculty } from '../faculty/faculty.interface';
import { Faculty } from '../faculty/faculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { TAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // create a  user object
  const userData: Partial<TUser> = {};

  // if password is not given, use default password

  userData.password = password || (config.default_password as string);

  // set student role
  userData.role = 'student';

  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload?.admissionSemester,
  );

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    if (!admissionSemester)
      throw new AppError(httpStatus.NOT_FOUND, 'No admission Semester found');

    // set generated id
    userData.id = await generateStudentId(admissionSemester);

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

  // find academic semester info
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

const createAdminIntoDB = async (
  password: string,
  payload: Partial<TAdmin>,
) => {
  const userData: Partial<TUser> = {};
  userData.role = 'admin';
  userData.password = password || (config.default_admin_pass as string);
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    userData.id = await generateAdminId();
    const newUser = await User.create([userData], { session });

    if (!newUser)
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create User for Admin',
      );

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    const generatedAdmin = await Admin.create([payload], { session });
    if (!generatedAdmin)
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Admin');

    await session.commitTransaction();
    await session.endSession();

    return generatedAdmin;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Failed to create Admin: ${error.message}`,
    );
  }
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
};
