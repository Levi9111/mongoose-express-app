import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyValidation } from './academicFaculty.validation';
import { AcademicFacultyControllers } from './academicFaculty.controller';

const router = Router();

router.post(
  '/create-academic-faculty',
  validateRequest(
    AcademicFacultyValidation.createAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.createAcademicFaculty,
);

router.get('/', AcademicFacultyControllers.getAllAcademicFaculties);

router.get('/:facultyId', AcademicFacultyControllers.getSingleAcademicFaculty);

router.patch('/:facultyId', AcademicFacultyControllers.updateAFaculty);

export const AcademicFacultyRoutes = router;
