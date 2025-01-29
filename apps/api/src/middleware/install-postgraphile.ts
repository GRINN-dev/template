import type { Express } from "express";
import { postgraphile } from "postgraphile";
import { grafserv } from "postgraphile/grafserv/express/v4";

import { getHttpServer } from "../app";
import { getPreset } from "../graphile.config";
import { getRootPgPool } from "./install-database-pools";

export default async function installPostGraphile(app: Express) {
  const httpServer = getHttpServer(app);
  const rootPgPool = getRootPgPool(app);
  const pgl = postgraphile(getPreset({ rootPgPool }));

  app.set("pgl", pgl);

  const serv = pgl.createServ(grafserv);
  await serv.addTo(app, httpServer, false);
}
