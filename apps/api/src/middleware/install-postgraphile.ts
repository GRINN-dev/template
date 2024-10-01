import { Express } from "express";
import { postgraphile } from "postgraphile";
import { grafserv } from "postgraphile/grafserv/express/v4";

import { getHttpServer } from "../app";
import { getPreset } from "../graphile.config";
import { getAuthPgPool, getRootPgPool } from "./install-database-pools";

export default async function installPostGraphile(app: Express) {
  const authPgPool = getAuthPgPool(app);
  const rootPgPool = getRootPgPool(app);
  const httpServer = getHttpServer(app);

  const pgl = postgraphile(
    getPreset({
      authPgPool,
      rootPgPool,
    }),
  );

  app.set("pgl", pgl);

  const serv = pgl.createServ(grafserv);
  serv.addTo(app, httpServer, false);
}
