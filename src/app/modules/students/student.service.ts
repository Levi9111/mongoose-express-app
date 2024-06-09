import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Student } from './student.model';
import { User } from '../user/usetr.model';
import mongoose from 'mongoose';

const getAllStudentsFromDB = async () => {
  const result = await Student.find()
    .populate('admissionSemister')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findById(id)
    .populate('admissionSemister')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

  // const result = await Student.aggregate([{ $match: { id: id } }]);

  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const deletedStudent = await Student.updateOne(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent)
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');

    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser)
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user ');

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
  }
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
};
