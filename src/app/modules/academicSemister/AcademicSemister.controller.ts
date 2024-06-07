import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { AcademicSemisterServices } from './academicSemister.service';

const createAcademicSemister = catchAsync(async (req, res) => {
  const result = await AcademicSemisterServices.createAcademicSemisterIntoDB(
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semister is created successfully',
    data: result,
  });
});

const getAllSemisters = catchAsync(async (req, res) => {
  const result = await AcademicSemisterServices.getAllSemistersFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Academic Semisters retrieved successfully',
    data: result,
  });
});

const getSingleAcademicSemister = catchAsync(async (req, res) => {
  const { semisterId } = req.params;

  const result =
    await AcademicSemisterServices.getSingleAcacemicSemisterFromDB(semisterId);

  console.log({ semisterId }, { result });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semister retrieved successfully',
    data: result,
  });
});

const updateASemister = catchAsync(async (req, res) => {
  const { semisterId } = req.params;

  const result = await AcademicSemisterServices.updateASemisterIntoDB(
    semisterId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semister updated successfully',
    data: result,
  });
});

export const AcademicSemisterControllers = {
  createAcademicSemister,
  getAllSemisters,
  getSingleAcademicSemister,
  updateASemister,
};
