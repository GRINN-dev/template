import { cookies } from "next/headers";
import { HttpLink } from "@apollo/client";
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from "@apollo/experimental-nextjs-app-support";

const nextCookies = cookies();
const accessToken = nextCookies.get("access_token");
export const { getClient, query } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      // this needs to be an absolute url, as relative urls cannot be used in SSR
      uri: "http://localhost:8080/graphql",
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
