import { Schema, model } from 'mongoose';
import { TAcademicSemister } from './academicSemister.interface';
import {
  Months,
  academicSemisterCode,
  academicSemisterName,
} from './academicSemister.constant';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const academicSemisterSchema = new Schema<TAcademicSemister>(
  {
    name: {
      type: String,
      required: true,
      enum: academicSemisterName,
    },
    code: {
      type: String,
      required: true,
      enum: academicSemisterCode,
    },
    year: {
      type: String,
      required: true,
    },
    startMonth: {
      type: String,
      enum: Months,
      required: true,
    },
    endMonth: {
      type: String,
      enum: Months,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// next here is a mongoose function not from express
academicSemisterSchema.pre('save', async function (next) {
  const isSemisterExists = await AcademicSemister.findOne({
    year: this.year,
    name: this.name,
  });

  if (isSemisterExists)
    throw new AppError(httpStatus.CONFLICT, 'Semister already exists');

  next();
});

export const AcademicSemister = model<TAcademicSemister>(
  'AcademicSemister',
  academicSemisterSchema,
);
