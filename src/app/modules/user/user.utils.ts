import { TAcademicSemister } from '../academicSemister/academicSemister.interface';
import { User } from './usetr.model';

const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastStudent?.id ? lastStudent.id : undefined;
};

export const generateStudentId = async (payload: TAcademicSemister) => {
  let currentId = (0).toString();
  // 2027 01 0004
  const lastStudentId = await findLastStudentId();
  const lastStudentSemisterCode = lastStudentId?.substring(4, 6);
  const lastStudentSemisterYear = lastStudentId?.substring(0, 4);
  const currentStudentSemisterCode = payload.code;
  const currentStudentSemisterYear = payload.year;

  if (
    lastStudentId &&
    lastStudentSemisterCode === currentStudentSemisterCode &&
    lastStudentSemisterYear === currentStudentSemisterYear
  ) {
    currentId = lastStudentId.substring(6);
  }
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `${payload.year}${payload.code}${incrementId}`;

  return incrementId;
};

export const findLastFacultyId = async () => {
  const lastFaculty = await User.findOne(
    {
      role: 'faculty',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined;
};

export const generateFacultyId = async () => {
  let currentId = (0).toString();
  const lastFacultyId = await findLastFacultyId();

  if (lastFacultyId) {
    currentId = lastFacultyId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `F-${incrementId}`;

  return incrementId;
};

export const findLastAdminId = async () => {
  const lastAdmin = await User.findOne(
    {
      role: 'admin',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastAdmin?.id ? lastAdmin.id : undefined;
};

export const generateAdminId = async () => {
  const lastAdminId = await findLastAdminId();
  let currentId = '0';
  if (lastAdminId) {
    currentId = lastAdminId.substring(2);
  }
  const generatedId = `A-${(+currentId + 1).toString().padStart(4, '0')}`;

  return generatedId;
};
