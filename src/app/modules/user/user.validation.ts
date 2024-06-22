import { z } from 'zod';

const userValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'Password must be string',
    })
    .max(50, { message: 'Password cannot be more than 50 characters`' })
    .optional(),
});

export const UserValidation = {
  userValidationSchema,
};
