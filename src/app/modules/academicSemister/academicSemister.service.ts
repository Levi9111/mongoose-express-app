import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { academicSemisterNameCodeMapper } from './academicSemister.constant';
import { TAcademicSemister } from './academicSemister.interface';
import { AcademicSemister } from './academicSemister.model';

const createAcademicSemisterIntoDB = async (payload: TAcademicSemister) => {
  if (academicSemisterNameCodeMapper[payload.name] !== payload.code) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid Semister Code');
  }

  const result = await AcademicSemister.create(payload);

  return result;
};

const getAllSemistersFromDB = async () => {
  const result = await AcademicSemister.find();

  return result;
};

const getSingleAcacemicSemisterFromDB = async (id: string) => {
  const result = await AcademicSemister.findOne({ _id: id });

  return result;
};

const updateASemisterIntoDB = async (
  id: string,
  payload: Partial<TAcademicSemister>,
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemisterNameCodeMapper[payload.name] !== payload.code
  )
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid semister code');

  const result = await AcademicSemister.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const AcademicSemisterServices = {
  createAcademicSemisterIntoDB,
  getAllSemistersFromDB,
  getSingleAcacemicSemisterFromDB,
  updateASemisterIntoDB,
};
