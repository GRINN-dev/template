import { serialize } from "cookie";
import express from "express";
import jwtPkg, { JwtPayload } from "jsonwebtoken";

import { login } from "../utils/login";
import { getRootPgPool } from "./install-database-pools";

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
const { verify } = jwtPkg;
interface DbSession {
  uuid: string;
  user_id: string;
  created_at: Date;
  last_active: Date;
}
export const installGoogleOAuth = (app: express.Express) => {
  app.use(express.json());

  const rootPgPool = getRootPgPool(app);

  app.post("/api/auth/google", async (req, res) => {
    const { code } = req.body;
    let session: DbSession | undefined = undefined;

    try {
      // Exchange authorization code for tokens
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_OAUTH_CLIENT_ID!,
          client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
          redirect_uri: "http://localhost:3000/auth/register/callback",
          grant_type: "authorization_code",
        }),
      });

      const tokenData = await tokenResponse.json();
      const idToken = tokenData.id_token; // This can be used to validate the user

      // Fetch user profile using the access token
      const userResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        },
      );

      const userInfo = await userResponse.json();

      /**  // from here we want to:
       * 1. check is there is a current user, to link his google account to his existing account
       * 2. if there is no current user, we want to create a new user with the google account
       */

      /* we check the authorization header, if it has a valid accessToken, we wxtract the `sub` fromm the token and check if there is a matching session in the db to get the user id */
      const authorization = req.headers.authorization;
      if (authorization) {
        try {
          const token = authorization.split(" ")[1];
          const decoded = verify(token || "", process.env.ACCESS_TOKEN_SECRET!);
          const sessionId = decoded.sub;
          ({
            rows: [session],
          } = await rootPgPool.query<DbSession>(
            "select * from priv.sessions where uuid = $1",
            [sessionId],
          ));
          // we can use the sessionId to get the user id
        } catch (error) {
          // do nothing
        }
      }

      const {
        rows: [user],
      } = await rootPgPool.query(
        `select * from priv.link_or_register_user($1, $2, $3, $4, $5)`,
        [
          session ? session.user_id : null,
          "google",
          userInfo.id,
          JSON.stringify({
            username: userInfo.username,
            avatar_url: userInfo.avatarUrl,
            email: userInfo.email,
            name: userInfo.displayName,
            ...userInfo.profile,
          }),
          JSON.stringify({
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            ...userInfo.auth,
          }),
        ],
      );
      if (!user || !user.id) {
        throw Object.assign(new Error("Registration failed"), {
          code: "FFFFF",
        });
      }
      if (!session) {
        ({
          rows: [session],
        } = await rootPgPool.query<DbSession>(
          `insert into priv.sessions (user_id) values ($1) returning *`,
          [user.id],
        ));
      }
      if (!session) {
        throw Object.assign(new Error("Failed to create session"), {
          code: "FFFFF",
        });
      }

      const { accessToken, refreshToken } = await login({
        payload: {
          sessionId: session.uuid,
          userId: session.user_id,
        },
        pool: rootPgPool,
        setCookie(input: { name: string; value: string; options?: any }[]) {
          if (res) {
            res.setHeader(
              "Set-Cookie",
              input.map((cookie) =>
                serialize(cookie.name, cookie.value, cookie.options),
              ),
            );
          }
        },
        at_secret: ACCESS_TOKEN_SECRET!,
        rt_secret: REFRESH_TOKEN_SECRET!,
      });

      // we can use the userId to link the google account to the user

      // Now you have the user profile, you can authenticate the user in your database
      // Check if the user exists in your database, if not, create a new user
      // Assuming a Postgres setup here
      // For example:
      // await db.query('INSERT INTO users (google_id, email, name) VALUES ($1, $2, $3) RETURNING *', [userInfo.id, userInfo.email, userInfo.name]);

      res.json({
        message: "Google login successful",
        user: userInfo,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error("Error exchanging code for tokens", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  });
};
