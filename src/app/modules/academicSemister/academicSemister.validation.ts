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

const updateAcademicSemisterValidationSchema = z.object({
  body: z.object({
    name: z.enum([...academicSemisterName] as [string, ...string[]]).optional(),
    year: z.string().optional(),
    code: z.enum([...academicSemisterCode] as [string, ...string[]]).optional(),
    startMonth: z.enum([...Months] as [string, ...string[]]).optional(),
    endMonth: z.enum([...Months] as [string, ...string[]]).optional(),
  }),
});

export const AcademicSemisterValidations = {
  createAcademicSemisterValidationSchema,
  updateAcademicSemisterValidationSchema,
};
