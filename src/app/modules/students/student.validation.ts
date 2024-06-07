import { z } from 'zod';

const userNameValidationSchema = z.object({
  firstName: z
    .string({
      required_error: 'First Name is required',
    })
    .max(20, 'First Name cannot exceed 20 characters')
    .trim(),
  middleName: z.string().trim().optional(),
  lastName: z
    .string({
      required_error: 'Last Name is required',
    })
    .trim(),
});

const guardianValidationSchema = z.object({
  fatherName: z
    .string({
      required_error: "Father's Name is required",
    })
    .trim(),
  fatherOccupation: z
    .string({
      required_error: "Father's occupation is required",
    })
    .trim(),
  fatherContactNo: z
    .string({
      required_error: "Father's Contact Number is required",
    })
    .trim(),

  motherName: z
    .string({
      required_error: "Mother's Name is required",
    })
    .trim(),
  motherOccupation: z
    .string({
      required_error: "Mother's occupation is required",
    })
    .trim(),
  motherContactNo: z
    .string({
      required_error: "Mother's Contact Number is required",
    })
    .trim(),
});

const localGuardianValidationSchema = z.object({
  name: z
    .string({
      required_error: "Local Guardian's Name is required",
    })
    .trim(),
  occupation: z
    .string({
      required_error: "Local Guardian's occupation is required",
    })
    .trim(),
  contactNo: z
    .string({
      required_error: "Local Guardian's Contact Number is required",
    })
    .trim(),

  address: z
    .string({
      required_error: "Loacal Guardian's address is required",
    })
    .trim(),
});

const createStudentValidationSchema = z.object({
  body: z.object({
    password: z
      .string({
        required_error: 'Password is required',
      })
      .max(20),
    student: z.object({
      name: userNameValidationSchema.required(),
      gender: z.enum(['male', 'female', 'other'], {
        errorMap: issue => ({ message: `${issue} is not valid` }),
      }),
      dateOfBirth: z.string().optional(),
      email: z
        .string({
          required_error: 'Email is required',
        })
        .email('Invalid email format')
        .trim(),
      contactNo: z
        .string({
          required_error: 'Contact Number is required',
        })
        .trim(),
      emergencyContactNo: z
        .string({
          required_error: 'Emergency contact number is required',
        })
        .trim(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z
        .string({
          required_error: 'Present address is reqired',
        })
        .trim(),
      permanentAddress: z
        .string({
          required_error: 'Permanent address is reqired',
        })
        .trim(),
      guardian: guardianValidationSchema.required(),
      localGuardian: localGuardianValidationSchema.required(),
      admissionSemister: z.string(),
      profileImg: z.string().optional(),
    }),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
};
