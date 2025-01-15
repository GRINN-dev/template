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

import { getStoreItemAsync } from "@/utils/secure-store";

// import { createPersistedQueryLink } from "@apollo/client/link/persisted-queries";
// import { usePregeneratedHashes as withPregeneratedHashes } from "graphql-codegen-persisted-query-ids/lib/apollo";

// import hashes from "@grinn/codegen/persisted-query-ids/client.json";

("use client");

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080";
console.log("API_URL:", API_URL);

// const persistedLink = createPersistedQueryLink({
//   useGETForHashedQueries: false,
//   generateHash: withPregeneratedHashes(hashes),
//   disable: () => false,
// });

async function getAccessToken() {
  return await getStoreItemAsync("access_token");
}
export interface Token {
  sub: string;
  iss?: string;
  exp?: string;
  aud?: string;
}
export function makeClient() {
  const apiUrl =
    API_URL.includes("localhost") && Platform.OS === "android"
      ? API_URL.replace("localhost", "10.0.2.2")
      : API_URL;

  const authLink = setContext(async (_, { headers }) => {
    const token = await getAccessToken();
    console.log("Token récupéré:", token);

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
      // ...(API_URL.includes("localhost") ? [] : [persistedLink]),
      ...(process.env.NODE_ENV !== "production" ? [errorLink] : []),
      authLink,
      httpLink,
    ]),
  });
}

export const client = makeClient();

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
