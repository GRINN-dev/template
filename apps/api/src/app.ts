import type { Express } from "express";
import type { Server } from "http";
import cookieParser from "cookie-parser";
import express from "express";

import * as middleware from "./middleware";

// Server may not always be supplied, e.g. where mounting on a sub-route
export function getHttpServer(app: Express) {
  return (app.get("httpServer") as Server | undefined) ?? null;
}

export async function makeApp({
  httpServer,
}: {
  httpServer?: Server;
} = {}): Promise<Express> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isDev = process.env.NODE_ENV === "development";

  /*
   * Our Express server
   */
  const app = express();

  /*
   * Getting access to the HTTP server directly means that we can do things
   * with websockets if we need to (e.g. GraphQL subscriptions).
   */
  app.set("httpServer", httpServer);

  /*
   * Middleware is installed from the /server/middleware directory. These
   * helpers may augment the express app with new settings and/or install
   * express middleware. These helpers may be asynchronous, but they should
   * operate very rapidly to enable quick as possible server startup.
   */
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  middleware.installLogging(app);
  middleware.installAuthorizationHeader(app);
  middleware.installCors(app);
  middleware.installDatabasePools(app);
  await middleware.installPostGraphile(app);
  middleware.installRefreshTokenRotation(app);

  // This is our asset uploader
  middleware.installUploads(app);

  // These are our assets: images/etc; served out of the /@app/server/public folder (if present)
  middleware.installSharedStatic(app);

  /*
   * Error handling middleware
   */
  middleware.installErrorHandler(app);

  return app;
}
