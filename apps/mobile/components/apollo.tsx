import { Buffer } from "buffer";
import { Platform } from "react-native";
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { createPersistedQueryLink } from "@apollo/client/link/persisted-queries";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import { TadaPersistedDocumentNode } from "gql.tada";

import { getStoreItemAsync, setStoreItemAsync } from "@/utils/secure-store";

export const parseJWT = (token: string) => {
  try {
    const base64Payload = token.split(".")[1]; // Get the payload part
    const decodedPayload = Buffer.from(base64Payload, "base64").toString(
      "utf-8",
    ); // Decode from base64
    return JSON.parse(decodedPayload); // Parse to JSON
  } catch (error) {
    console.error("Invalid JWT:", error);
    return null;
  }
};
// import { createPersistedQueryLink } from "@apollo/client/link/persisted-queries";
// import { usePregeneratedHashes as withPregeneratedHashes } from "graphql-codegen-persisted-query-ids/lib/apollo";

// import hashes from "@grinn/codegen/persisted-query-ids/client.json";

function getApiUrl(url: string): string {
  return url.includes("localhost") && Platform.OS === "android"
    ? url.replace("localhost", "10.0.2.2")
    : url;
}

const API_URL = getApiUrl(
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080",
);

// const persistedLink = createPersistedQueryLink({
//   useGETForHashedQueries: false,
//   generateHash: withPregeneratedHashes(hashes),
//   disable: () => false,
// });

const persistedLink = createPersistedQueryLink({
  generateHash(document) {
    console.log("/n===========/nthe document:\n\n", document);
    return (document as TadaPersistedDocumentNode).documentId;
  },
  useGETForHashedQueries: false,
});

const refreshTokenLink = new TokenRefreshLink({
  accessTokenField: "tokens",
  isTokenValidOrUndefined: async () => {
    // get accesstoken from secure store and check if it is valid (date is not expired). If it is expired, return false, else return true. If there is no accesstoken, return true.
    const token = await getStoreItemAsync("access_token");
    if (!token) return true;
    const { exp } = parseJWT(token);
    return Date.now() < exp * 1000;
  },
  fetchAccessToken: async () => {
    return fetch(`${process.env.EXPO_PUBLIC_API_URL}/access_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: await getStoreItemAsync("refresh_token"),
      }),
    });
  },
  handleFetch: async (tokens: any) => {
    if (tokens) {
      const { access_token, refresh_token } = tokens;
      await setStoreItemAsync("access_token", access_token);
      await setStoreItemAsync("refresh_token", refresh_token);
    } else {
      await setStoreItemAsync("access_token", "");
      await setStoreItemAsync("refresh_token", "");
      throw new Error("No tokens");
    }
  },
  handleError: (err) => {
    console.warn("Your refresh token is invalid. Please try re-logging in.");
    console.warn(err);
    setStoreItemAsync("access_token", "");
    setStoreItemAsync("refresh_token", "");
  },
});

/* async function getAccessToken() {
  return await getStoreItemAsync("access_token");
} */
/* export interface Token {
  sub: string;
  iss?: string;
  exp?: string;
  aud?: string;
} */
export function makeClient() {
  const apiUrl =
    API_URL.includes("localhost") && Platform.OS === "android"
      ? API_URL.replace("localhost", "10.0.2.2")
      : API_URL;

  const authLink = setContext(async (_, { headers }) => {
    const token = await getStoreItemAsync("access_token");

    return {
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors) {
      console.error(
        `[GraphQL error]: Operation: ${operation.operationName}, Query: ${
          operation.query.loc?.source.body
        }, Variables: ${JSON.stringify(operation.variables)}`,
      );
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      );
    }

    if (networkError) {
      console.error(
        `[Network error]: ${networkError}, Operation: ${operation.operationName}`,
      );
    }
  });

  const httpLink = new HttpLink({
    uri: apiUrl + "/graphql",
    credentials: "include",
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    credentials: "include",
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-first",
      },
    },

    link: ApolloLink.from([
      // persistedLink,
      ...(API_URL.includes("localhost") ? [] : [persistedLink]),
      ...(process.env.NODE_ENV !== "production" ? [errorLink] : []),
      refreshTokenLink,
      authLink,
      httpLink,
    ]),
  });
}

export const client = makeClient();

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
