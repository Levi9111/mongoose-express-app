import { z } from 'zod';

const createUserNameValidationSchema = z.object({
  firstName: z
    .string({
      required_error: 'First Name is required',
    })
    .min(1, { message: 'First Name must be at least 1 character' })
    .max(20, { message: 'First Name cannot exceed 20 characters' })
    .trim()
    .refine(value => /^[A-Z]/.test(value), {
      message: 'First Name must start with a capital letter',
    }),
  middleName: z.string().trim().optional(),
  lastName: z
    .string({
      required_error: 'Last Name is required',
    })
    .trim(),
});

const updateUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First Name must be at least 1 character' })
    .max(20, { message: 'First Name cannot exceed 20 characters' })
    .trim()
    .refine(value => /^[A-Z]/.test(value), {
      message: 'First Name must start with a capital letter',
    })
    .optional(),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
});

const createGuardianValidationSchema = z.object({
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

const updateGuardianValidationSchema = z.object({
  fatherName: z.string().trim().optional(),
  fatherOccupation: z.string().trim().optional(),
  fatherContactNo: z.string().trim().optional(),

  motherName: z.string().trim().optional(),
  motherOccupation: z.string().trim().optional(),
  motherContactNo: z.string().trim().optional(),
});

const createLocalGuardianValidationSchema = z.object({
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

const updateLocalGuardianValidationSchema = z.object({
  name: z.string().trim().optional(),
  occupation: z.string().trim().optional(),
  contactNo: z.string().trim().optional(),

  address: z.string().trim().optional(),
});

const createStudentValidationSchema = z.object({
  body: z.object({
    password: z
      .string({
        required_error: 'Password is required',
      })
      .max(20),
    student: z.object({
      name: createUserNameValidationSchema.required(),
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
      guardian: createGuardianValidationSchema.required(),
      localGuardian: createLocalGuardianValidationSchema.required(),
      admissionSemester: z.string(),
      academicDepartment: z.string(),
      profileImg: z.string().optional(),
    }),
  }),
});

const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: updateUserNameValidationSchema,
      gender: z.enum(['male', 'female', 'other']).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email('Invalid email format').trim().optional(),
      contactNo: z.string().trim().optional(),
      emergencyContactNo: z.string().trim().optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().trim().optional(),
      permanentAddress: z.string().trim().optional(),
      guardian: updateGuardianValidationSchema.optional(),
      localGuardian: updateLocalGuardianValidationSchema.optional(),
      admissionSemester: z.string().optional(),
      academicDepartment: z.string().optional(),
      profileImg: z.string().optional(),
    }),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
