import { useQuery } from "@apollo/client";

import { graphql } from "@grinn/graphql";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function AuthProfileScreen() {
  const { data, loading } = useQuery(CurrentUserQuery);

  return (
    <ThemedView>
      <ThemedText type="title">{data?.currentUser?.firstname}</ThemedText>
    </ThemedView>
  );
}
const CurrentUserQuery = graphql(`
  query CurrentUser {
    currentUser {
      id
      email
      firstname
      lastname
    }
  }
`);
