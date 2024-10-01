import { graphql } from "@/graphql";
import { query } from "@/graphql/apollo-client-ss";

export default async function MaBibliothequePage() {
  const { data } = await query({ query: MyLibraryQuery });
  return (
    <div>
      <h1>Ma bibliothèque</h1>
      <p>Bonjour, {data?.currentUser?.username ?? "anonyme"}.</p>
    </div>
  );
}

const MyLibraryQuery = graphql(`
  query MyLibrary {
    currentUser {
      id
      username
    }
  }
`);
