import cors from "cors";
import { Express } from "express";

const isDev = process.env.NODE_ENV === "development";
export const installCors = (app: Express) => {
  isDev
    ? // allow any origin in dev
      app.use(cors({ origin: true, credentials: true }))
    : app.use(
        cors({
          origin: [
            "https://soongo-site-git-development-grinn-tech.vercel.app/",
            // regexp for canto + anything + 'vercel.app'
            /https:\/\/soongo.*.vercel.app$/,
            //  <anything>.grinn.tech
            /https:\/\/.*.grinn.tech$/,
            /https:\/\/.*.soongo.com$/,
            /grandetable:\/\/.*/,
          ],
          credentials: true,
        }),
      );
};

//<project-name>-<unique-hash>-<scope-slug>.vercel.app
