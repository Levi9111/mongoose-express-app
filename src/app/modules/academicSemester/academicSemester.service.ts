import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { academicSemesterNameCodeMapper } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid Semester Code');
  }

  const result = await AcademicSemester.create(payload);

  return result;
};

const getAllSemestersFromDB = async () => {
  const result = await AcademicSemester.find();

  return result;
};

const getSingleAcacemicSemesterFromDB = async (id: string) => {
  const result = await AcademicSemester.findOne({ _id: id });

  return result;
};

const updateASemesterIntoDB = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  )
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid semester code');

  const result = await AcademicSemester.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllSemestersFromDB,
  getSingleAcacemicSemesterFromDB,
  updateASemesterIntoDB,
};
