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

  if(Object.keys(filterData).length > 0){
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any) [key]
        }
      }))
    })
  }

  console.log(andConditions)

  const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? {
    AND: andConditions
  } : {};

  const result = await prisma.user.findMany({
    skip,
    take: limit,

    where: whereConditions,
    orderBy: {
      [sortBy] : sortOrder
    }
  })

  return result;
}

export const UserService = {
  createPatient,
  allUserFromDB
}
