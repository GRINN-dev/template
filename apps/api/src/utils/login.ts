import type { Pool } from "pg";

import { signToken } from "./signToken";

interface LoginInput {
  payload: { sessionId: string; userId: string };
  setCookie: (
    cookies: {
      name: string;
      value: string;
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      options?: import("cookie").CookieSerializeOptions | undefined;
    }[],
  ) => void;
  pool: Pool;
  at_secret: string;
  rt_secret: string;
}
export async function login({
  payload: { sessionId, userId },
  pool,
  setCookie,
  at_secret,
  rt_secret,
}: LoginInput) {
  // create the tokens
  const accessToken = signToken(
    { sub: sessionId },
    { expiresIn: "30 days" },
    at_secret,
  );
  const refreshToken = signToken(
    { sub: sessionId },
    { expiresIn: "7 days" },
    rt_secret,
  );

  // update the session in the db with the new refresh token
  await pool.query(
    `UPDATE priv.sessions SET refresh_token = $1 WHERE uuid = $2`,
    [refreshToken, sessionId],
  );

  // send the token via cookie
  setCookie([
    {
      name: "refresh_token",
      value: refreshToken,
      options: {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        //domain: process.env.DOMAIN, // this is to limit our cookie to our domain, so the tokens are not sent to other domains like third party APIs,
        ...(process.env.DOMAIN === "localhost"
          ? {}
          : { domain: process.env.DOMAIN }),
        secure: true, // this is to ensure that the cookie is only sent over https
        httpOnly: true, // this is to ensure that the cookie is not accessible via javascript
        sameSite: "none", // this is to ensure that the cookie is sent on cross-origin requests
      },
    },
    {
      name: "access_token",
      value: accessToken,
      options: {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 15),
        ...(process.env.DOMAIN === "localhost"
          ? {}
          : { domain: process.env.DOMAIN }),
        secure: true,
        sameSite: "none",
      },
    },
  ]);

  return { accessToken, refreshToken };
}
