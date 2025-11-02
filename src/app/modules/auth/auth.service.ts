import { UserStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JwtHelper } from "../../helper/jwtHelper";
import config from "../../../config";

const login = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    user.password
  );
  if (!isCorrectPassword) {
    throw new Error("Password is incorrect");
  }

  //   const accessToken = JwtHelper.generateToken({email: user.email, role: user.role}, config.jwt.access_token_secret, config.jwt.access_token_expiration)

  // const refreshToken = JwtHelper.generateToken({email: user.email, role: user.role}, config.jwt.refresh_token_secret, config.jwt.refresh_token_expiration)


  const accessToken = JwtHelper.generateToken(
    { email: user.email, role: user.role },
    "abcd",
    "15m"
  );

  const refreshToken = JwtHelper.generateToken(
    { email: user.email, role: user.role },
    "abcd",
    "15m"
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

export const AuthService = {
  login,
};
