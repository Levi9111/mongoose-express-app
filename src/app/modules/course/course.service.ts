import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { CourseSearchableFields } from './course.constant';
import { TCourse, TCourseFaculty } from './course.interface';
import { Course, courseFaculty } from './course.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await courseQuery.modelQuery;

  return result;
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  );

  return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...courseRemainingData } = payload;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //   step 1: update basic course information

    const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseRemainingData,
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!updatedBasicCourseInfo)
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to update course information',
      );

    //   check if there is any preRequisite courses to update
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      // filter out the deleted fields
      const deletedPreRequisites = preRequisiteCourses
        .filter(el => el.course && el.isDeleted)
        .map(el => el.course);

      const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisites } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!deletedPreRequisiteCourses)
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to update course information',
        );

      //   filter out the new course fields
      const newPreRequisites = preRequisiteCourses?.filter(
        el => el.course && !el.isDeleted,
      );

      const newPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!newPreRequisiteCourses)
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to update course information',
        );
    }

    const result = await Course.findById(id).populate(
      'preRequisiteCourses.course',
    );

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to update course information',
    );
  }
};

const deleteCoursesFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

const assignFacultiesWithCourseIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await courseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    },
  );

  return result;
};

const removeFacultiesFromCourseFromDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await courseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: {
        faculties: {
          $in: payload,
        },
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  updateCourseIntoDB,
  deleteCoursesFromDB,
  assignFacultiesWithCourseIntoDB,
  removeFacultiesFromCourseFromDB,
};
