import config from '../../config';
import { TStudent } from '../students/student.interface';
import { Student } from '../students/student.model';
import { TUser } from './user.interface';
import { User } from './usetr.model';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  // create a  user object
  const userData: Partial<TUser> = {};

  // if password is not given, use default password

  userData.password = password || (config.default_password as string);

  // set student role
  userData.role = 'student';

  // set manually generated id
  userData.id = '203010001';

  // create a user
  const newUser = await User.create(userData);

  // create a student
  if (Object.keys(newUser).length) {
    // set id , _id as user
    studentData.id = newUser.id; // Embadded id
    studentData.user = newUser._id; // Referencing _id

    const newStudentData = await Student.create(studentData);

    return newStudentData;
  }
};

export const UserServices = {
  createStudentIntoDB,
};
