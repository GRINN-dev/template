import type { Express } from "express";
import cors from "cors";

const isDev = process.env.NODE_ENV === "development";
export const installCors = (app: Express) => {
  if (isDev) {
    app.use(cors({ origin: true, credentials: true }));
  } else {
    app.use(
      cors({
        origin: [
          //  <anything>.grinn.tech
          /https:\/\/.*.grinn.tech$/,
        ],
        credentials: true,
      }),
    );
  }
};

//<project-name>-<unique-hash>-<scope-slug>.vercel.app
