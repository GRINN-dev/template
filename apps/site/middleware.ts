import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { decodeJwt } from "jose";

export default async function middleware(request: NextRequest) {
  // A list of all locales that are supported
  const response = NextResponse.next();
  const accessToken = request.cookies.get("access_token");
  const refresh_token = request.cookies.get("refresh_token");

  // checks if access_token is expired
  if (refresh_token?.value) {
    const accessTokenPayload = accessToken?.value
      ? (decodeJwt(accessToken.value) as { exp: number })
      : null;
    if (!accessTokenPayload || accessTokenPayload.exp * 1000 < Date.now()) {
      const jo = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/access_token`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ refresh_token: refresh_token.value }),
        },
      );
      const res = (await jo.json()) as {
        access_token: string;
        refresh_token: string;
        ok: boolean;
      };
      console.log(res);
      if (res.ok) {
        response.cookies.set("access_token", res?.access_token, {
          httpOnly: true,
          path: "/",
          sameSite: "none",
          secure: true,
          domain: process.env.DOMAIN,
          expires: new Date(Date.now() + 1000 * 60 * 15),
        });

        response.cookies.set("refresh_token", res?.refresh_token, {
          httpOnly: true,
          path: "/",
          sameSite: "none",
          secure: true,
          domain: process.env.DOMAIN,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        });

        response.headers.set("access_token", res?.access_token);
        response.headers.set("refresh_token", res?.refresh_token);
      }
    }
  }

  return response;
}
