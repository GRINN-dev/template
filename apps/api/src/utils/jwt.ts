import type { SerializeOptions } from "cookie";
import type { IncomingMessage, ServerResponse } from "http";
import { serialize } from "cookie";
import { sign } from "jsonwebtoken";

export const signToken = (
  payload: { sub: string; sid?: string },
  pgJwtSignOptions: {
    audience?: string;
    issuer?: string;
    expiresIn?: string;
  },
  secret: string,
) => {
  const defaultOptions = {
    audience: "postgraphile",
    issuer: "postgraphile",
    expiresIn: "15 minutes",
  };
  return sign(payload, secret, {
    ...defaultOptions,
    ...pgJwtSignOptions,
  });
};

export function createAccessToken({
  userId,
  sessionId,
}: {
  userId: string;
  sessionId: string;
}) {
  return signToken(
    { sub: userId, sid: sessionId },
    { expiresIn: "15 minutes" },
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.ACCESS_TOKEN_SECRET!,
  );
}

export function createRefreshToken({
  userId,
  sessionId,
}: {
  userId: string;
  sessionId: string;
}) {
  return signToken(
    { sub: userId, sid: sessionId },
    { expiresIn: "7 days" },
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.REFRESH_TOKEN_SECRET!,
  );
}

export function createTokensAndSetCookies({
  userId,
  sessionId,
  setCookies,
}: {
  userId: string;
  sessionId: string;
  setCookies: (
    cookies: { name: string; value: string; options: SerializeOptions }[],
  ) => void;
}) {
  const accessToken = createAccessToken({ userId, sessionId });
  const refreshToken = createRefreshToken({ userId, sessionId });

  // Set cookies
  setCookies([
    {
      name: "access_token",
      value: accessToken,
      options: {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        expires: new Date(Date.now() + 15 * 60 * 1000), // 7 days
      },
    },
    {
      name: "refresh_token",
      value: refreshToken,
      options: {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    },
    // this third cookie is available to the client and helps indicate that a token refresh is necessary
    {
      name: "access_token_expiration",
      value: (Date.now() + 1000 * 60 * 15).toString(),
      options: {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        secure: true,
        sameSite: true,
      },
    },
  ]);

  return { accessToken, refreshToken };
}

export function setCookies(
  cookies: { name: string; value: string; options?: SerializeOptions }[],
  res?: ServerResponse<IncomingMessage>,
) {
  if (res) {
    const existingCookies = res.getHeader("Set-Cookie") ?? [];
    const newCookies = cookies.map((cookie) =>
      serialize(cookie.name, cookie.value, cookie.options),
    );

    const updatedCookies = Array.isArray(existingCookies)
      ? existingCookies
          .filter((existingCookie) => {
            const existingName = existingCookie.split("=")[0];
            return !cookies.some((cookie) => cookie.name === existingName);
          })
          .concat(newCookies)
      : newCookies;

    res.setHeader("Set-Cookie", updatedCookies);
  }
}
