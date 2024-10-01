"use client";

import { ResultOf } from "gql.tada";

import { profileQuery } from "../_graphql/profile-query";

export const ManageUserAuthentications = ({
  authentications,
}: {
  authentications: NonNullable<
    ResultOf<typeof profileQuery>["currentUser"]
  >["userAuthentications"]["nodes"];
}) => {
  return (
    <div>
      <h2>Manage Authentications</h2>
      <p>TODO</p>
    </div>
  );
};
