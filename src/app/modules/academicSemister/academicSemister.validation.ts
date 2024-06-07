import { z } from 'zod';
import {
  Months,
  academicSemisterCode,
  academicSemisterName,
} from './academicSemister.constant';

const createAcademicSemisterValidationSchema = z.object({
  body: z.object({
    name: z.enum([...academicSemisterName] as [string, ...string[]]),
    year: z.string(),
    code: z.enum([...academicSemisterCode] as [string, ...string[]]),
    startMonth: z.enum([...Months] as [string, ...string[]]),
    endMonth: z.enum([...Months] as [string, ...string[]]),
  }),
});

export const AcademicSemisterValidations = {
  createAcademicSemisterValidationSchema,
};
