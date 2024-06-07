import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { StudentsRoutes } from '../modules/students/student.route';
import { AcademicSemisterRoutes } from '../modules/academicSemister/academicSemister.route';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/students',
    route: StudentsRoutes,
  },
  {
    path: '/academic-semisters',
    route: AcademicSemisterRoutes,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
