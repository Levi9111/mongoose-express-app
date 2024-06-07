import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { StudentsRoutes } from '../modules/students/student.route';
import { AcademicSemisterRoutes } from '../modules/academicSemister/academicSemister.route';

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
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

/*router.use('/users', UserRoutes);
router.use('/students', StudentsRoutes);
*/
export default router;
