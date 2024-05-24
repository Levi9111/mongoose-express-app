import Joi from 'joi';

// JOI validation
const userNameValidationSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .max(20)
    .regex(/^[A-Z][a-zA-Z]*$/, 'capitalized format')
    .required()
    .messages({
      'string.empty': 'First Name is required',
      'string.max': 'Name cannot exceed 20 characters',
      'string.pattern.name': '{#label} is not in capitalized format',
    }),
  middleName: Joi.string().trim().optional(),
  lastName: Joi.string()
    .trim()
    .regex(/^[a-zA-Z]+$/, 'alpha')
    .required()
    .messages({
      'string.empty': 'Last Name is required',
      'string.pattern.name': '{#label} contains non-alphabetic characters',
    }),
});

// Guardian Schema
const guardianValidationSchema = Joi.object({
  fatherName: Joi.string().trim().required().messages({
    'string.empty': "Father's Name is required",
  }),
  fatherOccupation: Joi.string().trim().required().messages({
    'string.empty': "Father's Occupation is required",
  }),
  fatherContactNo: Joi.string().trim().required().messages({
    'string.empty': "Father's Contact Number is required",
  }),
  motherName: Joi.string().trim().required().messages({
    'string.empty': "Mother's Name is required",
  }),
  motherOccupation: Joi.string().trim().required().messages({
    'string.empty': "Mother's Occupation is required",
  }),
  motherContactNo: Joi.string().trim().required().messages({
    'string.empty': "Mother's Contact Number is required",
  }),
});

// Local Guardian Schema
const localGuardianValidationSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': "Local Guardian's Name is required",
  }),
  occupation: Joi.string().trim().required().messages({
    'string.empty': "Local Guardian's Occupation is required",
  }),
  contactNo: Joi.string().trim().required().messages({
    'string.empty': "Local Guardian's Contact Number is required",
  }),
  address: Joi.string().trim().required().messages({
    'string.empty': "Local Guardian's Address is required",
  }),
});

// Student Schema
const studentValidationSchema = Joi.object({
  id: Joi.string().trim().required().messages({
    'string.empty': 'ID is required',
  }),
  name: userNameValidationSchema.required().messages({
    'object.base': 'Name is required',
  }),
  gender: Joi.string()
    .trim()
    .valid('male', 'female', 'other')
    .required()
    .messages({
      'string.empty': 'Gender is required',
      'any.only': '{#value} is not valid',
    }),
  dateOfBirth: Joi.string().trim().optional(),
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': '{#value} is not a valid email type',
  }),
  contactNo: Joi.string().trim().required().messages({
    'string.empty': 'Contact Number is required',
  }),
  emergencyContactNo: Joi.string().trim().required().messages({
    'string.empty': 'Emergency Contact Number is required',
  }),
  bloodGroup: Joi.string()
    .trim()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    .optional()
    .messages({
      'any.only': '{#value} is not a valid blood group',
    }),
  presentAddress: Joi.string().trim().required().messages({
    'string.empty': 'Present Address is required',
  }),
  permanentAddress: Joi.string().trim().required().messages({
    'string.empty': 'Permanent Address is required',
  }),
  guardian: guardianValidationSchema.required().messages({
    'object.base': 'Guardian information is required',
  }),
  localGuardian: localGuardianValidationSchema.required().messages({
    'object.base': 'Local Guardian information is required',
  }),
  profileImg: Joi.string().trim().optional(),
  isActive: Joi.string()
    .trim()
    .valid('active', 'blocked')
    .default('active')
    .messages({
      'any.only': '{#value} is not a valid status',
    }),
});

export default studentValidationSchema;
