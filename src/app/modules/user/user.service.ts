import bcrypt from "bcryptjs";
import { prisma } from "../../shared/prisma";
import { Request } from "express";
import { fileUploader } from "../../helper/fileUploader";
import { PaginationHelper } from "../../helper/paginationHelper";
import { Prisma } from "@prisma/client";
import { userSearchableFields } from "./user.contant";

const createPatient = async (req: Request) => {

  if(req.file){
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    req.body.patient.profilePhoto = uploadResult?.secure_url
  }

  const hashPassword = await bcrypt.hash(req.body.password, 10);

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.patient.email,
        password: hashPassword,
      },
    });

    return await tnx.patient.create({
      data: req.body.patient
    });
  });
  return result;
};

const allUserFromDB = async (params: any, options: any) => {
  const {page, limit, skip, sortBy, sortOrder} = PaginationHelper.calculatePagination(options);
  const {searchTerm, ...filterData} = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  if(searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map(field => ({
        [field] : {
          contains: searchTerm,
          mode: "insensitive"
        }
      }))
    })
  }
  
  const result = await prisma.user.findMany({
    skip,
    take: limitNumber,

    where: {
      email: {
        contains: searchTerm,
        mode: 'insensitive'
      },
      status: status,
      role: role
    },


    orderBy: sortBy && sortOrder ? {
      [sortBy]: sortOrder
    } : {
      createdAt: "asc"
    }
  });
  return result;
}

export const UserService = {
  createPatient,
  allUserFromDB
};
