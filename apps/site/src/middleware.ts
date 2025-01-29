import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  // A list of all locales that are supported
  const response = NextResponse.next();
  const accessTokenExpiration = request.cookies.get("access_token_expiration");

  // checks if access_token is expired
  if (
    accessTokenExpiration?.value &&
    Number(accessTokenExpiration?.value) < Date.now()
  ) {
    console.log(accessTokenExpiration?.value);
    const freshTokenRequest = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_PROXY_URL}/access_token`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          refresh_token: request.cookies.get("refresh_token")?.value,
        }),
      },
    );
    const res = (await freshTokenRequest.json()) as {
      access_token: string;
      refresh_token: string;
      ok: boolean;
    };
    console.log(res);
    if (res.ok) {
      response.cookies.set("access_token", res?.access_token, {
        httpOnly: true,
        path: "/",
        sameSite: true,
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * 15),
      });

      response.cookies.set("refresh_token", res?.refresh_token, {
        httpOnly: true,
        path: "/",
        sameSite: true,
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      });
      response.cookies.set(
        "access_token_expiration",
        (Date.now() + 1000 * 60 * 15).toString(),
        {
          path: "/",
          sameSite: true,
          secure: true,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        },
      );
    }
  }

  return response;
}
