import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentValdations } from './academicDepartment.validation';
import { AcademicDepartmentControllers } from './academicDepartment.controller';

const router = Router();

router.post(
  '/create-academic-department',
  // validateRequest(
  //   AcademicDepartmentValdations.createAcademicDepartmentValidationSchema,
  // ),
  AcademicDepartmentControllers.createAcademicDepartment,
);

router.get('/', AcademicDepartmentControllers.getAllAcademicDepartments);

router.get(
  '/:departmentId',
  AcademicDepartmentControllers.getSingleAcademicDepartment,
);

router.patch(
  '/:departmentId',
  validateRequest(
    AcademicDepartmentValdations.updateAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.updateADepartment,
);

export const AcademicDepartmentRoutes = router;
