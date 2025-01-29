import type { SerializeOptions } from "cookie";
import type { Express, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { serialize } from "cookie";
import jwtPkg from "jsonwebtoken";

import { createTokensAndSetCookies } from "../utils/jwt";
import { getRootPgPool } from "./install-database-pools";

const { verify } = jwtPkg;

export const installRefreshTokenRotation = (app: Express) => {
  const { REFRESH_TOKEN_SECRET } = process.env;

  app.post("/access_token", async (req: Request, res: Response) => {
    const rootPgPool = getRootPgPool(app);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const refreshToken: string | undefined =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      req.cookies.refresh_token ?? req.body?.refresh_token;
    if (refreshToken) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const payload = verify(refreshToken, REFRESH_TOKEN_SECRET!, {
          algorithms: ["HS256"],
        }) as JwtPayload;
        // user lookup - if user was deleted, they no longer get a token
        const { rows } = await rootPgPool.query<{
          session_id: string;
          sub: string;
        }>(
          ` SELECT uuid as session_id, user_id AS sub FROM priv.sessions 
          WHERE uuid = $1 and refresh_token = $2
          LIMIT 1
          `,
          [payload.sid, refreshToken],
        );
        console.log(rows);

        if (rows[0]) {
          const { sub, session_id } = rows[0];
          // go ahead and refresh refresh token while we're here
          const { accessToken, refreshToken: newRefreshToken } =
            createTokensAndSetCookies({
              userId: sub,
              sessionId: session_id,

              setCookies: (
                input: {
                  name: string;
                  value: string;
                  options?: SerializeOptions;
                }[],
              ) => {
                res.setHeader(
                  "Set-Cookie",
                  input.map((cookie) =>
                    serialize(cookie.name, cookie.value, cookie.options),
                  ),
                );
              },
            });

          // we update the session with the new refresh token

          await rootPgPool.query(
            ` UPDATE priv.sessions
              SET refresh_token = $1,
              ip_address = $3,
              user_agent = $4
              WHERE uuid = $2
            `,
            [newRefreshToken, session_id, req.ip, req.headers["user-agent"]],
          );

          res.send({
            ok: true,
            access_token: accessToken,
            refresh_token: newRefreshToken,
          });
          return;
        }
      } catch (err) {
        console.error(err);
        res
          .status(401)
          .send({ ok: false, access_token: "", refresh_token: "" });
        return;
      }
    }

    res.send({ ok: false, access_token: "", refresh_token: "" });
    return;
  });
};
