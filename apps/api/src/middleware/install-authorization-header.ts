// install authorization header from the access_token cookie
import type { Express, NextFunction, Request, Response } from "express";

const middleware = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.access_token as string | undefined;
  if (accessToken) {
    req.headers.authorization = `Bearer ${accessToken}`;
  }
  next();
};

export const installAuthorizationHeader = (app: Express) => {
  app.use(middleware);
};
