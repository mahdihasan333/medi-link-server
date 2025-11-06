import bcrypt from "bcryptjs";
import { prisma } from "../../shared/prisma";
import { Request } from "express";
import { fileUploader } from "../../helper/fileUploader";

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

const allUserFromDB = async ({page, limit, searchTerm, sortBy, sortOrder, role, status}: {page: number, limit: number, searchTerm?: any, sortBy?: any, sortOrder?: any, role?: any, status?: any}) => {
  const pageNumber = page || 1;
  const limitNumber = limit || 10;
  const skip = (pageNumber - 1) * limitNumber;
  console.log(page, limit)
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


    
  });
  return result;
}

export const UserService = {
  createPatient,
  allUserFromDB
};
