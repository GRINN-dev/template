import type { Express } from "express";
import { static as staticMiddleware } from "express";

export default (app: Express) => {
  app.use(staticMiddleware(`${__dirname}/../public`, { index: false }));
  app.use(staticMiddleware(`${__dirname}/../uploads`, { index: false }));
};
