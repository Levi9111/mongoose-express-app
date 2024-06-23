import { array, boolean, number, object, string, z } from 'zod';

const PreRequisiteCourseValidationSchema = object({
  course: string(),
  isDeleted: boolean().optional(),
});

const createCourseValidationSchema = object({
  body: object({
    title: string(),
    prefix: string(),
    code: number(),
    credits: number(),
    isDeleted: boolean().optional(),
    preRequisiteCourses: array(PreRequisiteCourseValidationSchema).optional(),
  }),
});

const updatePreRequisiteCourseValidationSchema = object({
  course: string(),
  isDeleted: boolean().optional(),
});

const updateCourseValidationSchema = object({
  body: object({
    title: string().optional(),
    prefix: string().optional(),
    code: number().optional(),
    credits: number().optional(),
    isDeleted: boolean().optional(),
    preRequisiteCourses: array(
      updatePreRequisiteCourseValidationSchema,
    ).optional(),
  }),
});

const facultiesWithCourseValidationSchema = object({
  body: object({
    faculties: array(string()),
  }),
});

export const CourseValidations = {
  createCourseValidationSchema,
  updateCourseValidationSchema,
  facultiesWithCourseValidationSchema,
};
