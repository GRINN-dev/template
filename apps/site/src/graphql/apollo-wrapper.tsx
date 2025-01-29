"use client";

// ^ this file needs the "use client" pragma
import { ApolloNextAppProvider } from "@apollo/experimental-nextjs-app-support";

import { client } from "./client";

// you need to create a component to wrap your app in
export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={() => client}>
      {children}
    </ApolloNextAppProvider>
  );
}
