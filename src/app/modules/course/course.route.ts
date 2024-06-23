import { Router } from 'express';
import { CourseValidations } from './course.validation';
import { CourseControllers } from './course.controller';
import validateRequest from '../../middlewares/validateRequest';

const router = Router();

router.post(
  '/create-course',
  validateRequest(CourseValidations.createCourseValidationSchema),

  CourseControllers.createCourse,
);

router.put(
  '/:courseId/assign-faculties',
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesWithCourse,
);

router.delete(
  '/:courseId/remove-faculties',
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesFromCourse,
);

router.get('/', CourseControllers.getAllCourses);

router.get('/:id', CourseControllers.getSingleCoureses);

router.patch(
  '/:id',
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateACourse,
);
router.delete('/:id', CourseControllers.deleteCourse);

export const CoursesRoutes = router;
