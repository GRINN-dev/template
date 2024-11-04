import { Platform } from "react-native";
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  useQuery,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { getStoreItemAsync } from "@/src/utils/secure-store";

// import { createPersistedQueryLink } from "@apollo/client/link/persisted-queries";
// import { usePregeneratedHashes as withPregeneratedHashes } from "graphql-codegen-persisted-query-ids/lib/apollo";

// import hashes from "@grinn/codegen/persisted-query-ids/client.json";

("use client");

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8082";

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
    // get the authentication token from local storage if it exists
    const token = await getAccessToken();

    // get the environment from local storage if it exists
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      uri: "/graphql",
    };
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
      authLink,
      httpLink,
    ]),
  });
}

export const client = makeClient();

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
