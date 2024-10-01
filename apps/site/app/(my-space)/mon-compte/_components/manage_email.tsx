"use client";

import { ResultOf } from "gql.tada";

import { profileQuery } from "../_graphql/profile-query";

export function ManageEmail({
  emails,
}: {
  emails: NonNullable<
    ResultOf<typeof profileQuery>["currentUser"]
  >["userEmails"]["nodes"];
}) {
  return (
    <div>
      <h2>Manage Emails</h2>
      <p>TODO</p>
    </div>
  );
}
