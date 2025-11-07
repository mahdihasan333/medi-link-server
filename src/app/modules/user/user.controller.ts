import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import pick from "../../helper/pick";

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createPatient(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Patient created successfully!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  // page, limit, sortBy, sortOrder - pagination, sorting
  // fields, searchTerm - searching, filtering
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);


  const {page, limit, searchTerm, sortBy, sortOrder, role, status} = req.query;
  const result = await UserService.allUserFromDB({page: Number(page), limit: Number(limit), searchTerm, sortBy, sortOrder, role, status});

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All users retrieved successfully!",
    data: result,
  });
});



export const UserController = {
  createPatient,
  getAllFromDB
};
