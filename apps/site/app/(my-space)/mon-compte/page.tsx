import { query } from "@/graphql/apollo-client-ss";
import { ManageEmail } from "./_components/manage_email";
import { ManageProfile } from "./_components/manage-profile";
import { ManageUserAuthentications } from "./_components/manage-user-authentications";
import { profileQuery } from "./_graphql/profile-query";

export default async function ProfilePage() {
  const { data, error } = await query({
    query: profileQuery,
    context: { fetchOptions: { next: { tags: ["profile"] } } },
  });

  return (
    <main className="container">
      <h1>Profile</h1>
      {error && <p>Error: {error.message}</p>}
      {data.currentUser && (
        <>
          <ManageProfile profile={data.currentUser} />
          <ManageEmail emails={data.currentUser?.userEmails.nodes || []} />
          <ManageUserAuthentications
            authentications={data.currentUser?.userAuthentications.nodes || []}
          />
        </>
      )}
    </main>
  );
}
