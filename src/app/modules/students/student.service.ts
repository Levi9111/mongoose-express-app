import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Student } from './student.model';
import { User } from '../user/usetr.model';
import mongoose from 'mongoose';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constants';

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  /*
  const studentSearchableFields = ['email', 'name.firstName', 'presentAddress'];
  let searchTerm = '';
  const queryObj = { ...query };

  if (query?.searchTerm) searchTerm = query?.searchTerm as string;

  const searchQuery = Student.find({
    $or: studentSearchableFields.map(field => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    })),
  });

  // filtering
  const excludedFields = ['searchTerm', 'sort', 'page', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  const filteredQuery = searchQuery
    .find(queryObj)
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

  // sorting
  let sort = '-createdAt';

  if (query?.sort) sort = query?.sort as string;

  const sortedQuery = filteredQuery.sort(sort);

  // limiting
  let page = 1;
  let limit = 10;
  let skip = 0;
  if (query.limit) limit = Number(query.limit);

  if (query.page) {
    page = Number(query.page);
    skip = (page - 1) * limit;
  }

  const paginatedQuery = sortedQuery.skip(skip);

  const limitedQuery = paginatedQuery.limit(limit);

  // field limiting
  let fields = '-__v';
  if (query.fields) fields = (query.fields as string).split(',').join(' '); //fields:name,email ---> fields:name email

  const fieldQuery = await limitedQuery.select(fields);

  return fieldQuery;

  */

  const studentQuery = new QueryBuilder(
    Student.find()
      .populate('user')
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery;

  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

  // const result = await Student.aggregate([{ $match: { id: id } }]);

  return result;
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });

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
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
  }
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB,
};
