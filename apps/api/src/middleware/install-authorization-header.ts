// install authorization header from the access_token cookie
import { Request, Response, NextFunction, Express } from "express";

const middleware = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.access_token;
  if (accessToken) {
    req.headers.authorization = `Bearer ${accessToken}`;
  }
  next();
};

export const installAuthorizationHeader = (app: Express) => {
  app.use(middleware);
};
