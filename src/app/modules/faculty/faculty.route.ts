import express from 'express';
import { FacultyControllers } from './faculty.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', auth(), FacultyControllers.getAllFaculties);

router.get('/:facultyId', FacultyControllers.getSingleFaculty);

router.patch('/:facultyId', FacultyControllers.updateAFaculty);

router.delete('/:facultyId', FacultyControllers.deleteAFaculty);

export const FacultyRoutes = router;
