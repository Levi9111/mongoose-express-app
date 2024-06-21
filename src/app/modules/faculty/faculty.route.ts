import express from 'express';
import { FacultyControllers } from './faculty.controller';

const router = express.Router();

router.get('/', FacultyControllers.getAllFaculties);

router.get('/:facultyId', FacultyControllers.getSingleFaculty);

router.patch('/:facultyId', FacultyControllers.updateAFaculty);

router.delete('/:facultyId', FacultyControllers.deleteAFaculty);

export const FacultyRoutes = router;
