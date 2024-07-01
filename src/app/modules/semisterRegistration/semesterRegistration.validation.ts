import { number, object, string, z } from 'zod';
import { SemesterRegistrationStatus } from './semesterRegistration.constant';

const createSemesterRegistrationValidationSchema = object({
  body: object({
    academicSemester: string(),
    status: z.enum([...(SemesterRegistrationStatus as [string, ...string[]])]),
    startDate: string().datetime(),
    endDate: string().datetime(),
    minCredit: number(),
    maxCredit: number(),
  }),
});

const updateSemesterRegistrationValidationSchema = object({
  body: object({
    academicSemester: string().optional(),
    status: z
      .enum([...(SemesterRegistrationStatus as [string, ...string[]])])
      .optional(),
    startDate: string().datetime().optional(),
    endDate: string().datetime().optional(),
    minCredit: number().optional(),
    maxCredit: number().optional(),
  }),
});

export const SemesterRegistrationValidations = {
  createSemesterRegistrationValidationSchema,
  updateSemesterRegistrationValidationSchema,
};
