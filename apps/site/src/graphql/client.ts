import { ApolloLink, HttpLink } from "@apollo/client";
import {
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";
import { TokenRefreshLink } from "apollo-link-token-refresh";

const refreshTokenLink = new TokenRefreshLink({
  accessTokenField: "accessToken",
  isTokenValidOrUndefined: async () => {
    const rawExpDate = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token_expiration"))
      ?.split("=")[1];
    return Date.now() < Number(rawExpDate) || !rawExpDate;
  },
  fetchAccessToken: async () => {
    return fetch(`${process.env.NEXT_PUBLIC_SERVER_PROXY_URL}/access_token`, {
      method: "POST",
      credentials: "include",
    });
  },

  handleFetch: (access_token) => {
    console.log("handleFetch", access_token);
  },
  handleError: (err) => {
    console.warn("Your refresh token is invalid. Please try re-logging in.");
    console.warn(err);
  },
});

const httpLink = new HttpLink({
  uri: "/graphql",
  credentials: "include",
  fetchOptions: { cache: "no-store" },
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([refreshTokenLink, httpLink]),
});

export const { getClient, query } = {
  getClient: () => client,
  query: client.query,
};
