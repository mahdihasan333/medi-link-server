import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import pick from "../../helper/pick";
import { userFilterableFields } from "./user.contant";

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createPatient(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Patient created successfully!",
    data: result,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createPatient(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admin created successfully!",
    data: result,
  })
})


// Create Doctor
const createDoctor = catchAsync(async(req: Request, res: Response) => {
  const result = await UserService.createPatient(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctor created successfully!",
    data: result,
  })
})

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  // page, limit, sortBy, sortOrder - pagination, sorting
  // fields, searchTerm - searching, filtering
  const filter = pick(req.query, userFilterableFields);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);


  const result = await UserService.allUserFromDB(filter, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All users retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});



export const UserController = {
  createPatient,
  getAllFromDB
};
