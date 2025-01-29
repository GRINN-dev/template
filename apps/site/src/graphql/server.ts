import { cookies } from "next/headers";
import { HttpLink } from "@apollo/client";
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from "@apollo/experimental-nextjs-app-support";

export const { getClient, query } = registerApolloClient(async () => {
  const accessToken = (await cookies()).get("access_token");

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      // this needs to be an absolute url, as relative urls cannot be used in SSR
      uri:
        (process.env.NEXT_PUBLIC_SERVER_PROXY_URL || "http://localhost:3000") +
        "/graphql",
      credentials: "include",
      headers: {
        ...(accessToken?.value
          ? { Authorization: `Bearer ${accessToken?.value}` }
          : {}),
      },

      // you can disable result caching here if you want to
      // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
      fetchOptions: { cache: "no-store" },
    }),
  });
});
