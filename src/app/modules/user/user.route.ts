import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './user.controller';

const router = express.Router();

const guardMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(`Guard middleware`);
  next();
};

router.post('/create-student', guardMiddleware, UserControllers.createStudent);

export const UserRoutes = router;
