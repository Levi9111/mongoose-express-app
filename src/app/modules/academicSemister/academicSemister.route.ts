import express from 'express';
import { AcademicSemisterControllers } from './AcademicSemister.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemisterValidations } from './academicSemister.validation';

const router = express.Router();

router.post(
  '/create-academic-semister',
  validateRequest(
    AcademicSemisterValidations.createAcademicSemisterValidationSchema,
  ),
  AcademicSemisterControllers.createAcademicSemister,
);

router.get('/', AcademicSemisterControllers.getAllSemisters);

router.get(
  '/:semisterId',
  AcademicSemisterControllers.getSingleAcademicSemister,
);

router.patch('/:semisterId', AcademicSemisterControllers.updateASemister);

export const AcademicSemisterRoutes = router;
