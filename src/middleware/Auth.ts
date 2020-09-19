import User, { UserDocument } from "../components/User/model/User";
import { verify } from "jsonwebtoken";
import { NextFunction } from "express";
import { sign } from "jsonwebtoken";

export const isAdmin = async (userId: string) => {
  const user = await User.findById(userId);
  return user?.role === "Admin";
};

export const handleToken = async (req: any, res: any, next: NextFunction) => {
  const accessToken = req.cookies["access-token"];
  const refreshToken = req.cookies["refresh-token"];
  if (!refreshToken && !accessToken) return next();

  // Check access-token
  try {
    const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as any;
    req.userId = data.userId;
    req.isAdmin = await isAdmin(data.userId);
    return next();
  } catch (err) {}

  // No refreshToken, must log in
  if (!refreshToken) return next();

  let data;
  try {
    data = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as any;
  } catch {
    return next();
  }

  const user = await User.findById(data.userId);

  if (!user) {
    return next();
  }

  const tokens = createTokens(user);

  res.cookie("refresh-token", tokens.refreshToken, { expiresIn: 60 * 60 * 24 * 7 });
  res.cookie("access-token", tokens.accessToken, { expiresIn: 60 * 15 });

  req.userId = data.userId;
  req.isAdmin = await isAdmin(data.userId);

  next();
};

export const createTokens = (user: UserDocument) => {
  const refreshToken = sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "7d",
  });

  const accessToken = sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "15m",
  });

  return { refreshToken, accessToken };
};
